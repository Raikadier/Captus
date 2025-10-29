"use client"

import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Bell, MessageSquare, Pin, Edit, Trash2, SearchIcon, Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../../ui/button"
import { Card } from "../../ui/card"
import { Input } from "../../ui/input"
import { Badge } from "../../ui/badge"

function getCurrentDate() {
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

const initialNotes = [
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
    content: "Kant: Imperativo categórico, fenómeno vs. noúmeno. Descartes: Cogito ergo sum, dualismo mente-cuerpo...",
    subject: "Filosofía Moderna",
    color: "yellow",
    pinned: false,
    lastEdited: "2025-10-19",
  },
]

function NoteCard({ note, index }) {
  const colorClass = useMemo(() => {
    const map = {
      blue: "bg-blue-50 border-blue-200 hover:border-blue-300",
      purple: "bg-purple-50 border-purple-200 hover:border-purple-300",
      green: "bg-green-50 border-green-200 hover:border-green-300",
      orange: "bg-orange-50 border-orange-200 hover:border-orange-300",
      red: "bg-red-50 border-red-200 hover:border-red-300",
      yellow: "bg-yellow-50 border-yellow-200 hover:border-yellow-300",
    }
    return map[note.color] || "bg-white border-gray-200 hover:border-gray-300"
  }, [note.color])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className={`p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-2 ${colorClass}`}>
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-gray-900 text-base flex-1 leading-relaxed">{note.title}</h3>
          {note.pinned && (
            <motion.div initial={{ rotate: 0 }} animate={{ rotate: 45 }} transition={{ duration: 0.3 }}>
              <Pin size={16} className="text-green-600 flex-shrink-0" fill="currentColor" />
            </motion.div>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{note.content}</p>
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="bg-white border-gray-300">
            {note.subject}
          </Badge>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/50" title="Editar">
              <Edit size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Eliminar"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Editado:{" "}
          {new Date(note.lastEdited).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
          })}
        </p>
      </Card>
    </motion.div>
  )
}

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [notes] = useState(initialNotes)

  const pinnedNotes = useMemo(() => notes.filter((n) => n.pinned), [notes])
  const regularNotes = useMemo(
    () =>
      notes
        .filter((n) => !n.pinned)
        .filter((n) => {
          if (!searchQuery.trim()) return true
          const q = searchQuery.toLowerCase()
          return (
            n.title.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q) ||
            n.subject.toLowerCase().includes(q)
          )
        }),
    [notes, searchQuery],
  )

  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <header className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mis Notas</h1>
              <p className="text-gray-600 mt-1">Organiza tus apuntes y conocimientos</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button className="bg-green-600 hover:bg-green-700 shadow-sm hover:shadow-md transition-all duration-200">
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
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar notas por título, contenido o materia..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 bg-white rounded-xl shadow-sm border-gray-200 focus:border-green-500 focus:ring-green-500"
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
              {pinnedNotes.map((note, index) => (
                <NoteCard key={note.id} note={note} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Regular Notes */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Todas las Notas</h2>
          <AnimatePresence>
            {regularNotes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white rounded-xl"
              >
                <p className="text-gray-500">No se encontraron notas</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {regularNotes.map((note, index) => (
                  <NoteCard key={note.id} note={note} index={index} />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating AI Chat Button */}
      <Link to="/chatbot" title="Hablar con Captus">
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-200"
          size="icon"
        >
          <MessageSquare size={24} />
        </Button>
      </Link>
    </div>
  )
}
