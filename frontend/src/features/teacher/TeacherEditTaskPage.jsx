import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAssignments } from '../../hooks/useAssignments'
import { useCourses } from '../../hooks/useCourses'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { Label } from '../../ui/label'
import { Switch } from '../../ui/switch'
import Loading from '../../ui/loading'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

export default function TeacherEditTaskPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { getAssignment, createAssignment, updateAssignment } = useAssignments()
  const { getCourse } = useCourses()

  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
      title: '',
      description: '',
      due_date: new Date(),
      is_group_assignment: false,
      course_id: null
  })

  useEffect(() => {
      const init = async () => {
          try {
              if (id === 'new') {
                  // Create Mode
                  const courseId = searchParams.get('courseId')
                  if (!courseId) {
                      toast.error('Falta el ID del curso')
                      navigate('/teacher/courses')
                      return
                  }
                  setFormData(prev => ({ ...prev, course_id: parseInt(courseId) }))
                  setIsEditing(false)
              } else {
                  // Edit Mode
                  const assignment = await getAssignment(id)
                  if (assignment && assignment.id) {
                      setIsEditing(true)
                      setFormData({
                          ...assignment,
                          due_date: new Date(assignment.due_date)
                      })
                  }
              }
          } catch (e) {
              console.error(e)
              toast.error('Error cargando la tarea')
              navigate(-1)
          } finally {
              setLoading(false)
          }
      }
      init()
  }, [id, searchParams])

  const handleSubmit = async () => {
      try {
          if (!formData.title) return toast.error('El título es obligatorio');

          if (isEditing) {
              await updateAssignment(id, formData);
              toast.success('Tarea actualizada');
              navigate(-1);
          } else {
              await createAssignment(formData);
              toast.success('Tarea creada');
              navigate(`/teacher/courses/${formData.course_id}`);
          }
      } catch (error) {
          toast.error(error.message);
      }
  }

  if (loading) return <Loading message="Cargando..." />

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm p-6">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <ClipboardList className="text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar tarea #{id}</h1>
          <p className="text-sm text-gray-600">Actualiza la información de la tarea</p>
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
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
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
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            Guardar cambios
          </Button>
        </div>
    </div>
  )
}
