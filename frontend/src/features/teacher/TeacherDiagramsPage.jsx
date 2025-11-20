import React from 'react'
import { GitBranch } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'

export default function TeacherDiagramsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-3">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <GitBranch className="text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Diagramas</h1>
          <p className="text-sm text-gray-600">Visualizaciones académicas</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">No hay diagramas disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Conecta el backend para mostrar diagramas de curso.</p>
        </CardContent>
      </Card>
    </div>
  )
}
