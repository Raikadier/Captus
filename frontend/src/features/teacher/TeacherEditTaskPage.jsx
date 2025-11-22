import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ClipboardList, ArrowLeft } from 'lucide-react'
import { Button } from '@ui/button'
import { Input } from '@ui/input'

export default function TeacherEditTaskPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: 'Título de la tarea',
    description: 'Descripción de la tarea',
    dueDate: '2025-11-25',
  })

  const handleChange = (field) => (e) => setFormData({ ...formData, [field]: e.target.value })
  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/teacher/tasks')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm p-6">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <ClipboardList className="text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar tarea #{id}</h1>
          <p className="text-sm text-gray-600">Actualiza la información de la tarea</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" onClick={() => navigate('/teacher/tasks')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver
          </Button>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Título</label>
          <Input value={formData.title} onChange={handleChange('title')} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            value={formData.description}
            onChange={handleChange('description')}
            rows={4}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Fecha límite</label>
          <Input type="date" value={formData.dueDate} onChange={handleChange('dueDate')} />
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => navigate('/teacher/tasks')}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  )
}
