// --- mockData.js ---
// Este archivo contiene un conjunto de datos mock para toda la aplicación.
// Está diseñado para ser utilizado en modo demo o cuando Supabase no está disponible.
// Los datos están interconectados para simular un entorno de aplicación real.

// --- IDs para mantener la coherencia ---
const USER_IDS = {
  teacher_ana: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  student_carlos: '6f7a1b9e-2c3d-4e5f-8g9h-0i1j2k3l4m5n',
  student_lucia: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
  student_pedro: 'b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6q7',
};

const COURSE_IDS = {
  math: 1, // Manteniendo IDs numéricos si la BD los usa
  csharp: 2,
  ai_ml: 3,
  db: 4,
};

const GROUP_IDS = {
  math_1a: 'g1-a1b2-c3d4-e5f6-1234567890ab',
  csharp_2b: 'g2-b2c3-d4e5-f6g7-234567890bc',
  study_algo: 'g3-c3d4-e5f6-g7h8-34567890cde',
  final_project: 'g4-d4e5-f6g7-h8i9-4567890def',
};

const TASK_IDS = {
  algebra: 't1-a1b2-c3d4-e5f6-111111111111',
  oop_project: 't2-b2c3-d4e5-f6g7-222222222222',
  neural_net: 't3-c3d4-e5f6-g7h8-333333333333',
  sql_design: 't4-d4e5-f6g7-h8i9-444444444444',
  overdue_task: 't5-e5f6-g7h8-i9j0-555555555555',
  ia_generated: 't6-f6g7-h8i9-j0k1-666666666666',
  simple_task: 't7-g7h8-i9j0-k1l2-777777777777',
};

// --- Mock Data ---

export const mockUsers = [
  { id: USER_IDS.teacher_ana, name: 'Ana Torres', email: 'ana.torres@example.com', role: 'teacher' },
  { id: USER_IDS.student_carlos, name: 'Carlos Gomez', email: 'carlos.gomez@example.com', role: 'student' },
  { id: USER_IDS.student_lucia, name: 'Lucía Fernández', email: 'lucia.fernandez@example.com', role: 'student' },
  { id: USER_IDS.student_pedro, name: 'Pedro Martínez', email: 'pedro.martinez@example.com', role: 'student' },
];

export const mockCourses = [
  { id: COURSE_IDS.math, name: 'Matemáticas I', description: 'Curso de introducción al cálculo y álgebra lineal.', teacher_id: USER_IDS.teacher_ana },
  { id: COURSE_IDS.csharp, name: 'Programación en C#', description: 'Desarrollo de aplicaciones con .NET y C#.', teacher_id: USER_IDS.teacher_ana },
  { id: COURSE_IDS.ai_ml, name: 'IA y Machine Learning', description: 'Fundamentos de la inteligencia artificial y modelos de aprendizaje.', teacher_id: USER_IDS.teacher_ana },
  { id: COURSE_IDS.db, name: 'Bases de Datos', description: 'Diseño y gestión de bases de datos relacionales.', teacher_id: USER_IDS.teacher_ana },
];

export const mockGroups = [
  { id: GROUP_IDS.math_1a, name: 'Grupo 1A', course_id: COURSE_IDS.math },
  { id: GROUP_IDS.csharp_2b, name: 'Grupo 2B', course_id: COURSE_IDS.csharp },
  { id: GROUP_IDS.study_algo, name: 'Grupo de estudio "Algoritmos"', course_id: COURSE_IDS.ai_ml },
  { id: GROUP_IDS.final_project, name: 'Grupo "Proyecto Final"', course_id: COURSE_IDS.db },
];

// Asignaciones de estudiantes a grupos
export const mockGroupMembers = [
    { group_id: GROUP_IDS.math_1a, user_id: USER_IDS.student_carlos },
    { group_id: GROUP_IDS.csharp_2b, user_id: USER_IDS.student_carlos },
    { group_id: GROUP_IDS.csharp_2b, user_id: USER_IDS.student_lucia },
    { group_id: GROUP_IDS.study_algo, user_id: USER_IDS.student_pedro },
    { group_id: GROUP_IDS.final_project, user_id: USER_IDS.student_lucia },
];

export const mockTasks = [
  // Tarea académica con entrega
  {
    id: TASK_IDS.algebra, title: 'Resolver sistema de ecuaciones', description: 'Entregar el capítulo 3 resuelto.', due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    completed: false, user_id: USER_IDS.student_carlos, course_id: COURSE_IDS.math,
    created_at: new Date().toISOString(),
  },
  // Tarea simple
  {
    id: TASK_IDS.simple_task, title: 'Comprar libro de Cálculo', description: '', due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    completed: false, user_id: USER_IDS.student_carlos, course_id: null,
    created_at: new Date().toISOString(),
  },
  // Tarea vencida
  {
    id: TASK_IDS.overdue_task, title: 'Revisar paper de IA', description: 'Leer y resumir el paper sobre redes neuronales.', due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completed: false, user_id: USER_IDS.student_lucia, course_id: COURSE_IDS.ai_ml,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // Tarea generada por IA (simulación)
  {
    id: TASK_IDS.ia_generated, title: 'Investigar sobre la historia de los compiladores', description: 'Creado por IA: un resumen de los hitos más importantes.', due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    completed: false, user_id: USER_IDS.student_pedro, course_id: COURSE_IDS.csharp,
    created_at: new Date().toISOString(),
  },
];

export const mockSubmissions = [
  {
    id: 'sub1-a1b2-c3d4-e5f6-abcdef123456', task_id: TASK_IDS.algebra, user_id: USER_IDS.student_carlos,
    content: 'Adjunto la resolución del problema.', submitted_at: new Date().toISOString(), grade: 95,
  },
];

export const mockEvents = [
  { id: 'ev1', title: 'Examen Parcial de Matemáticas', description: 'Cubre los temas 1 a 4.', start_time: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), end_time: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), course_id: COURSE_IDS.math },
  { id: 'ev2', title: 'Entrega Proyecto C#', description: 'Fecha límite para la entrega final.', start_time: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), end_time: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), course_id: COURSE_IDS.csharp },
  { id: 'ev3', title: 'Clase de IA Cancelada', description: 'La clase del próximo lunes se cancela.', start_time: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), end_time: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), course_id: COURSE_IDS.ai_ml },
  { id: 'ev4', title: 'Reunión Grupo Proyecto Final', description: 'Reunión para definir los próximos pasos.', start_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), end_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), course_id: COURSE_IDS.db },
];

export const mockNotifications = [
    { id: 'not1', user_id: USER_IDS.student_carlos, message: 'Tu entrega para "Resolver sistema de ecuaciones" ha sido calificada.', type: 'grade', created_at: new Date().toISOString() },
    { id: 'not2', user_id: USER_IDS.student_lucia, message: 'La tarea "Revisar paper de IA" está vencida.', type: 'overdue', created_at: new Date().toISOString() },
    { id: 'not3', user_id: USER_IDS.teacher_ana, message: 'Se canceló la clase de IA y Machine Learning.', type: 'event', created_at: new Date().toISOString() },
];


const mockData = {
  users: mockUsers,
  courses: mockCourses,
  groups: mockGroups,
  groupMembers: mockGroupMembers,
  tasks: mockTasks,
  submissions: mockSubmissions,
  events: mockEvents,
  notifications: mockNotifications
};

export default mockData;
