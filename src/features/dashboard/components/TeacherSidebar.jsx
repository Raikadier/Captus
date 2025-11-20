import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'

const teacherMenuItems = [
  { path: '/teacher/home', icon: School, label: 'Panel del Profesor' },
  { path: '/teacher/courses', icon: BookOpen, label: 'Cursos' },
  { path: '/teacher/tasks', icon: ClipboardList, label: 'Tareas' },
  { path: '/teacher/reviews', icon: ListChecks, label: 'Revisiones Pendientes' },
  { path: '/teacher/calendar', icon: Calendar, label: 'Calendario' },
  { path: '/teacher/diagrams', icon: GitBranch, label: 'Diagramas' },
  { path: '/teacher/stats', icon: BarChart3, label: 'Estadísticas' },
  { path: '/chatbot', icon: MessageSquare, label: 'Chat IA' },
  { path: '/settings', icon: Settings, label: 'Ajustes' },
]

export default function TeacherSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div
      className={`fixed inset-y-0 left-0 bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))] z-10 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-sm ${
        isCollapsed ? 'w-20' : 'w-60'
      }`}
    >
      <div className="flex items-center justify-between h-16 border-b border-[hsl(var(--sidebar-border))] px-4">
        {!isCollapsed ? (
          <div className="flex items-center space-x-2 transition-opacity duration-200">
            <BookOpen className="text-[hsl(var(--sidebar-primary))]" size={24} />
            <h1 className="text-xl font-semibold text-[hsl(var(--sidebar-primary))]">Captus</h1>
          </div>
        ) : (
          <div className="transition-opacity duration-200">
            <BookOpen className="text-[hsl(var(--sidebar-primary))]" size={24} />
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-foreground))] transition-colors"
          title={isCollapsed ? 'Expandir' : 'Colapsar'}
        >
          {isCollapsed ? <ChevronRight size={18} className="text-muted-foreground" /> : <ChevronLeft size={18} className="text-muted-foreground" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} mb-6 p-3 bg-[hsl(var(--sidebar-accent))] rounded-xl transition-all duration-200 shadow-sm`}>
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[hsl(var(--sidebar-primary))] flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-white font-semibold">P</span>
          </div>
          {!isCollapsed && (
            <div className="transition-opacity duration-200">
              <p className="font-medium text-[hsl(var(--sidebar-foreground))] whitespace-nowrap">Profesor</p>
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
                  active
                    ? 'bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-primary))] font-medium shadow-sm'
                    : 'text-muted-foreground hover:bg-[hsl(var(--sidebar-accent))]'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <span className={active ? 'text-[hsl(var(--sidebar-primary))]' : 'text-muted-foreground'}>
                  <Icon size={18} />
                </span>
                {!isCollapsed && (
                  <span className="font-medium text-sm whitespace-nowrap transition-opacity duration-200">{item.label}</span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="flex-shrink-0 p-4 border-t border-[hsl(var(--sidebar-border))]">
        <button
          onClick={handleLogout}
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-foreground))] transition-all duration-200 w-full active:scale-95`}
          title={isCollapsed ? 'Cerrar Sesión' : ''}
        >
          <LogOut size={18} className="text-muted-foreground" />
          {!isCollapsed && <span className="font-medium text-sm whitespace-nowrap transition-opacity duration-200">Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  )
}
