import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, MessageSquare, Pin, Edit, Trash2, Search as SearchIcon, Plus, FileText, X, Save, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../../ui/button'
import { Card } from '../../ui/card'
import { Input } from '../../ui/input'
import { Badge } from '../../ui/badge'
import { Textarea } from '../../ui/textarea'
import { Label } from '../../ui/label'

function getCurrentDate() {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
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
  ]
  const now = new Date()
  return `${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`
}

const initialNotes = [
  {
    id: 1,
    title: 'Apuntes de Cálculo - Derivadas',
    content:
      'Definición de derivada: límite del cociente incremental. Reglas básicas: potencia, producto, cociente, cadena...',
    subject: 'Matemáticas III',
    color: 'blue',
    pinned: true,
    lastEdited: '2025-10-24',
  },
  {
    id: 2,
    title: 'Resumen: Romanticismo Español',
    content:
      'Características principales del Romanticismo: libertad creativa, sentimientos, naturaleza, rebeldía...',
    subject: 'Literatura Española',
    color: 'purple',
    pinned: true,
    lastEdited: '2025-10-23',
  },
  {
    id: 3,
    title: 'Ideas para proyecto final',
    content:
      'Posibles temas: Sistema de gestión académica, App de salud mental para estudiantes, Plataforma de tutorías...',
    subject: 'Programación Web',
    color: 'green',
    pinned: false,
    lastEdited: '2025-10-22',
  },
  {
    id: 4,
    title: 'Fórmulas de Química Orgánica',
    content:
      'Grupos funcionales: alcoholes (-OH), aldehídos (-CHO), cetonas (C=O), ácidos carboxílicos (-COOH)...',
    subject: 'Química Orgánica',
    color: 'orange',
    pinned: false,
    lastEdited: '2025-10-21',
  },
  {
    id: 5,
    title: 'Cronología Segunda Guerra Mundial',
    content:
      '1939: Invasión de Polonia. 1941: Ataque a Pearl Harbor. 1944: Desembarco de Normandía...',
    subject: 'Historia Mundial',
    color: 'red',
    pinned: false,
    lastEdited: '2025-10-20',
  },
  {
    id: 6,
    title: 'Conceptos de Filosofía Moderna',
    content:
      'Kant: Imperativo categórico, fenómeno vs. noúmeno. Descartes: Cogito ergo sum, dualismo mente-cuerpo...',
    subject: 'Filosofía Moderna',
    color: 'yellow',
    pinned: false,
    lastEdited: '2025-10-19',
  },
]

const getColorClass = (color) => {
    const map = {
      blue: 'bg-blue-50 border-blue-200',
      purple: 'bg-purple-50 border-purple-200',
      green: 'bg-green-50 border-green-200',
      orange: 'bg-orange-50 border-orange-200',
      red: 'bg-red-50 border-red-200',
      yellow: 'bg-yellow-50 border-yellow-200',
      'bg-blue-50': 'bg-blue-50 border-blue-200', // Fallback for new notes
      'bg-purple-50': 'bg-purple-50 border-purple-200',
      'bg-green-50': 'bg-green-50 border-green-200',
      'bg-orange-50': 'bg-orange-50 border-orange-200',
      'bg-red-50': 'bg-red-50 border-red-200',
      'bg-yellow-50': 'bg-yellow-50 border-yellow-200',
    }
    return map[color] || 'bg-white border-gray-200'
}

