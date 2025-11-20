import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardList, Edit2 } from 'lucide-react'
import { Button } from '../../ui/button'

const mockTasks = [
  { id: 1, title: 'Ensayo cap. 2', course: 'Programación I', status: 'En revisión', dueDate: '2025-11-22' },
  { id: 2, title: 'Quiz módulo 3', course: 'Matemáticas Aplicadas', status: 'Pendiente', dueDate: '2025-11-25' },
]

export default function TeacherTasksCreatedPage() {
  const navigate = useNavigate()

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-3">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <ClipboardList className="text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tareas creadas</h1>
          <p className="text-sm text-gray-600">Administra las tareas de tus cursos</p>
        </div>
      </div>

      <div className="space-y-3">
        {mockTasks.map((task) => (
          <div key={task.id} className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-gray-900">{task.title}</p>
              <p className="text-sm text-gray-600">{task.course} • {task.status} • {task.dueDate}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate(`/teacher/tasks/${task.id}/edit`)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
