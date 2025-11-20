import React from 'react'
import { BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'

const mockStats = [
  { label: 'Tareas revisadas', value: 48 },
  { label: 'Promedio de entrega', value: '85%' },
  { label: 'Cursos activos', value: 5 },
]

export default function TeacherStatsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-3">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <BarChart3 className="text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estadísticas del profesor</h1>
          <p className="text-sm text-gray-600">Rendimiento de cursos y tareas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockStats.map((s) => (
          <Card key={s.label}>
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