function NoteDetailModal({ note, onClose, onSave, onDelete, onTogglePin }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(note.title)
  const [editedContent, setEditedContent] = useState(note.content)
  const [editedSubject, setEditedSubject] = useState(note.subject || '')

  const handleSave = () => {
    onSave(note.id, {
      title: editedTitle,
      content: editedContent,
      subject: editedSubject,
    })
    setIsEditing(false)
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${getColorClass(note.color).split(' ')[0]} rounded-lg flex items-center justify-center`}>
                <FileText size={24} className="text-gray-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Detalle de Nota</h2>
                <p className="text-sm text-gray-500">
                  Editado: {note.lastEdited.includes('-') ?
                    new Date(note.lastEdited).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
                    : note.lastEdited}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label>Título</Label>
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Materia</Label>
                <Input
                  value={editedSubject}
                  onChange={(e) => setEditedSubject(e.target.value)}
                  className="mt-1"
                  placeholder="Opcional"
                />
              </div>
              <div>
                <Label>Contenido</Label>
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="mt-1 min-h-[300px]"
                />
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save size={16} className="mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{note.title}</h3>
                {note.subject && (
                  <span className="inline-block text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-md">
                    {note.subject}
                  </span>
                )}
              </div>

              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{note.content}</p>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => onTogglePin(note.id)}
                  className={note.pinned ? 'text-green-600 border-green-600' : ''}
                >
                  <Pin size={16} className="mr-2" />
                  {note.pinned ? 'Desfijar' : 'Fijar'}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit size={16} className="mr-2" />
                  Editar
                </Button>
                <Button variant="outline" onClick={() => onDelete(note.id)} className="text-red-600 hover:bg-red-50 hover:text-red-700">
                  <Trash2 size={16} className="mr-2" />
                  Eliminar
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function CreateNoteModal({ onClose, onCreate }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [subject, setSubject] = useState('')

  const handleCreate = () => {
    if (title.trim() && content.trim()) {
      onCreate({
        title,
        content,
        subject,
      })
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Plus size={24} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Nueva Nota</h2>
                <p className="text-sm text-gray-500">Crea una nueva nota para tus estudios</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Título *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título de la nota"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Materia</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Opcional"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Contenido *</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escribe el contenido de tu nota aquí..."
                className="mt-1 min-h-[300px]"
              />
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!title.trim() || !content.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save size={16} className="mr-2" />
                Crear Nota
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NoteCard({ note, index, onClick }) {
  const colorClass = useMemo(() => getColorClass(note.color), [note.color])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
      <Card
        className={`p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border ${colorClass} cursor-pointer`}
        onClick={onClick}
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-gray-900 text-base flex-1">{note.title}</h3>
          {note.pinned && (
            <motion.div initial={{ rotate: 0 }} animate={{ rotate: 45 }} transition={{ duration: 0.3 }}>
              <Pin size={16} className="text-green-600 flex-shrink-0" />
            </motion.div>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{note.content}</p>
        <div className="flex justify-between items-center">
          {note.subject ? (
            <Badge variant="outline" className="bg-white">
              {note.subject}
            </Badge>
          ) : (<div></div>)}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Editado:{' '}
          {note.lastEdited.includes('-') ?
            new Date(note.lastEdited).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
            : note.lastEdited}
        </p>
      </Card>
    </motion.div>
  )
}

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [notes, setNotes] = useState(initialNotes)
  const [selectedNote, setSelectedNote] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleSaveNote = (noteId, updates) => {
    setNotes(notes.map((n) => (n.id === noteId ? { ...n, ...updates, lastEdited: 'Hoy' } : n)))
    setSelectedNote(null)
  }

  const handleDeleteNote = (noteId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
      setNotes(notes.filter((n) => n.id !== noteId))
      setSelectedNote(null)
    }
  }

  const handleTogglePin = (noteId) => {
    setNotes(notes.map((n) => (n.id === noteId ? { ...n, pinned: !n.pinned } : n)))
    // Update selected note if open
    if (selectedNote && selectedNote.id === noteId) {
      setSelectedNote(prev => ({ ...prev, pinned: !prev.pinned }))
    }
  }

  const handleCreateNote = (newNote) => {
    const note = {
      id: Date.now(),
      ...newNote,
      color: 'blue', // Default color
      pinned: false,
      lastEdited: 'Hoy',
    }
    setNotes([...notes, note])
  }

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
            (n.subject && n.subject.toLowerCase().includes(q))
          )
        }),
    [notes, searchQuery]
  )

  const filteredPinnedNotes = pinnedNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.subject && note.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <header className="sticky top-0 bg-white rounded-xl shadow-sm p-6 mb-6 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📝 Mis Notas</h1>
              <p className="text-gray-600 mt-1">{getCurrentDate()}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowCreateModal(true)}>
                <Plus size={16} className="mr-2" />
                Nueva Nota
              </Button>
            </div>
          </div>
        </header>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar notas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>

        {/* Pinned Notes */}
        {filteredPinnedNotes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Pin size={18} className="mr-2 text-green-600" />
              Notas Fijadas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPinnedNotes.map((note, index) => (
                <NoteCard key={note.id} note={note} index={index} onClick={() => setSelectedNote(note)} />
              ))}
            </div>
          </div>
        )}

        {/* Regular Notes */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Todas las Notas</h2>
          <AnimatePresence>
            {regularNotes.length === 0 && filteredPinnedNotes.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-500">No se encontraron notas</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {regularNotes.map((note, index) => (
                  <NoteCard key={note.id} note={note} index={index} onClick={() => setSelectedNote(note)} />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {selectedNote && (
        <NoteDetailModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onSave={handleSaveNote}
          onDelete={handleDeleteNote}
          onTogglePin={handleTogglePin}
        />
      )}

      {showCreateModal && <CreateNoteModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateNote} />}
    </div>
  )
}
