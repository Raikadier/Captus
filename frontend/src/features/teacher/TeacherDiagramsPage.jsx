import React, { useState } from 'react'
import { GitBranch, Plus, Pencil, Eye, Trash2, Save, X } from 'lucide-react'
import { Button } from '../../ui/button'
import { Card } from '../../ui/card'
import { Textarea } from '../../ui/textarea'
import { Input } from '../../ui/input'
import { useTheme } from '../../context/themeContext'

const mockDiagrams = [
  { id: 1, title: 'Flujo de registro', updatedAt: '2025-11-18', content: 'graph TD\n  A[Usuario] --> B[Formulario]\n  B --> C[Validación]\n  C --> D[Registro exitoso]' },
  { id: 2, title: 'Arquitectura Captus', updatedAt: '2025-11-17', content: 'graph LR\n  A[Frontend] --> B[API]\n  B --> C[Base de Datos]\n  B --> D[Servicios externos]' },
]

export default function TeacherDiagramsPage() {
  const [diagrams, setDiagrams] = useState(mockDiagrams)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const { darkMode, compactView } = useTheme()

  const handleCreateNew = () => {
    setIsCreating(true)
    setNewTitle('')
    setNewContent('graph TD\n  A[Inicio] --> B[Fin]')
  }

  const handleSaveNew = () => {
    if (newTitle.trim()) {
      const newDiagram = {
        id: Math.max(...diagrams.map(d => d.id), 0) + 1,
        title: newTitle,
        updatedAt: new Date().toISOString().split('T')[0],
        content: newContent
      }
      setDiagrams([...diagrams, newDiagram])
      setIsCreating(false)
      setNewTitle('')
      setNewContent('')
    }
  }

  const handleCancelNew = () => {
    setIsCreating(false)
    setNewTitle('')
    setNewContent('')
  }

  const handleEdit = (id) => {
    const diagram = diagrams.find(d => d.id === id)
    if (diagram) {
      setEditingId(id)
      setNewTitle(diagram.title)
      setNewContent(diagram.content)
    }
  }

  const handleSaveEdit = () => {
    if (editingId !== null && newTitle.trim()) {
      setDiagrams(diagrams.map(d =>
        d.id === editingId
          ? { ...d, title: newTitle, content: newContent, updatedAt: new Date().toISOString().split('T')[0] }
          : d
      ))
      setEditingId(null)
      setNewTitle('')
      setNewContent('')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setNewTitle('')
    setNewContent('')
  }

  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de eliminar este diagrama?')) {
      setDiagrams(diagrams.filter(d => d.id !== id))
    }
  }

  return (
    <div className={`${compactView ? 'p-4' : 'p-6'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-2xl shadow-sm ${compactView ? 'p-4' : 'p-6'} ${compactView ? 'mb-4' : 'mb-6'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <GitBranch className="text-purple-600" size={24} />
              </div>
              <div>
                <h1 className={`${compactView ? 'text-xl' : 'text-2xl'} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Diagramas</h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gestiona diagramas Mermaid para tus cursos</p>
              </div>
            </div>
            {!isCreating && editingId === null && (
              <Button
                onClick={handleCreateNew}
                className={`bg-green-600 hover:bg-green-700 text-white ${darkMode ? 'bg-green-700 hover:bg-green-800' : ''}`}
              >
                <Plus size={18} className="mr-2" />
                Nuevo Diagrama
              </Button>
            )}
          </div>
        </div>

        {/* Editor (Create or Edit) */}
        {(isCreating || editingId !== null) && (
          <Card className={`p-6 mb-6 shadow-sm ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              {isCreating ? 'Crear Nuevo Diagrama' : 'Editar Diagrama'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'} mb-2`}>
                  Título del Diagrama
                </label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Flujo de autenticación"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'} mb-2`}>
                    Código Mermaid
                  </label>
                  <Textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="graph TD&#10;  A[Inicio] --> B[Proceso]&#10;  B --> C[Fin]"
                    className="h-64 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'} mb-2`}>
                    Vista Previa
                  </label>
                  <Card className={`h-64 flex items-center justify-center bg-gray-50 border-2 border-dashed ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}>
                    <div className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-400'}`}>
                      <Eye size={32} className="mx-auto mb-2" />
                      <p className="text-sm">Vista previa del diagrama</p>
                      <p className="text-xs">(Parser pendiente de implementar)</p>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  onClick={isCreating ? handleCancelNew : handleCancelEdit}
                  variant="outline"
                  className={darkMode ? 'text-white hover:bg-gray-700' : ''}
                >
                  <X size={16} className="mr-2" />
                  Cancelar
                </Button>
                <Button
                  onClick={isCreating ? handleSaveNew : handleSaveEdit}
                  className={`bg-green-600 hover:bg-green-700 text-white ${darkMode ? 'bg-green-700 hover:bg-green-800' : ''}`}
                >
                  <Save size={16} className="mr-2" />
                  Guardar
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Lista de Diagramas */}
        {!isCreating && editingId === null && (
          <Card className={`shadow-sm overflow-hidden ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`bg-gray-50 border-b border-gray-200 ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                      Título
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                      Última Modificación
                    </th>
                    <th className={`px-6 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className={`bg-white divide-y divide-gray-200 ${darkMode ? 'bg-gray-800 divide-gray-700' : ''}`}>
                  {diagrams.map((diagram) => (
                    <tr key={diagram.id} className={`hover:bg-gray-50 transition-colors ${darkMode ? 'hover:bg-gray-700' : ''}`}>
                      <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'bg-gray-700' : ''}`}>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <GitBranch className="text-purple-600" size={16} />
                          </div>
                          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {diagram.title}
                          </span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'bg-gray-700' : ''}`}>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{diagram.updatedAt}</span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right space-x-2 ${darkMode ? 'bg-gray-700' : ''}`}>
                        <Button
                          onClick={() => handleEdit(diagram.id)}
                          variant="outline"
                          size="sm"
                          className={darkMode ? 'text-white hover:bg-gray-600' : ''}
                        >
                          <Pencil size={14} className="mr-1" />
                          Editar
                        </Button>
                        <Button
                          onClick={() => handleDelete(diagram.id)}
                          variant="outline"
                          size="sm"
                          className={`text-red-600 hover:text-red-700 hover:bg-red-50 ${darkMode ? 'text-red-400 hover:text-red-500 hover:bg-red-600' : ''}`}
                        >
                          <Trash2 size={14} className="mr-1" />
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {diagrams.length === 0 && (
                    <tr>
                      <td colSpan={3} className={`px-6 py-12 text-center ${darkMode ? 'bg-gray-700' : ''}`}>
                        <GitBranch size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className={`text-gray-500 mb-2 ${darkMode ? 'text-gray-400' : ''}`}>No hay diagramas creados</p>
                        <p className={`text-sm text-gray-400 ${darkMode ? 'text-gray-500' : ''}`}>Crea tu primer diagrama para empezar</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
