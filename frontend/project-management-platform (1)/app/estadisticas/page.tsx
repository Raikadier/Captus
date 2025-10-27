"use client"

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
  TrendingUp,
  Target,
  Award,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function EstadisticasPage() {
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

  const subjects = [
    { name: "Matemáticas III", grade: 8.5, progress: 85, tasks: 12, color: "blue" },
    { name: "Literatura Española", grade: 9.0, progress: 90, tasks: 8, color: "purple" },
    { name: "Historia Mundial", grade: 7.8, progress: 78, tasks: 10, color: "red" },
    { name: "Química Orgánica", grade: 8.2, progress: 82, tasks: 15, color: "orange" },
    { name: "Programación Web", grade: 9.2, progress: 92, tasks: 6, color: "green" },
    { name: "Filosofía Moderna", grade: 8.0, progress: 80, tasks: 9, color: "yellow" },
  ]

  const stats = {
    averageGrade: 8.45,
    completedTasks: 48,
    totalTasks: 60,
    studyHours: 156,
    streak: 12,
  }

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
            <NavItem icon={<Calendar size={18} />} label="Calendario" href="/calendario" />
            <NavItem icon={<StickyNote size={18} />} label="Notas" href="/notas" />
            <NavItem icon={<BarChart3 size={18} />} label="Estadísticas" active />
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
              <h1 className="text-2xl font-bold text-gray-900">📊 Mis Estadísticas</h1>
              <p className="text-gray-600 mt-1">{getCurrentDate()}</p>
            </div>
            <Button variant="outline" className="border-gray-300 relative bg-transparent">
              <Bell size={18} className="text-gray-500" />
            </Button>
          </div>
        </header>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            icon={<TrendingUp className="text-green-600" size={28} />}
            label="Promedio General"
            value={stats.averageGrade.toFixed(2)}
            bgColor="bg-green-50"
          />
          <StatCard
            icon={<CheckSquare className="text-blue-600" size={28} />}
            label="Tareas Completadas"
            value={`${stats.completedTasks}/${stats.totalTasks}`}
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<Target className="text-orange-600" size={28} />}
            label="Horas de Estudio"
            value={`${stats.studyHours}h`}
            bgColor="bg-orange-50"
          />
          <StatCard
            icon={<Award className="text-purple-600" size={28} />}
            label="Racha Actual"
            value={`${stats.streak} días`}
            bgColor="bg-purple-50"
          />
        </div>

        {/* Progress by Subject */}
        <Card className="p-6 bg-white rounded-xl shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Progreso por Materia</h2>
          <div className="space-y-6">
            {subjects.map((subject) => (
              <SubjectProgress key={subject.name} subject={subject} />
            ))}
          </div>
        </Card>

        {/* Task Completion Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Completación de Tareas</h2>
            <div className="flex items-center justify-center h-64">
              <div className="relative w-48 h-48">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle cx="96" cy="96" r="88" stroke="#E5E7EB" strokeWidth="16" fill="none" className="opacity-30" />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="#10b981"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${(stats.completedTasks / stats.totalTasks) * 553} 553`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-4xl font-bold text-gray-900">
                    {Math.round((stats.completedTasks / stats.totalTasks) * 100)}%
                  </span>
                  <span className="text-sm text-gray-500">Completado</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Rendimiento Mensual</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Septiembre</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">7.5</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Octubre</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">8.5</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Noviembre</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "90%" }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">9.0</span>
                </div>
              </div>
            </div>
          </Card>
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

function SubjectProgress({ subject }: { subject: any }) {
  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: "bg-blue-600",
      purple: "bg-purple-600",
      green: "bg-green-600",
      orange: "bg-orange-600",
      red: "bg-red-600",
      yellow: "bg-yellow-600",
    }
    return colors[color] || "bg-gray-600"
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="font-medium text-gray-900">{subject.name}</h3>
          <p className="text-sm text-gray-500">{subject.tasks} tareas</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">{subject.grade}</p>
          <p className="text-sm text-gray-500">Promedio</p>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all ${getColorClass(subject.color)}`}
          style={{ width: `${subject.progress}%` }}
        ></div>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  bgColor,
}: { icon: React.ReactNode; label: string; value: string; bgColor: string }) {
  return (
    <Card className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div className={`${bgColor} p-4 rounded-xl`}>{icon}</div>
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600 mt-1">{label}</p>
        </div>
      </div>
    </Card>
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
