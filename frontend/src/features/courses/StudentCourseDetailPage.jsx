import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BookOpen, Calendar as CalendarIcon, CheckSquare, Users, ArrowLeft } from 'lucide-react'
import { Button } from '../../ui/button'

const tabs = ['Overview', 'Contenido', 'Tareas', 'Anuncios', 'Estudiantes']

const mockCourse = {
  name: 'Curso de Ejemplo',
  professor: 'Dr. Juan Pérez',
  progress: 72,
  description: 'Descripción breve del curso y sus objetivos.',
}

const mockTasks = [
  { id: 1, title: 'Ensayo capítulo 2', dueDate: '2025-11-22', status: 'Pendiente' },
  { id: 2, title: 'Quiz módulo 3', dueDate: '2025-11-25', status: 'En progreso' },
]

export default function StudentCourseDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = React.useState('Overview')

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <BookOpen className="text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{mockCourse.name} #{id}</h1>
            <p className="text-sm text-gray-600">Profesor: {mockCourse.professor}</p>
          </div>
        </div>
        <Button variant="ghost" className="gap-2" onClick={() => navigate('/courses')}>
          <ArrowLeft className="w-4 h-4" /> Volver
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex gap-2 p-4 flex-wrap">
          {tabs.map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab)}
              className="active:scale-95"
            >
              {tab}
            </Button>
          ))}
        </div>
        <div className="p-6 border-t border-gray-200">
          {activeTab === 'Overview' && (
            <div className="space-y-3 text-gray-700">
              <p>{mockCourse.description}</p>
              <p><strong>Progreso:</strong> {mockCourse.progress}%</p>
            </div>
          )}
          {activeTab === 'Contenido' && <div className="text-sm text-gray-600">Contenido del curso (mock).</div>}
          {activeTab === 'Tareas' && (
            <div className="space-y-3">
              {mockTasks.map((t) => (
                <div key={t.id} className="p-3 border border-gray-200 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{t.title}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-green-600" /> {t.dueDate}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/tasks/${t.id}`)}>
                    Ver tarea
                  </Button>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'Anuncios' && <div className="text-sm text-gray-600">Sin anuncios aún.</div>}
          {activeTab === 'Estudiantes' && (
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Users className="w-4 h-4" /> Lista de estudiantes (mock)
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
