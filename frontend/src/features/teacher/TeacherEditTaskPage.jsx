import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Calendar, FileText, BookOpen } from 'lucide-react'
import { Button } from '../../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Textarea } from '../../ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../ui/breadcrumb'

const mockTask = {
  id: 1,
  title: "Ensayo sobre el capítulo 2",
  description: "Realizar un análisis crítico del capítulo 2 del libro de texto, enfocándose en los conceptos principales.",
  course: "Programación I",
  dueDate: "2025-11-22",
  points: 100,
}

export default function TeacherEditTaskPage({ taskId }) {
  const router = useNavigate()
  const [title, setTitle] = useState(mockTask.title)
  const [description, setDescription] = useState(mockTask.description)
  const [course, setCourse] = useState(mockTask.course)
  const [dueDate, setDueDate] = useState(mockTask.dueDate)
  const [points, setPoints] = useState(mockTask.points.toString())

  const handleSave = () => {
    if (title.trim() && description.trim() && dueDate && points) {
      console.log('[v0] Saving task edits:', { taskId, title, description, course, dueDate, points })
      router('/teacher/tasks')
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/teacher">Panel Profesor</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/teacher/tasks">Tareas</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Editar Tarea</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <Button
          variant="ghost"
          onClick={() => router(-1)}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Tarea</h1>
            <p className="text-sm text-gray-500">Modifica los detalles de la tarea</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Tarea</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              <FileText className="w-4 h-4 inline mr-2" />
              Título de la Tarea
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Ensayo sobre el capítulo 2"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe los detalles y requisitos de la tarea..."
              rows={6}
            />
          </div>

          {/* Course */}
          <div className="space-y-2">
            <Label htmlFor="course">
              <BookOpen className="w-4 h-4 inline mr-2" />
              Curso
            </Label>
            <Select value={course} onValueChange={setCourse}>
              <SelectTrigger id="course">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Programación I">Programación I</SelectItem>
                <SelectItem value="Matemáticas Aplicadas">Matemáticas Aplicadas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Due Date and Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dueDate">
                <Calendar className="w-4 h-4 inline mr-2" />
                Fecha de Entrega
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">Puntos</Label>
              <Input
                id="points"
                type="number"
                min="0"
                max="100"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="100"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => router(-1)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700"
              disabled={!title.trim() || !description.trim() || !dueDate || !points}
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
