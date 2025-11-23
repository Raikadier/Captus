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
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mis Cursos</h1>
              <p className="text-sm text-gray-600">Gestiona tus cursos inscritos</p>
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
              <div className="col-span-3 text-center py-10 text-gray-500">
                  No estás inscrito en ningún curso. ¡Únete a uno!
              </div>
          )}
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer hover:scale-[1.02] duration-200"
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              <div
                className="w-full h-32 rounded-lg mb-4 bg-blue-500" // Fallback color
                style={{ backgroundColor: course.color || '#3b82f6' }}
              />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {course.title}
              </h3>
              {/* Note: Backend might not return teacher name directly in flat generic map,
                  might need join or fix repo. Assuming repo returns joined object or similar.
                  If not, we show what we have.
                  The repo findByStudent joins 'courses:course_id (*)', so we have title/description.
                  We might lack teacher name unless we join users.
                  Let's check repo: It does `courses:course_id (*)`.
                  It does NOT join teacher name.
                  For now, we display description or nothing.
              */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Inscrito: {new Date(course.enrolled_at).toLocaleDateString()}</span>
                </div>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
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
