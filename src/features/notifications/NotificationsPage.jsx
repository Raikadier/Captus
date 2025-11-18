import React, { useState } from 'react';
import { ArrowLeft, Bell } from 'lucide-react';
import { Button } from '../../ui/button';
import { ScrollArea } from '../../ui/scroll-area';
import { useNavigate } from 'react-router-dom';

const mockNotifications = [
  { id: 1, title: 'Tarea próxima a vencer', description: 'La tarea de Matemáticas vence mañana.', time: 'Hoy, 10:20 AM', read: false, category: 'today' },
  { id: 2, title: 'Nuevo anuncio del profesor', description: 'El capítulo 5 ya está disponible.', time: 'Hoy, 8:05 AM', read: false, category: 'today' },
  { id: 3, title: 'Evento del calendario', description: 'Reunión del proyecto a las 4 PM.', time: 'Ayer, 4:15 PM', read: true, category: 'yesterday' },
  { id: 4, title: 'Mensaje importante', description: 'El servidor estará en mantenimiento.', time: 'Ayer, 9:30 AM', read: true, category: 'yesterday' },
  { id: 5, title: 'Nueva nota compartida', description: 'Juan compartió una nota de Física contigo.', time: '2 días atrás', read: true, category: 'previous' },
  { id: 6, title: 'Actualización del grupo', description: 'El grupo de Química tiene 3 nuevos miembros.', time: '3 días atrás', read: true, category: 'previous' },
];

const NotificationsSection = ({ title, items, onMarkRead }) => (
  <div>
    <div className="px-6 py-3 bg-gray-50">
      <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
    </div>
    {items.map((notification) => (
      <div
        key={notification.id}
        onClick={() => onMarkRead(notification.id)}
        className={`px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${
          !notification.read ? 'bg-green-50/30' : ''
        }`}
      >
        <div className="flex items-start gap-3">
          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />}
          <div className={`flex-1 ${notification.read ? 'ml-5' : ''}`}>
            <h3 className="font-semibold text-gray-900">{notification.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
            <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleMarkAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const today = notifications.filter((n) => n.category === 'today');
  const yesterday = notifications.filter((n) => n.category === 'yesterday');
  const previous = notifications.filter((n) => n.category === 'previous');

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="divide-y divide-gray-100">
            {today.length > 0 && (
              <NotificationsSection title="Hoy" items={today} onMarkRead={handleMarkAsRead} />
            )}
            {yesterday.length > 0 && (
              <NotificationsSection title="Ayer" items={yesterday} onMarkRead={handleMarkAsRead} />
            )}
            {previous.length > 0 && (
              <NotificationsSection title="Anterior" items={previous} onMarkRead={handleMarkAsRead} />
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default NotificationsPage;
