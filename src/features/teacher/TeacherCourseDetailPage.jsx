import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Users, ClipboardList, PlusCircle, Megaphone, ArrowLeft, FileText, BookOpen, X } from 'lucide-react';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../ui/breadcrumb';
import { Badge } from '../../ui/badge';

const mockCourse = {
  id: 1,
  name: 'Programación I',
  students: [
    { id: 1, name: 'María Gómez' },
    { id: 2, name: 'Juan Pérez' },
    { id: 3, name: 'Ana López' },
    { id: 4, name: 'Carlos Ruiz' },
  ],
  tasks: [
    { id: 1, title: 'Ensayo cap. 2', dueDate: '2025-11-22' },
    { id: 2, title: 'Proyecto parcial', dueDate: '2025-11-28' },
    { id: 3, title: 'Trabajo práctico 1', dueDate: '2025-12-05' },
  ],
};

const mockAnnouncements = [
  {
    id: 1,
    title: 'Recordatorio: Entrega del Proyecto Final',
    content: 'Recuerden que la entrega del proyecto final es el próximo viernes. No se aceptarán entregas tardías.',
    type: 'important',
    date: '2025-11-18',
  },
  {
    id: 2,
    title: 'Clase de Repaso',
    content: 'Habrá una clase de repaso el jueves a las 3 PM en el aula 205.',
    type: 'general',
    date: '2025-11-17',
  },
];

const TeacherCourseDetailPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcementType, setAnnouncementType] = useState('general');

  const handleSendAnnouncement = () => {
    if (announcementTitle.trim() && announcementContent.trim()) {
      // TODO: replace with API call
      setShowAnnouncementModal(false);
      setAnnouncementTitle('');
      setAnnouncementContent('');
      setAnnouncementType('general');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/teacher">Panel Profesor</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/teacher/courses">Cursos</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{mockCourse.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <Button variant="ghost" onClick={() => navigate('/teacher/courses')} className="mb-4 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Mis Cursos
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{mockCourse.name}</h1>
            <p className="text-sm text-gray-500">{mockCourse.students.length} estudiantes inscritos</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button onClick={() => navigate(`/teacher/courses/${courseId}/assignments/new`)} className="bg-green-600 hover:bg-green-700 text-white">
            <PlusCircle className="w-4 h-4 mr-2" />
            Crear tarea
          </Button>
          <Button onClick={() => navigate(`/teacher/reviews`)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <ClipboardList className="w-4 h-4 mr-2" />
            Revisiones
          </Button>
          <Button onClick={() => navigate(`/teacher/diagrams`)} className="bg-purple-600 hover:bg-purple-700 text-white">
            <FileText className="w-4 h-4 mr-2" />
            Ver diagramas
          </Button>
          <Button onClick={() => setShowAnnouncementModal(true)} className="bg-orange-600 hover:bg-orange-700 text-white">
            <Megaphone className="w-4 h-4 mr-2" />
            Enviar anuncio
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="w-5 h-5 text-green-600" />
              Estudiantes Inscritos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockCourse.students.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                  <div className="font-medium text-gray-900">{s.name}</div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Activo
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ClipboardList className="w-5 h-5 text-blue-600" />
              Tareas del curso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockCourse.tasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                <div>
                  <p className="font-semibold text-gray-900">{t.title}</p>
                  <p className="text-sm text-gray-500">Entrega: {t.dueDate}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate(`/teacher/tasks/${t.id}/edit`)}>
                  Editar
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Megaphone className="w-5 h-5 text-orange-600" />
            Anuncios del Curso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockAnnouncements.map((a) => (
            <div key={a.id} className="p-4 rounded-lg border border-gray-100 bg-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      a.type === 'important'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }
                  >
                    {a.type === 'important' ? 'Importante' : 'General'}
                  </Badge>
                  <p className="text-xs text-gray-500">{a.date}</p>
                </div>
                <Button variant="ghost" size="icon">
                  <X size={16} />
                </Button>
              </div>
              <p className="font-semibold text-gray-900">{a.title}</p>
              <p className="text-sm text-gray-600 mt-1">{a.content}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Nuevo Anuncio</h2>
                <p className="text-sm text-gray-500">Envía un mensaje a todos los estudiantes</p>
              </div>
              <button onClick={() => setShowAnnouncementModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Título</label>
                <Input value={announcementTitle} onChange={(e) => setAnnouncementTitle(e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Mensaje</label>
                <Textarea rows={4} value={announcementContent} onChange={(e) => setAnnouncementContent(e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Tipo</label>
                <Select value={announcementType} onValueChange={setAnnouncementType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="important">Importante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setShowAnnouncementModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSendAnnouncement} className="bg-green-600 hover:bg-green-700 text-white">
                Enviar anuncio
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCourseDetailPage;
