import BaseRepository from './BaseRepository.js';

export default class CourseRepository extends BaseRepository {
  constructor() {
    super('courses', { primaryKey: 'id' });
  }

  async findByTeacher(teacherId) {
    const { data, error } = await this.client
      .from(this.tableName)
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async findByStudent(studentId) {
    // Supabase join syntax: course_enrollments -> courses
    const { data, error } = await this.client
      .from('course_enrollments')
      .select(`
        course_id,
        enrolled_at,
        courses:course_id (*)
      `)
      .eq('student_id', studentId);

    if (error) throw new Error(error.message);

    // Map to return just the course objects with enrollment info if needed
    return data.map(item => ({
      ...item.courses,
      enrolled_at: item.enrolled_at
    }));
  }

  async findByInviteCode(code) {
    const { data, error } = await this.client
      .from(this.tableName)
      .select('*')
      .eq('invite_code', code)
      .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  }
}
