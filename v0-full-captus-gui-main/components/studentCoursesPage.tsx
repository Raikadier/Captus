'use client'

import { useState } from 'react'
import { BookOpen, Clock, TrendingUp, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

// Mock data
const mockCourses = [
  {
    id: '1',
    name: 'Cálculo Diferencial',
    professor: 'Dr. Juan Pérez',
    progress: 75,
    lastUpdate: '2 días',
    color: '#3b82f6',
  },
  {
    id: '2',
    name: 'Programación Avanzada',
    professor: 'Ing. María García',
    progress: 60,
    lastUpdate: '1 día',
    color: '#10b981',
  },
  {
    id: '3',
    name: 'Base de Datos',
    professor: 'Dr. Carlos López',
    progress: 90,
    lastUpdate: '3 días',
    color: '#8b5cf6',
  },
]

export default function StudentCoursesPage() {
  const router = useRouter()

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mis Cursos</h1>
              <p className="text-sm text-gray-600">Gestiona tus cursos inscritos</p>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/courses/${course.id}`)}
            >
              <div
                className="w-full h-32 rounded-lg mb-4"
                style={{ backgroundColor: course.color }}
              />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {course.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">{course.professor}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progreso</span>
                  <span className="font-semibold text-gray-900">
                    {course.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Hace {course.lastUpdate}</span>
                </div>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/courses/${course.id}`)
                  }}
                >
                  Ver curso
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
