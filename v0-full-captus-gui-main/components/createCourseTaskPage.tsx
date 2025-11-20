'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Calendar, FileText, Save } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function CreateCourseTaskPage({ courseId }: { courseId?: string }) {
  const router = useRouter()
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskDueDate, setTaskDueDate] = useState('')
  const [taskType, setTaskType] = useState('assignment')
  const [maxScore, setMaxScore] = useState('100')

  const handleCreateTask = () => {
    if (taskTitle.trim() && taskDescription.trim() && taskDueDate) {
      console.log('[v0] Creating task:', { taskTitle, taskDescription, taskDueDate, taskType, maxScore })
      router.push(`/teacher/courses/${courseId}`)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-sm">
          <CardHeader>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4 text-gray-600 hover:text-gray-900 w-fit"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              Crear Nueva Tarea
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título de la Tarea *
              </label>
              <Input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Ej: Ensayo sobre el Capítulo 3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Tarea
              </label>
              <Select value={taskType} onValueChange={setTaskType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="assignment">Tarea</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="project">Proyecto</SelectItem>
                  <SelectItem value="exam">Examen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Entrega *
                </label>
                <Input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puntaje Máximo
                </label>
                <Input
                  type="number"
                  value={maxScore}
                  onChange={(e) => setMaxScore(e.target.value)}
                  placeholder="100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <Textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Describe las instrucciones y requisitos de la tarea..."
                className="h-40"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateTask}
                className="bg-green-600 hover:bg-green-700"
                disabled={!taskTitle.trim() || !taskDescription.trim() || !taskDueDate}
              >
                <Save className="w-4 h-4 mr-2" />
                Crear Tarea
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
