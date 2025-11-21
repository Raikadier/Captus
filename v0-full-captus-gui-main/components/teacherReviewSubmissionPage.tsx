'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, BookOpen, FileText, Clock, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const mockSubmission = {
  id: 10,
  student: "María Gómez",
  course: "Programación I",
  task: "Ensayo cap. 2",
  submittedAt: "2025-11-19 14:30",
  content: "Este ensayo analiza los conceptos fundamentales del capítulo 2, enfocándose en las estructuras de control y su aplicación práctica. A lo largo del texto se desarrollan ejemplos concretos que demuestran la importancia de comprender estos mecanismos para la programación eficiente...",
}

interface TeacherReviewSubmissionPageProps {
  submissionId: string
}

export function TeacherReviewSubmissionPage({ submissionId }: TeacherReviewSubmissionPageProps) {
  const router = useRouter()
  const [grade, setGrade] = useState('')
  const [feedback, setFeedback] = useState('')

  const handleSubmit = () => {
    console.log('[v0] Revisión completada:', { submissionId, grade, feedback })
    router.push('/teacher/reviews')
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/teacher/home">Panel Profesor</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/teacher/reviews">Revisiones</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{mockSubmission.student}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <FileText className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Revisar Entrega</h1>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna izquierda: Información de la entrega */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información de la entrega</h2>
            
            <div className="space-y-4">
              {/* Estudiante */}
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-0.5">Estudiante</p>
                  <p className="font-semibold text-gray-900">{mockSubmission.student}</p>
                </div>
              </div>

              {/* Curso */}
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BookOpen size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-0.5">Curso</p>
                  <p className="font-semibold text-gray-900">{mockSubmission.course}</p>
                </div>
              </div>

              {/* Tarea */}
              <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FileText size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-0.5">Tarea</p>
                  <p className="font-semibold text-gray-900">{mockSubmission.task}</p>
                </div>
              </div>

              {/* Fecha de envío */}
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-0.5">Fecha de envío</p>
                  <p className="font-semibold text-gray-900">{mockSubmission.submittedAt}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Calificación y Retroalimentación */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Calificación</h2>
            
            <div className="space-y-4">
              {/* Campo de calificación */}
              <div>
                <Label htmlFor="grade" className="text-sm font-medium text-gray-700 mb-2 block">
                  Nota
                </Label>
                <Input
                  id="grade"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Ingrese la calificación (0-100)"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Campo de retroalimentación */}
              <div>
                <Label htmlFor="feedback" className="text-sm font-medium text-gray-700 mb-2 block">
                  Retroalimentación
                </Label>
                <Textarea
                  id="feedback"
                  placeholder="Escriba sus comentarios para el estudiante..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={6}
                  className="w-full resize-none"
                />
              </div>

              {/* Botón de guardar */}
              <Button
                onClick={handleSubmit}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={!grade}
              >
                <Save size={18} className="mr-2" />
                Marcar como revisado
              </Button>
            </div>
          </Card>
        </div>

        {/* Columna derecha: Contenido enviado */}
        <div>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contenido enviado</h2>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <Textarea
                value={mockSubmission.content}
                readOnly
                rows={20}
                className="w-full resize-none bg-white border-0 focus:ring-0"
              />
            </div>

            {/* Opción de archivo (mock) */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700 mb-2">Archivo adjunto:</p>
              <Button variant="outline" className="w-full" disabled>
                Descargar archivo (mock)
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
