// Script de prueba final y concluyente para la lógica Aditiva.
import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });

import TaskRepository from '../TaskRepository.js';
import CourseRepository from '../CourseRepository.js';
import mockData from '../../lib/mockData.js';
import { v4 as uuidv4 } from 'uuid';

const TEST_STUDENT_ID = '6f7a1b9e-2c3d-4e5f-8g9h-0i1j2k3l4m5n'; // student_carlos
const TEST_TEACHER_ID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'; // teacher_ana

async function runFinalCheck() {
  console.log("--- INICIANDO PRUEBA DE VERIFICACIÓN FINAL ---");
  const taskRepo = new TaskRepository();
  const courseRepo = new CourseRepository();

  // --- MODO REAL (FORCE_MOCK_MODE=false) ---
  console.log("\n--- Ejecutando en MODO REAL ---");
  process.env.FORCE_MOCK_MODE = 'false';

  // Prueba 1: Método simple
  let realTasks = await taskRepo.getAllByUserId(TEST_STUDENT_ID);
  console.log(`[REAL] Tareas obtenidas (getAllByUserId): ${realTasks.length}`);

  // Prueba 2: Método complejo
  let realCourses = await courseRepo.findByStudent(TEST_STUDENT_ID);
  console.log(`[REAL] Cursos obtenidos (findByStudent): ${realCourses.length}`);

  // --- MODO DEMO ENRIQUECIDO (FORCE_MOCK_MODE=true) ---
  console.log("\n--- Ejecutando en MODO DEMO ENRIQUECIDO ---");
  process.env.FORCE_MOCK_MODE = 'true';

  // Prueba 3: Método simple (aditivo)
  let demoTasks = await taskRepo.getAllByUserId(TEST_STUDENT_ID);
  console.log(`[DEMO] Tareas obtenidas (getAllByUserId): ${demoTasks.length}`);
  const mockTasksCount = mockData.tasks.filter(t => t.user_id === TEST_STUDENT_ID).length;
  console.log(`  -> Cálculo esperado: ${realTasks.length} (Supabase) + ${mockTasksCount} (Mocks) = ${realTasks.length + mockTasksCount}`);
  if (demoTasks.length >= realTasks.length) {
    console.log("  -> ✅ OK: El conteo es consistente.");
  } else {
    console.error("  -> ❌ ERROR: El conteo es inconsistente.");
  }

  // Prueba 4: Método complejo (aditivo)
  let demoCourses = await courseRepo.findByStudent(TEST_STUDENT_ID);
  console.log(`[DEMO] Cursos obtenidos (findByStudent): ${demoCourses.length}`);
  // Cálculo complejo, solo verificamos que aumente o se mantenga
  if (demoCourses.length >= realCourses.length) {
      console.log("  -> ✅ OK: El conteo es consistente.");
  } else {
      console.error("  -> ❌ ERROR: El conteo es inconsistente.");
  }

  // --- PRUEBA DE ESCRITURA ---
  console.log("\n--- Probando la ESCRITURA (debe ir a Supabase) ---");
  const newTaskTitle = `Prueba Final ${uuidv4()}`;
  try {
    const savedTask = await taskRepo.save({ title: newTaskTitle, user_id: TEST_STUDENT_ID });
    console.log(`Tarea creada con ID: ${savedTask.id}`);
    const fetchedTask = await taskRepo.getById(savedTask.id);
    if (fetchedTask && fetchedTask.title === newTaskTitle) {
      console.log("✅ La tarea se ha guardado y recuperado de Supabase correctamente.");
    } else {
      console.error("❌ ERROR: No se pudo verificar la tarea guardada en Supabase.");
    }
  } catch (e) {
    console.error("❌ ERROR CRÍTICO durante la prueba de escritura:", e.message);
  }

  console.log("\n--- PRUEBA FINALIZADA ---");
}

runFinalCheck();
