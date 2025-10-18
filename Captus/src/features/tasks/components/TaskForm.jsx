// Task form component for creating and editing tasks
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TaskForm = ({
  task = null,
  categories = [],
  priorities = [],
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    priority_id: '',
    due_date: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        category_id: task.category_id || '',
        priority_id: task.priority_id || '',
        due_date: task.due_date ? task.due_date.split('T')[0] : ''
      });
    }
  }, [task]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (formData.due_date && new Date(formData.due_date) < new Date()) {
      newErrors.due_date = 'La fecha límite no puede ser en el pasado';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Convert empty strings to null for optional fields
    const submitData = {
      ...formData,
      category_id: formData.category_id || null,
      priority_id: formData.priority_id || null,
      due_date: formData.due_date || null,
      description: formData.description.trim() || null
    };

    onSubmit(submitData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {task ? 'Editar Tarea' : 'Nueva Tarea'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Título *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Ingresa el título de la tarea"
            disabled={loading}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Ingresa una descripción opcional"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              id="category"
              value={formData.category_id}
              onChange={(e) => handleChange('category_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            >
              <option value="">Sin categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              Prioridad
            </label>
            <select
              id="priority"
              value={formData.priority_id}
              onChange={(e) => handleChange('priority_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            >
              <option value="">Sin prioridad</option>
              {priorities.map((priority) => (
                <option key={priority.id} value={priority.id}>
                  {priority.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-2">
              Fecha límite
            </label>
            <input
              type="date"
              id="due_date"
              value={formData.due_date}
              onChange={(e) => handleChange('due_date', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.due_date ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.due_date && (
              <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Guardando...' : (task ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;