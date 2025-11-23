import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ListChecks } from 'lucide-react'
import { Button } from '../../ui/button'

const mockReviews = [
  { id: 1, student: 'María Gómez', task: 'Ensayo cap. 2', course: 'Programación I' },
  { id: 2, student: 'Juan Pérez', task: 'Problemas tema 3', course: 'Matemáticas Aplicadas' },
]

export default function TeacherReviewsPage() {
  const navigate = useNavigate()

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
              <p className="text-lg font-semibold text-gray-900">{review.student}</p>
              <p className="text-sm text-gray-600">{review.task} • {review.course}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate(`/teacher/reviews/${review.id}`)}>
              Revisar
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
