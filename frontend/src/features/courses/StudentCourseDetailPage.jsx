import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { ArrowLeft, BookOpen, Calendar as CalendarIcon, ClipboardList } from 'lucide-react';

const mockCourse = {
  id: 1,
  name: 'Programación I',
  teacher: 'Prof. García',
  lessons: [
    { id: 1, title: 'Introducción a JavaScript', date: '2025-11-18' },
    { id: 2, title: 'Funciones y Scope', date: '2025-11-20' },
    { id: 3, title: 'DOM y Eventos', date: '2025-11-25' },
  ],
  tasks: [
    { id: 1, title: 'Ensayo cap. 2', dueDate: '2025-11-22', status: 'Pendiente' },
    { id: 2, title: 'Proyecto parcial', dueDate: '2025-11-28', status: 'En progreso' },
  ],
};

const StudentCourseDetailPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  return (
    <div className="p-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate('/courses')} className="text-gray-600 hover:text-gray-900">
        <ArrowLeft size={16} className="mr-2" />
        Volver a cursos
      </Button>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-green-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{mockCourse.name}</h1>
            <p className="text-sm text-gray-600">Docente: {mockCourse.teacher}</p>
            <p className="text-xs text-gray-500 mt-1">ID curso: {courseId}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarIcon size={18} className="text-green-600" />
              Próximas clases
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockCourse.lessons.map((lesson) => (
              <div key={lesson.id} className="p-3 rounded-lg border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{lesson.title}</p>
                  <p className="text-sm text-gray-600">Fecha: {lesson.date}</p>
                </div>
                <Button variant="outline" size="sm">Ver</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ClipboardList size={18} className="text-blue-600" />
              Tareas del curso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockCourse.tasks.map((task) => (
              <div key={task.id} className="p-3 rounded-lg border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{task.title}</p>
                  <p className="text-sm text-gray-600">Entrega: {task.dueDate}</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {task.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentCourseDetailPage;
