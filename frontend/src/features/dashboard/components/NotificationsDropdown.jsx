import React, { useEffect, useRef, useState } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'
import { ScrollArea } from '../../../ui/scroll-area'
import { Button } from '../../../ui/button'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import apiClient from '../../../shared/api/client'

export default function NotificationsDropdown({ isOpen, onClose }) {
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    fetchNotifications()

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  const fetchNotifications = async () => {
    if (!user) return
    setLoading(true)
    try {
      const response = await apiClient.get('/notifications')
      const data = response.data
      setNotifications(Array.isArray(data) ? data : data.data || [])
    } catch (error) {
      console.error('Error loading notifications', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (e, id) => {
    e.stopPropagation()
    try {
      await apiClient.put(`/notifications/${id}/read`)
      setNotifications((prev) =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      )
    } catch (error) {
      console.error('Error marking as read', error)
    }
  }

  if (!isOpen) return null

  const unreadCount = notifications.filter((n) => !n.read).length

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
            <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
              {unreadCount} nuevas
            </span>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <ScrollArea className="h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center h-full p-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            No tienes notificaciones
          </div>
        ) : (
          <div className="p-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer group ${notification.read ? 'bg-white hover:bg-gray-50' : 'bg-blue-50 hover:bg-blue-100'}`}
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
                  <p className="text-sm text-gray-600 mb-1 line-clamp-2">{notification.body}</p>
                  <p className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleString()}</p>
                </div>

                {/* Mark as read icon (appears on hover) */}
                {!notification.read && (
                  <button
                    onClick={(e) => handleMarkAsRead(e, notification.id)}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Marcar como leída"
                  >
                    <CheckCircle size={16} className="text-gray-400 hover:text-primary" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full text-sm text-primary hover:text-primary/90 hover:bg-primary/10"
          onClick={() => {
            onClose()
            navigate('/notifications')
          }}
        >
          Ver todas las notificaciones →
        </Button>
      </div>
    </div>
  )
}
