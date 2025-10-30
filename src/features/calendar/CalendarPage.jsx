// CalendarPage - Monthly calendar view with tasks
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus } from 'lucide-react';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Mock tasks data - TODO: Replace with API call
  useEffect(() => {
    const mockTasks = [
      {
        id: 1,
        title: 'Reunión de equipo',
        date: new Date(2024, 9, 15), // October 15
        completed: false,
        priority: 'high'
      },
      {
        id: 2,
        title: 'Revisar código',
        date: new Date(2024, 9, 18), // October 18
        completed: true,
        priority: 'medium'
      },
      {
        id: 3,
        title: 'Entrega del proyecto',
        date: new Date(2024, 9, 25), // October 25
        completed: false,
        priority: 'high'
      }
    ];
    setTasks(mockTasks);
  }, [currentDate]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task =>
      task.date.toDateString() === date.toDateString()
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Calendario</h1>
              <p className="text-green-100">Vista mensual de tus tareas</p>
            </div>
          </div>
          <button
            onClick={() => setShowTaskForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nueva Tarea
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Calendar Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>

            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="p-3 text-center font-semibold text-gray-600 bg-gray-50 rounded">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentDate).map((date, index) => (
              <div
                key={index}
                className={`min-h-32 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer ${
                  date && date.toDateString() === selectedDate.toDateString()
                    ? 'ring-2 ring-green-500 bg-green-50'
                    : ''
                }`}
                onClick={() => date && setSelectedDate(date)}
              >
                {date && (
                  <>
                    <div className="text-sm font-medium text-gray-900 mb-2">
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {getTasksForDate(date).slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          className={`text-xs p-1 rounded border ${getPriorityColor(task.priority)} ${
                            task.completed ? 'line-through opacity-60' : ''
                          }`}
                          title={task.title}
                        >
                          {task.title.length > 15 ? `${task.title.substring(0, 15)}...` : task.title}
                        </div>
                      ))}
                      {getTasksForDate(date).length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{getTasksForDate(date).length - 3} más
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Date Details */}
        {selectedDate && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Tareas para {selectedDate.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h3>

            <div className="space-y-3">
              {getTasksForDate(selectedDate).length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No hay tareas programadas para este día
                </p>
              ) : (
                getTasksForDate(selectedDate).map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border ${getPriorityColor(task.priority)} ${
                      task.completed ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${task.completed ? 'line-through' : ''}`}>
                        {task.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.completed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {task.completed ? 'Completada' : 'Pendiente'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;