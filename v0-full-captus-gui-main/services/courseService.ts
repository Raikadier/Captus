import { api } from './api';
import { Course, Event, Task } from '@/types';

// Datos mock movidos aquí para simular la base de datos
const MOCK_COURSES: Course[] = [
  {
    id: 1,
    name: "Matemáticas Aplicadas",
    studentsCount: 32,
    pendingTasksCount: 4,
    professor: "Dr. Juan Pérez"
  },
  {
    id: 2,
    name: "Programación I",
    studentsCount: 28,
    pendingTasksCount: 7,
    professor: "Ing. María López"
  },
];

const MOCK_EVENTS: Event[] = [
  {
    id: 1,
    title: "Revisión de proyecto",
    date: "2025-11-20",
    time: "3:00 PM",
  },
  {
    id: 2,
    title: "Entrega parcial",
    date: "2025-11-22",
    time: "11:59 PM",
  },
];

export const courseService = {
  // Obtener todos los cursos del profesor
  getTeacherCourses: async (): Promise<Course[]> => {
    // return api.get<Course[]>('/teacher/courses');
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_COURSES), 600);
    });
  },

  // Obtener eventos próximos
  getUpcomingEvents: async (): Promise<Event[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_EVENTS), 400);
    });
  },

  // Obtener detalle de un curso
  getCourseById: async (id: string): Promise<Course | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_COURSES.find(c => c.id.toString() === id));
      }, 500);
    });
  }
};
