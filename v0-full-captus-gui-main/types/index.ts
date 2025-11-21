// Definiciones de tipos para el proyecto Captus
// Esto nos ayuda a asegurar que los datos sean consistentes en toda la app

export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Course {
  id: number | string;
  name: string;
  professor?: string;
  studentsCount?: number;
  pendingTasksCount?: number;
  color?: string;
  description?: string;
}

export interface Task {
  id: number | string;
  title: string;
  courseName?: string;
  courseId?: number | string;
  dueDate: string;
  status?: 'pending' | 'submitted' | 'graded' | 'late';
  grade?: number;
  maxGrade?: number;
  description?: string;
  submissionsCount?: number;
  totalStudents?: number;
}

export interface Announcement {
  id: number | string;
  title: string;
  content: string;
  date: string;
  type: 'General' | 'Urgente' | 'Recordatorio';
  courseId?: number | string;
}

export interface Event {
  id: number | string;
  title: string;
  date: string;
  time: string;
  type?: string;
}

export interface StudentProgress {
  id: number | string;
  name: string;
  status: 'active' | 'dropped' | 'completed';
  progress: number;
  avatarUrl?: string;
}
