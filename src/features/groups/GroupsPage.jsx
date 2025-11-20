import React, { useState, useEffect } from 'react'
import { Users, Plus, MessageCircle, Calendar, CheckSquare, Search, X, ChevronDown } from 'lucide-react'
import { Button } from '../../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu'

export default function GroupsPage() {
  const [groups, setGroups] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [availableStudents, setAvailableStudents] = useState([])
  const [selectedStudents, setSelectedStudents] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    const mockGroups = [
      {
        id: 1,
        name: 'Equipo de Desarrollo',
        description: 'Grupo para coordinar tareas de desarrollo',
        members: 5,
        tasks: 12,
        created_at: '2024-01-15T10:30:00Z',
        lastActivity: '2024-10-18T14:30:00Z',
      },
      {
        id: 2,
        name: 'Proyecto Marketing',
        description: 'Campañas y estrategias de marketing',
        members: 3,
        tasks: 8,
        created_at: '2024-02-20T09:15:00Z',
        lastActivity: '2024-10-17T16:45:00Z',
      },
      {
        id: 3,
        name: 'Estudio y Aprendizaje',
        description: 'Grupo para compartir recursos de estudio',
        members: 7,
        tasks: 15,
        created_at: '2024-03-10T11:00:00Z',
        lastActivity: '2024-10-18T12:20:00Z',
      },
    ]
    setGroups(mockGroups)

    const mockStudents = [
      { id: 1, name: 'María García', email: 'maria@universidad.edu', course: 'Matemáticas III' },
      { id: 2, name: 'Juan Pérez', email: 'juan@universidad.edu', course: 'Matemáticas III' },
      { id: 3, name: 'Ana López', email: 'ana@universidad.edu', course: 'Matemáticas III' },
      { id: 4, name: 'Carlos Rodríguez', email: 'carlos@universidad.edu', course: 'Física II' },
      { id: 5, name: 'Laura Martínez', email: 'laura@universidad.edu', course: 'Física II' },
      { id: 6, name: 'Pedro Sánchez', email: 'pedro@universidad.edu', course: 'Literatura Española' },
    ]
    setAvailableStudents(mockStudents)
  }, [])

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

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      alert('Por favor ingresa un nombre para el grupo')
      return
    }
    if (!selectedCourse) {
      alert('Por favor selecciona un curso')
      return
    }

    console.log('[v0] Creating group:', {
      name: groupName,
      description: groupDescription,
      course: selectedCourse,
      members: selectedStudents.map(s => s.id)
    })

    alert(`Grupo "${groupName}" creado con ${selectedStudents.length} miembros`)

    setShowCreateForm(false)
    setGroupName('')
    setGroupDescription('')
    setSelectedCourse('')
    setSelectedStudents([])
    setSearchInput('')
  }

  const handleJoinGroup = (groupId) => {
    alert(`Unirse al grupo ${groupId} próximamente`)
  }

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredStudents = selectedCourse
    ? availableStudents.filter(student => student.course === selectedCourse)
    : []

  const suggestedStudents = filteredStudents.filter(student =>
    student.name.toLowerCase().includes(searchInput.toLowerCase()) &&
    !selectedStudents.find(s => s.id === student.id)
  )

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
                <p className="text-sm text-muted-foreground">Colabora con tu equipo</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Nuevo Grupo
            </button>
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
              onClick={() => setSelectedGroup(group)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{group.name}</h3>
                      <p className="text-sm text-muted-foreground">{group.members} miembros</p>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{group.description}</p>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-1">
                    <CheckSquare className="w-4 h-4" />
                    <span>{group.tasks} tareas</span>
                  </div>
                  <span className="text-xs">Activo {new Date(group.lastActivity).toLocaleDateString('es-ES')}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleJoinGroup(group.id)
                    }}
                    className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Unirse
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedGroup(group)
                    }}
                    className="px-4 py-2 border border-border text-foreground rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Ver
                  </button>
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
              {searchQuery ? 'No se encontraron grupos con ese criterio' : 'Crea tu primer grupo para comenzar a colaborar'}
            </p>
            {!searchQuery && (
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

        {showCreateForm && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-foreground">Crear Nuevo Grupo</h3>
                  <button
                    onClick={() => setShowCreateForm(false)}
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
                            {selectedCourse || 'Selecciona un curso'}
                          </span>
                          <ChevronDown size={16} className="ml-2 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-full min-w-[400px]">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedCourse('')
                            setSelectedStudents([])
                          }}
                          className={!selectedCourse ? 'bg-primary/10 text-primary' : ''}
                        >
                          Selecciona un curso
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedCourse('Matemáticas III')
                            setSelectedStudents([])
                          }}
                          className={selectedCourse === 'Matemáticas III' ? 'bg-primary/10 text-primary' : ''}
                        >
                          Matemáticas III
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedCourse('Física II')
                            setSelectedStudents([])
                          }}
                          className={selectedCourse === 'Física II' ? 'bg-primary/10 text-primary' : ''}
                        >
                          Física II
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedCourse('Literatura Española')
                            setSelectedStudents([])
                          }}
                          className={selectedCourse === 'Literatura Española' ? 'bg-primary/10 text-primary' : ''}
                        >
                          Literatura Española
                        </DropdownMenuItem>
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
                      setGroupName('')
                      setGroupDescription('')
                      setSelectedCourse('')
                      setSelectedStudents([])
                      setSearchInput('')
                    }}
                    className="flex-1 px-4 py-2 text-sm font-medium text-foreground bg-muted border border-border rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateGroup}
                    className="flex-1 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Crear Grupo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{selectedGroup.members}</div>
                    <div className="text-sm text-primary font-medium">Miembros</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{selectedGroup.tasks}</div>
                    <div className="text-sm text-blue-700 font-medium">Tareas</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">
                      {new Date(selectedGroup.created_at).toLocaleDateString('es-ES')}
                    </div>
                    <div className="text-sm text-purple-700 font-medium">Creado</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-foreground mb-4">Funcionalidades del Grupo</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <MessageCircle className="w-6 h-6 text-blue-600 mb-2" />
                      <h5 className="font-semibold text-foreground mb-1">Chat del Grupo</h5>
                      <p className="text-sm text-muted-foreground">Comunicación en tiempo real con los miembros</p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <CheckSquare className="w-6 h-6 text-primary mb-2" />
                      <h5 className="font-semibold text-foreground mb-1">Tareas Compartidas</h5>
                      <p className="text-sm text-muted-foreground">Asigna y sigue tareas del equipo</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <Calendar className="w-6 h-6 text-purple-600 mb-2" />
                      <h5 className="font-semibold text-foreground mb-1">Calendario Compartido</h5>
                      <p className="text-sm text-muted-foreground">Coordina eventos y reuniones</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                      <Users className="w-6 h-6 text-orange-600 mb-2" />
                      <h5 className="font-semibold text-foreground mb-1">Gestión de Miembros</h5>
                      <p className="text-sm text-muted-foreground">Invita y administra miembros del grupo</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleJoinGroup(selectedGroup.id)}
                    className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    Unirse al Grupo
                  </button>
                  <button
                    onClick={() => setSelectedGroup(null)}
                    className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium"
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
