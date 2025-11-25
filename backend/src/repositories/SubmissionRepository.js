import BaseRepository from './BaseRepository.js';
import { isMockMode } from '../lib/supabaseClient.js';

class SubmissionRepository extends BaseRepository {
  constructor() {
    // Usamos el nombre de la tabla de Supabase. BaseRepository se encargará de mapear a los mocks.
    super('assignment_submissions', { primaryKey: 'id' });
    // Le decimos a BaseRepository cuál es el set de mocks que debe usar
    this.mockSet = this.mockData.submissions || [];
  }

  // Las operaciones de escritura (save, update, delete) se heredan y van siempre a Supabase.

  async findByAssignment(assignmentId) {
    if (!assignmentId) return [];
    let supabaseData = [];
    if (this.client) {
        const { data, error } = await this.client.from(this.tableName)
            .select('*, student:student_id(id, name, email), group:group_id(id, name)')
            .eq('assignment_id', assignmentId);
        if (error) throw new Error(error.message);
        supabaseData = data;
    }

    if (isMockMode()) {
        const supabaseIds = new Set(supabaseData.map(s => s.id));
        const additiveMocks = this.mockSet
            .filter(s => s.task_id === assignmentId && !supabaseIds.has(s.id))
            .map(s => ({ ...s, student: this.mockData.users.find(u => u.id === s.user_id) })); // Simula join
        return [...supabaseData, ...additiveMocks];
    }
    return supabaseData;
  }

  // Se simplifican los otros métodos para que se centren en Supabase,
  // ya que la lógica aditiva para consultas tan específicas es compleja y menos prioritaria.
  async findByStudent(studentId, assignmentId) {
    if (!studentId || !this.client) return [];
    let query = this.client.from(this.tableName).select('*').eq('student_id', studentId);
    if (assignmentId) {
      query = query.eq('assignment_id', assignmentId);
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return assignmentId ? (data[0] || null) : data;
  }

  async findByGroup(groupId, assignmentId) {
    if (!groupId || !assignmentId || !this.client) return null;
    const { data, error } = await this.client.from(this.tableName)
        .select('*').eq('group_id', groupId).eq('assignment_id', assignmentId).single();
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  }
}

export default SubmissionRepository;
