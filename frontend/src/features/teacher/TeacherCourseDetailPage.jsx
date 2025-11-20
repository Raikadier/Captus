import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Users, ClipboardList, PlusCircle, Megaphone, ArrowLeft, FileText, BookOpen, X } from 'lucide-react'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../ui/breadcrumb'
import { Badge } from '../../ui/badge'

const mockCourse = {
  id: 1,
  name: "Programación I",
  students: [
    { id: 1, name: "María Gómez" },
    { id: 2, name: "Juan Pérez" },
    { id: 3, name: "Ana López" },
    { id: 4, name: "Carlos Ruiz" },
  ],
  tasks: [
    { id: 1, title: "Ensayo cap. 2", dueDate: "2025-11-22" },
    { id: 2, title: "Proyecto parcial", dueDate: "2025-11-28" },
    { id: 3, title: "Trabajo práctico 1", dueDate: "2025-12-05" },
  ],
}

const mockAnnouncements = [
  {
    id: 1,
    title: "Recordatorio: Entrega del Proyecto Final",
    content: "Recuerden que la entrega del proyecto final es el próximo viernes. No se aceptarán entregas tardías.",
    type: "important",
    date: "2025-11-18",
  },
  {
    id: 2,
    title: "Clase de Repaso",
    content: "Habrá una clase de repaso el jueves a las 3 PM en el aula 205.",
    type: "general",
    date: "2025-11-17",
  },
]

export default function TeacherCourseDetailPage({ courseId }) {
  const router = useNavigate()
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  const [announcementTitle, setAnnouncementTitle] = useState('')
  const [announcementContent, setAnnouncementContent] = useState('')
  const [announcementType, setAnnouncementType] = useState('general')

  const handleSendAnnouncement = () => {
    if (announcementTitle.trim() && announcementContent.trim()) {
      console.log('[v0] Enviar anuncio', { courseId, title: announcementTitle, body: announcementContent, type: announcementType })
      setShowAnnouncementModal(false)
      setAnnouncementTitle('')
      setAnnouncementContent('')
      setAnnouncementType('general')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/teacher">Panel Profesor</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/teacher/courses">Cursos</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{mockCourse.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <Button
          variant="ghost"
          onClick={() => router('/teacher/courses')}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Mis Cursos
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{mockCourse.name}</h1>
            <p className="text-sm text-gray-500">{mockCourse.students.length} estudiantes inscritos</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            onClick={() => router(`/teacher/courses/${courseId}/assignments/new`)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Crear tarea
          </Button>
          <Button
            onClick={() => router(`/teacher/reviews`)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ClipboardList className="w-4 h-4 mr-2" />
            Revisiones
          </Button>
          <Button
            onClick={() => router(`/teacher/diagrams`)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <FileText className="w-4 h-4 mr-2" />
            Ver diagramas
          </Button>
          <Button
            onClick={() => setShowAnnouncementModal(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Megaphone className="w-4 h-4 mr-2" />
            Enviar anuncio
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="w-5 h-5 text-green-600" />
              Estudiantes Inscritos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockCourse.students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-700 font-semibold text-sm">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900">{student.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('Ver perfil', student.id)}
                    className="text-green-600 hover:text-green-700"
                  >
                    Ver perfil
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tasks Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ClipboardList className="w-5 h-5 text-blue-600" />
              Tareas del Curso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockCourse.tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                      {task.dueDate}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => console.log('Revisar entregas', task.id)}
                    className="bg-green-600 hover:bg-green-700 text-white w-full"
                  >
                    Revisar entregas
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Megaphone className="w-5 h-5 text-orange-600" />
            Anuncios Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="p-4 bg-gray-50 rounded-lg border-l-4 border-orange-500"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                  <Badge variant={announcement.type === 'important' ? 'destructive' : 'secondary'}>
                    {announcement.type === 'important' ? 'Importante' : 'General'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{announcement.content}</p>
                <p className="text-xs text-gray-500">{announcement.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl shadow-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">Enviar Anuncio</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAnnouncementModal(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Anuncio
                </label>
                <Select value={announcementType} onValueChange={setAnnouncementType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="important">Recordatorio</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título
                </label>
                <Input
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  placeholder="Título del anuncio"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenido
                </label>
                <Textarea
                  value={announcementContent}
                  onChange={(e) => setAnnouncementContent(e.target.value)}
                  placeholder="Escribe el contenido del anuncio..."
                  className="h-32"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAnnouncementModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSendAnnouncement}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={!announcementTitle.trim() || !announcementContent.trim()}
                >
                  <Megaphone className="w-4 h-4 mr-2" />
                  Enviar Anuncio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
