import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  School,
  ClipboardList,
  ListChecks,
  Calendar,
  GitBranch,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const teacherMenuItems = [
  { path: '/teacher', icon: School, label: 'Panel del Profesor' }, // Updated path from /teacher/home to /teacher to match App.jsx
  { path: '/teacher/courses', icon: BookOpen, label: 'Cursos' },
  { path: '/teacher/tasks', icon: ClipboardList, label: 'Tareas' },
  { path: '/teacher/reviews', icon: ListChecks, label: 'Revisiones Pendientes' },
  // { path: '/teacher/calendar', icon: Calendar, label: 'Calendario' }, // Removed as it's not in App.jsx routes clearly? Actually App.jsx has /calendar but for student? Let's keep it commented or check if teacher has specific calendar.
  { path: '/teacher/diagrams', icon: GitBranch, label: 'Diagramas' },
  { path: '/teacher/stats', icon: BarChart3, label: 'Estadísticas' },
  { path: '/chatbot', icon: MessageSquare, label: 'Chat IA' },
  { path: '/configuracion', icon: Settings, label: 'Ajustes' }, // Updated path from /settings to /configuracion to match App.jsx
];

// eslint-disable-next-line no-unused-vars
const TeacherSidebar = ({ isCollapsed: propIsCollapsed, setIsCollapsed: propSetIsCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Manage local state if props are not provided (though MainLayout should provide them)
  const [localIsCollapsed, setLocalIsCollapsed] = useState(false);

  // Use props if available, otherwise local state.
  // Note: MainLayout logic seems to pass isCollapsed but MainLayout itself doesn't manage the state for the child completely in the previous code.
  // Let's follow the pattern of Sidebar.jsx where it manages its own state, BUT MainLayout needs to know width.
  // In the updated Sidebar.jsx, it manages its own state.
  // In the updated MainLayout, it reads the DOM element width.

  const isCollapsed = localIsCollapsed;
  const setIsCollapsed = setLocalIsCollapsed;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`fixed inset-y-0 left-0 bg-sidebar border-r border-sidebar-border z-10 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] animate-in slide-in-from-left-10 duration-500 ${
        isCollapsed ? 'w-20' : 'w-60'
      }`}>
      <div className="flex items-center justify-between h-16 border-b border-sidebar-border px-4">
        {!isCollapsed ? (
          <div className="flex items-center space-x-2 transition-opacity duration-200">
            <BookOpen className="text-primary" size={24} />
            <h1 className="text-xl font-semibold text-primary">Captus</h1>
          </div>
        ) : (
          <div className="transition-opacity duration-200">
            <BookOpen className="text-primary" size={24} />
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
          title={isCollapsed ? 'Expandir' : 'Colapsar'}
        >
          {isCollapsed ? <ChevronRight size={18} className="text-muted-foreground" /> : <ChevronLeft size={18} className="text-muted-foreground" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="p-4 flex-shrink-0">
        <div
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} mb-6 p-3 bg-sidebar-accent/50 rounded-xl transition-all duration-200`}
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-semibold">P</span>
          </div>
          {!isCollapsed && (
            <div className="transition-opacity duration-200">
              <p className="font-medium text-sidebar-foreground whitespace-nowrap">Profesor</p>
              <p className="text-xs text-muted-foreground whitespace-nowrap">Docente</p>
            </div>
          )}
        </div>

        <nav className="space-y-1">
          {teacherMenuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
                  active ? 'bg-sidebar-accent text-primary' : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <span className={active ? 'text-primary' : 'text-muted-foreground'}>
                  <Icon size={18} />
                </span>
                {!isCollapsed && (
                  <span className="font-medium text-sm whitespace-nowrap transition-opacity duration-200">
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
      </div>

      <div className="flex-shrink-0 p-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all duration-200 w-full active:scale-95`}
          title={isCollapsed ? 'Cerrar Sesión' : ''}
        >
          <LogOut size={18} />
          {!isCollapsed && (
            <span className="font-medium text-sm whitespace-nowrap transition-opacity duration-200">
              Cerrar Sesión
            </span>
          )}
        </button>
      </div>
    </div>
  )
}

export default TeacherSidebar;
