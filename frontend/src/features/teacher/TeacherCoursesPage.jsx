import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, PlusCircle } from 'lucide-react'
import { Button } from '@ui/button'

const mockCourses = [
  { id: '1', name: 'Matemáticas Aplicadas', students: 32, pendingTasks: 4 },
  { id: '2', name: 'Programación I', students: 28, pendingTasks: 7 },
]

export default function TeacherCoursesPage() {
  const navigate = useNavigate()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cursos</h1>
            <p className="text-gray-600">Gestiona tus cursos como docente</p>
          </div>
        </div>
        <Button className="gap-2" onClick={() => navigate('/teacher/courses/new')}>
          <PlusCircle className="w-4 h-4" />
          Crear curso
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockCourses.map((course) => (
          <div key={course.id} className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer" onClick={() => navigate(`/teacher/courses/${course.id}`)}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                <p className="text-sm text-gray-600">{course.students} estudiantes</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Tareas pendientes: {course.pendingTasks}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
