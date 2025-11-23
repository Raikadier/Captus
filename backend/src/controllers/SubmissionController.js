import SubmissionService from '../services/SubmissionService.js';
import NotificationService from '../services/NotificationService.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export class SubmissionController {
  constructor() {
    this.service = new SubmissionService();
  }

  async submit(req, res) {
    try {
      const studentId = req.user.id;
      // req.body: { assignment_id, file_url, group_id (opt) }
      const result = await this.service.submitAssignment(req.body, studentId);

      // Check for Full Class Submission (Course Completion of Task)
      // 1. Get Course ID
      const { data: assignment } = await supabase
        .from('course_assignments')
        .select('course_id, title, courses(teacher_id)')
        .eq('id', req.body.assignment_id)
        .single();

      if (assignment) {
        const courseId = assignment.course_id;
        const teacherId = assignment.courses.teacher_id;

        // 2. Count Enrollments
        const { count: enrollmentCount } = await supabase
          .from('course_enrollments')
          .select('*', { count: 'exact', head: true })
          .eq('course_id', courseId);

        // 3. Count Submissions
        const { count: submissionCount } = await supabase
          .from('assignment_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('assignment_id', req.body.assignment_id);

        // 4. Notify Teacher if counts match
        if (enrollmentCount && submissionCount && enrollmentCount === submissionCount) {
          await NotificationService.notify({
            user_id: teacherId,
            title: 'Tarea Completada por Todos',
            body: `Todos los estudiantes han entregado la tarea "${assignment.title}".`,
            event_type: 'all_submitted',
            entity_id: req.body.assignment_id,
            metadata: { course_id: courseId }
          });
        }
      }

      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getByAssignment(req, res) {
    try {
      const { id } = req.params; // assignmentId
      const userId = req.user.id;
      const role = req.user.role || 'student';
      const result = await this.service.getSubmissions(id, userId, role);
      res.json(result);
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }

  async grade(req, res) {
    try {
      const { id } = req.params; // submissionId
      const { grade, feedback } = req.body;
      const teacherId = req.user.id;
      const result = await this.service.gradeSubmission(id, grade, feedback, teacherId);

      // Notify Student
      const { data: submission } = await supabase
        .from('assignment_submissions')
        .select('student_id, assignment_id, course_assignments(title)')
        .eq('id', id)
        .single();

      if (submission) {
        await NotificationService.notify({
          user_id: submission.student_id,
          title: 'Tarea Calificada',
          body: `Tu entrega para "${submission.course_assignments.title}" ha sido calificada. Nota: ${grade}`,
          event_type: 'submission_graded',
          entity_id: id,
          metadata: { assignment_id: submission.assignment_id }
        });
      }

      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
