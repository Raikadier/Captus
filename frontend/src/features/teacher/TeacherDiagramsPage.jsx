import React, { useState } from 'react';
import { GitBranch, Plus, FolderTree, FileText } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../ui/sheet';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';

const mockDiagrams = [
  { id: 1, name: 'Diagrama de Clases', course: 'Programación I', updatedAt: '2025-11-15' },
  { id: 2, name: 'Arquitectura del Proyecto', course: 'Bases de Datos', updatedAt: '2025-11-14' },
  { id: 3, name: 'Flujo de Evaluación', course: 'Matemáticas Aplicadas', updatedAt: '2025-11-13' },
];

const TeacherDiagramsPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
        <div className="flex items-start gap-3">
          <div className="bg-green-100 p-3 rounded-xl">
            <GitBranch className="text-green-600" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Diagramas</h1>
            <p className="text-sm text-gray-600">Gestiona diagramas y documentación visual</p>
          </div>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus size={18} className="mr-2" />
              Nuevo diagrama
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-6 w-full max-w-lg">
            <SheetHeader>
              <SheetTitle>Crear nuevo diagrama</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nombre</label>
                <Input className="mt-1" placeholder="Diagrama de clases" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Descripción</label>
                <Textarea rows={4} className="mt-1" placeholder="Describe el diagrama..." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Curso</label>
                <Input className="mt-1" placeholder="Programación I" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button onClick={() => setOpen(false)} className="bg-green-600 hover:bg-green-700 text-white">Crear</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDiagrams.map((diagram) => (
          <Card key={diagram.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FolderTree size={18} className="text-green-600" />
                {diagram.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <FileText size={14} className="text-gray-400" />
                Curso: {diagram.course}
              </p>
              <p className="text-xs text-gray-500">Actualizado: {diagram.updatedAt}</p>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm">Ver</Button>
                <Button variant="outline" size="sm">Editar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeacherDiagramsPage;
