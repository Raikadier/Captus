import BaseRepository from './BaseRepository.js';
import { isMockMode } from '../lib/supabaseClient.js';

class CourseRepository extends BaseRepository {
  constructor() {
    super('courses', { primaryKey: 'id' });
  }

  async findByTeacher(teacherId) {
    if (!teacherId) return [];
    return super.getAll({ teacher_id: teacherId });
  }

  async findByStudent(studentId) {
    if (!studentId) return [];
    let supabaseData = [];

    if (this.client) {
      const { data, error } = await this.client.from('course_enrollments')
        .select('courses:course_id (*)').eq('student_id', studentId);
      if (error) throw new Error(error.message);
      supabaseData = data.map(item => item.courses);
    }

    if (isMockMode()) {
      const supabaseIds = new Set(supabaseData.map(c => c.id));
      const studentCoursesIds = this.mockData.groupMembers
        .filter(member => member.user_id === studentId)
        .map(member => this.mockData.groups.find(g => g.id === member.group_id)?.course_id)
        .filter(id => id);
      const uniqueCourseIds = [...new Set(studentCoursesIds)];
      const additiveMocks = this.mockSet.filter(course => uniqueCourseIds.includes(course.id) && !supabaseIds.has(course.id));
      return [...supabaseData, ...additiveMocks];
    }
    return supabaseData;
  }

  async findByInviteCode(code) {
    if (!code) return null;
    let supabaseCourse = null;

    if (this.client) {
        const { data, error } = await this.client.from(this.tableName).select('*').eq('invite_code', code).single();
        if (error && error.code !== 'PGRST116') throw new Error(error.message);
        supabaseCourse = data;
    }

    if (supabaseCourse) return supabaseCourse;

    if (isMockMode()) {
        return this.mockSet.find(course => course.invite_code === code) || null;
    }
    return null;
  }
}

export default CourseRepository;
