import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCourses } from '../../hooks/useCourses'
import { useEnrollments } from '../../hooks/useEnrollments'
import { useAssignments } from '../../hooks/useAssignments'
import { Button } from '../../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs'
import { Plus, Users, FileText, ClipboardList } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog'
import { Input } from '../../ui/input'
import Loading from '../../ui/loading'
import { toast } from 'sonner'

export default function TeacherCourseDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getCourse } = useCourses()
  const { getStudents, addStudentManually } = useEnrollments()
  const { getAssignments } = useAssignments()

  const [course, setCourse] = useState(null)
  const [students, setStudents] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  // Add Student State
  const [emailToAdd, setEmailToAdd] = useState('')
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)

  const loadData = async () => {
      try {
        const c = await getCourse(id)
        setCourse(c)
        const s = await getStudents(id)
        setStudents(s)
        const a = await getAssignments(id)
        setAssignments(a)
      } catch (err) {
        console.error(err)
        // toast.error('Error cargando datos del curso')
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    loadData()
  }, [id])

  const handleAddStudent = async () => {
      try {
          await addStudentManually(id, emailToAdd)
          toast.success('Estudiante agregado')
          setEmailToAdd('')
          setIsAddStudentOpen(false)
          loadData() // Refresh list
      } catch (error) {
          toast.error(error.message)
      }
  }

  if (loading) return <Loading message="Cargando..." />
  if (!course) return <div className="p-6">Curso no encontrado</div>

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <BookOpen className="text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600 mt-2">{course.description}</p>
            <div className="mt-4 inline-flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                <span className="text-sm font-medium text-green-800">Código de Invitación:</span>
                <span className="font-mono font-bold text-green-900">{course.invite_code}</span>
            </div>
          </div>
          <Button onClick={() => navigate(`/teacher/tasks/new/edit?courseId=${id}`)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Tarea
          </Button>
       </div>

       <Tabs defaultValue="assignments">
           <TabsList>
               <TabsTrigger value="assignments" className="flex gap-2"><FileText className="w-4 h-4"/> Tareas</TabsTrigger>
               <TabsTrigger value="students" className="flex gap-2"><Users className="w-4 h-4"/> Estudiantes</TabsTrigger>
           </TabsList>

           <TabsContent value="assignments" className="mt-6 space-y-4">
               {assignments.map(assign => (
                   <Card key={assign.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/teacher/reviews/${assign.id}`)}>
                       <CardHeader className="flex flex-row items-center justify-between pb-2">
                           <CardTitle className="text-lg font-bold">{assign.title}</CardTitle>
                           <Button variant="outline" size="sm" onClick={(e) => {
                               e.stopPropagation()
                               navigate(`/teacher/tasks/${assign.id}/edit`)
                           }}>
                               Editar
                           </Button>
                       </CardHeader>
                       <CardContent>
                           <p className="text-sm text-gray-500 mb-2">{assign.description}</p>
                           <div className="flex items-center gap-4 text-sm">
                               <span className="bg-gray-100 px-2 py-1 rounded">Vence: {new Date(assign.due_date).toLocaleDateString()}</span>
                               <span className="text-blue-600 font-medium flex items-center gap-1">
                                   <ClipboardList className="w-4 h-4" />
                                   Revisar Entregas
                               </span>
                           </div>
                       </CardContent>
                   </Card>
               ))}
               {assignments.length === 0 && <p className="text-gray-500 p-4">No hay tareas creadas.</p>}
           </TabsContent>

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
                      <CalendarIcon className="w-4 h-4 text-primary" /> {t.dueDate}
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
