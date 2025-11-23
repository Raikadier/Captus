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

    // Check permissions
    if (role === 'teacher') {
      const course = await this.courseRepo.getById(course_id);
      if (course.teacher_id !== userId) throw new Error('No autorizado');
    } else {
      // Students can create groups? Usually teacher only or both.
      // Prompt says: "Crear grupo ... GET /course/:id/groups".
      // Prompt D) Groups inside a course -> created_by (uuid).
      // Assuming students can create groups if enrolled, or just teachers.
      // Let's assume teachers manage structure, or students form teams.
      // Since `created_by` is there, maybe students can.
      // Let's allow students if enrolled.
      const isEnrolled = await this.enrollmentRepo.isEnrolled(course_id, userId);
      if (!isEnrolled && role !== 'teacher') throw new Error('No autorizado');
    }

    return await this.repo.save({
      course_id,
      name,
      description,
      created_by: userId
    });
  }

  async addMember(groupId, studentId, requesterId, role) {
    // Validate group exists
    const group = await this.repo.getById(groupId);
    if (!group) throw new Error('Grupo no encontrado');

    const course = await this.courseRepo.getById(group.course_id);

    // Permission check
    if (role === 'teacher') {
       if (course.teacher_id !== requesterId) throw new Error('No autorizado');
    } else {
       // Student must be the creator of the group? or just in the course?
       // Let's say group creator or maybe open join.
       // Strict: Group creator.
       if (group.created_by !== requesterId) throw new Error('Solo el creador del grupo puede agregar miembros');
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
}
