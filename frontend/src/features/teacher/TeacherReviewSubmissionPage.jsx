import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { Input } from '../../ui/input';
import { FileCheck, ArrowLeft } from 'lucide-react';

const mockSubmission = {
  id: 1,
  student: 'María Gómez',
  task: 'Ensayo cap. 2',
  course: 'Programación I',
  submittedAt: '2025-11-19 14:30',
  contentPreview: 'En este ensayo se discuten los conceptos principales del capítulo 2...',
};

const TeacherReviewSubmissionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <Button variant="ghost" onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
        <ArrowLeft size={16} className="mr-2" />
        Volver
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileCheck size={20} className="text-green-600" />
            Revisar entrega
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <p><span className="font-semibold">Estudiante:</span> {mockSubmission.student}</p>
            <p><span className="font-semibold">Curso:</span> {mockSubmission.course}</p>
            <p><span className="font-semibold">Tarea:</span> {mockSubmission.task}</p>
            <p><span className="font-semibold">Fecha de entrega:</span> {mockSubmission.submittedAt}</p>
          </div>

          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600 whitespace-pre-line">{mockSubmission.contentPreview}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Calificación</label>
              <Input type="number" min="0" max="100" className="mt-1" placeholder="Ej. 90" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Retroalimentación</label>
              <Textarea rows={4} className="mt-1" placeholder="Escribe comentarios para el estudiante..." />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">Enviar revisión</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherReviewSubmissionPage;
