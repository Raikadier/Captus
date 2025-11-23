import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSubmissions } from '../../hooks/useSubmissions'
import { useAssignments } from '../../hooks/useAssignments'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { Card, CardContent } from '../../ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog'
import Loading from '../../ui/loading'
import { toast } from 'sonner'
import { ArrowLeft, ExternalLink, CheckCircle, Clock } from 'lucide-react'

export default function TeacherReviewsPage() {
  const { studentId } = useParams()
  // studentId param name in router is confusing.
  // Route is `/teacher/reviews/:studentId`.
  // But usually we review an Assignment, not a student globally?
  // In `TeacherCourseDetailPage`, I linked to `/teacher/reviews/${assign.id}`.
  // So `studentId` here actually holds `assignmentId`.
  const assignmentId = studentId;

  const navigate = useNavigate()
  const { getSubmissions, gradeSubmission } = useSubmissions()
  const { getAssignment } = useAssignments()

  const [assignment, setAssignment] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  // Grading Modal State
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [grade, setGrade] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isGradeOpen, setIsGradeOpen] = useState(false)

  const loadData = async () => {
      try {
          const a = await getAssignment(assignmentId)
          setAssignment(a)
          const s = await getSubmissions(assignmentId)
          setSubmissions(s)
      } catch (e) {
          console.error(e)
          toast.error('Error cargando entregas')
      } finally {
          setLoading(false)
      }
  }

  useEffect(() => {
    loadData()
  }, [assignmentId])

  const handleGrade = async () => {
      try {
          if (!grade) return toast.error('Ingresa una nota');
          await gradeSubmission(selectedSubmission.id, { grade, feedback });
          toast.success('Calificación guardada');
          setIsGradeOpen(false);
          loadData(); // Refresh
      } catch (error) {
          toast.error(error.message);
      }
  }

  const openGradeModal = (sub) => {
      setSelectedSubmission(sub)
      setGrade(sub.grade || '')
      setFeedback(sub.feedback || '')
      setIsGradeOpen(true)
  }

  if (loading) return <Loading message="Cargando..." />

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-3">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <ListChecks className="text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Revisiones pendientes</h1>
          <p className="text-sm text-gray-600">Evalúa las entregas de tus estudiantes</p>
        </div>
      </div>

      <div className="space-y-3">
        {mockReviews.map((review) => (
          <div key={review.id} className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">Revisiones: {assignment?.title}</h1>
                <p className="text-gray-500">Total entregas: {submissions.length}</p>
            </div>
       </div>

       <div className="grid grid-cols-1 gap-4">
           {submissions.map(sub => (
               <Card key={sub.id} className="hover:shadow-sm transition-shadow">
                   <CardContent className="p-4 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                           <div className={`w-2 h-12 rounded-full ${sub.graded ? 'bg-green-500' : 'bg-yellow-500'}`} />
                           <div>
                               <h3 className="font-bold text-gray-900">
                                   {sub.student?.name || sub.student?.email || (sub.group ? `Grupo: ${sub.group.name}` : 'Desconocido')}
                               </h3>
                               <div className="text-sm text-gray-500 flex items-center gap-2">
                                   <Clock className="w-3 h-3" />
                                   Entregado: {new Date(sub.submitted_at).toLocaleString()}
                               </div>
                               <a href={sub.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline flex items-center gap-1 mt-1">
                                   <ExternalLink className="w-3 h-3" /> Ver archivo
                               </a>
                           </div>
                       </div>

                       <div className="flex items-center gap-4">
                           {sub.graded && (
                               <div className="text-right mr-4">
                                   <div className="text-2xl font-bold text-green-700">{sub.grade}</div>
                                   <div className="text-xs text-gray-500">Calificado</div>
                               </div>
                           )}

                           <Dialog open={isGradeOpen && selectedSubmission?.id === sub.id} onOpenChange={(open) => !open && setIsGradeOpen(false)}>
                               <DialogTrigger asChild>
                                   <Button onClick={() => openGradeModal(sub)}>
                                       {sub.graded ? 'Editar Nota' : 'Calificar'}
                                   </Button>
                               </DialogTrigger>
                               <DialogContent>
                                   <DialogHeader>
                                       <DialogTitle>Calificar Entrega</DialogTitle>
                                   </DialogHeader>
                                   <div className="space-y-4 py-4">
                                       <div className="space-y-2">
                                           <label className="text-sm font-medium">Calificación (0-100)</label>
                                           <Input
                                                type="number"
                                                value={grade}
                                                onChange={e => setGrade(e.target.value)}
                                                placeholder="Ej: 95"
                                           />
                                       </div>
                                       <div className="space-y-2">
                                           <label className="text-sm font-medium">Feedback (Opcional)</label>
                                           <Textarea
                                                value={feedback}
                                                onChange={e => setFeedback(e.target.value)}
                                                placeholder="Comentarios para el estudiante..."
                                           />
                                       </div>
                                       <Button onClick={handleGrade} className="w-full">Guardar Calificación</Button>
                                   </div>
                               </DialogContent>
                           </Dialog>
                       </div>
                   </CardContent>
               </Card>
           ))}
           {submissions.length === 0 && (
               <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                   No hay entregas para esta tarea aún.
               </div>
           )}
       </div>
    </div>
  )
}
