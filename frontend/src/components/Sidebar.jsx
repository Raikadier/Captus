// Sidebar.jsx - Barra lateral de navegación estilo Captus
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  CheckSquare,
  Calendar,
  BarChart3,
  MessageSquare,
  Settings,
  StickyNote,
  BookOpen,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ onNavigate }) => {
  const { user } = useAuth();

  // Obtener iniciales del nombre del usuario
  const getUserInitials = () => {
    const name = user?.user_metadata?.name || 'Usuario';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const navLinks = [
    { to: '/home', icon: <Home size={18} />, text: 'Inicio' },
    { to: '/tasks', icon: <CheckSquare size={18} />, text: 'Tareas' },
    { to: '/calendar', icon: <Calendar size={18} />, text: 'Calendario' },
    { to: '/notes', icon: <StickyNote size={18} />, text: 'Notas' },
    { to: '/stats', icon: <BarChart3 size={18} />, text: 'Estadísticas' },
    { to: '/groups', icon: <Users size={18} />, text: 'Grupos' },
    { to: '/chatbot', icon: <MessageSquare size={18} />, text: 'Chat IA' },
    { to: '/profile', icon: <Settings size={18} />, text: 'Configuración' },
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-60 max-w-[80vw] bg-white border-r border-gray-200 z-40 lg:z-10" role="navigation" aria-label="Navegación principal">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <BookOpen className="text-green-600 mr-2" size={24} />
        <h1 className="text-xl font-semibold text-green-600">Captus</h1>
      </div>

      {/* Perfil del usuario */}
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-6 p-3 bg-green-50 rounded-xl">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-green-600 flex items-center justify-center">
            <span className="text-white font-semibold">{getUserInitials()}</span>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">
              {user?.user_metadata?.name || 'Usuario'}
            </p>
            <p className="text-xs text-gray-500">Estudiante</p>
          </div>
        </div>

        {/* Links de navegación */}
        <nav className="space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => onNavigate?.()}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-green-50 text-green-600 border-l-4 border-green-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-green-600' : 'text-gray-500'}>
                    {link.icon}
                  </span>
                  <span className="font-medium text-sm">{link.text}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;

