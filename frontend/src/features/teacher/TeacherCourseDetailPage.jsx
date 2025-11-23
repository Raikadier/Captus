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

  if (loading) return <div className="p-6">Cargando...</div>
  if (!course) return <div className="p-6">Curso no encontrado</div>

  return (
    <div className="p-6 space-y-6">
       {/* Header */}
       <div className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-start">
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

           <TabsContent value="students" className="mt-6">
               <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                   <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                       <h3 className="font-semibold">Lista de Estudiantes ({students.length})</h3>
                       <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
                           <DialogTrigger asChild>
                               <Button variant="outline" size="sm">
                                   <Plus className="w-4 h-4 mr-2" /> Agregar manualmente
                               </Button>
                           </DialogTrigger>
                           <DialogContent>
                               <DialogHeader>
                                   <DialogTitle>Agregar Estudiante</DialogTitle>
                               </DialogHeader>
                               <div className="space-y-4 py-4">
                                   <div className="space-y-2">
                                       <label className="text-sm font-medium">Email del Estudiante</label>
                                       <Input
                                            placeholder="estudiante@ejemplo.com"
                                            value={emailToAdd}
                                            onChange={e => setEmailToAdd(e.target.value)}
                                       />
                                   </div>
                                   <Button onClick={handleAddStudent} className="w-full">Agregar al Curso</Button>
                               </div>
                           </DialogContent>
                       </Dialog>
                   </div>
                   <table className="w-full text-sm text-left">
                       <thead className="bg-gray-50 text-gray-700">
                           <tr>
                               <th className="px-6 py-3">Nombre/Email</th>
                               <th className="px-6 py-3">Fecha Inscripción</th>
                           </tr>
                       </thead>
                       <tbody>
                           {students.map(student => (
                               <tr key={student.id} className="border-b hover:bg-gray-50">
                                   <td className="px-6 py-4 font-medium text-gray-900">
                                       {student.name || student.email}
                                       <div className="text-xs text-gray-500">{student.email}</div>
                                   </td>
                                   <td className="px-6 py-4">
                                       {new Date(student.enrolled_at).toLocaleDateString()}
                                   </td>
                               </tr>
                           ))}
                           {students.length === 0 && (
                               <tr>
                                   <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                                       Aún no hay estudiantes inscritos. Comparte el código <b>{course.invite_code}</b>.
                                   </td>
                               </tr>
                           )}
                       </tbody>
                   </table>
               </div>
           </TabsContent>
       </Tabs>
    </div>
  )
}
