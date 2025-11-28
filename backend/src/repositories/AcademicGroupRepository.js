import BaseRepository from './BaseRepository.js';

export default class AcademicGroupRepository extends BaseRepository {
  constructor() {
    super('course_groups', { primaryKey: 'id' });
  }

  async findByCourse(courseId) {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(`
        *,
        members:course_group_members(
           student_id,
           joined_at
        )
      `)
      .eq('course_id', courseId);

    if (error) throw new Error(error.message);
    return data;
  }

  async addMember(groupId, studentId) {
    const { data, error } = await this.client
      .from('course_group_members')
      .insert({ group_id: groupId, student_id: studentId })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async removeMember(groupId, studentId) {
    const { error } = await this.client
      .from('course_group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('student_id', studentId);

    if (error) throw new Error(error.message);
    return true;
  }

  async findByStudent(studentId) {
    const { data, error } = await this.client
      .from('course_group_members')
      .select(`
        group_id,
        joined_at,
        group:group_id (
          id,
          course_id,
          name,
          description,
          created_by,
          created_at
        )
      `)
      .eq('student_id', studentId);

    if (error) throw new Error(error.message);
    // Flatten structure to return groups with joined_at
    return data.map(row => ({
      ...row.group,
      joined_at: row.joined_at
    }));
  }

  async getGroupWithMembers(groupId) {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(`
        *,
        members:course_group_members(
          student_id,
          joined_at,
          student:student_id (
            id,
            name,
            email
          )
        )
      `)
      .eq('id', groupId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async isMember(groupId, studentId) {
    const { data, error } = await this.client
      .from('course_group_members')
      .select('id')
      .eq('group_id', groupId)
      .eq('student_id', studentId)
      .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return !!data;
  }
}
