import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { ArrowLeft, StickyNote } from 'lucide-react';

const mockNote = {
  id: 1,
  title: 'Apuntes de Cálculo - Derivadas',
  content:
    'Definición de derivada: límite del cociente incremental. Reglas básicas: potencia, producto, cociente, cadena...',
  subject: 'Matemáticas III',
  lastEdited: '2025-10-24',
  tags: ['Cálculo', 'Derivadas', 'Examen'],
};

const NoteDetailPage = () => {
  const navigate = useNavigate();
  const { noteId } = useParams();

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
        <ArrowLeft size={16} className="mr-2" />
        Volver
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <StickyNote size={20} className="text-green-600" />
            {mockNote.title}
          </CardTitle>
          <p className="text-sm text-gray-500">ID nota: {noteId}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {mockNote.subject}
            </Badge>
            {mockNote.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                {tag}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{mockNote.content}</p>
          <p className="text-xs text-gray-500">Última edición: {mockNote.lastEdited}</p>
          <div className="flex gap-2">
            <Button className="bg-green-600 hover:bg-green-700 text-white">Editar</Button>
            <Button variant="outline">Eliminar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoteDetailPage;
