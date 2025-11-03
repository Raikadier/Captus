// Sidebar - Diseño como la plantilla con sidebar fijo
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Home,
  CheckSquare,
  Calendar as CalendarIcon,
  StickyNote,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { path: '/home', icon: Home, label: 'Inicio' },
    { path: '/tasks', icon: CheckSquare, label: 'Tareas' },
    { path: '/calendar', icon: CalendarIcon, label: 'Calendario' },
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
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-y-0 left-0 bg-white border-r border-gray-200 z-10 flex flex-col"
    >
      <div className="flex items-center justify-between h-16 border-b border-gray-200 px-4">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-2"
            >
              <BookOpen className="text-green-600" size={24} />
              <h1 className="text-xl font-semibold text-green-600">Captus</h1>
            </motion.div>
          )}
          {isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <BookOpen className="text-green-600" size={24} />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          title={isCollapsed ? 'Expandir' : 'Colapsar'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="p-4 flex-shrink-0">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} mb-6 p-3 bg-green-50 rounded-xl transition-all duration-200`}>
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-green-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2 }}>
                <p className="font-medium text-gray-900 whitespace-nowrap">{user?.name || 'Usuario'}</p>
                <p className="text-xs text-gray-500 whitespace-nowrap">Estudiante</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  active ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <span className={active ? 'text-green-600' : 'text-gray-500'}>
                  <Icon size={18} />
                </span>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2 }} className="font-medium text-sm whitespace-nowrap">
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 w-full`}
          title={isCollapsed ? 'Cerrar Sesión' : ''}
        >
          <LogOut size={18} className="text-gray-500" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2 }} className="font-medium text-sm whitespace-nowrap">
                Cerrar Sesión
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;