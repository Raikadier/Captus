import React, { useEffect, useState } from 'react';

const TITLE_SUGGESTIONS = [
  'Estudiar capítulo 3',
  'Resolver ejercicios de repaso',
  'Preparar presentación',
  'Investigar tema del proyecto',
];

const DESCRIPTION_SUGGESTIONS = [
  'Dedicar 45 minutos a leer y tomar notas.',
  'Resolver mínimo 10 ejercicios y anotar dudas.',
  'Crear diapositivas y practicar la exposición.',
  'Leer artículos y resumir hallazgos clave.',
];

const AddTaskForm = ({ onSubmit, onCancel, categories = [], priorities = [], loading = false }) => {

  const [placeholders, setPlaceholders] = useState({ title: '', description: '' });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    priority_id: '',
    due_date: '',
  });

  useEffect(() => {
    const randomTitle = TITLE_SUGGESTIONS[Math.floor(Math.random() * TITLE_SUGGESTIONS.length)];
    const randomDescription = DESCRIPTION_SUGGESTIONS[Math.floor(Math.random() * DESCRIPTION_SUGGESTIONS.length)];
    setPlaceholders({ title: randomTitle, description: randomDescription });
    setFormData((prev) => ({ ...prev, title: randomTitle, description: randomDescription }));
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input
            className="w-full px-3 py-2 border rounded-lg"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder={placeholders.title}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            className="w-full px-3 py-2 border rounded-lg"
            rows={3}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder={placeholders.description}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.category_id}
              onChange={(e) => handleChange('category_id', e.target.value)}
            >
              <option value="">Sin categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.priority_id}
              onChange={(e) => handleChange('priority_id', e.target.value)}
            >
              <option value="">Sin prioridad</option>
              {priorities.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de entrega</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.due_date}
              onChange={(e) => handleChange('due_date', e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            className="px-4 py-2 rounded-lg border text-gray-700"
            onClick={() => onCancel?.()}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            disabled={loading}
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskForm;
