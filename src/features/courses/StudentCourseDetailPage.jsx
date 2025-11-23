import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { BookOpen, FileText, Bell, ArrowLeft, PlayCircle, FileText as FilePdf, Bookmark, CheckCircle2, Calendar, BadgeCheck } from 'lucide-react'
import { Button } from '../../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
import { Badge } from '../../ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table'
import { Card } from '../../ui/card'
import { Progress } from '../../ui/progress'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../ui/breadcrumb'

export default function StudentCourseDetailPage() {
  // const { id: courseId } = useParams() // Unused
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data
  const course = {
    name: 'Cálculo Diferencial',
    professor: 'Dr. Juan Pérez',
    color: '#3b82f6',
  }

  const contentItems = [
    { id: 1, title: 'Introducción al Cálculo', type: 'Video', viewed: true, duration: '15 min' },
    { id: 2, title: 'Límites - Teoría', type: 'PDF', viewed: true, pages: 12 },
    { id: 3, title: 'Ejercicios de Límites', type: 'Apunte', viewed: false, pages: 5 },
    { id: 4, title: 'Quiz: Límites Básicos', type: 'Quiz', viewed: false, questions: 10 },
    { id: 5, title: 'Continuidad de Funciones', type: 'Video', viewed: false, duration: '20 min' },
  ]

  const assignments = [
    { id: 1, name: 'Taller 1: Límites', dueDate: '2025-01-20', status: 'entregada', grade: 95 },
    { id: 2, name: 'Taller 2: Continuidad', dueDate: '2025-01-25', status: 'entregada', grade: 88 },
    { id: 3, name: 'Taller 3: Derivadas', dueDate: '2025-02-01', status: 'pendiente', grade: null },
    { id: 4, name: 'Parcial 1', dueDate: '2025-01-15', status: 'atrasada', grade: null },
  ]

  const announcements = [
    { id: 1, title: 'Cambio de horario para el parcial', date: '2025-01-18', type: 'Urgente', content: 'El parcial se realizará el viernes a las 2 PM' },
    { id: 2, title: 'Nuevo material disponible', date: '2025-01-17', type: 'General', content: 'Se ha publicado el material de derivadas' },
    { id: 3, title: 'Recordatorio: Taller 3', date: '2025-01-16', type: 'Recordatorio', content: 'El taller 3 vence este viernes' },
  ]

  const students = [
    { id: 1, name: 'Ana García', status: 'activo', progress: 85 },
    { id: 2, name: 'Carlos Mendoza', status: 'activo', progress: 92 },
    { id: 3, name: 'Laura Pérez', status: 'activo', progress: 78 },
    { id: 4, name: 'Miguel Torres', status: 'retirado', progress: 45 },
    { id: 5, name: 'Sofia Ramirez', status: 'activo', progress: 95 },
  ]

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Video': return <PlayCircle className="w-4 h-4 text-blue-600" />
      case 'PDF': return <FilePdf className="w-4 h-4 text-red-600" />
      case 'Apunte': return <Bookmark className="w-4 h-4 text-primary" />
      case 'Quiz': return <CheckCircle2 className="w-4 h-4 text-purple-600" />
      default: return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'entregada':
        return <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Entregada</Badge>
      case 'pendiente':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pendiente</Badge>
      case 'atrasada':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Atrasada</Badge>
      default:
        return null
    }
  }

  const getAnnouncementBadge = (type) => {
    switch (type) {
      case 'Urgente':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Urgente</Badge>
      case 'Recordatorio':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Recordatorio</Badge>
      case 'General':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">General</Badge>
      default:
        return null
    }
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
                <Link to="/home">Inicio</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
                <Link to="/courses">Cursos</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{course.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header with course info */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/courses')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a cursos
        </Button>

        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-lg"
            style={{ backgroundColor: course.color }}
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{course.name}</h1>
            <p className="text-sm text-gray-600">{course.professor}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white border mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Contenido</TabsTrigger>
          <TabsTrigger value="assignments">Tareas</TabsTrigger>
          <TabsTrigger value="announcements">Anuncios</TabsTrigger>
          <TabsTrigger value="students">Estudiantes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Próximas clases */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Próximas Clases</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">Límites y Continuidad</p>
                  <p className="text-xs text-gray-600">Lunes 10:00 AM</p>
                </div>
              </div>
            </div>

            {/* Últimas publicaciones */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Últimas Publicaciones</h3>
              <div className="space-y-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">Material de Derivadas</p>
                  <p className="text-xs text-gray-600">Hace 2 días</p>
                </div>
              </div>
            </div>

            {/* Tareas pendientes */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Tareas Pendientes</h3>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">Taller 3</p>
                  <p className="text-xs text-gray-600">Vence en 2 días</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="content">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Material del Curso</h2>
            <div className="space-y-2">
              {contentItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => console.log('[v0] Open content', item.id)}
                >
                  <div className="flex items-center gap-3">
                    {getTypeIcon(item.type)}
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-600">
                        {item.type} • {item.type === 'Video' ? item.duration : `${item.pages} páginas`}
                      </p>
                    </div>
                  </div>
                  {item.viewed ? (
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                      <BadgeCheck className="w-3 h-3 mr-1" />
                      Visto
                    </Badge>
                  ) : (
                    <Badge variant="outline">No visto</Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tareas del Curso</h2>
            <div className="space-y-3">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{assignment.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-gray-500" />
                      <p className="text-xs text-gray-600">Entrega: {assignment.dueDate}</p>
                      {assignment.grade && (
                        <span className="text-xs text-gray-600 ml-2">• Nota: {assignment.grade}/100</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(assignment.status)}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => console.log('[v0] Ver tarea', assignment.id)}
                    >
                      Ver detalles
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="announcements">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Anuncios del Curso</h2>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-gray-600" />
                      <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                    </div>
                    {getAnnouncementBadge(announcement.type)}
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{announcement.content}</p>
                  <p className="text-xs text-gray-500">{announcement.date}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Estudiantes Inscritos</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Progreso</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>
                      {student.status === 'activo' ? (
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Activo</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Retirado</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={student.progress} className="w-24" />
                        <span className="text-sm text-gray-600">{student.progress}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
