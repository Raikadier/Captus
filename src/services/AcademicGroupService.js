import AcademicGroupRepository from '../repositories/AcademicGroupRepository.js';
import CourseRepository from '../repositories/CourseRepository.js';
import EnrollmentRepository from '../repositories/EnrollmentRepository.js';

export default class AcademicGroupService {
  constructor() {
    this.repo = new AcademicGroupRepository();
    this.courseRepo = new CourseRepository();
    this.enrollmentRepo = new EnrollmentRepository();
  }

  async createGroup(data, userId, role) {
    const { course_id, name, description } = data;

    // Only teachers can create groups
    if (role !== 'teacher') {
      throw new Error('Solo los profesores pueden crear grupos');
    }

    // Verify teacher owns the course
    const course = await this.courseRepo.getById(course_id);
    if (course.teacher_id !== userId) {
      throw new Error('No autorizado para crear grupos en este curso');
    }

    // Create Group
    const group = await this.repo.save({
      course_id,
      name,
      description,
      created_by: userId
    });

    return group;
  }

  async addMember(groupId, studentId, requesterId, role) {
    // Validate group exists
    const group = await this.repo.getById(groupId);
    if (!group) throw new Error('Grupo no encontrado');

    const course = await this.courseRepo.getById(group.course_id);

    // Permission check - only teacher can add members
    if (role !== 'teacher' || course.teacher_id !== requesterId) {
      throw new Error('Solo el profesor puede agregar miembros al grupo');
    }

    // Validate student is in the course
    const isEnrolled = await this.enrollmentRepo.isEnrolled(group.course_id, studentId);
    if (!isEnrolled) throw new Error('El estudiante no está inscrito en el curso');

    return await this.repo.addMember(groupId, studentId);
  }

  async getGroupsByCourse(courseId, userId, role) {
    if (role === 'teacher') {
      const course = await this.courseRepo.getById(courseId);
      if (course.teacher_id !== userId) throw new Error('No autorizado');
    } else {
      const isEnrolled = await this.enrollmentRepo.isEnrolled(courseId, userId);
      if (!isEnrolled) throw new Error('No autorizado');
    }
    return await this.repo.findByCourse(courseId);
  }

  async getStudentGroups(userId) {
    // Get all groups where the student is a member
    return await this.repo.findByStudent(userId);
  }

  async getGroupDetails(groupId, userId, role) {
    const group = await this.repo.getGroupWithMembers(groupId);
    if (!group) throw new Error('Grupo no encontrado');

    // Check permissions
    if (role === 'teacher') {
      const course = await this.courseRepo.getById(group.course_id);
      if (course.teacher_id !== userId) throw new Error('No autorizado');
    } else {
      // Student must be a member of the group or enrolled in the course
      const isMember = await this.repo.isMember(groupId, userId);
      const isEnrolled = await this.enrollmentRepo.isEnrolled(group.course_id, userId);
      if (!isMember && !isEnrolled) throw new Error('No autorizado');
    }

    return group;
  }

  async removeMember(groupId, studentId, requesterId, role) {
    const group = await this.repo.getById(groupId);
    if (!group) throw new Error('Grupo no encontrado');

    const course = await this.courseRepo.getById(group.course_id);

    // Only the teacher can remove members
    if (role !== 'teacher' || course.teacher_id !== requesterId) {
      throw new Error('Solo el profesor puede eliminar miembros del grupo');
    }

    return await this.repo.removeMember(groupId, studentId);
  }
}
