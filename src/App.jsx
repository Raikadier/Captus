import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/themeContext';
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
import StudentCoursesPage from './features/courses/StudentCoursesPage';
import StudentCourseDetailPage from './features/courses/StudentCourseDetailPage';
import TeacherHomePage from './features/teacher/TeacherHomePage';
import TeacherCoursesPage from './features/teacher/TeacherCoursesPage';
import TeacherCourseDetailPage from './features/teacher/TeacherCourseDetailPage';
import TeacherTasksCreatedPage from './features/teacher/TeacherTasksCreatedPage';
import TeacherReviewSubmissionPage from './features/teacher/TeacherReviewSubmissionPage';
import TeacherStatsPage from './features/teacher/TeacherStatsPage';
import TeacherDiagramsPage from './features/teacher/TeacherDiagramsPage';
import TeacherReviewsPage from './features/teacher/TeacherReviewsPage';
import TeacherEditTaskPage from './features/teacher/TeacherEditTaskPage';
import TeacherCalendarPage from './features/teacher/TeacherCalendarPage';
import StudentDiagramsPage from './features/student/StudentDiagramsPage';
import { Toaster } from 'sonner';

 // Protected Route component
 const ProtectedRoute = ({ children }) => {
   const { isAuthenticated, loading } = useAuth();
 
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
 
   return isAuthenticated ? children : <Navigate to="/" />;
 };

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="App text-primary">
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
              path="/courses/:id"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <StudentCourseDetailPage />
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
              path="/stats"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <StatsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <SettingsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/diagrams"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <StudentDiagramsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            {/* Rutas docente */}
            <Route
              path="/teacher/home"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <TeacherHomePage />
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
              path="/teacher/courses/:id"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <TeacherCourseDetailPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/tasks/:id/edit"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <TeacherEditTaskPage />
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
              path="/teacher/reviews/:studentId"
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
              path="/teacher/calendar"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <TeacherCalendarPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
