import React from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'

const events = [
  { id: 1, title: 'Clase magistral', date: '2025-11-24', time: '10:00 AM' },
  { id: 2, title: 'Entrega parcial', date: '2025-11-26', time: '11:59 PM' },
]

export default function TeacherCalendarPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-3">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <CalendarIcon className="text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendario docente</h1>
          <p className="text-sm text-gray-600">Eventos académicos próximos</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Próximos eventos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {events.map((e) => (
            <div key={e.id} className="p-3 border border-gray-200 rounded-lg">
              <p className="font-medium text-gray-900">{e.title}</p>
              <p className="text-sm text-gray-600">{e.date} • {e.time}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
