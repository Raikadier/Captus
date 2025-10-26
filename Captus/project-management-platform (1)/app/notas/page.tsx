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
  Search,
  Edit,
  Trash2,
  Pin,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function NotasPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const notes = [
    {
      id: 1,
      title: "Apuntes de Cálculo - Derivadas",
      content:
        "Definición de derivada: límite del cociente incremental. Reglas básicas: potencia, producto, cociente, cadena...",
      subject: "Matemáticas III",
      color: "blue",
      pinned: true,
      lastEdited: "2025-10-24",
    },
    {
      id: 2,
      title: "Resumen: Romanticismo Español",
      content: "Características principales del Romanticismo: libertad creativa, sentimientos, naturaleza, rebeldía...",
      subject: "Literatura Española",
      color: "purple",
      pinned: true,
      lastEdited: "2025-10-23",
    },
    {
      id: 3,
      title: "Ideas para proyecto final",
      content:
        "Posibles temas: Sistema de gestión académica, App de salud mental para estudiantes, Plataforma de tutorías...",
      subject: "Programación Web",
      color: "green",
      pinned: false,
      lastEdited: "2025-10-22",
    },
    {
      id: 4,
      title: "Fórmulas de Química Orgánica",
      content: "Grupos funcionales: alcoholes (-OH), aldehídos (-CHO), cetonas (C=O), ácidos carboxílicos (-COOH)...",
      subject: "Química Orgánica",
      color: "orange",
      pinned: false,
      lastEdited: "2025-10-21",
    },
    {
      id: 5,
      title: "Cronología Segunda Guerra Mundial",
      content: "1939: Invasión de Polonia. 1941: Ataque a Pearl Harbor. 1944: Desembarco de Normandía...",
      subject: "Historia Mundial",
      color: "red",
      pinned: false,
      lastEdited: "2025-10-20",
    },
    {
      id: 6,
      title: "Conceptos de Filosofía Moderna",
      content:
        "Kant: Imperativo categórico, fenómeno vs. noúmeno. Descartes: Cogito ergo sum, dualismo mente-cuerpo...",
      subject: "Filosofía Moderna",
      color: "yellow",
      pinned: false,
      lastEdited: "2025-10-19",
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

  const pinnedNotes = notes.filter((note) => note.pinned)
  const regularNotes = notes.filter((note) => !note.pinned)

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
            <NavItem icon={<StickyNote size={18} />} label="Notas" active />
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
              <h1 className="text-2xl font-bold text-gray-900">📝 Mis Notas</h1>
              <p className="text-gray-600 mt-1">{getCurrentDate()}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus size={18} className="mr-2" />
                Nueva Nota
              </Button>
              <Button variant="outline" className="border-gray-300 relative bg-transparent">
                <Bell size={18} className="text-gray-500" />
              </Button>
            </div>
          </div>
        </header>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar notas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>

        {/* Pinned Notes */}
        {pinnedNotes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Pin size={18} className="mr-2 text-green-600" />
              Notas Fijadas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pinnedNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          </div>
        )}

        {/* Regular Notes */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Todas las Notas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
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

function NoteCard({ note }: { note: any }) {
  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: "bg-blue-50 border-blue-200",
      purple: "bg-purple-50 border-purple-200",
      green: "bg-green-50 border-green-200",
      orange: "bg-orange-50 border-orange-200",
      red: "bg-red-50 border-red-200",
      yellow: "bg-yellow-50 border-yellow-200",
    }
    return colors[color] || "bg-white border-gray-200"
  }

  return (
    <Card className={`p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border ${getColorClass(note.color)}`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 text-base flex-1">{note.title}</h3>
        {note.pinned && <Pin size={16} className="text-green-600 flex-shrink-0" />}
      </div>
      <p className="text-gray-600 text-sm mb-3 line-clamp-3">{note.content}</p>
      <div className="flex justify-between items-center">
        <Badge variant="outline" className="bg-white">
          {note.subject}
        </Badge>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit size={14} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700">
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Editado:{" "}
        {new Date(note.lastEdited).toLocaleDateString("es-ES", {
          day: "numeric",
          month: "short",
        })}
      </p>
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
