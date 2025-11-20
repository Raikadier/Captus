import React, { useEffect, useRef } from 'react'
import { CheckCircle } from 'lucide-react'
import { ScrollArea } from '../../../ui/scroll-area'
import { Button } from '../../../ui/button'
import { useNavigate } from 'react-router-dom'

const mockNotifications = [
  {
    id: 1,
    title: 'Tarea próxima a vencer',
    description: 'La tarea de Matemáticas vence mañana.',
    time: 'Hace 2 horas',
    read: false,
  },
  {
    id: 2,
    title: 'Nuevo anuncio del profesor',
    description: 'Hay material nuevo disponible.',
    time: 'Hace 5 horas',
    read: true,
  },
  {
    id: 3,
    title: 'Evento del calendario',
    description: 'Reunión de proyecto a las 4 PM.',
    time: 'Ayer',
    read: true,
  },
  {
    id: 4,
    title: 'Recordatorio de grupo',
    description: 'Tienes una sesión de estudio grupal en 1 hora.',
    time: 'Hace 30 minutos',
    read: false,
  },
]

export default function NotificationsDropdown({ isOpen, onClose }) {
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const unreadCount = mockNotifications.filter((n) => !n.read).length

  const handleViewAll = () => {
    onClose()
    navigate('/notifications')
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-12 w-[340px] bg-white rounded-xl shadow-lg border border-gray-200 z-50 animate-in fade-in-0 zoom-in-95 duration-200"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Notificaciones</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
              {unreadCount} nuevas
            </span>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <ScrollArea className="h-[300px]">
        <div className="p-2">
          {mockNotifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              {/* Unread indicator */}
              <div className="flex-shrink-0 mt-1">
                {!notification.read ? (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                ) : (
                  <div className="w-2 h-2" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 mb-0.5">{notification.title}</p>
                <p className="text-sm text-gray-600 mb-1 line-clamp-2">{notification.description}</p>
                <p className="text-xs text-gray-500">{notification.time}</p>
              </div>

              {/* Mark as read icon (appears on hover) */}
              {!notification.read && (
                <button className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CheckCircle size={16} className="text-gray-400 hover:text-green-600" />
                </button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full text-sm text-green-600 hover:text-green-700 hover:bg-green-50"
          onClick={handleViewAll}
        >
          Ver todas las notificaciones →
        </Button>
      </div>
    </div>
  )
}
