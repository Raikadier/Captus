import AssignmentService from '../services/AssignmentService.js';
import NotificationService from '../services/NotificationService.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export class AssignmentController {
  constructor() {
    this.service = new AssignmentService();
  }

  async create(req, res) {
    try {
      // req.body should contain { course_id, title, description, due_date, is_group_assignment }
      const teacherId = req.user.id;
      const result = await this.service.createAssignment(req.body, teacherId);

      // Notify enrolled students
      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select('user_id')
        .eq('course_id', req.body.course_id);

      if (enrollments) {
        for (const enrollment of enrollments) {
          await NotificationService.notify({
            user_id: enrollment.user_id,
            title: 'Nueva Tarea Asignada',
            body: `Nueva tarea disponible: "${result.title}"`,
            event_type: 'assignment_created',
            entity_id: result.id,
            metadata: { course_id: req.body.course_id }
          });
        }
      }

      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getByCourse(req, res) {
    try {
      const { id } = req.params; // courseId
      const userId = req.user.id;
      const role = req.user.role || 'student';
      const result = await this.service.getAssignmentsByCourse(id, userId, role);
      res.json(result);
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const role = req.user.role || 'student';
      const result = await this.service.getAssignmentById(id, userId, role);
      res.json(result);
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const teacherId = req.user.id;
      const result = await this.service.updateAssignment(id, req.body, teacherId);

      // Notify students of update
      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select('user_id')
        .eq('course_id', result.course_id); // Ensure result includes course_id

      if (enrollments) {
        for (const enrollment of enrollments) {
          await NotificationService.notify({
            user_id: enrollment.user_id,
            title: 'Tarea Actualizada',
            body: `La tarea "${result.title}" ha sido modificada.`,
            event_type: 'assignment_updated',
            entity_id: id,
            metadata: { course_id: result.course_id }
          });
        }
      }

      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const teacherId = req.user.id;
      await this.service.deleteAssignment(id, teacherId);
      res.json({ message: 'Tarea eliminada' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
