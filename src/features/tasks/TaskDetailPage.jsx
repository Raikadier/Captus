import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { ArrowLeft, Calendar as CalendarIcon, CheckSquare, Clock } from 'lucide-react';

const mockTask = {
  id: 1,
  title: 'Ensayo sobre el capítulo 2',
  course: 'Programación I',
  description: 'En este ensayo se discuten los conceptos principales del capítulo 2...',
  dueDate: '2025-11-22',
  status: 'En progreso',
  priority: 'Alta',
};

const TaskDetailPage = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
        <ArrowLeft size={16} className="mr-2" />
        Volver
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CheckSquare size={20} className="text-green-600" />
            {mockTask.title}
          </CardTitle>
          <p className="text-sm text-gray-500">ID tarea: {taskId}</p>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-700">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{mockTask.course}</Badge>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Prioridad: {mockTask.priority}</Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{mockTask.status}</Badge>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <CalendarIcon size={16} className="text-green-600" />
            <span><strong>Fecha de entrega:</strong> {mockTask.dueDate}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={16} className="text-gray-500" />
            <span>Asignada recientemente</span>
          </div>
          <p className="leading-relaxed text-gray-800">{mockTask.description}</p>
          <div className="flex gap-2">
            <Button className="bg-green-600 hover:bg-green-700 text-white">Marcar como completada</Button>
            <Button variant="outline">Editar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskDetailPage;
