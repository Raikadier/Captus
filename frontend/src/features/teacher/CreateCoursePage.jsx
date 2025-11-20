import React, { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus } from 'lucide-react'
import { Button } from "../../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Textarea } from "../../ui/textarea"

export default function CreateCoursePage() {
  const router = useNavigate()
  const [formData, setFormData] = useState({
    courseName: "",
    description: "",
    semester: "",
  })
  const [errors, setErrors] = useState({ courseName: "" })

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validación mínima
    if (!formData.courseName.trim()) {
      setErrors({ courseName: "El nombre del curso es requerido" })
      return
    }

    // Mock submit
    console.log("Curso creado (mock) →", formData)
    router("/teacher/courses")
  }

  const handleCancel = () => {
    router(-1)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <Plus className="h-8 w-8 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-900">Crear Curso</h1>
            </div>
            <p className="text-gray-500 mt-1">
              Completa la información para crear un nuevo curso
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">
              Información del Curso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre del Curso */}
              <div className="space-y-2">
                <Label htmlFor="courseName" className="text-gray-700">
                  Nombre del Curso <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="courseName"
                  placeholder="Ej: Matemáticas III"
                  value={formData.courseName}
                  onChange={(e) => {
                    setFormData({ ...formData, courseName: e.target.value })
                    setErrors({ courseName: "" })
                  }}
                  className={errors.courseName ? "border-red-500" : ""}
                />
                {errors.courseName && (
                  <p className="text-sm text-red-500">{errors.courseName}</p>
                )}
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700">
                  Descripción
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe brevemente el contenido del curso..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
                <p className="text-xs text-gray-500">Opcional</p>
              </div>

              {/* Semestre/Periodo */}
              <div className="space-y-2">
                <Label htmlFor="semester" className="text-gray-700">
                  Semestre / Periodo
                </Label>
                <Input
                  id="semester"
                  placeholder="Ej: 2025-1, Primavera 2025"
                  value={formData.semester}
                  onChange={(e) =>
                    setFormData({ ...formData, semester: e.target.value })
                  }
                />
                <p className="text-xs text-gray-500">Opcional</p>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white flex-1"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Curso
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
