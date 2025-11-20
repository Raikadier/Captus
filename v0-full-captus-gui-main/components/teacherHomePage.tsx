'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Users, Calendar, PlusCircle, ListChecks as ListCheck, BarChart3, Network, ClipboardList, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { courseService } from '@/services/courseService'
import { taskService } from '@/services/taskService'
import { Course, Event } from '@/types'


export default function TeacherHomePage() {
  const router = useRouter()
  
  const [courses, setCourses] = useState<Course[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [pendingReviews, setPendingReviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // Execute requests in parallel
        const [coursesData, eventsData, reviewsData] = await Promise.all([
          courseService.getTeacherCourses(),
          courseService.getUpcomingEvents(),
          taskService.getPendingReviews()
        ])
        
        setCourses(coursesData)
        setUpcomingEvents(eventsData)
        setPendingReviews(reviewsData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
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
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-start space-x-4">
          <div className="bg-green-100 p-3 rounded-xl">
            <BookOpen className="text-green-600" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bienvenido Profesor</h1>
            <p className="text-gray-600 mt-1">Revisa tus cursos y actividades académicas</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Accesos Rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            <Button 
              variant="default" 
              className="bg-green-600 hover:bg-green-700 transition-all hover:scale-105 active:scale-95"
              onClick={() => router.push('/teacher/courses/new')}
            >
              <PlusCircle size={18} className="mr-2" />
              Crear curso
            </Button>
            <Button 
              variant="outline"
              className="transition-all hover:scale-105 active:scale-95"
              onClick={() => router.push('/teacher/courses')}
            >
              <BookOpen size={18} className="mr-2" />
              Ver todos los cursos
            </Button>
            <Button 
              variant="outline"
              className="transition-all hover:scale-105 active:scale-95"
              onClick={() => router.push('/teacher/diagrams')}
            >
              <Network size={18} className="mr-2" />
              Diagramas
            </Button>
            <Button 
              variant="outline"
              className="transition-all hover:scale-105 active:scale-95"
              onClick={() => router.push('/teacher/stats')}
            >
              <BarChart3 size={18} className="mr-2" />
              Estadísticas
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {/* My Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <BookOpen size={20} className="mr-2 text-green-600" />
              Mis Cursos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <Card key={course.id} className="border border-gray-200 hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">{course.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Users size={16} className="mr-2 text-gray-400" />
                        {course.studentsCount} estudiantes
                      </div>
                      <div className="flex items-center text-gray-600">
                        <ListCheck size={16} className="mr-2 text-gray-400" />
                        {course.pendingTasksCount} tareas por revisar
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-colors"
                      onClick={() => router.push(`/teacher/courses/${course.id}`)}
                    >
                      Ver curso
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <ListCheck size={20} className="mr-2 text-green-600" />
              Revisiones Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingReviews.map((review) => (
                <Card key={review.id} className="border border-gray-200 hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{review.studentName}</h3>
                    <p className="text-sm text-gray-600 mb-1">{review.taskTitle}</p>
                    <p className="text-xs text-gray-500 mb-3">{review.courseName}</p>
                    <Button 
                      size="sm" 
                      className="w-full bg-green-600 hover:bg-green-700 transition-colors"
                      onClick={() => router.push(`/teacher/reviews/${review.id}`)}
                    >
                      Revisar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Calendar size={20} className="mr-2 text-green-600" />
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="border border-gray-200 hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                        <Calendar size={20} className="text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                        <p className="text-sm text-gray-600">{event.date}</p>
                        <p className="text-sm text-gray-500">{event.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
