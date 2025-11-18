import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Calendar, Pencil, FolderOpen, Plus } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';

const mockCreatedTasks = [
  { id: 1, title: 'Ensayo sobre el capítulo 2', course: 'Programación I', dueDate: '2025-11-22', submissions: 18, totalStudents: 28 },
  { id: 2, title: 'Problemas del Tema 3', course: 'Matemáticas Aplicadas', dueDate: '2025-11-24', submissions: 30, totalStudents: 32 },
  { id: 3, title: 'Proyecto final - Primera entrega', course: 'Programación I', dueDate: '2025-11-28', submissions: 15, totalStudents: 28 },
  { id: 4, title: 'Quiz de repaso', course: 'Matemáticas Aplicadas', dueDate: '2025-11-25', submissions: 25, totalStudents: 32 },
];

const TeacherTasksCreatedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <ClipboardList className="text-green-600" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tareas Creadas</h1>
              <p className="text-gray-600 mt-1">Gestiona todas las tareas que has creado para tus cursos</p>
            </div>
          </div>
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => navigate('/teacher/tasks/new')}>
            <Plus size={18} className="mr-2" />
            Crear tarea
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockCreatedTasks.map((task) => (
          <Card key={task.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                    {task.title}
                  </CardTitle>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                    {task.course}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-gray-600">
                <Calendar size={18} className="mr-2 text-gray-400" />
                <span className="text-sm">
                  <span className="font-medium">Fecha de entrega:</span> {task.dueDate}
                </span>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div className="flex items-center">
                  <FolderOpen size={18} className="mr-2 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Entregas</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {task.submissions} / {task.totalStudents}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => navigate(`/teacher/reviews?course=${encodeURIComponent(task.course)}`)}
                >
                  <FolderOpen size={16} className="mr-2" />
                  Revisar entregas
                </Button>
                <Button variant="outline" onClick={() => navigate(`/teacher/tasks/${task.id}/edit`)}>
                  <Pencil size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockCreatedTasks.length === 0 && (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardList size={48} className="text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay tareas creadas</h3>
            <p className="text-gray-600 mb-4 text-center">
              Comienza creando tu primera tarea para tus cursos
            </p>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => navigate('/teacher/tasks/new')}>
              <Plus size={18} className="mr-2" />
              Crear primera tarea
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeacherTasksCreatedPage;
