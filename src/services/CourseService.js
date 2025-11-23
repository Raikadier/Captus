import CourseRepository from '../repositories/CourseRepository.js';
import EnrollmentRepository from '../repositories/EnrollmentRepository.js';
import crypto from 'crypto';

export default class CourseService {
  constructor() {
    this.courseRepo = new CourseRepository();
    this.enrollmentRepo = new EnrollmentRepository();
  }

  async createCourse(data, teacherId) {
    // Generate unique invite code
    let inviteCode;
    let isUnique = false;

    while (!isUnique) {
      inviteCode = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 chars
      const existing = await this.courseRepo.findByInviteCode(inviteCode);
      if (!existing) isUnique = true;
    }

    const courseData = {
      ...data,
      teacher_id: teacherId,
      invite_code: inviteCode
    };

    return await this.courseRepo.save(courseData);
  }

  async getCoursesForUser(userId, role) {
    if (role === 'teacher') {
      return await this.courseRepo.findByTeacher(userId);
    } else {
      return await this.courseRepo.findByStudent(userId);
    }
  }

  async getCourseDetail(courseId, userId, role) {
    const course = await this.courseRepo.getById(courseId);
    if (!course) throw new Error('Curso no encontrado');

    // Access Control
    if (role === 'teacher') {
      if (course.teacher_id !== userId) throw new Error('No tienes permiso para ver este curso');
    } else {
      const isEnrolled = await this.enrollmentRepo.isEnrolled(courseId, userId);
      if (!isEnrolled) throw new Error('No estás inscrito en este curso');
    }

    return course;
  }

  async updateCourse(courseId, data, teacherId) {
    const course = await this.courseRepo.getById(courseId);
    if (!course) throw new Error('Curso no encontrado');
    if (course.teacher_id !== teacherId) throw new Error('No tienes permiso para editar este curso');

    return await this.courseRepo.update(courseId, data);
  }

  async deleteCourse(courseId, teacherId) {
    const course = await this.courseRepo.getById(courseId);
    if (!course) throw new Error('Curso no encontrado');
    if (course.teacher_id !== teacherId) throw new Error('No tienes permiso para eliminar este curso');

    return await this.courseRepo.delete(courseId);
  }
}
