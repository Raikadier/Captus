import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Calendar as CalendarIcon, CheckSquare, Sparkles, StickyNote, Clock } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card } from '../../../ui/card';
import NotificationsDropdown from './NotificationsDropdown';

function getCurrentDate() {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];
  const now = new Date();
  return `${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`;
}

const mockTasks = [
  {
    id: 1,
    title: 'Entregar ensayo de Literatura',
    dueDate: '2025-10-26',
    priority: 'Alta',
    status: 'Pendiente',
    subject: 'Literatura Española',
  },
  {
    id: 2,
    title: 'Estudiar para examen de Cálculo',
    dueDate: '2025-10-28',
    priority: 'Alta',
    status: 'En progreso',
    subject: 'Matemáticas III',
  },
  {
    id: 3,
    title: 'Presentación grupal de Historia',
    dueDate: '2025-10-30',
    priority: 'Media',
    status: 'Pendiente',
    subject: 'Historia Mundial',
  },
];

const upcomingEvents = [
  { time: '10:00 AM', title: 'Examen de Cálculo III', type: 'Examen', date: 'Lunes' },
  { time: '2:00 PM', title: 'Entrega de proyecto', type: 'Entrega', date: 'Martes' },
  { time: '4:00 PM', title: 'Reunión con tutor', type: 'Reunión', date: 'Miércoles' },
];

function StatCard({ icon, label, value, bgColor }) {
  return (
    <Card className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        <div className={`${bgColor} p-3 rounded-lg`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </Card>
  );
}

function CalendarEvent({ event }) {
  const getTypeColor = (type) => {
    switch (type) {
      case 'Examen':
        return 'bg-red-100 text-red-800';
      case 'Entrega':
        return 'bg-orange-100 text-orange-800';
      case 'Reunión':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[#F6F7FB] transition-colors">
      <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
        <Clock size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm">{event.title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{event.time}</p>
        <div className="flex items-center mt-1 space-x-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(event.type)}`}>{event.type}</span>
          <span className="text-xs text-green-600 font-medium">{event.date}</span>
        </div>
      </div>
    </div>
  );
}

const HomePage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const navigate = useNavigate()
  // Mock darkMode, in real app use context
  const darkMode = false
  const unreadCount = 3

  return (
    <div className={`p-8 ${darkMode ? 'bg-gray-900' : ''}`}>
      <header className={`sticky top-0 rounded-xl shadow-sm p-6 mb-6 z-10 animate-in slide-in-from-top duration-300 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              👋 Bienvenida, María
            </h1>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              {getCurrentDate()}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button
                variant="outline"
                className="border-gray-300 relative bg-transparent"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Bell size={18} className="text-gray-500" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-green-600 items-center justify-center text-[10px] text-white font-bold">
                      {unreadCount}
                    </span>
                  </span>
                )}
              </Button>
              <NotificationsDropdown
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card className={`p-6 rounded-xl shadow-sm animate-in fade-in slide-in-from-bottom duration-500 ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Tareas Pendientes
              </h2>
              <Link to="/tasks">
                <Button variant="ghost" className={`text-green-600 hover:text-green-700 hover:bg-green-50 transition-all duration-200 hover:scale-105 ${
                  darkMode ? 'text-green-400 hover:text-green-500 hover:bg-green-400' : ''
                }`}>
                  Ver todas
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {mockTasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`p-4 border rounded-lg transition-all duration-200 cursor-pointer animate-in fade-in slide-in-from-left hover:scale-[1.02] hover:shadow-md ${
                    darkMode ? 'border-gray-700 bg-gray-750 hover:border-green-600' : 'border-gray-200 hover:border-green-500'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => navigate(`/tasks/${task.id}`)}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {task.title}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800">{task.priority}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">{task.status}</span>
                  </div>
                  <div className={`flex items-center gap-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div className="flex items-center">
                      <CalendarIcon size={14} className="mr-1.5 text-green-600" />
                      {new Date(task.dueDate).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="flex items-center">
                      <CheckSquare size={14} className="mr-1.5 text-green-600" />
                      {task.subject}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className={`p-6 rounded-xl shadow-sm animate-in fade-in slide-in-from-bottom duration-500 delay-200 ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Resumen General
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatCard
                icon={<CheckSquare className="text-green-600" size={24} />}
                label="Total de Tareas"
                value="12"
                bgColor="bg-green-50"
              />
              <StatCard
                icon={<CalendarIcon className="text-blue-600" size={24} />}
                label="Próximos Eventos"
                value="5"
                bgColor="bg-blue-50"
              />
              <StatCard
                icon={<StickyNote className="text-orange-600" size={24} />}
                label="Notas Guardadas"
                value="28"
                bgColor="bg-orange-50"
              />
              <StatCard
                icon={<Bell className="text-purple-600" size={24} />}
                label="Recordatorios Activos"
                value="7"
                bgColor="bg-purple-50"
              />
            </div>
          </Card>
        </div>
      </div>

      <Link to="/chatbot" title="Hablar con Captus AI">
        <Button
          className={`fixed bottom-6 right-6 h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 animate-pulse`}
          size="icon"
        >
          <Sparkles size={24} />
        </Button>
      </Link>
    </div>
  )
}

export default HomePage
