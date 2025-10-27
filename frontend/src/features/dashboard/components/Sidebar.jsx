// Sidebar - Diseño como la plantilla con sidebar fijo
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Home,
  CheckSquare,
  Calendar,
  StickyNote,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/home', icon: Home, label: 'Inicio' },
    { path: '/tasks', icon: CheckSquare, label: 'Tareas' },
    { path: '/calendar', icon: Calendar, label: 'Calendario' },
    { path: '/notes', icon: StickyNote, label: 'Notas' },
    { path: '/estadisticas', icon: BarChart3, label: 'Estadísticas' },
    { path: '/chatbot', icon: MessageSquare, label: 'Chat IA' },
    { path: '/configuracion', icon: Settings, label: 'Configuración' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="fixed inset-y-0 left-0 w-60 bg-white border-r border-gray-200 z-10">
      {/* Header con logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <BookOpen className="text-green-600 mr-2" size={24} />
        <h1 className="text-xl font-semibold text-green-600">Captus</h1>
      </div>

      {/* Información del usuario */}
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-6 p-3 bg-green-50 rounded-xl">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-green-600 flex items-center justify-center">
            <span className="text-white font-semibold">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </span>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {user?.name || 'Usuario'}
            </p>
            <p className="text-xs text-gray-500">Estudiante</p>
          </div>
        </div>

        {/* Navegación */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-colors ${
                  isActive(item.path)
                    ? 'bg-green-50 text-green-600 border-l-4 border-green-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className={isActive(item.path) ? 'text-green-600' : 'text-gray-500'}>
                  <Icon size={18} />
                </span>
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Botón de logout */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
          >
            <LogOut size={18} className="text-gray-500" />
            <span className="font-medium text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;