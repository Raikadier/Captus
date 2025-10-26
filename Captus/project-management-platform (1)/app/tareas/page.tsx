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
  Filter,
  Search,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TareasPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const tasks = [
    {
      id: 1,
      title: "Entregar ensayo de Literatura",
      description: "Escribir un ensayo de 2000 palabras sobre el Romanticismo español",
      dueDate: "2025-10-26",
      priority: "Alta",
      status: "Pendiente",
      subject: "Literatura Española",
      progress: 60,
    },
    {
      id: 2,
      title: "Estudiar para examen de Cálculo",
      description: "Repasar capítulos 5-8: Derivadas e integrales",
      dueDate: "2025-10-28",
      priority: "Alta",
      status: "En progreso",
      subject: "Matemáticas III",
      progress: 75,
    },
    {
      id: 3,
      title: "Presentación grupal de Historia",
      description: "Preparar slides sobre la Segunda Guerra Mundial",
      dueDate: "2025-10-30",
      priority: "Media",
      status: "Pendiente",
      subject: "Historia Mundial",
      progress: 30,
    },
    {
      id: 4,
      title: "Laboratorio de Química",
      description: "Completar informe del experimento de titulación",
      dueDate: "2025-11-02",
      priority: "Media",
      status: "Pendiente",
      subject: "Química Orgánica",
      progress: 0,
    },
    {
      id: 5,
      title: "Proyecto final de Programación",
      description: "Desarrollar aplicación web con React y Node.js",
      dueDate: "2025-11-15",
      priority: "Alta",
      status: "En progreso",
      subject: "Programación Web",
      progress: 45,
    },
    {
      id: 6,
      title: "Lectura de Filosofía",
      description: "Leer capítulos 3-5 de 'Crítica de la Razón Pura'",
      dueDate: "2025-10-25",
      priority: "Baja",
      status: "Completada",
      subject: "Filosofía Moderna",
      progress: 100,
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

  const filterTasksByStatus = (status: string) => {
    if (status === "todas") return tasks
    return tasks.filter((task) => task.status.toLowerCase() === status.toLowerCase())
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
            <NavItem icon={<CheckSquare size={18} />} label="Tareas" active />
            <NavItem icon={<Calendar size={18} />} label="Calendario" href="/calendario" />
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
              <h1 className="text-2xl font-bold text-gray-900">📝 Mis Tareas</h1>
              <p className="text-gray-600 mt-1">{getCurrentDate()}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus size={18} className="mr-2" />
                Nueva Tarea
              </Button>
              <Button variant="outline" className="border-gray-300 relative bg-transparent">
                <Bell size={18} className="text-gray-500" />
              </Button>
            </div>
          </div>
        </header>

        {/* Search and Filter */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar tareas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
          <Button variant="outline" className="border-gray-300 bg-transparent">
            <Filter size={18} className="mr-2" />
            Filtrar
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="todas" className="w-full">
          <TabsList className="bg-white mb-6">
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="pendiente">Pendientes</TabsTrigger>
            <TabsTrigger value="en progreso">En Progreso</TabsTrigger>
            <TabsTrigger value="completada">Completadas</TabsTrigger>
          </TabsList>

          <TabsContent value="todas" className="space-y-4">
            {tasks.map((task) => (
              <TaskDetailCard key={task.id} task={task} />
            ))}
          </TabsContent>

          <TabsContent value="pendiente" className="space-y-4">
            {filterTasksByStatus("pendiente").map((task) => (
              <TaskDetailCard key={task.id} task={task} />
            ))}
          </TabsContent>

          <TabsContent value="en progreso" className="space-y-4">
            {filterTasksByStatus("en progreso").map((task) => (
              <TaskDetailCard key={task.id} task={task} />
            ))}
          </TabsContent>

          <TabsContent value="completada" className="space-y-4">
            {filterTasksByStatus("completada").map((task) => (
              <TaskDetailCard key={task.id} task={task} />
            ))}
          </TabsContent>
        </Tabs>
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

function TaskDetailCard({ task }: { task: any }) {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "alta":
        return "bg-red-100 text-red-800"
      case "media":
        return "bg-yellow-100 text-yellow-800"
      case "baja":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pendiente":
        return "bg-gray-100 text-gray-800"
      case "en progreso":
        return "bg-green-50 text-green-700"
      case "completada":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
            <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
            <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
          </div>
          <p className="text-gray-600 text-sm mb-3">{task.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar size={14} className="mr-1.5 text-green-600" />
              {new Date(task.dueDate).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
            <div className="flex items-center">
              <BookOpen size={14} className="mr-1.5 text-green-600" />
              {task.subject}
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Progreso</span>
          <span className="text-gray-900 font-medium">{task.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: `${task.progress}%` }}></div>
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
