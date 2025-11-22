import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BookOpen, Calendar as CalendarIcon, Users, FileText, PlusCircle, GitBranch, Megaphone } from 'lucide-react'
import { Button } from '@ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'

const tabs = ['Información', 'Estudiantes', 'Tareas', 'Anuncios']

const mockStudents = [
  { id: 1, name: 'María Gómez', email: 'maria@example.com' },
  { id: 2, name: 'Juan Pérez', email: 'juan@example.com' },
]

const mockTasks = [
  { id: 1, title: 'Ensayo cap. 2', dueDate: '2025-11-22', status: 'Pendiente' },
  { id: 2, title: 'Quiz módulo 3', dueDate: '2025-11-25', status: 'En progreso' },
]

const mockAnnouncements = [{ id: 1, title: 'Recordatorio', body: 'Entrega parcial el 22/11', type: 'Urgente' }]

export default function TeacherCourseDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Información')

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <BookOpen className="text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Curso #{id}</h1>
            <p className="text-sm text-gray-600">Detalle del curso y sus recursos</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/teacher/courses/${id}/assignments/new`)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Crear Tarea
          </Button>
          <Button variant="ghost">
            <Megaphone className="w-4 h-4 mr-2" />
            Enviar anuncio
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Secciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4 flex-wrap">
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

          {activeTab === 'Información' && (
            <div className="space-y-3 text-gray-700">
              <p><strong>Profesor:</strong> Nombre del profesor</p>
              <p><strong>Semestre:</strong> 2025-II</p>
              <p><strong>Código:</strong> CUR-{id}</p>
            </div>
          )}

          {activeTab === 'Estudiantes' && (
            <div className="space-y-3">
              {mockStudents.map((s) => (
                <div key={s.id} className="p-3 border border-gray-200 rounded-lg">
                  <p className="font-medium text-gray-900">{s.name}</p>
                  <p className="text-sm text-gray-600">{s.email}</p>
                </div>
              ))}
            </div>
          )}

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
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/teacher/tasks/${t.id}/edit`)}>
                    Editar
                  </Button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Anuncios' && (
            <div className="space-y-3">
              {mockAnnouncements.map((a) => (
                <div key={a.id} className="p-3 border border-gray-200 rounded-lg">
                  <p className="font-medium text-gray-900">{a.title}</p>
                  <p className="text-sm text-gray-600">{a.body}</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-700 inline-block mt-2">{a.type}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
