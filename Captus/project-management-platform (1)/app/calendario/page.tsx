"use client"

import { useState } from "react"
import type React from "react"
import {
  BookOpen,
  Calendar,
  CheckSquare,
  Home,
  MessageSquare,
  Settings,
  BarChart3,
  StickyNote,
  Bell,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function CalendarioPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const events = [
    {
      id: 1,
      title: "Examen de Cálculo III",
      date: "2025-10-28",
      time: "10:00 AM",
      type: "Examen",
      subject: "Matemáticas III",
      duration: "2 horas",
    },
    {
      id: 2,
      title: "Entrega ensayo de Literatura",
      date: "2025-10-26",
      time: "11:59 PM",
      type: "Entrega",
      subject: "Literatura Española",
      duration: "Todo el día",
    },
    {
      id: 3,
      title: "Presentación de Historia",
      date: "2025-10-30",
      time: "2:00 PM",
      type: "Presentación",
      subject: "Historia Mundial",
      duration: "1 hora",
    },
    {
      id: 4,
      title: "Reunión con tutor académico",
      date: "2025-10-25",
      time: "4:00 PM",
      type: "Reunión",
      subject: "Tutoría",
      duration: "30 minutos",
    },
    {
      id: 5,
      title: "Laboratorio de Química",
      date: "2025-11-02",
      time: "9:00 AM",
      type: "Laboratorio",
      subject: "Química Orgánica",
      duration: "3 horas",
    },
  ]

  const getCurrentDate = () => {
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    const months = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ]
    const now = new Date()
    return `${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`
  }

  const monthName = currentMonth.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-60 bg-white border-r border-gray-200 z-10">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <BookOpen className="text-green-600 mr-2" size={24} />
          <h1 className="text-xl font-semibold text-green-600">Captus</h1>
        </div>
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-6 p-3 bg-green-50 rounded-xl">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-green-600 flex items-center justify-center">
              <span className="text-white font-semibold">MG</span>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <p className="font-medium text-gray-900">María García</p>
              <p className="text-xs text-gray-500">Estudiante</p>
            </div>
          </div>

          <nav className="space-y-1">
            <NavItem icon={<Home size={18} />} label="Inicio" href="/" />
            <NavItem icon={<CheckSquare size={18} />} label="Tareas" href="/tareas" />
            <NavItem icon={<Calendar size={18} />} label="Calendario" active />
            <NavItem icon={<StickyNote size={18} />} label="Notas" href="/notas" />
            <NavItem icon={<BarChart3 size={18} />} label="Estadísticas" href="/estadisticas" />
            <NavItem icon={<MessageSquare size={18} />} label="Chat IA" href="/chat" />
            <NavItem icon={<Settings size={18} />} label="Configuración" href="/configuracion" />
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-60 p-8">
        {/* Header */}
        <header className="sticky top-0 bg-white rounded-xl shadow-sm p-6 mb-6 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📅 Mi Calendario</h1>
              <p className="text-gray-600 mt-1">{getCurrentDate()}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus size={18} className="mr-2" />
                Nuevo Evento
              </Button>
              <Button variant="outline" className="border-gray-300 relative bg-transparent">
                <Bell size={18} className="text-gray-500" />
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 capitalize">{monthName}</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                  >
                    <ChevronLeft size={18} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                  >
                    <ChevronRight size={18} />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-4">
                {["L", "M", "X", "J", "V", "S", "D"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }, (_, i) => {
                  const dayNum = i - 3
                  const isCurrentDay = dayNum === 24
                  const hasEvent = [25, 26, 28, 30].includes(dayNum)
                  return (
                    <div
                      key={i}
                      className={`aspect-square flex items-center justify-center text-sm rounded-xl cursor-pointer transition-colors ${
                        dayNum < 1 || dayNum > 31
                          ? "text-gray-300"
                          : isCurrentDay
                            ? "bg-green-600 text-white font-bold"
                            : hasEvent
                              ? "bg-green-50 text-green-700 font-medium hover:bg-green-100"
                              : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {dayNum > 0 && dayNum <= 31 ? dayNum : ""}
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Upcoming Events */}
          <div>
            <Card className="p-6 bg-white rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Próximos Eventos</h2>
              <div className="space-y-4">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating AI Chat Button */}
      <Link href="/chat">
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all"
          size="icon"
          title="Hablar con Captus"
        >
          <MessageSquare size={24} />
        </Button>
      </Link>
    </div>
  )
}

function EventCard({ event }: { event: any }) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Examen":
        return "bg-red-100 text-red-800"
      case "Entrega":
        return "bg-orange-100 text-orange-800"
      case "Presentación":
        return "bg-purple-100 text-purple-800"
      case "Reunión":
        return "bg-blue-100 text-blue-800"
      case "Laboratorio":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
          <Clock size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 text-sm mb-1">{event.title}</h3>
          <p className="text-xs text-gray-500 mb-2">
            {event.time} • {event.duration}
          </p>
          <div className="flex items-center gap-2">
            <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
            <span className="text-xs text-gray-600">{event.subject}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function NavItem({
  icon,
  label,
  active = false,
  href = "#",
}: { icon: React.ReactNode; label: string; active?: boolean; href?: string }) {
  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-colors ${
        active ? "bg-green-50 text-green-600 border-l-4 border-green-600" : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <span className={active ? "text-green-600" : "text-gray-500"}>{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </Link>
  )
}
