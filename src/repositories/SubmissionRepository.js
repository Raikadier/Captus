import BaseRepository from './BaseRepository.js';

export default class SubmissionRepository extends BaseRepository {
  constructor() {
    super('assignment_submissions', { primaryKey: 'id' });
  }

  async findByAssignment(assignmentId) {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(`
        *,
        student:student_id (
          id,
          name,
          email
        ),
        group:group_id (
          id,
          name
        )
      `)
      .eq('assignment_id', assignmentId);

    if (error) throw new Error(error.message);
    return data;
  }

  async findByStudent(studentId, assignmentId) {
    let query = this.client
      .from(this.tableName)
      .select('*')
      .eq('student_id', studentId);

    if (assignmentId) {
      query = query.eq('assignment_id', assignmentId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    // Return single if assignmentId provided, else list
    return assignmentId ? (data[0] || null) : data;
  }

  async findByGroup(groupId, assignmentId) {
    const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('group_id', groupId)
        .eq('assignment_id', assignmentId)
        .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  }
}
