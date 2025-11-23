import AssignmentRepository from '../repositories/AssignmentRepository.js';
import EnrollmentRepository from '../repositories/EnrollmentRepository.js';
import CourseRepository from '../repositories/CourseRepository.js';
import { requireSupabaseClient } from '../lib/supabaseAdmin.js';

export default class AssignmentService {
  constructor() {
    this.repo = new AssignmentRepository();
    this.enrollmentRepo = new EnrollmentRepository();
    this.courseRepo = new CourseRepository();
  }

  async createAssignment(data, teacherId) {
    const { course_id, title } = data;

    // Verify ownership
    const course = await this.courseRepo.getById(course_id);
    if (!course) throw new Error('Curso no encontrado');
    if (course.teacher_id !== teacherId) throw new Error('No autorizado');

    const assignment = await this.repo.save(data);

    // Notify students
    // NOTE: Passing null for relatedTask because assignment.id is Int, and notifications.related_task is UUID.
    await this._notifyCourseStudents(course_id, `Nueva tarea: ${title}`, `El profesor ha creado una nueva tarea en ${course.title}`, null);

    return assignment;
  }

  async getAssignmentsByCourse(courseId, userId, role) {
    // Access check
    if (role === 'teacher') {
        const course = await this.courseRepo.getById(courseId);
        if (course.teacher_id !== userId) throw new Error('No autorizado');
    } else {
        const isEnrolled = await this.enrollmentRepo.isEnrolled(courseId, userId);
        if (!isEnrolled) throw new Error('No estás inscrito en este curso');
    }

    return await this.repo.findByCourse(courseId);
  }

  async getAssignmentById(id, userId, role) {
    const assignment = await this.repo.getById(id);
    if (!assignment) throw new Error('Tarea no encontrada');

    if (role === 'teacher') {
         const course = await this.courseRepo.getById(assignment.course_id);
         if (course.teacher_id !== userId) throw new Error('No autorizado');
    } else {
         const isEnrolled = await this.enrollmentRepo.isEnrolled(assignment.course_id, userId);
         if (!isEnrolled) throw new Error('No autorizado');
    }

    return assignment;
  }

  async updateAssignment(id, data, teacherId) {
    const assignment = await this.repo.getById(id);
    const course = await this.courseRepo.getById(assignment.course_id);

    if (course.teacher_id !== teacherId) throw new Error('No autorizado');

    return await this.repo.update(id, data);
  }

  async deleteAssignment(id, teacherId) {
    const assignment = await this.repo.getById(id);
    const course = await this.courseRepo.getById(assignment.course_id);

    if (course.teacher_id !== teacherId) throw new Error('No autorizado');

    return await this.repo.delete(id);
  }

  async _notifyCourseStudents(courseId, title, body, relatedTask = null) {
    const students = await this.enrollmentRepo.getCourseStudents(courseId);

    if (students.length === 0) return;

    const notifications = students.map(s => ({
      user_id: s.id,
      title,
      body,
      type: 'task',
      related_task: relatedTask // Will be null for academic assignments
    }));

    // Insert notifications
    const client = requireSupabaseClient();
    const { error } = await client.from('notifications').insert(notifications);
    if (error) console.error('Error sending notifications:', error);
  }
}
