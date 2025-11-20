import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import streakRoutes, { setStreakService } from './src/routes/streakRoutes.js';
import TaskRoutes from './routes/TaskRoutes.js';
import SubTaskRoutes from './routes/SubTaskRoutes.js';
import StatisticsRoutes from './routes/StatisticsRoutes.js';
import PriorityRoutes from './routes/PriorityRoutes.js';
import buildSupabaseAuthMiddleware from './src/middlewares/verifySupabaseToken.js';
import CategoryRoutes from './routes/CategoryRoutes.js';
import UserAchievementsRoutes from './routes/UserAchievementsRoutes.js';
import RolRoutes from './routes/RolRoutes.js';
import ProjectRoutes from './routes/ProjectRoutes.js';
import ProjectMemberRoutes from './routes/ProjectMemberRoutes.js';
import ProjectCommentRoutes from './routes/ProjectCommentRoutes.js';
import CommentLikeRoutes from './routes/CommentLikeRoutes.js';
import aiRouter from './src/routes/ai.js';
import { getSupabaseClient } from './src/lib/supabaseAdmin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Supabase admin client (for token verification and server-side operations)
const supabaseAdmin = getSupabaseClient();
const ENV_OK = !!supabaseAdmin;

if (!ENV_OK) {
  console.warn('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.');
} else {
  setStreakService(supabaseAdmin);
}

const verifySupabaseToken = buildSupabaseAuthMiddleware(supabaseAdmin);

// Health route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Captus Web API is running' });
});

// Swagger configuration (minimal)
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Captus Web API',
      version: '1.0.0',
      description: 'Minimal API for the Captus application (streaks only)',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/routes/streakRoutes.js',
    './routes/**/*.js',
    './docs/swaggerRoutes.js'
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// AI routes
if (ENV_OK && supabaseAdmin) {
  app.use('/ai', verifySupabaseToken, aiRouter);
}

// API routes (minimal)
app.use(
  '/api/streaks',
  (req, res, next) => {
    if (!ENV_OK || !supabaseAdmin) {
      return res.status(503).json({ error: 'Server misconfiguration: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY' });
    }
    return next();
  },
  verifySupabaseToken,
  streakRoutes
);

// Extended API routes
if (ENV_OK && supabaseAdmin) {
  app.use('/api/tasks', verifySupabaseToken, TaskRoutes);
  app.use('/api/subtasks', verifySupabaseToken, SubTaskRoutes);
  app.use('/api/statistics', verifySupabaseToken, StatisticsRoutes);
  app.use('/api/categories', verifySupabaseToken, CategoryRoutes);
  app.use('/api/priorities', PriorityRoutes);
  app.use('/api/achievements', verifySupabaseToken, UserAchievementsRoutes);
  app.use('/api/roles', verifySupabaseToken, RolRoutes);
  app.use('/api/projects', verifySupabaseToken, ProjectRoutes);
  app.use('/api/project-members', verifySupabaseToken, ProjectMemberRoutes);
  app.use('/api/project-comments', verifySupabaseToken, ProjectCommentRoutes);
  app.use('/api/comment-likes', verifySupabaseToken, CommentLikeRoutes);
}

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Captus Web API',
    version: '1.0.0',
    status: 'Running',
    docs: '/api-docs',
    health: '/api/health'
  });
});

// API base helper
app.get('/api', (req, res) => {
  res.json({
    message: 'Captus API',
    status: 'Running',
    health: '/api/health',
    docs: '/api-docs',
    endpoints: [
      '/api/health',
      '/api/streaks',
      '/api/tasks',
      '/api/subtasks',
      '/api/statistics',
      '/api/categories',
      '/api/priorities',
      '/api/achievements',
      '/api/roles',
      '/api/projects',
      '/api/project-members',
      '/api/project-comments',
      '/api/comment-likes',
      '/api/users'
    ]
  });
});

app.listen(PORT, () => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const apiBase = `http://localhost:${PORT}/api`;
  console.log('===================================');
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(`Health check: ${apiBase}/health`);
  console.log(`Swagger UI:   http://localhost:${PORT}/api-docs`);
  console.log(`API base:     ${apiBase}`);
  console.log(`Frontend:     ${frontendUrl}`);
  console.log('===================================');
});


