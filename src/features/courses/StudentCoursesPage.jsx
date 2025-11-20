import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { Button } from '../../ui/button'

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
  const navigate = useNavigate()

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer active:scale-95"
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              <div className="w-full h-32 rounded-lg mb-4" style={{ backgroundColor: course.color }} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{course.professor}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progreso</span>
                  <span className="font-semibold text-gray-900">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-green-500 transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">Última actividad: {course.lastUpdate}</div>
              </div>

              <div className="flex items-center justify-between">
                <Button variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => navigate(`/courses/${course.id}`)}>
                  Ver curso
                </Button>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {course.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
