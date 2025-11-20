'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Edit2, Trash2, Pin, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NoteDetailPage() {
  const router = useRouter()
  const params = useParams()
  const noteId = params.id as string
  const [isPinned, setIsPinned] = useState(false)

  // Mock data
  const note = {
    id: noteId,
    title: 'Apuntes de Cálculo - Derivadas',
    subject: 'Matemáticas III',
    content: `# Definición de derivada

La derivada de una función f(x) en un punto x=a se define como:

f'(a) = lim(h→0) [f(a+h) - f(a)] / h

## Reglas básicas:
- Derivada de una constante: d/dx(c) = 0
- Derivada de x^n: d/dx(x^n) = n·x^(n-1)
- Regla de la cadena: d/dx[f(g(x))] = f'(g(x))·g'(x)

## Ejemplos:
1. f(x) = x² → f'(x) = 2x
2. f(x) = 3x³ → f'(x) = 9x²`,
    lastEdited: '2024-11-14',
    pinned: false,
  }

  const handleDelete = () => {
    console.log('Deleting note:', noteId)
    router.push('/notes')
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Notas
        </Button>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{note.title}</h1>
                {isPinned && <Pin className="w-5 h-5 text-green-600 fill-green-600" />}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                  {note.subject}
                </span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Editado: {new Date(note.lastEdited).toLocaleDateString('es')}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPinned(!isPinned)}
              >
                <Pin className={`w-4 h-4 ${isPinned ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/notes/${noteId}/edit`)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
              {note.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
