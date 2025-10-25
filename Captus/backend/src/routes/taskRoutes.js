// Task routes
import express from 'express';
import TaskController from '../controllers/taskController.js';

const router = express.Router();

// Initialize controller with supabase (will be passed from main app)
let taskController = null;

export const setTaskController = (supabase) => {
  taskController = new TaskController(supabase);
};

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for the authenticated user
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: priorityId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: searchText
 *         schema:
 *           type: string
 *       - in: query
 *         name: isOverdue
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of tasks
 *   post:
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               due_date:
 *                 type: string
 *                 format: date-time
 *               priority_id:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Task created
 */

/**
 * @swagger
 * /api/tasks/overdue:
 *   get:
 *     summary: Get overdue tasks for the authenticated user
 *     responses:
 *       200:
 *         description: List of overdue tasks
 */

/**
 * @swagger
 * /api/tasks/completed-today:
 *   get:
 *     summary: Get tasks completed today by the authenticated user
 *     responses:
 *       200:
 *         description: List of completed tasks today
 */

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a specific task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task details
 *       404:
 *         description: Task not found
 *   put:
 *     summary: Update a task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               due_date:
 *                 type: string
 *                 format: date-time
 *               priority_id:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Task updated
 *       404:
 *         description: Task not found
 *   delete:
 *     summary: Delete a task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Task deleted
 *       404:
 *         description: Task not found
 */

/**
 * @swagger
 * /api/tasks/{id}/subtasks:
 *   get:
 *     summary: Get subtasks for a specific task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of subtasks
 *   post:
 *     summary: Create a subtask for a specific task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               due_date:
 *                 type: string
 *                 format: date-time
 *               priority_id:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Subtask created
 */

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