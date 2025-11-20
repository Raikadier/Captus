// Sidebar - Diseño como la plantilla con sidebar fijo
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Home,
  CheckSquare,
  Calendar as CalendarIcon,
  StickyNote,
  BarChart3,
  MessageSquare,
  Settings,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const Sidebar = () => {
  const location = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { path: '/home', icon: Home, label: 'Inicio' },
    { path: '/courses', icon: BookOpen, label: 'Cursos' },
    { path: '/tasks', icon: CheckSquare, label: 'Tareas' },
    { path: '/calendar', icon: CalendarIcon, label: 'Calendario' },
    { path: '/notes', icon: StickyNote, label: 'Notas' },
    { path: '/groups', icon: Users, label: 'Grupos' },
    { path: '/stats', icon: BarChart3, label: 'Estadísticas' },
    { path: '/chatbot', icon: MessageSquare, label: 'Captus AI' },
    { path: '/settings', icon: Settings, label: 'Configuración' },
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-y-0 left-0 bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))] z-10 flex flex-col shadow-sm"
    >
      <div className="flex items-center justify-between h-16 border-b border-[hsl(var(--sidebar-border))] px-4">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-2"
            >
              <BookOpen className="text-[hsl(var(--sidebar-primary))]" size={24} />
              <h1 className="text-xl font-semibold text-[hsl(var(--sidebar-primary))]">Captus</h1>
            </motion.div>
          )}
          {isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <BookOpen className="text-[hsl(var(--sidebar-primary))]" size={24} />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-foreground))] transition-colors"
          title={isCollapsed ? 'Expandir' : 'Colapsar'}
        >
          {isCollapsed ? <ChevronRight size={18} className="text-muted-foreground" /> : <ChevronLeft size={18} className="text-muted-foreground" />}
        </button>
      </div>

      <div className="p-4 flex-shrink-0">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} mb-6 p-3 bg-[hsl(var(--sidebar-accent))] rounded-xl transition-all duration-200 shadow-sm`}>
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[hsl(var(--sidebar-primary))] flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-white font-semibold">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2 }}>
                <p className="font-medium text-[hsl(var(--sidebar-foreground))] whitespace-nowrap">{user?.name || 'Usuario'}</p>
                <p className="text-xs text-muted-foreground whitespace-nowrap">Estudiante</p>
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
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
                  active
                    ? 'bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-primary))] font-medium shadow-sm'
                    : 'text-muted-foreground hover:bg-[hsl(var(--sidebar-accent))]'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <span className={active ? 'text-[hsl(var(--sidebar-primary))]' : 'text-muted-foreground'}>
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
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-foreground))] transition-all duration-200 w-full active:scale-95`}
          title={isCollapsed ? 'Cerrar Sesión' : ''}
        >
          <LogOut size={18} className="text-muted-foreground" />
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
