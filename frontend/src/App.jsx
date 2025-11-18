import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './features/auth/components/LoginForm';
import HomePage from './features/dashboard/components/HomePage';
import MainLayout from './features/dashboard/components/MainLayout';
import TaskPage from './features/tasks/TaskPage';
import ChatBotPage from './features/chatbot/ChatBotPage';
import NotesPage from './features/notes/NotesPage';
import ProfilePage from './features/profile/ProfilePage';
import CalendarPage from './features/calendar/CalendarPage';
import GroupsPage from './features/groups/GroupsPage';
import SettingsPage from './features/settings/SettingsPage';
import StatsPage from './features/stats/StatsPage';
import TeacherHomePage from './features/teacher/TeacherHomePage';
import TeacherCoursesPage from './features/teacher/TeacherCoursesPage';
import TeacherTasksCreatedPage from './features/teacher/TeacherTasksCreatedPage';
import TeacherReviewsPage from './features/teacher/TeacherReviewsPage';
import TeacherStatsPage from './features/teacher/TeacherStatsPage';
import TeacherCourseDetailPage from './features/teacher/TeacherCourseDetailPage';
import TeacherDiagramsPage from './features/teacher/TeacherDiagramsPage';
import TeacherReviewSubmissionPage from './features/teacher/TeacherReviewSubmissionPage';
import TeacherEditTaskPage from './features/teacher/TeacherEditTaskPage';
import CreateCoursePage from './features/teacher/CreateCoursePage';
import CreateCourseTaskPage from './features/teacher/CreateCourseTaskPage';
import StudentCoursesPage from './features/courses/StudentCoursesPage';
import StudentCourseDetailPage from './features/courses/StudentCourseDetailPage';
import TaskDetailPage from './features/tasks/TaskDetailPage';
import NoteDetailPage from './features/notes/NoteDetailPage';
import CreateTaskPage from './features/tasks/CreateTaskPage';
import CreateNotePage from './features/notes/CreateNotePage';
import NotificationsPage from './features/notifications/NotificationsPage';
import { Toaster } from 'sonner';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, role } = useAuth();
  const location = useLocation();

  // En desarrollo, permite navegar sin autenticación para validar estilos/UX
  if (import.meta.env.MODE !== 'production') {
    return children;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  // Si es ruta de profesor y el rol no es teacher, redirige a home
  const isTeacherRoute = location.pathname.startsWith('/teacher');
  if (isTeacherRoute && role !== 'teacher') {
    return <Navigate to="/home" replace />;
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App p-4 md:p-6 text-primary">
          <Toaster richColors position="top-right" />
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <HomePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <TaskPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/new"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CreateTaskPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/chatbot"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ChatBotPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <NotesPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes/new"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CreateNotePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ProfilePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CalendarPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/groups"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <GroupsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/estadisticas"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <StatsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/configuracion"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <SettingsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            {/* Rutas de profesor */}
            <Route
              path="/teacher"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <TeacherHomePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <StudentCoursesPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:courseId"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <StudentCourseDetailPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/:taskId"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <TaskDetailPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes/:noteId"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <NoteDetailPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/courses"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <TeacherCoursesPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/courses/new"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CreateCoursePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/tasks"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <TeacherTasksCreatedPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/reviews"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <TeacherReviewsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/stats"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <TeacherStatsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/courses/:courseId"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <TeacherCourseDetailPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/courses/:courseId/assignments/new"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CreateCourseTaskPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/diagrams"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <TeacherDiagramsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/tasks/:taskId/edit"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <TeacherEditTaskPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/reviews/:submissionId"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <TeacherReviewSubmissionPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <NotificationsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
