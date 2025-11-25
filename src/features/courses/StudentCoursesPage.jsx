import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Clock, ChevronRight, Plus } from 'lucide-react'
import { Button } from '../../ui/button'
import { useCourses } from '../../hooks/useCourses'
import { useEnrollments } from '../../hooks/useEnrollments'
import { toast } from 'sonner'
import { Input } from '../../ui/input'
import Loading from '../../ui/loading'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog'

export default function StudentCoursesPage() {
  const navigate = useNavigate()
  const { courses, loading, refresh } = useCourses()
  const { joinByCode } = useEnrollments()
  const [inviteCode, setInviteCode] = useState('')
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false)

  const handleJoin = async () => {
      try {
          await joinByCode(inviteCode);
          toast.success('Inscripción exitosa');
          setIsJoinDialogOpen(false);
          setInviteCode('');
          refresh();
      } catch (error) {
          toast.error(error.message || 'Error al inscribirse');
      }
  }

  if (loading) return <Loading message="Cargando cursos..." />

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-card rounded-xl shadow-sm p-6 mb-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Mis Cursos</h1>
              <p className="text-sm text-muted-foreground">Gestiona tus cursos inscritos</p>
            </div>
          </div>

          <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Unirse a un curso
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Unirse mediante código</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Código de invitación</label>
                        <Input
                            placeholder="Ej: A1B2C3"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleJoin} className="w-full">Unirse</Button>
                </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length === 0 && (
              <div className="col-span-3 text-center py-10 text-muted-foreground">
                  No estás inscrito en ningún curso. ¡Únete a uno!
              </div>
          )}
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-card rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer hover:scale-[1.02] duration-200"
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              <div
                className="w-full h-32 rounded-lg mb-4 bg-blue-500" // Fallback color
                style={{ backgroundColor: course.color || '#3b82f6' }}
              />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {course.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{course.professor}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progreso</span>
                  <span className="font-semibold text-foreground">
                    {course.progress}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Inscrito: {new Date(course.enrolled_at).toLocaleDateString()}</span>
                </div>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/courses/${course.id}`)
                  }}
                >
                  Ver curso
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
