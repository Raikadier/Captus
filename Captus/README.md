# Captus Web - Task Management Application

A modern web version of the Captus desktop application, migrated from C# to a React + Node.js stack with Supabase.

## 🚀 Features (MVP)

- ✅ User authentication (register/login) with Supabase Auth
- ✅ Task management (CRUD operations)
- ✅ Subtask support
- ✅ Categories and priorities
- ✅ Streak tracking system
- ✅ Responsive UI with Tailwind CSS
- ✅ REST API with JWT authentication
- ✅ Swagger API documentation

## 🏗️ Architecture

### Backend
- **Framework**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + JWT
- **Documentation**: Swagger/OpenAPI
- **Structure**: Modular (controllers, services, models, routes)

### Frontend
- **Framework**: React + Vite
- **State Management**: Context API + Custom Hooks
- **Styling**: Tailwind CSS
- **Architecture**: Bulletproof React (features, shared, components)
- **Routing**: React Router

## 📁 Project Structure

```
Captus/
├── backend/src/
│   ├── controllers/     # HTTP request handlers
│   ├── services/        # Business logic layer
│   ├── models/          # Data models
│   ├── routes/          # API route definitions
│   └── middleware/      # Express middleware
├── src/
│   ├── features/        # Feature-specific code
│   │   └── tasks/       # Task management feature
│   ├── shared/          # Shared utilities and components
│   └── context/         # React context providers
├── __tests__/           # Unit and integration tests
├── server.js            # Main server file
├── supabase-schema.sql  # Database schema
└── MIGRATION_PLAN.md    # Migration documentation
```

## 🔧 Setup and Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account and project

### Environment Variables
Create a `.env` file in the root directory:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Server Configuration
PORT=5432
FRONTEND_URL=http://localhost:5173
```

### Installation

1. **Clone and setup**:
   ```bash
   git checkout feature/web-migration
   npm install
   ```

2. **Database setup**:
   - Create a Supabase project
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
   - Update your `.env` file with Supabase credentials

3. **Start the application**:
   ```bash
   # Start backend server
   npm run server:dev

   # In another terminal, start frontend
   npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5432
   - API Documentation: http://localhost:5432/api-docs

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

## 📚 API Documentation

The API is fully documented with Swagger. Visit `/api-docs` when the server is running.

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

#### Tasks
- `GET /api/tasks` - Get user tasks (with filters)
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/overdue` - Get overdue tasks
- `GET /api/tasks/completed-today` - Get today's completed tasks
- `POST /api/tasks/:id/subtasks` - Create subtask
- `GET /api/tasks/:id/subtasks` - Get task subtasks

#### Streaks
- `GET /api/streaks` - Get user streak
- `PUT /api/streaks` - Update streak
- `DELETE /api/streaks` - Reset streak
- `GET /api/streaks/stats` - Get streak statistics

#### Reference Data
- `GET /api/categories` - Get all categories
- `GET /api/priorities` - Get all priorities

## 🔄 Migration from Desktop Version

This web version maintains feature parity with the C# desktop application:

### Entity Mapping
- `Task` (C#) → `tasks` table
- `SubTask` (C#) → `tasks` table with `parent_task_id`
- `User` (C#) → Supabase Auth + `users` table
- `Category` (C#) → `categories` table
- `Priority` (C#) → `priorities` table
- `Statistics` (C#) → `streaks` table

### Business Logic Migration
- Task validation and business rules preserved
- Streak calculation logic migrated
- User session management adapted for web
- CRUD operations maintain desktop behavior

See `MIGRATION_PLAN.md` for detailed migration notes.

## 🚀 Deployment

### Backend Deployment
```bash
npm run build
npm run server  # Production server
```

### Frontend Deployment
```bash
npm run build
# Deploy the dist/ folder to your hosting service
```

## 🤝 Contributing

1. Create a feature branch from `feature/web-migration`
2. Make your changes
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📝 License

This project is part of the Captus application migration. See the original desktop project for licensing information.

## 🐛 Known Issues & TODO

- [ ] Email notifications (Phase 2)
- [ ] Document management (Phase 2)
- [ ] Work groups (Phase 2)
- [ ] AI integration (Phase 3)
- [ ] UML editor (Phase 3)

See `MIGRATION_PLAN.md` for the complete roadmap.
