// TaskForm - Form for creating and editing tasks
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TaskForm = ({ task, categories, priorities, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return {
      title: '',
      description: '',
      due_date: tomorrow.toISOString().split('T')[0], // Default to tomorrow
      priority_id: '1', // Default to "Baja" (1)
      category_id: '6' // Default to existing category (Personal = 6)
    };
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        due_date: task.due_date ? task.due_date.split('T')[0] : new Date().toISOString().split('T')[0],
        priority_id: task.priority_id || 1,
        category_id: task.category_id || 6 // Use existing category ID (Personal = 6)
      });
    }
  }, [task]);

  // Date quick buttons
  const setDate = (date) => {
    setFormData(prev => ({
      ...prev,
      due_date: date.toISOString().split('T')[0]
    }));
  };

  const handleToday = () => setDate(new Date());
  const handleTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow);
  };
  const handleWeekend = () => {
    const today = new Date();
    const daysUntilSaturday = (6 - today.getDay()) % 7;
    const saturday = new Date(today);
    saturday.setDate(today.getDate() + (daysUntilSaturday === 0 ? 7 : daysUntilSaturday));
    setDate(saturday);
  };
  const handleNextWeek = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setDate(nextWeek);
  };

  const handleInputChange = (field, value) => {
    console.log('📅 FORM INPUT CHANGE - Field:', field, 'Value:', value);

    if (field === 'due_date') {
      // Validate date is not in the past
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      console.log('📅 DATE VALIDATION - Selected:', selectedDate.toISOString(), 'Today:', today.toISOString());
      console.log('📅 DATE VALIDATION - Selected < Today:', selectedDate < today);

      if (selectedDate < today) {
        console.log('📅 DATE VALIDATION - BLOCKED: Date is in the past');
        setError('La fecha límite no puede ser anterior a hoy. Selecciona una fecha actual o futura.');
      } else {
        console.log('📅 DATE VALIDATION - ALLOWED: Date is valid');
        setError(''); // Clear error if date is valid
      }
    }

    if (field === 'category_id') {
      console.log('🏷️ CATEGORY CHANGE - New category_id:', value, 'Type:', typeof value);
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    console.log('📝 FORM DATA UPDATED - New formData:', JSON.stringify({
      ...formData,
      [field]: value
    }, null, 2));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('📤 FORM SUBMIT - Raw formData:', JSON.stringify(formData, null, 2));

    if (!formData.title.trim()) {
      console.log('❌ FORM SUBMIT - BLOCKED: Title is empty');
      alert('El título es obligatorio');
      return;
    }

    if (error) {
      console.log('❌ FORM SUBMIT - BLOCKED: Validation error');
      alert(error);
      return;
    }

    // Ensure priority_id and category_id are valid numbers - ALL tasks must have valid IDs
    const submitData = {
      ...formData,
      priority_id: formData.priority_id && formData.priority_id !== '' ? parseInt(formData.priority_id) : 1, // Default to "Baja" (1)
      category_id: formData.category_id && formData.category_id !== '' ? parseInt(formData.category_id) : 6, // Default to existing category (Personal = 6)
    };

    console.log('📤 FORM SUBMIT - Processed submitData:', JSON.stringify(submitData, null, 2));
    console.log('📤 FORM SUBMIT - Calling onSubmit with data');

    onSubmit(submitData);
  };

  const getPriorityColor = (priorityId) => {
    switch (priorityId) {
      case 1: return 'border-green-500 bg-green-50';  // Baja - Verde
      case 2: return 'border-orange-500 bg-orange-50'; // Media - Naranja
      case 3: return 'border-red-500 bg-red-50';      // Alta - Roja
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {task ? 'Editar Tarea' : 'Nueva Tarea'}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            placeholder="Ingresa el título de la tarea"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            placeholder="Describe la tarea (opcional)"
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha límite
          </label>
          <input
            type="date"
            value={formData.due_date}
            onInput={(e) => handleInputChange('due_date', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        {/* Quick date buttons */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            type="button"
            onClick={handleToday}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
            title="Establecer para hoy"
          >
            Hoy
          </button>
          <button
            type="button"
            onClick={handleTomorrow}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
            title="Establecer para mañana"
          >
            Mañana
          </button>
          <button
            type="button"
            onClick={handleWeekend}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
            title="Establecer para el fin de semana"
          >
            Fin de semana
          </button>
          <button
            type="button"
            onClick={handleNextWeek}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
            title="Establecer para la próxima semana"
          >
            Próxima semana
          </button>
        </div>

        {/* Priority and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prioridad
            </label>
            <select
              value={formData.priority_id}
              onChange={(e) => handleInputChange('priority_id', e.target.value ? parseInt(e.target.value) : 1)}
              className={`w-full px-3 py-2 border-2 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${getPriorityColor(formData.priority_id)}`}
            >
              {priorities.map((priority) => (
                <option key={`priority-${priority.id}`} value={priority.id}>
                  {priority.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => handleInputChange('category_id', e.target.value ? parseInt(e.target.value) : 6)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            >
              {categories.map((category) => (
                <option key={`category-${category.id}`} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {task ? 'Actualizar' : 'Crear'} Tarea
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
