import AcademicGroupService from '../services/AcademicGroupService.js';

export class AcademicGroupController {
  constructor() {
    this.service = new AcademicGroupService();
  }

  async create(req, res) {
    try {
      const { course_id, name, description } = req.body;
      const userId = req.user.id;
      const role = req.user.role || 'student';

      const result = await this.service.createGroup({ course_id, name, description }, userId, role);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async addMember(req, res) {
    try {
      const { groupId, studentId } = req.body;
      const requesterId = req.user.id;
      const role = req.user.role || 'student';

      const result = await this.service.addMember(groupId, studentId, requesterId, role);
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

      const result = await this.service.getGroupsByCourse(id, userId, role);
      res.json(result);
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }

  async getStudentGroups(req, res) {
    try {
      const userId = req.user.id;
      const result = await this.service.getStudentGroups(userId);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getGroupDetails(req, res) {
    try {
      const { id } = req.params; // groupId
      const userId = req.user.id;
      const role = req.user.role || 'student';

      const result = await this.service.getGroupDetails(id, userId, role);
      res.json(result);
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }

  async removeMember(req, res) {
    try {
      const { groupId, studentId } = req.params;
      const requesterId = req.user.id;
      const role = req.user.role || 'student';

      await this.service.removeMember(groupId, studentId, requesterId, role);
      res.json({ success: true, message: 'Miembro eliminado del grupo' });
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }
}
