import BaseRepository from './BaseRepository.js';
import { isMockMode } from '../lib/supabaseClient.js';

class AcademicGroupRepository extends BaseRepository {
  constructor() {
    super('course_groups', { primaryKey: 'id' });
    this.mockSet = this.mockData.groups || [];
    this.membersTable = 'course_group_members';
  }

  // Las operaciones de escritura (save, update, delete) sobre grupos se heredan.

  async findByCourse(courseId) {
    if (!courseId) return [];
    let supabaseData = [];

    if (this.client) {
      const { data, error } = await this.client.from(this.tableName)
        .select('*, members:course_group_members(student_id, joined_at)')
        .eq('course_id', courseId);
      if (error) throw new Error(error.message);
      supabaseData = data;
    }

    if (isMockMode()) {
      const supabaseIds = new Set(supabaseData.map(g => g.id));
      const additiveMocks = this.mockSet
        .filter(g => g.course_id === courseId && !supabaseIds.has(g.id))
        .map(g => ({ ...g, members: [] })); // Simplificamos mocks sin miembros
      return [...supabaseData, ...additiveMocks];
    }
    return supabaseData;
  }

  // --- Operaciones de miembros (siempre a Supabase) ---

  async addMember(groupId, studentId) {
    if (!groupId || !studentId || !this.client) return null;
    const { data, error } = await this.client
      .from(this.membersTable)
      .insert({ group_id: groupId, student_id: studentId })
      .select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  async removeMember(groupId, studentId) {
    if (!groupId || !studentId || !this.client) return false;
    const { error } = await this.client
      .from(this.membersTable)
      .delete()
      .eq('group_id', groupId)
      .eq('student_id', studentId);
    if (error) throw new Error(error.message);
    return true;
  }
}

export default AcademicGroupRepository;
