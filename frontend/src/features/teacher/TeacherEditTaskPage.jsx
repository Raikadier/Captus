import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { ArrowLeft, Pencil } from 'lucide-react';

const mockTask = {
  id: 1,
  title: 'Ensayo sobre el capítulo 2',
  description: 'Redactar un ensayo con los conceptos principales del capítulo 2.',
  dueDate: '2025-11-22',
  course: 'Programación I',
  priority: 'high',
};

const TeacherEditTaskPage = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const [title, setTitle] = useState(mockTask.title);
  const [description, setDescription] = useState(mockTask.description);
  const [priority, setPriority] = useState(mockTask.priority);
  const [dueDate, setDueDate] = useState(mockTask.dueDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: llamar backend/supabase para actualizar
    navigate('/teacher/tasks');
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
        <ArrowLeft size={16} className="mr-2" />
        Volver
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Pencil size={20} className="text-green-600" />
            Editar tarea
          </CardTitle>
          <p className="text-sm text-gray-500">ID: {taskId}</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-gray-700">Título</label>
              <Input className="mt-1" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Descripción</label>
              <Textarea
                className="mt-1"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Prioridad</label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecciona prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="low">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Fecha de entrega</label>
                <Input className="mt-1" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                Guardar cambios
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherEditTaskPage;
