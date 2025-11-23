import BaseRepository from './BaseRepository.js';

export default class AssignmentRepository extends BaseRepository {
  constructor() {
    super('course_assignments', { primaryKey: 'id' });
  }

  async findByCourse(courseId) {
    const { data, error } = await this.client
      .from(this.tableName)
      .select('*')
      .eq('course_id', courseId)
      .order('due_date', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  }
}
