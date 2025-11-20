'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BookOpen, Home, CheckSquare, CalendarIcon, StickyNote, BarChart3, Sparkles, Settings, LogOut, ChevronLeft, ChevronRight, Users } from 'lucide-react'
import { TeacherSidebar } from './teacherSidebar'
import { useTheme } from '@/contexts/themeContext'

const menuItems = [
  { path: '/home', icon: Home, label: 'Inicio' },
  { path: '/courses', icon: BookOpen, label: 'Cursos' },
  { path: '/tasks', icon: CheckSquare, label: 'Tareas' },
  { path: '/calendar', icon: CalendarIcon, label: 'Calendario' },
  { path: '/notes', icon: StickyNote, label: 'Notas' },
  { path: '/groups', icon: Users, label: 'Grupos' },
  { path: '/stats', icon: BarChart3, label: 'Estadísticas' },
  { path: '/chatbot', icon: Sparkles, label: 'Captus AI' },
  { path: '/settings', icon: Settings, label: 'Configuración' },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { darkMode } = useTheme()

  const isTeacher = pathname?.startsWith('/teacher')

  const handleLogout = () => {
    router.push('/')
  }

  return (
    <div className={`min-h-screen bg-background animate-in fade-in duration-500`}>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-sidebar border-r border-sidebar-border z-10 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] animate-in slide-in-from-left-10 duration-500 ${
          isCollapsed ? 'w-20' : 'w-60'
        }`}
      >
        {isTeacher ? (
          <TeacherSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        ) : (
          <>
            <div className={`flex items-center justify-between h-16 border-b border-sidebar-border px-4`}>
              {!isCollapsed ? (
                <div className="flex items-center space-x-2 transition-opacity duration-200">
                  <BookOpen className="text-primary" size={24} />
                  <h1 className={`text-xl font-semibold text-primary`}>Captus</h1>
                </div>
              ) : (
                <div className="transition-opacity duration-200">
                  <BookOpen className="text-primary" size={24} />
                </div>
              )}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors`}
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
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-primary flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-primary-foreground font-semibold">U</span>
                  </div>
                  {!isCollapsed && (
                    <div className="transition-opacity duration-200">
                      <p className={`font-medium text-sidebar-foreground whitespace-nowrap`}>Usuario</p>
                      <p className={`text-xs text-muted-foreground whitespace-nowrap`}>Estudiante</p>
                    </div>
                  )}
                </div>

                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    const active = pathname === item.path
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
                          active 
                            ? 'bg-sidebar-accent text-primary font-medium shadow-sm' 
                            : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
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

            <div className={`flex-shrink-0 p-4 border-t border-sidebar-border`}>
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
          </>
        )}
      </div>

      {/* Main Content */}
      <div
        className={`min-h-screen transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'ml-20' : 'ml-60'}`}
      >
        {children}
      </div>
    </div>
  )
}
