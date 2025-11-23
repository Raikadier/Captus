import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCourses } from '../../hooks/useCourses'
import { useAssignments } from '../../hooks/useAssignments'
import { useCourseGroups } from '../../hooks/useCourseGroups'
import { useSubmissions } from '../../hooks/useSubmissions'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { toast } from 'sonner'
import { FileText, Users, Clock, Upload, CheckCircle } from 'lucide-react'

export default function StudentCourseDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getCourse } = useCourses()
  const { getAssignments } = useAssignments()
  const { getGroups, createGroup, addMember } = useCourseGroups()
  const { submitAssignment, getSubmissions } = useSubmissions()

  const [course, setCourse] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [groups, setGroups] = useState([])
  const [submissions, setSubmissions] = useState({}) // Map assignmentId -> submission
  const [loading, setLoading] = useState(true)

  // Modals state
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [fileUrl, setFileUrl] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const c = await getCourse(id)
        setCourse(c)
        const a = await getAssignments(id)
        setAssignments(a)
        const g = await getGroups(id)
        setGroups(g)

        // Load submissions for all assignments to check status
        const subsMap = {}
        for (let assign of a) {
            try {
               const sub = await getSubmissions(assign.id);
               // If it's a list (Student view returns list but usually 1 per student), take first
               if (Array.isArray(sub) && sub.length > 0) subsMap[assign.id] = sub[0];
               else if (!Array.isArray(sub) && sub) subsMap[assign.id] = sub;
            } catch (e) {
                // Ignore error if no submission
            }
        }
        setSubmissions(subsMap)

      } catch (err) {
        console.error(err)
        toast.error('Error cargando detalles del curso')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  const handleSubmit = async () => {
      if (!fileUrl) return toast.error('Debes ingresar una URL del archivo');

      let groupId = null;
      if (selectedAssignment.is_group_assignment) {
          // Find if user is in any group of this course
          // Logic: We have 'groups' loaded. Each group has 'members'.
          // We find the group where one member has student_id == user.id

          const myGroup = groups.find(g =>
              g.members && g.members.some(m => m.student_id === user.id)
          );

          if (!myGroup) {
              return toast.error('Debes pertenecer a un grupo para entregar esta tarea');
          }
          groupId = myGroup.id;
      }

      try {
          await submitAssignment({
              assignment_id: selectedAssignment.id,
              file_url: fileUrl,
              group_id: groupId
          });
          toast.success('Tarea entregada');
          setSelectedAssignment(null);
          // Reload submissions
          const sub = await getSubmissions(selectedAssignment.id);
          setSubmissions(prev => ({ ...prev, [selectedAssignment.id]: Array.isArray(sub) ? sub[0] : sub }));
      } catch (error) {
          toast.error(error.message);
      }
  }

  if (loading) return <div className="p-6">Cargando...</div>
  if (!course) return <div className="p-6">Curso no encontrado</div>

  return (
    <div className="p-6 space-y-6">
       <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-600 mt-2">{course.description}</p>
       </div>

       <Tabs defaultValue="assignments">
         <TabsList>
           <TabsTrigger value="assignments" className="flex gap-2"><FileText className="w-4 h-4"/> Tareas</TabsTrigger>
           <TabsTrigger value="groups" className="flex gap-2"><Users className="w-4 h-4"/> Grupos</TabsTrigger>
         </TabsList>

         <TabsContent value="assignments" className="mt-6 space-y-4">
            {assignments.length === 0 && <p className="text-gray-500">No hay tareas asignadas.</p>}
            {assignments.map(assign => {
                const submission = submissions[assign.id];
                const isSubmitted = !!submission;
                const isGraded = submission?.graded;

                return (
                    <Card key={assign.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{assign.title}</CardTitle>
                                    <CardDescription>{assign.is_group_assignment ? 'Grupal' : 'Individual'} • Vence: {new Date(assign.due_date).toLocaleDateString()}</CardDescription>
                                </div>
                                <div>
                                    {isGraded ? (
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">
                                            Nota: {submission.grade}
                                        </span>
                                    ) : isSubmitted ? (
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3"/> Entregado
                                        </span>
                                    ) : (
                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pendiente</span>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-sm">{assign.description}</p>

                            {!isSubmitted && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="sm" onClick={() => setSelectedAssignment(assign)}>
                                            <Upload className="w-4 h-4 mr-2"/> Entregar Tarea
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Entregar: {assign.title}</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>URL del Archivo (Drive, Dropbox, etc)</Label>
                                                <Input value={fileUrl} onChange={e => setFileUrl(e.target.value)} placeholder="https://..." />
                                            </div>
                                            <Button onClick={handleSubmit} className="w-full">Confirmar Entrega</Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            )}
                            {isSubmitted && (
                                <div className="text-sm bg-gray-50 p-3 rounded">
                                    <p className="font-medium">Tu entrega:</p>
                                    <a href={submission.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                                        {submission.file_url}
                                    </a>
                                    {submission.feedback && (
                                        <div className="mt-2 pt-2 border-t border-gray-200">
                                            <p className="font-medium text-gray-700">Retroalimentación:</p>
                                            <p className="text-gray-600">{submission.feedback}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )
            })}
         </TabsContent>

         <TabsContent value="groups" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groups.map(group => (
                    <Card key={group.id}>
                        <CardHeader>
                            <CardTitle>{group.name}</CardTitle>
                            <CardDescription>{group.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h4 className="text-sm font-medium mb-2">Miembros:</h4>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                                {group.members?.map(m => (
                                    <li key={m.student_id}>Estudiante ID: {m.student_id.slice(0,8)}...</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
                {groups.length === 0 && <p className="text-gray-500">No hay grupos formados.</p>}
            </div>
         </TabsContent>
       </Tabs>
    </div>
  )
}
