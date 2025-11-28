import React, { useState, useEffect } from 'react'
import { Users, Plus, Search, X, ChevronDown, Trash2 } from 'lucide-react'
import { Button } from '../../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu'
import { useCourseGroups } from '../../hooks/useCourseGroups'
import { useCourses } from '../../hooks/useCourses'
import { useEnrollments } from '../../hooks/useEnrollments'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'sonner'
import Loading from '../../ui/loading'

export default function GroupsPage() {
  const { user } = useAuth()
  const role = user?.user_metadata?.role || 'student'
  const isTeacher = role === 'teacher'

  const { getStudentGroups, createGroup, addMember, getGroupDetails, removeMember, loading: groupsLoading } = useCourseGroups()
  const { courses, loading: coursesLoading } = useCourses()
  const { getStudents } = useEnrollments()

  const [groups, setGroups] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Form states
  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [availableStudents, setAvailableStudents] = useState([])
  const [selectedStudents, setSelectedStudents] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Load groups on mount
  useEffect(() => {
    loadGroups()
  }, [])

  const loadGroups = async () => {
    try {
      setLoading(true)
      const data = await getStudentGroups()
      setGroups(data || [])
    } catch (error) {
      console.error('Error loading groups:', error)
      toast.error('Error al cargar los grupos')
    } finally {
      setLoading(false)
    }
  }

  // Load students when a course is selected
  useEffect(() => {
    if (selectedCourse) {
      loadStudentsForCourse(selectedCourse.id)
    } else {
      setAvailableStudents([])
    }
  }, [selectedCourse])

  const loadStudentsForCourse = async (courseId) => {
    try {
      const students = await getStudents(courseId)
      setAvailableStudents(students || [])
    } catch (error) {
      console.error('Error loading students:', error)
      toast.error('Error al cargar estudiantes del curso')
    }
  }

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error('Por favor ingresa un nombre para el grupo')
      return
    }
    if (!selectedCourse) {
      toast.error('Por favor selecciona un curso')
      return
    }

    try {
      const newGroup = await createGroup({
        course_id: selectedCourse.id,
        name: groupName,
        description: groupDescription
      })

      // Add members to the group
      for (const student of selectedStudents) {
        try {
          await addMember(newGroup.id, student.id)
        } catch (error) {
          console.error(`Error adding member ${student.name}:`, error)
          toast.error(`Error al agregar a ${student.name}`)
        }
      }

      toast.success(`Grupo "${groupName}" creado exitosamente`)
      setShowCreateForm(false)
      resetForm()
      loadGroups()
    } catch (error) {
      console.error('Error creating group:', error)
      toast.error(error.message || 'Error al crear el grupo')
    }
  }

  const resetForm = () => {
    setGroupName('')
    setGroupDescription('')
    setSelectedCourse(null)
    setSelectedStudents([])
    setSearchInput('')
  }

  const handleViewGroup = async (group) => {
    try {
      const details = await getGroupDetails(group.id)
      setSelectedGroup(details)
    } catch (error) {
      console.error('Error loading group details:', error)
      toast.error('Error al cargar detalles del grupo')
    }
  }

  const handleRemoveMember = async (groupId, studentId, studentName) => {
    if (!confirm(`¿Estás seguro de eliminar a ${studentName} del grupo?`)) {
      return
    }

    try {
      await removeMember(groupId, studentId)
      toast.success('Miembro eliminado del grupo')
      // Reload group details
      const details = await getGroupDetails(groupId)
      setSelectedGroup(details)
      loadGroups()
    } catch (error) {
      console.error('Error removing member:', error)
      toast.error(error.message || 'Error al eliminar miembro')
    }
  }

  const addStudent = (student) => {
    if (!selectedStudents.find(s => s.id === student.id)) {
      setSelectedStudents([...selectedStudents, student])
    }
    setSearchInput('')
    setShowSuggestions(false)
  }

  const removeStudent = (studentId) => {
    setSelectedStudents(selectedStudents.filter(s => s.id !== studentId))
  }

  const filteredGroups = groups.filter(group =>
    group.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const suggestedStudents = availableStudents.filter(student =>
    student.name?.toLowerCase().includes(searchInput.toLowerCase()) &&
    !selectedStudents.find(s => s.id === student.id)
  )

  if (loading || coursesLoading) {
    return <Loading message="Cargando grupos..." />
  }

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Mis Grupos</h1>
                <p className="text-sm text-muted-foreground">
                  {isTeacher ? 'Gestiona los grupos de tus cursos' : 'Colabora con tu equipo'}
                </p>
              </div>
            </div>
            {isTeacher && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium"
              >
                <Plus className="w-5 h-5" />
                Nuevo Grupo
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar grupos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className="bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-border"
              onClick={() => handleViewGroup(group)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{group.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {group.members?.length || 0} miembros
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {group.description || 'Sin descripción'}
                </p>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="text-xs">
                    Creado {new Date(group.created_at).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-16 bg-card rounded-xl shadow-sm border border-border">
            <Users className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No hay grupos</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? 'No se encontraron grupos con ese criterio'
                : isTeacher
                  ? 'Crea tu primer grupo para organizar a tus estudiantes'
                  : 'Aún no perteneces a ningún grupo'}
            </p>
            {!searchQuery && isTeacher && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2 font-medium"
              >
                <Plus className="w-5 h-5" />
                Crear Grupo
              </button>
            )}
          </div>
        )}

        {/* Create Group Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-foreground">Crear Nuevo Grupo</h3>
                  <button
                    onClick={() => {
                      setShowCreateForm(false)
                      resetForm()
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Nombre del Grupo</label>
                    <input
                      type="text"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
                      placeholder="Ingresa el nombre del grupo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Descripción</label>
                    <textarea
                      rows={3}
                      value={groupDescription}
                      onChange={(e) => setGroupDescription(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none bg-background text-foreground placeholder:text-muted-foreground"
                      placeholder="Describe el propósito del grupo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Curso</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between bg-background hover:bg-muted border-border text-foreground"
                        >
                          <span className="text-sm">
                            {selectedCourse ? selectedCourse.title : 'Selecciona un curso'}
                          </span>
                          <ChevronDown size={16} className="ml-2 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-full min-w-[400px]">
                        {courses.map((course) => (
                          <DropdownMenuItem
                            key={course.id}
                            onClick={() => {
                              setSelectedCourse(course)
                              setSelectedStudents([])
                            }}
                            className={selectedCourse?.id === course.id ? 'bg-primary/10 text-primary' : ''}
                          >
                            {course.title}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {selectedCourse && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Añadir Integrantes ({selectedStudents.length} seleccionados)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={searchInput}
                          onChange={(e) => {
                            setSearchInput(e.target.value)
                            setShowSuggestions(true)
                          }}
                          onFocus={() => setShowSuggestions(true)}
                          placeholder="Escribe el nombre del estudiante..."
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
                        />

                        {showSuggestions && searchInput && suggestedStudents.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {suggestedStudents.map((student) => (
                              <div
                                key={student.id}
                                onClick={() => addStudent(student)}
                                className="px-4 py-2 hover:bg-primary/10 cursor-pointer transition-colors border-b border-border last:border-b-0"
                              >
                                <div className="text-sm font-medium text-foreground">{student.name}</div>
                                <div className="text-xs text-muted-foreground">{student.email}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {selectedStudents.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {selectedStudents.map((student) => (
                            <div
                              key={student.id}
                              className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                            >
                              <span>{student.name}</span>
                              <button
                                onClick={() => removeStudent(student.id)}
                                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {searchInput && suggestedStudents.length === 0 && (
                        <p className="mt-2 text-sm text-muted-foreground">No se encontraron estudiantes</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowCreateForm(false)
                      resetForm()
                    }}
                    className="flex-1 px-4 py-2 text-sm font-medium text-foreground bg-muted border border-border rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateGroup}
                    disabled={groupsLoading}
                    className="flex-1 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {groupsLoading ? 'Creando...' : 'Crear Grupo'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Group Details Modal */}
        {selectedGroup && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-border">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{selectedGroup.name}</h3>
                      <p className="text-muted-foreground text-sm">{selectedGroup.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedGroup(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-bold text-foreground mb-4">
                    Miembros ({selectedGroup.members?.length || 0})
                  </h4>
                  <div className="space-y-2">
                    {selectedGroup.members?.map((member) => (
                      <div
                        key={member.student_id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg bg-background"
                      >
                        <div>
                          <p className="font-medium text-foreground">{member.student?.name}</p>
                          <p className="text-sm text-muted-foreground">{member.student?.email}</p>
                        </div>
                        {isTeacher && (
                          <button
                            onClick={() => handleRemoveMember(selectedGroup.id, member.student_id, member.student?.name)}
                            className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    {(!selectedGroup.members || selectedGroup.members.length === 0) && (
                      <p className="text-muted-foreground text-center py-4">No hay miembros en este grupo</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedGroup(null)}
                    className="flex-1 px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
