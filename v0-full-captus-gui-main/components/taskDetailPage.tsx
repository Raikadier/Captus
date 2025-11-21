'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, Flag, CheckCircle2, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TaskDetailPage() {
  const router = useRouter()
  const params = useParams()
  const taskId = params.id as string
  const [completed, setCompleted] = useState(false)

  // Mock data
  const task = {
    id: taskId,
    title: 'Estudiar para examen de Cálculo',
    description: 'Repasar capítulos 5-8, hacer ejercicios prácticos y revisar notas de clase.',
    dueDate: '2024-11-20',
    priority: 'high',
    category: 'Estudio',
    completed: false,
    createdAt: '2024-11-10',
  }

  const handleDelete = () => {
    console.log('Deleting task:', taskId)
    router.push('/tasks')
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Tareas
        </Button>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  task.priority === 'high' ? 'bg-red-100 text-red-700' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  Prioridad {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                </span>
              </div>
              <p className="text-gray-600">{task.description}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/tasks/${taskId}/edit`)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <div>
                <p className="text-xs text-gray-500">Vencimiento</p>
                <p className="font-medium">{new Date(task.dueDate).toLocaleDateString('es')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Flag className="w-5 h-5" />
              <div>
                <p className="text-xs text-gray-500">Categoría</p>
                <p className="font-medium">{task.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <div>
                <p className="text-xs text-gray-500">Creada</p>
                <p className="font-medium">{new Date(task.createdAt).toLocaleDateString('es')}</p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setCompleted(!completed)}
            className={`w-full ${completed ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            {completed ? 'Marcar como Pendiente' : 'Marcar como Completada'}
          </Button>
        </div>
      </div>
    </div>
  )
}
