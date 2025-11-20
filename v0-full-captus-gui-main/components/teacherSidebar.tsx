'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BookOpen, School, ClipboardList, ListChecks, Calendar, GitBranch, BarChart3, MessageSquare, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react'

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

interface TeacherSidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

export function TeacherSidebar({ isCollapsed, setIsCollapsed }: TeacherSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    router.push('/')
  }

  return (
    <>
      <div className="flex items-center justify-between h-16 border-b border-gray-200 px-4">
        {!isCollapsed ? (
          <div className="flex items-center space-x-2 transition-opacity duration-200">
            <BookOpen className="text-green-600" size={24} />
            <h1 className="text-xl font-semibold text-green-600">Captus</h1>
          </div>
        ) : (
          <div className="transition-opacity duration-200">
            <BookOpen className="text-green-600" size={24} />
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          title={isCollapsed ? 'Expandir' : 'Colapsar'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} mb-6 p-3 bg-green-50 rounded-xl transition-all duration-200`}
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-green-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold">P</span>
          </div>
          {!isCollapsed && (
            <div className="transition-opacity duration-200">
              <p className="font-medium text-gray-900 whitespace-nowrap">Profesor</p>
              <p className="text-xs text-gray-500 whitespace-nowrap">Docente</p>
            </div>
          )}
        </div>

        <nav className="space-y-1">
          {teacherMenuItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.path
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  active ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <span className={active ? 'text-green-600' : 'text-gray-500'}>
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

      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 w-full`}
          title={isCollapsed ? 'Cerrar Sesión' : ''}
        >
          <LogOut size={18} className="text-gray-500" />
          {!isCollapsed && (
            <span className="font-medium text-sm whitespace-nowrap transition-opacity duration-200">
              Cerrar Sesión
            </span>
          )}
        </button>
      </div>
    </>
  )
}

// Para usar esta sidebar en DashboardLayout:
// Detecta el rol del usuario (por ejemplo, desde el pathname o un contexto)
// if (pathname.startsWith('/teacher')) {
//   return <TeacherSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
// }
