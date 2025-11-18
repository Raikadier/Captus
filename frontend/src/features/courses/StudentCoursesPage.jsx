import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { BookOpen, Users, ListChecks } from 'lucide-react';

const mockCourses = [
  { id: 1, name: 'Programación I', teacher: 'Prof. García', progress: 75, tasks: 5 },
  { id: 2, name: 'Matemáticas Aplicadas', teacher: 'Prof. Martínez', progress: 60, tasks: 4 },
  { id: 3, name: 'Historia Moderna', teacher: 'Prof. López', progress: 40, tasks: 3 },
  { id: 4, name: 'Bases de Datos', teacher: 'Prof. Pérez', progress: 50, tasks: 6 },
];

const StudentCoursesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Cursos</h1>
            <p className="text-sm text-gray-600">Explora tus cursos activos</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/courses/${course.id}`)}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900">{course.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">Docente: {course.teacher}</p>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <Users size={16} className="text-green-600" />
                  Avance: {course.progress}%
                </span>
                <span className="flex items-center gap-2">
                  <ListChecks size={16} className="text-orange-600" />
                  {course.tasks} tareas
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="h-2 rounded-full bg-green-600" style={{ width: `${course.progress}%` }} />
              </div>
              <Button variant="outline" className="w-full" onClick={() => navigate(`/courses/${course.id}`)}>
                Ver curso
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentCoursesPage;
