import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Calendar as CalendarIcon,
  PlusCircle,
  ListCheck,
  BarChart3,
  Network,
  ClipboardList,
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

const mockCourses = [
  { id: 1, name: 'Matemáticas Aplicadas', students: 32, pendingTasks: 4 },
  { id: 2, name: 'Programación I', students: 28, pendingTasks: 7 },
];

const mockUpcomingEvents = [
  { id: 1, title: 'Revisión de proyecto', date: '2025-11-20', time: '3:00 PM' },
  { id: 2, title: 'Entrega parcial', date: '2025-11-22', time: '11:59 PM' },
];

const mockPendingReviews = [
  { id: 1, student: 'María Gómez', task: 'Ensayo cap. 2', course: 'Programación I' },
  { id: 2, student: 'Juan Pérez', task: 'Problemas del tema 3', course: 'Matemáticas Aplicadas' },
];

const TeacherHomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-start space-x-4">
          <div className="bg-green-100 p-3 rounded-xl">
            <BookOpen className="text-green-600" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bienvenido Profesor</h1>
            <p className="text-gray-600 mt-1">Revisa tus cursos y actividades académicas</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Accesos Rápidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 flex-wrap">
              <Button onClick={() => navigate('/teacher/courses')}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Crear curso
              </Button>
              <Button variant="outline" onClick={() => navigate('/teacher/tasks')}>
                <ClipboardList className="mr-2 h-4 w-4" />
                Ver tareas
              </Button>
              <Button variant="outline" onClick={() => navigate('/teacher/reviews')}>
                <ListCheck className="mr-2 h-4 w-4" />
                Revisiones pendientes
              </Button>
              <Button variant="outline" onClick={() => navigate('/teacher/stats')}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Estadísticas
              </Button>
              <Button variant="outline" onClick={() => navigate('/teacher/diagrams')}>
                <Network className="mr-2 h-4 w-4" />
                Diagramas
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Courses overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <BookOpen size={20} className="mr-2 text-green-600" />
              Cursos Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockCourses.map((course) => (
                <Card key={course.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">{course.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Users size={16} className="mr-2 text-gray-400" />
                        {course.students} estudiantes
                      </div>
                      <div className="flex items-center text-gray-600">
                        <ListCheck size={16} className="mr-2 text-gray-400" />
                        {course.pendingTasks} tareas por revisar
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4"
                      onClick={() => navigate(`/teacher/courses/${course.id}`)}
                    >
                      Ver curso
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <ListCheck size={20} className="mr-2 text-green-600" />
              Revisiones Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockPendingReviews.map((review) => (
                <Card key={review.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{review.student}</h3>
                    <p className="text-sm text-gray-600 mb-1">{review.task}</p>
                    <p className="text-xs text-gray-500 mb-3">{review.course}</p>
                    <Button
                      size="sm"
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => navigate(`/teacher/reviews/${review.id}`)}
                    >
                      Revisar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <CalendarIcon size={20} className="mr-2 text-green-600" />
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockUpcomingEvents.map((event) => (
                <Card key={event.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                        <CalendarIcon size={20} className="text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                        <p className="text-sm text-gray-600">{event.date}</p>
                        <p className="text-sm text-gray-500">{event.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherHomePage;
