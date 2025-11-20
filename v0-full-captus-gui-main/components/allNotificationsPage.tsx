'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Bell } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useRouter } from 'next/navigation'

interface Notification {
  id: number
  title: string
  description: string
  time: string
  read: boolean
  category?: string
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'Tarea próxima a vencer',
    description: 'La tarea de Matemáticas vence mañana.',
    time: 'Hoy, 10:20 AM',
    read: false,
    category: 'today'
  },
  {
    id: 2,
    title: 'Nuevo anuncio del profesor',
    description: 'El capítulo 5 ya está disponible.',
    time: 'Hoy, 8:05 AM',
    read: false,
    category: 'today'
  },
  {
    id: 3,
    title: 'Evento del calendario',
    description: 'Reunión del proyecto a las 4 PM.',
    time: 'Ayer, 4:15 PM',
    read: true,
    category: 'yesterday'
  },
  {
    id: 4,
    title: 'Mensaje importante',
    description: 'El servidor estará en mantenimiento.',
    time: 'Ayer, 9:30 AM',
    read: true,
    category: 'yesterday'
  },
  {
    id: 5,
    title: 'Nueva nota compartida',
    description: 'Juan compartió una nota de Física contigo.',
    time: '2 días atrás',
    read: true,
    category: 'previous'
  },
  {
    id: 6,
    title: 'Actualización del grupo',
    description: 'El grupo de Química tiene 3 nuevos miembros.',
    time: '3 días atrás',
    read: true,
    category: 'previous'
  }
]

export default function AllNotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const todayNotifications = notifications.filter((n) => n.category === 'today')
  const yesterdayNotifications = notifications.filter((n) => n.category === 'yesterday')
  const previousNotifications = notifications.filter((n) => n.category === 'previous')

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>

        <div className="flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-xl">
            <Bell className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
            <p className="text-gray-600 mt-1">Revisa tus alertas más recientes</p>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="divide-y divide-gray-100">
            {/* Hoy */}
            {todayNotifications.length > 0 && (
              <div>
                <div className="px-6 py-3 bg-gray-50">
                  <h2 className="text-sm font-semibold text-gray-700">Hoy</h2>
                </div>
                {todayNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleMarkAsRead(notification.id)}
                    className={`px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-green-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      )}
                      <div className={`flex-1 ${notification.read ? 'ml-5' : ''}`}>
                        <h3 className="font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Ayer */}
            {yesterdayNotifications.length > 0 && (
              <div>
                <div className="px-6 py-3 bg-gray-50">
                  <h2 className="text-sm font-semibold text-gray-700">Ayer</h2>
                </div>
                {yesterdayNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      )}
                      <div className={`flex-1 ${notification.read ? 'ml-5' : ''}`}>
                        <h3 className="font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Anterior */}
            {previousNotifications.length > 0 && (
              <div>
                <div className="px-6 py-3 bg-gray-50">
                  <h2 className="text-sm font-semibold text-gray-700">Anterior</h2>
                </div>
                {previousNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      )}
                      <div className={`flex-1 ${notification.read ? 'ml-5' : ''}`}>
                        <h3 className="font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {notifications.length === 0 && (
              <div className="px-6 py-12 text-center">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  No hay notificaciones
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Cuando tengas notificaciones nuevas, aparecerán aquí
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

/*
 * INTEGRACIÓN EN EL ROUTER:
 * 
 * 1. En app/(dashboard)/notifications/page.tsx:
 * 
 * import AllNotificationsPage from '@/components/all-notifications-page'
 * 
 * export default function NotificationsPage() {
 *   return <AllNotificationsPage />
 * }
 * 
 * 2. En el NotificationsDropdown (components/notifications-dropdown.tsx),
 *    actualizar el botón "Ver todas las notificaciones →":
 * 
 * <button
 *   onClick={() => router.push('/notifications')}
 *   className="w-full py-2 text-center text-sm text-green-600 hover:text-green-700 font-medium"
 * >
 *   Ver todas las notificaciones →
 * </button>
 */
