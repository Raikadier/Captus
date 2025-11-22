// Sidebar - Diseño como la plantilla con sidebar fijo
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'
import './Sidebar.css'
import {
  BookOpen,
  Home,
  CheckSquare,
  Calendar as CalendarIcon,
  StickyNote,
  BarChart3,
  Sparkles,
  Settings,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  ChevronDown,
  Tag,
} from 'lucide-react'

const Sidebar = ({ onCollapseChange }) => {
  const location = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [tasksDropdownOpen, setTasksDropdownOpen] = useState(false)

  const menuItems = [
    { path: '/home', icon: Home, label: 'Inicio' },
    { path: '/courses', icon: BookOpen, label: 'Cursos' },
    {
      type: 'dropdown',
      icon: CheckSquare,
      label: 'Tareas',
      isOpen: tasksDropdownOpen,
      onToggle: () => setTasksDropdownOpen(!tasksDropdownOpen),
      subItems: [
        { path: '/tasks', icon: CheckSquare, label: 'Mis Tareas' },
        { path: '/tasks?tab=categories', icon: Tag, label: 'Categorías' }
      ]
    },
    { path: '/diagrams', icon: GitBranch, label: 'Diagramas' },
    { path: '/calendar', icon: CalendarIcon, label: 'Calendario' },
    { path: '/notes', icon: StickyNote, label: 'Notas' },
    { path: '/groups', icon: Users, label: 'Grupos' },
    { path: '/stats', icon: BarChart3, label: 'Estadísticas' },
    { path: '/chatbot', icon: Sparkles, label: 'Captus AI' },
    { path: '/settings', icon: Settings, label: 'Configuración' },
  ]

  const handleCollapse = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    if (onCollapseChange) {
      onCollapseChange(newState)
    }
  }

  const isActive = (path) => {
    if (path === '/tasks') {
      // "Mis Tareas" está activo si estamos en /tasks sin tab=categories
      return location.pathname === '/tasks' && !location.search.includes('tab=categories')
    }
    if (path === '/tasks?tab=categories') {
      // "Categorías" está activo si estamos en /tasks con tab=categories
      return location.pathname === '/tasks' && location.search.includes('tab=categories')
    }
    return location.pathname === path
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div
      className={`fixed inset-y-0 left-0 bg-sidebar border-r border-sidebar-border z-10 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] slide-in-animation sidebar-shadow ${
        isCollapsed ? 'w-20' : 'w-60'
      }`}
    >
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
          onClick={handleCollapse}
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
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-primary flex items-center justify-center flex-shrink-0 shadow-md avatar-glow">
              <span className="text-primary-foreground font-semibold">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
            </div>
            {!isCollapsed && (
              <div className="transition-opacity duration-200">
                <p className={`font-medium text-sidebar-foreground whitespace-nowrap`}>{user?.name ? user.name.split(' ')[0] : 'Usuario'}</p>
                <p className={`text-xs text-muted-foreground whitespace-nowrap`}>Estudiante</p>
              </div>
            )}
          </div>

          <nav className="space-y-1">
            {menuItems.map((item, index) => {
              if (item.type === 'dropdown') {
                const DropdownIcon = item.icon
                const hasActiveSubItem = item.subItems.some(subItem => isActive(subItem.path))

                return (
                  <div key={`dropdown-${index}`}>
                    <button
                      onClick={item.onToggle}
                      className={`sidebar-menu-item ripple-effect flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-xl transition-all duration-200 active:scale-95 w-full ${
                        hasActiveSubItem
                          ? 'active bg-sidebar-accent text-primary font-medium shadow-sm'
                          : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                      }`}
                      title={isCollapsed ? item.label : ''}
                    >
                      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                        <span className={hasActiveSubItem ? 'text-primary' : 'text-muted-foreground'}>
                          <DropdownIcon size={18} />
                        </span>
                        {!isCollapsed && (
                          <span className="font-medium text-sm whitespace-nowrap transition-opacity duration-200">
                            {item.label}
                          </span>
                        )}
                      </div>
                      {!isCollapsed && (
                        <ChevronDown
                          size={16}
                          className={`text-muted-foreground chevron-rotate ${item.isOpen ? 'rotated' : ''}`}
                        />
                      )}
                    </button>

                    {/* Submenu */}
                    {item.isOpen && !isCollapsed && (
                      <div className="dropdown-submenu open ml-6 mt-1 space-y-1">
                        {item.subItems.map((subItem) => {
                          const SubIcon = subItem.icon
                          const subActive = isActive(subItem.path)
                          return (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 active:scale-95 ${
                                subActive
                                  ? 'bg-sidebar-accent/80 text-primary font-medium'
                                  : 'text-muted-foreground hover:bg-sidebar-accent/40 hover:text-sidebar-foreground'
                              }`}
                            >
                              <span className={subActive ? 'text-primary' : 'text-muted-foreground'}>
                                <SubIcon size={16} />
                              </span>
                              <span className="font-medium text-sm whitespace-nowrap">
                                {subItem.label}
                              </span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              } else {
                // Regular menu item
                const RegularIcon = item.icon
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`sidebar-menu-item ripple-effect flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
                      active
                        ? 'active bg-sidebar-accent text-primary font-medium shadow-sm'
                        : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                    }`}
                    title={isCollapsed ? item.label : ''}
                  >
                    <span className={active ? 'text-primary' : 'text-muted-foreground'}>
                      <RegularIcon size={18} />
                    </span>
                    {!isCollapsed && (
                      <span className="font-medium text-sm whitespace-nowrap transition-opacity duration-200">
                        {item.label}
                      </span>
                    )}
                  </Link>
                )
              }
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
    </div>
  );
};

export default Sidebar;
