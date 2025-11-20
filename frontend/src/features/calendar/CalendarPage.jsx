import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Plus, Clock, X } from 'lucide-react'
import { useTheme } from '../../context/themeContext'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Textarea } from '../../ui/textarea'

function CreateEventModal({ onClose, onCreate, selectedDate }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(selectedDate?.toISOString().split('T')[0] || '')
  const [time, setTime] = useState('09:00')
  const [type, setType] = useState('Reunión')
  const { darkMode } = useTheme()

  const handleCreate = () => {
    if (title.trim() && date) {
      onCreate({
        title,
        description,
        date: new Date(date),
        time,
        type,
      })
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-300`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Plus size={24} className="text-green-600" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Nuevo Evento</h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Crea un evento en tu calendario</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label className={darkMode ? 'text-gray-300' : ''}>Título *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título del evento"
                className={`mt-1 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
              />
            </div>
            <div>
              <Label className={darkMode ? 'text-gray-300' : ''}>Tipo</Label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={`w-full mt-1 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
              >
                <option>Reunión</option>
                <option>Examen</option>
                <option>Entrega</option>
                <option>Clase</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className={darkMode ? 'text-gray-300' : ''}>Fecha *</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`mt-1 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                />
              </div>
              <div>
                <Label className={darkMode ? 'text-gray-300' : ''}>Hora</Label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className={`mt-1 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                />
              </div>
            </div>
            <div>
              <Label className={darkMode ? 'text-gray-300' : ''}>Descripción</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe tu evento..."
                className={`mt-1 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!title.trim() || !date}
                className="bg-green-600 hover:bg-green-700"
              >
                Crear Evento
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [tasks, setTasks] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [view, setView] = useState('month')
  const { darkMode } = useTheme()

  useEffect(() => {
    const mockTasks = [
      {
        id: 1,
        title: 'Reunión de equipo',
        date: new Date(2024, 9, 15),
        completed: false,
        priority: 'high',
      },
      {
        id: 2,
        title: 'Revisar código',
        date: new Date(2024, 9, 18),
        completed: true,
        priority: 'medium',
      },
      {
        id: 3,
        title: 'Entrega del proyecto',
        date: new Date(2024, 9, 25),
        completed: false,
        priority: 'high',
      },
    ]
    setTasks(mockTasks)
  }, [currentDate])

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const navigateMonth = (direction) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setMonth(newDate.getMonth() + direction)
      return newDate
    })
  }

  const getTasksForDate = (date) => {
    return tasks.filter((task) => task.date.toDateString() === date.toDateString())
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  const handleCreateEvent = (newEvent) => {
    const event = {
      id: Date.now(),
      title: newEvent.title,
      date: newEvent.date,
      completed: false,
      priority: 'medium',
    }
    setTasks([...tasks, event])
  }

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      return day
    })

    return (
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => (
          <div key={index} className={`p-4 border-2 rounded-xl ${
            day.toDateString() === selectedDate.toDateString()
              ? 'ring-2 ring-green-500 bg-green-50 border-green-200'
              : darkMode
                ? 'border-gray-700 bg-gray-750'
                : 'border-gray-200'
          }`}>
            <div className={`text-center mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <div className="text-xs font-medium text-gray-500">
                {day.toLocaleDateString('es-ES', { weekday: 'short' })}
              </div>
              <div className={`text-2xl font-bold ${
                day.toDateString() === new Date().toDateString()
                  ? 'text-green-600'
                  : ''
              }`}>
                {day.getDate()}
              </div>
            </div>
            <div className="space-y-1">
              {getTasksForDate(day).map((task) => (
                <div
                  key={task.id}
                  className={`text-xs p-2 rounded-lg border ${getPriorityColor(task.priority)}`}
                >
                  {task.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const dayTasks = getTasksForDate(selectedDate)

    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6`}>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {selectedDate.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </h3>
        <div className="space-y-2">
          {hours.map((hour) => (
            <div key={hour} className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'} py-2`}>
              <div className={`w-20 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {hour.toString().padStart(2, '0')}:00
              </div>
              <div className="flex-1">
                {/* Events would be positioned here based on time */}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const handleDayClick = (date) => {
    setSelectedDate(date)
    setView('day')
  }

  return (
    <div className="p-6 space-y-6">
      <div className={`rounded-xl shadow-sm p-6 mb-6 animate-in slide-in-from-top duration-300 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Calendario
            </h1>
            <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Organiza tus eventos y tareas
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Evento
          </button>
        </div>

        <div className="flex space-x-2">
          {['month', 'week'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                view === v
                  ? 'bg-green-50 text-green-600 shadow-sm'
                  : darkMode
                    ? 'text-gray-400 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {v === 'month' ? 'Mes' : 'Semana'}
            </button>
          ))}
        </div>
      </div>

      {view === 'month' && (
        <div className={`rounded-xl shadow-sm p-6 mb-6 animate-in fade-in duration-500 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateMonth(-1)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>

            <button
              onClick={() => navigateMonth(1)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className={`p-3 text-center font-semibold rounded-lg ${
                  darkMode ? 'bg-gray-750 text-gray-400' : 'bg-gray-50 text-gray-600'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth(currentDate).map((date, index) => (
              <div
                key={index}
                className={`min-h-32 p-3 border-2 rounded-xl hover:shadow-md cursor-pointer transition-all duration-200 ${
                  date && date.toDateString() === selectedDate.toDateString()
                    ? 'ring-2 ring-green-500 bg-green-50 border-green-200'
                    : date
                      ? darkMode
                        ? 'border-gray-700 hover:border-green-500 bg-gray-750'
                        : 'border-gray-200 hover:border-green-200'
                      : 'border-transparent'
                }`}
                onClick={() => date && handleDayClick(date)}
              >
                {date && (
                  <>
                    <div
                      className={`text-sm font-semibold mb-2 ${
                        date.toDateString() === new Date().toDateString()
                          ? 'w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center'
                          : darkMode
                            ? 'text-white'
                            : 'text-gray-900'
                      }`}
                    >
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {getTasksForDate(date)
                        .slice(0, 2)
                        .map((task) => (
                          <div
                            key={task.id}
                            className={`text-xs p-1.5 rounded-lg border ${getPriorityColor(task.priority)} ${
                              task.completed ? 'line-through opacity-60' : ''
                            }`}
                            title={task.title}
                          >
                            {task.title.length > 12 ? `${task.title.substring(0, 12)}...` : task.title}
                          </div>
                        ))}
                      {getTasksForDate(date).length > 2 && (
                        <div className="text-xs text-gray-500 font-medium">+{getTasksForDate(date).length - 2} más</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'week' && (
        <div className={`rounded-xl shadow-sm p-6 mb-6 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                const newDate = new Date(currentDate)
                newDate.setDate(newDate.getDate() - 7)
                setCurrentDate(newDate)
              }}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Semana del {currentDate.toLocaleDateString('es-ES')}
            </h2>

            <button
              onClick={() => {
                const newDate = new Date(currentDate)
                newDate.setDate(newDate.getDate() + 7)
                setCurrentDate(newDate)
              }}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          {renderWeekView()}
        </div>
      )}

      {view === 'day' && renderDayView()}

      {selectedDate && (
        <div className={`rounded-xl shadow-sm p-6 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              darkMode ? 'bg-green-900/30' : 'bg-green-50'
            }`}>
              <Clock className={`w-6 h-6 text-green-600`} />
            </div>
            <div>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedDate.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {getTasksForDate(selectedDate).length} eventos programados
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {getTasksForDate(selectedDate).length === 0 ? (
              <div className="text-center py-12">
                <Calendar className={`w-12 h-12 mx-auto mb-3 ${
                  darkMode ? 'text-gray-600' : 'text-gray-300'
                }`} />
                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  No hay eventos para este día
                </p>
                <button className="mt-4 text-green-600 hover:text-green-700 font-medium text-sm">
                  Agregar evento
                </button>
              </div>
            ) : (
              getTasksForDate(selectedDate).map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border-2 ${getPriorityColor(task.priority)} ${task.completed ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className={`font-semibold ${task.completed ? 'line-through' : ''}`}>{task.title}</h4>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        task.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {task.completed ? 'Completada' : 'Pendiente'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateEvent}
          selectedDate={selectedDate}
        />
      )}
    </div>
  )
}
