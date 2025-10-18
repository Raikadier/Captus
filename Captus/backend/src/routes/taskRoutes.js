// Task routes
import express from 'express';
import TaskController from '../controllers/taskController.js';

const router = express.Router();

// Initialize controller with supabase (will be passed from main app)
let taskController = null;

export const setTaskController = (supabase) => {
  taskController = new TaskController(supabase);
};

// Task CRUD routes
router.get('/', (req, res) => taskController.getTasks(req, res));
router.post('/', (req, res) => taskController.createTask(req, res));
router.get('/overdue', (req, res) => taskController.getOverdueTasks(req, res));
router.get('/completed-today', (req, res) => taskController.getCompletedTasksToday(req, res));

// Task-specific routes
router.get('/:id', (req, res) => taskController.getTaskById(req, res));
router.put('/:id', (req, res) => taskController.updateTask(req, res));
router.delete('/:id', (req, res) => taskController.deleteTask(req, res));

// Subtask routes
router.get('/:id/subtasks', (req, res) => taskController.getSubtasks(req, res));
router.post('/:id/subtasks', (req, res) => taskController.createSubtask(req, res));

export default router;