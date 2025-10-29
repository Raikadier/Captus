"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Calendar, Plus, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [tasks, setTasks] = useState([])
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [view, setView] = useState("month") // month, week, day

  useEffect(() => {
    const mockTasks = [
      {
        id: 1,
        title: "Reunión de equipo",
        date: new Date(2024, 9, 15),
        completed: false,
        priority: "high",
      },
      {
        id: 2,
        title: "Revisar código",
        date: new Date(2024, 9, 18),
        completed: true,
        priority: "medium",
      },
      {
        id: 3,
        title: "Entrega del proyecto",
        date: new Date(2024, 9, 25),
        completed: false,
        priority: "high",
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
      case "high":
        return "bg-red-100 text-red-800 border-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  return (
    <div className="min-h-screen bg-[#F6F7FB] p-8">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calendario</h1>
            <p className="text-gray-600 mt-1">Organiza tus eventos y tareas</p>
          </div>
          <button
            onClick={() => setShowTaskForm(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Evento
          </button>
        </div>

        {/* View tabs */}
        <div className="flex space-x-2">
          {["month", "week", "day"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                view === v ? "bg-green-50 text-green-600" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {v === "month" ? "Mes" : v === "week" ? "Semana" : "Día"}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-bold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>

          <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="p-3 text-center font-semibold text-gray-600 bg-gray-50 rounded-lg">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          <AnimatePresence mode="wait">
            {getDaysInMonth(currentDate).map((date, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.01 }}
                className={`min-h-32 p-3 border-2 rounded-xl hover:shadow-md cursor-pointer transition-all duration-200 ${
                  date && date.toDateString() === selectedDate.toDateString()
                    ? "ring-2 ring-green-500 bg-green-50 border-green-200"
                    : date
                      ? "border-gray-200 hover:border-green-200"
                      : "border-transparent"
                }`}
                onClick={() => date && setSelectedDate(date)}
              >
                {date && (
                  <>
                    <div
                      className={`text-sm font-semibold mb-2 ${
                        date.toDateString() === new Date().toDateString()
                          ? "w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center"
                          : "text-gray-900"
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
                              task.completed ? "line-through opacity-60" : ""
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
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {selectedDate.toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </h3>
              <p className="text-sm text-gray-500">{getTasksForDate(selectedDate).length} eventos programados</p>
            </div>
          </div>

          <div className="space-y-3">
            {getTasksForDate(selectedDate).length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No hay eventos para este día</p>
                <button className="mt-4 text-green-600 hover:text-green-700 font-medium text-sm">Agregar evento</button>
              </div>
            ) : (
              getTasksForDate(selectedDate).map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-xl border-2 ${getPriorityColor(task.priority)} ${
                    task.completed ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className={`font-semibold ${task.completed ? "line-through" : ""}`}>{task.title}</h4>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        task.completed ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {task.completed ? "Completada" : "Pendiente"}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default CalendarPage
