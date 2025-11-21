import { Task } from '@/types';

const MOCK_PENDING_REVIEWS = [
  {
    id: 1,
    studentName: "María Gómez",
    taskTitle: "Ensayo cap. 2",
    courseName: "Programación I",
  },
  {
    id: 2,
    studentName: "Juan Pérez",
    taskTitle: "Problemas del tema 3",
    courseName: "Matemáticas Aplicadas",
  },
];

const MOCK_CREATED_TASKS: Task[] = [
  {
    id: 1,
    title: "Ensayo sobre el capítulo 2",
    courseName: "Programación I",
    dueDate: "2025-11-22",
    submissionsCount: 18,
    totalStudents: 28,
  },
  {
    id: 2,
    title: "Problemas del Tema 3",
    courseName: "Matemáticas Aplicadas",
    dueDate: "2025-11-24",
    submissionsCount: 30,
    totalStudents: 32,
  },
];

export const taskService = {
  getPendingReviews: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_PENDING_REVIEWS), 500);
    });
  },

  getCreatedTasks: async (): Promise<Task[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_CREATED_TASKS), 700);
    });
  }
};
