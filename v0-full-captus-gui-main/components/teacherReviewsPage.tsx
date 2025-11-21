'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FileCheck, User, Clock, BookOpen, Filter, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const mockPendingReviews = [
  {
    id: 1,
    student: "María Gómez",
    task: "Ensayo cap. 2",
    course: "Programación I",
    submittedAt: "2025-11-19 14:30",
  },
  {
    id: 2,
    student: "Juan Pérez",
    task: "Problemas Tema 3",
    course: "Matemáticas Aplicadas",
    submittedAt: "2025-11-19 09:10",
  },
  {
    id: 3,
    student: "Ana Rodríguez",
    task: "Práctica Lab 5",
    course: "Programación I",
    submittedAt: "2025-11-19 16:45",
  },
  {
    id: 4,
    student: "Carlos López",
    task: "Proyecto Final",
    course: "Estructuras de Datos",
    submittedAt: "2025-11-18 23:59",
  },
  {
    id: 5,
    student: "Laura Martínez",
    task: "Examen Parcial",
    course: "Matemáticas Aplicadas",
    submittedAt: "2025-11-18 20:15",
  },
]

export function TeacherReviewsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const courseParam = searchParams.get('course')
  const [selectedCourse, setSelectedCourse] = useState<string>(courseParam || 'all')

  useEffect(() => {
    if (courseParam) {
      setSelectedCourse(courseParam)
    }
  }, [courseParam])

  const courses = Array.from(new Set(mockPendingReviews.map(r => r.course)))
  
  const filteredReviews = selectedCourse === 'all' 
    ? mockPendingReviews 
    : mockPendingReviews.filter(r => r.course === selectedCourse)

  const handleReview = (id: number) => {
    router.push(`/teacher/reviews/${id}`)
  }

  const getSelectedCourseText = () => {
    return selectedCourse === 'all' ? 'Todos los cursos' : selectedCourse
  }

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-50 rounded-xl">
                <FileCheck className="text-green-600" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Revisiones Pendientes</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredReviews.length} {filteredReviews.length === 1 ? 'entrega pendiente' : 'entregas pendientes'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex items-center space-x-3">
            <Filter size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtrar por curso:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="min-w-[200px] justify-between bg-white hover:bg-gray-50 border-gray-200"
                >
                  <span className="text-sm">{getSelectedCourseText()}</span>
                  <ChevronDown size={16} className="ml-2 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[200px]">
                <DropdownMenuItem
                  onClick={() => setSelectedCourse('all')}
                  className={selectedCourse === 'all' ? 'bg-green-50 text-green-700' : ''}
                >
                  Todos los cursos
                </DropdownMenuItem>
                {courses.map((course) => (
                  <DropdownMenuItem
                    key={course}
                    onClick={() => setSelectedCourse(course)}
                    className={selectedCourse === course ? 'bg-green-50 text-green-700' : ''}
                  >
                    {course}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Lista de entregas */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <Card className="p-8 text-center">
              <FileCheck size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No hay entregas pendientes en este curso</p>
            </Card>
          ) : (
            filteredReviews.map((review) => (
              <Card key={review.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Estudiante */}
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <User size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Estudiante</p>
                        <p className="font-semibold text-gray-900">{review.student}</p>
                      </div>
                    </div>

                    {/* Tarea */}
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-50 rounded-lg">
                        <FileCheck size={18} className="text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Tarea</p>
                        <p className="font-semibold text-gray-900">{review.task}</p>
                      </div>
                    </div>

                    {/* Curso */}
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <BookOpen size={18} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Curso</p>
                        <p className="font-semibold text-gray-900">{review.course}</p>
                      </div>
                    </div>

                    {/* Fecha/hora */}
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <Clock size={18} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Fecha de entrega</p>
                        <p className="font-semibold text-gray-900 text-sm">{review.submittedAt}</p>
                      </div>
                    </div>
                  </div>

                  {/* Botón Revisar */}
                  <div className="ml-4">
                    <Button
                      onClick={() => handleReview(review.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Revisar
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
