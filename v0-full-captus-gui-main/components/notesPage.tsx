'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Pin, Edit, Trash2, SearchIcon, Plus, FileText, X, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

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

function NoteDetailModal({ note, onClose, onSave, onDelete, onTogglePin }: any) {
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
              <div className={`w-12 h-12 ${note.color} rounded-lg flex items-center justify-center`}>
                <FileText size={24} className="text-gray-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Detalle de Nota</h2>
                <p className="text-sm text-gray-500">Editado: {note.lastEdited}</p>
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
                <Button variant="outline" onClick={() => onDelete(note.id)} className="text-red-600 hover:bg-red-50">
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

function CreateNoteModal({ onClose, onCreate }: any) {
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

function NoteCard({
  note,
  showSubject = true,
  onClick,
}: {
  note: any //typeof pinnedNotes[0]
  showSubject?: boolean
  onClick: () => void
}) {
  return (
    <Card
      className={`p-4 rounded-xl border-0 shadow-sm hover:shadow-md transition-all cursor-pointer ${note.color}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 text-[15px] flex-1 leading-snug">{note.title}</h3>
        {note.pinned && <Pin size={16} className="text-green-600 flex-shrink-0 ml-2" />}
      </div>
      <p className="text-gray-600 text-[13px] mb-3 line-clamp-2 leading-relaxed">{note.content}</p>

      <div className="flex justify-between items-center">
        {showSubject && note.subject && (
          <div className="text-xs font-medium text-gray-900 bg-white px-2.5 py-1 rounded-md border border-gray-200">
            {note.subject}
          </div>
        )}
        {(!showSubject || !note.subject) && <div />}
        <p className="text-[11px] text-gray-500">Editado: {note.lastEdited}</p>
      </div>
    </Card>
  )
}

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNote, setSelectedNote] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Apuntes de Cálculo - Derivadas',
      content:
        'Definición de derivada: límite del cociente incremental. Reglas básicas: potencia, producto, cociente, cadena...',
      subject: 'Matemáticas III',
      color: 'bg-blue-50',
      pinned: true,
      lastEdited: '23 oct',
    },
    {
      id: 2,
      title: 'Resumen: Romanticismo Español',
      content:
        'Características principales del Romanticismo: libertad creativa, sentimientos, naturaleza, rebeldía...',
      subject: 'Literatura Española',
      color: 'bg-pink-50',
      pinned: true,
      lastEdited: '22 oct',
    },
    {
      id: 3,
      title: 'Ideas para proyecto final',
      content:
        'Posibles temas: Sistema de gestión académica, App de salud mental para estudiantes, Plataforma de tutorías...',
      color: 'bg-green-50',
      pinned: false,
      lastEdited: '20 oct',
    },
    {
      id: 4,
      title: 'Fórmulas de Química Orgánica',
      content: 'Grupos funcionales: alcoholes (-OH), aldehídos (-CHO), cetonas (C=O), ácidos carboxílicos (-COOH)...',
      color: 'bg-orange-50',
      pinned: false,
      lastEdited: '19 oct',
    },
    {
      id: 5,
      title: 'Cronología Segunda Guerra Mundial',
      content: '1939: Invasión de Polonia. 1941: Ataque a Pearl Harbor. 1944: Desembarco de Normandía...',
      color: 'bg-pink-50',
      pinned: false,
      lastEdited: '18 oct',
    },
  ])

  const handleSaveNote = (noteId: number, updates: any) => {
    setNotes(notes.map((n) => (n.id === noteId ? { ...n, ...updates, lastEdited: 'Hoy' } : n)))
    setSelectedNote(null)
  }

  const handleDeleteNote = (noteId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
      setNotes(notes.filter((n) => n.id !== noteId))
      setSelectedNote(null)
    }
  }

  const handleTogglePin = (noteId: number) => {
    setNotes(notes.map((n) => (n.id === noteId ? { ...n, pinned: !n.pinned } : n)))
    setSelectedNote(notes.find((n) => n.id === noteId && { ...n, pinned: !n.pinned }))
  }

  const handleCreateNote = (newNote: any) => {
    const note = {
      id: Date.now(),
      ...newNote,
      color: 'bg-blue-50',
      pinned: false,
      lastEdited: 'Hoy',
    }
    setNotes([...notes, note])
  }

  const pinnedNotesList = notes.filter((n) => n.pinned)
  const regularNotesList = notes.filter((n) => !n.pinned)

  const filteredPinnedNotes = pinnedNotesList.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.subject && note.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const filteredRegularNotes = regularNotesList.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.subject && note.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileText size={24} className="text-gray-400" />
                <h1 className="text-2xl font-bold text-gray-900">Mis Notas</h1>
              </div>
              <p className="text-gray-500 text-sm">{getCurrentDate()}</p>
            </div>
            <Button onClick={() => setShowCreateModal(true)} className="bg-green-600 hover:bg-green-700 text-white">
              <Plus size={16} className="mr-2" />
              Nueva Nota
            </Button>
          </div>
        </header>

        <div className="mb-6 mt-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar notas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-300 focus:border-green-600 focus:ring-green-600"
            />
          </div>
        </div>

        {filteredPinnedNotes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
              <Pin size={18} className="mr-2 text-green-600" />
              Notas Fijadas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPinnedNotes.map((note) => (
                <NoteCard key={note.id} note={note} onClick={() => setSelectedNote(note)} />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-4">Todas las Notas</h2>
          {filteredRegularNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRegularNotes.map((note) => (
                <NoteCard key={note.id} note={note} showSubject={false} onClick={() => setSelectedNote(note)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No se encontraron notas que coincidan con tu búsqueda
            </div>
          )}
        </div>
      </div>

      <Link href="/chatbot">
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
          size="icon"
        >
          <Sparkles size={24} />
        </Button>
      </Link>

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
