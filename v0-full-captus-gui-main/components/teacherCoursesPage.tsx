'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Users, ListChecks, Plus } from 'lucide-react'

const mockCourses = [
  {
    id: 1,
    name: "Matemáticas Aplicadas",
    students: 32,
    pendingReviews: 5,
  },
  {
    id: 2,
    name: "Programación I",
    students: 28,
    pendingReviews: 7,
  },
  {
    id: 3,
    name: "Algoritmos y Estructuras de Datos",
    students: 25,
    pendingReviews: 3,
  },
  {
    id: 4,
    name: "Bases de Datos",
    students: 30,
    pendingReviews: 8,
  },
]

export default function TeacherCoursesPage() {
  const router = useRouter()

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mis Cursos</h1>
                <p className="text-sm text-gray-500">Gestiona tus cursos y estudiantes</p>
              </div>
            </div>
            <Button
              onClick={() => router.push('/teacher/courses/new')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Curso
            </Button>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {course.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-green-600" />
                    <span>{course.students} estudiantes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ListChecks className="w-4 h-4 text-orange-600" />
                    <span>{course.pendingReviews} revisiones pendientes</span>
                  </div>
                </div>
                <Button
                  onClick={() => router.push(`/teacher/courses/${course.id}`)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Abrir Curso
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// Ruta sugerida en Next.js App Router:
// app/(dashboard)/teacher/courses/page.tsx
