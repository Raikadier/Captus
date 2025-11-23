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
    <div className="p-6 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">{isEditing ? 'Editar Tarea' : 'Crear Nueva Tarea'}</h1>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
            <div className="space-y-2">
                <Label>Título de la Tarea</Label>
                <Input
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="Ej: Ensayo sobre Historia"
                />
            </div>

            <div className="space-y-2">
                <Label>Descripción e Instrucciones</Label>
                <Textarea
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Detalla lo que deben realizar los estudiantes..."
                    className="h-32"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Fecha de Vencimiento</Label>
                    <div className="block">
                         <Input
                            type="datetime-local"
                            value={formData.due_date ? new Date(formData.due_date).toISOString().slice(0, 16) : ''}
                            onChange={e => setFormData({...formData, due_date: new Date(e.target.value)})}
                         />
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-8">
                     <input
                        type="checkbox"
                        id="isGroup"
                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                        checked={formData.is_group_assignment}
                        onChange={e => setFormData({...formData, is_group_assignment: e.target.checked})}
                     />
                     <Label htmlFor="isGroup" className="cursor-pointer">Es una tarea grupal</Label>
                </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <Button variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
                <Button onClick={handleSubmit}>{isEditing ? 'Guardar Cambios' : 'Crear Tarea'}</Button>
            </div>
        </div>
    </div>
  )
}
