import SubmissionRepository from '../repositories/SubmissionRepository.js';
import AssignmentRepository from '../repositories/AssignmentRepository.js';
import CourseRepository from '../repositories/CourseRepository.js';
import EnrollmentRepository from '../repositories/EnrollmentRepository.js'; // Needed for checks
import { requireSupabaseClient } from '../lib/supabaseAdmin.js';

export default class SubmissionService {
  constructor() {
    this.repo = new SubmissionRepository();
    this.assignmentRepo = new AssignmentRepository();
    this.courseRepo = new CourseRepository();
    this.enrollmentRepo = new EnrollmentRepository();
  }

  async submitAssignment(data, studentId) {
    const { assignment_id, file_url, group_id } = data;

    const assignment = await this.assignmentRepo.getById(assignment_id);
    if (!assignment) throw new Error('Tarea no encontrada');

    // Validate enrollment
    const isEnrolled = await this.enrollmentRepo.isEnrolled(assignment.course_id, studentId);
    if (!isEnrolled) throw new Error('No estás inscrito en este curso');

    // Check duplicates
    if (assignment.is_group_assignment) {
        if (!group_id) throw new Error('Esta tarea es grupal, se requiere ID de grupo');
        // Check if group has already submitted
        const existing = await this.repo.findByGroup(group_id, assignment_id);
        if (existing) throw new Error('El grupo ya ha realizado una entrega');

        // TODO: Validate student belongs to group (need GroupRepo for that, assuming handled in controller or here later)
    } else {
        const existing = await this.repo.findByStudent(studentId, assignment_id);
        if (existing) throw new Error('Ya has realizado una entrega para esta tarea');
    }

    const submissionData = {
      assignment_id,
      file_url,
      student_id: assignment.is_group_assignment ? null : studentId, // Or track uploader even for groups
      group_id: assignment.is_group_assignment ? group_id : null,
      submitted_at: new Date()
    };

    // If group assignment, maybe we want to store who uploaded it?
    // Schema allows student_id to be null. Let's store uploader anyway if useful?
    // Prompt says: "student_id FK (null si es entrega grupal)". So I will follow strict instructions.

    return await this.repo.save(submissionData);
  }

  async getSubmissions(assignmentId, userId, role) {
    const assignment = await this.assignmentRepo.getById(assignmentId);
    if (!assignment) throw new Error('Tarea no encontrada');
    const course = await this.courseRepo.getById(assignment.course_id);

    if (role === 'teacher') {
        if (course.teacher_id !== userId) throw new Error('No autorizado');
        return await this.repo.findByAssignment(assignmentId);
    } else {
        // Student can only see their own submission
        return await this.repo.findByStudent(userId, assignmentId);
    }
  }

  async gradeSubmission(submissionId, grade, feedback, teacherId) {
    const submission = await this.repo.getById(submissionId);
    if (!submission) throw new Error('Entrega no encontrada');

    const assignment = await this.assignmentRepo.getById(submission.assignment_id);
    const course = await this.courseRepo.getById(assignment.course_id);

    if (course.teacher_id !== teacherId) throw new Error('No autorizado');

    const updated = await this.repo.update(submissionId, {
      grade,
      feedback,
      graded: true
    });

    // Notify student(s)
    await this._notifyGrade(updated, assignment);

    return updated;
  }

  async _notifyGrade(submission, assignment) {
    const client = requireSupabaseClient();

    let userIds = [];
    if (submission.student_id) {
        userIds.push(submission.student_id);
    } else if (submission.group_id) {
        // Fetch group members
        const { data: members } = await client
            .from('course_group_members')
            .select('student_id')
            .eq('group_id', submission.group_id);

        userIds = members.map(m => m.student_id);
    }

    if (userIds.length === 0) return;

    const notifications = userIds.map(uid => ({
        user_id: uid,
        title: `Calificación: ${assignment.title}`,
        body: `Tu tarea ha sido calificada con: ${submission.grade}`,
        type: 'academic', // Using the new type we unlocked
        related_task: null // Same UUID issue
    }));

    await client.from('notifications').insert(notifications);
  }
}
