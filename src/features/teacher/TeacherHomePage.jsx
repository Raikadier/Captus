import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { BookOpen, Users, Calendar, PlusCircle, ListChecks, BarChart3, Network, ClipboardList, Loader2 } from 'lucide-react'
import { Button } from '../../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'

const mockCourses = [
  { id: '1', name: 'Matemáticas Aplicadas', students: 32, pendingTasks: 4 },
  { id: '2', name: 'Programación I', students: 28, pendingTasks: 7 },
]

const mockUpcomingEvents = [
  { id: 1, title: 'Revisión de proyecto', date: '2025-11-20', time: '3:00 PM' },
  { id: 2, title: 'Entrega parcial', date: '2025-11-22', time: '11:59 PM' },
]

const mockPendingReviews = [
  { id: 1, student: 'María Gómez', task: 'Ensayo cap. 2', course: 'Programación I' },
  { id: 2, student: 'Juan Pérez', task: 'Problemas tema 3', course: 'Matemáticas Aplicadas' },
]

export default function TeacherHomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Aquí irían las llamadas a servicios; usamos mocks
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-start space-x-4">
          <div className="bg-green-100 p-3 rounded-xl">
            <BookOpen className="text-green-600" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bienvenid@ {(user?.user_metadata?.name || user?.name || 'Profesor').split(' ')[0]}</h1>
            <p className="text-gray-600 mt-1">Revisa tus cursos y actividades académicas</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Accesos Rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            <Button className="bg-green-600 hover:bg-green-700 transition-all hover:scale-105 active:scale-95" onClick={() => navigate('/teacher/courses/new')}>
              <PlusCircle size={18} className="mr-2" />
              Crear curso
            </Button>
            <Button variant="outline" className="transition-all hover:scale-105 active:scale-95" onClick={() => navigate('/teacher/courses')}>
              <BookOpen size={18} className="mr-2" />
              Ver todos los cursos
            </Button>
            <Button variant="outline" className="transition-all hover:scale-105 active:scale-95" onClick={() => navigate('/teacher/diagrams')}>
              <Network size={18} className="mr-2" />
              Diagramas
            </Button>
            <Button variant="outline" className="transition-all hover:scale-105 active:scale-95" onClick={() => navigate('/teacher/stats')}>
              <BarChart3 size={18} className="mr-2" />
              Estadísticas
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <BookOpen size={20} className="mr-2 text-green-600" />
              Mis Cursos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockCourses.map((course) => (
                <div key={course.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                      <p className="text-sm text-gray-600">{course.students} estudiantes</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/teacher/courses/${course.id}`)}>
                      Ver curso
                    </Button>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">Tareas pendientes: {course.pendingTasks}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Calendar size={20} className="mr-2 text-green-600" />
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockUpcomingEvents.map((event) => (
              <div key={event.id} className="p-3 border border-gray-200 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-600">{event.date} • {event.time}</p>
                </div>
                <Button variant="ghost" size="sm">
                  Ver
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <ListChecks size={20} className="mr-2 text-green-600" />
              Revisiones pendientes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockPendingReviews.map((review) => (
              <div key={review.id} className="p-3 border border-gray-200 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{review.student}</p>
                  <p className="text-sm text-gray-600">{review.task} • {review.course}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate(`/teacher/reviews/${review.id}`)}>
                  Revisar
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
