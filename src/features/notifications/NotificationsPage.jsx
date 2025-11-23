import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../lib/api'
import { Card } from '../../ui/card'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
import { CheckCircle, Bell, Calendar, Clock } from 'lucide-react'
import Loading from '../../ui/loading'

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications')
      setNotifications(data)
    } catch (error) {
      console.error('Error fetching notifications', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    } catch (error) {
      console.error('Error marking read', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    // In a real app, you'd have an endpoint for this, or loop.
    // For simplicity, we loop but ideally optimize.
    const unread = notifications.filter(n => !n.read)
    await Promise.all(unread.map(n => handleMarkAsRead(n.id)))
  }

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read
    if (filter === 'read') return n.read
    return true
  })

  if (loading) return <Loading fullScreen message="Cargando notificaciones..." />

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
          <p className="text-gray-500 mt-1">Mantente al día con tus actividades académicas y personales</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            Marcar todas como leídas
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'unread', 'read'].map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'ghost'}
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f === 'all' ? 'Todas' : f === 'unread' ? 'No leídas' : 'Leídas'}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">Sin notificaciones</h3>
            <p className="text-gray-500">No tienes notificaciones {filter !== 'all' ? 'en esta categoría' : ''}</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 transition-all hover:shadow-md ${!notification.read ? 'bg-blue-50/50 border-blue-100' : 'bg-white'}`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${!notification.read ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                  <Bell size={20} />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-semibold text-lg ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-400 flex items-center gap-1 whitespace-nowrap ml-2">
                      <Clock size={12} />
                      {new Date(notification.created_at).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-gray-600 mt-1 leading-relaxed">
                    {notification.body}
                  </p>

                  {notification.event_type && (
                    <div className="mt-3">
                      <Badge variant="secondary" className="text-xs font-normal bg-gray-100 text-gray-600">
                        {notification.event_type.replace('_', ' ')}
                      </Badge>
                    </div>
                  )}
                </div>

                {!notification.read && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleMarkAsRead(notification.id)}
                    title="Marcar como leída"
                    className="text-gray-400 hover:text-primary"
                  >
                    <CheckCircle size={20} />
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
