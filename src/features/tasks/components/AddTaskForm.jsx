// AddTaskForm - Equivalent to frmAddTask.cs
// Form for creating new tasks with all the original features
import React, { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { X, RefreshCw } from 'lucide-react';

const AddTaskForm = ({ onClose, onTaskAdded }) => {
  const { createTask, categories, priorities, loading } = useTasks();

  // Random title suggestions (equivalent to TitleTaskRandom array)
  const titleSuggestions = [
    "Estudiar para el parcial de Programacion III",
    "Estudiar para el parcial de Electromagnetismo",
    "Organizar apuntes de clase",
    "Limpiar mi sitio de estudio",
    "Ir al gym",
    "Leer un capítulo del libro de programación",
    "Preparar presentación para la clase",
    "Lavar la ropa",
    "Ver API's para implementar a mi proyecto",
    "Hacer presupuesto semanal",
    "Revisar tareas en AulaWeb",
    "Asistir a clase virtual de Ingeniería de Software",
    "Realizar el proyecto de seminario",
    "Organizar horario semanal",
    "Planear comidas de la semana",
    "Hacer lista de compras",
    "Limpiar la habitación",
    "Preparar la presentación del proyecto",
    "Revisar correos electrónicos",
    "Hacer seguimiento a tareas pendientes"
  ];

  const descriptionSuggestions = [
    "Aquí puedes describir mejor tus ideas...",
    "Pasos que debo seguir para esta tarea...",
    "Aquí puedes colocar puntos clave de la tarea...",
    "Resumen del tema para estudiar..."
  ];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: new Date().toISOString().split('T')[0],
    priority_id: 1,
    category_id: 1
  });

  const [placeholders, setPlaceholders] = useState({
    title: '',
    description: ''
  });

  // Initialize with random suggestions
  useEffect(() => {
    const randomTitle = titleSuggestions[Math.floor(Math.random() * titleSuggestions.length)];
    const randomDescription = descriptionSuggestions[Math.floor(Math.random() * descriptionSuggestions.length)];

    setPlaceholders({
      title: randomTitle,
      description: randomDescription
    });

    setFormData(prev => ({
      ...prev,
      title: randomTitle,
      description: randomDescription
    }));
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTitleFocus = () => {
    if (formData.title === placeholders.title) {
      setFormData(prev => ({ ...prev, title: '' }));
    }
  };

  const handleTitleBlur = () => {
    if (formData.title.trim() === '') {
      setFormData(prev => ({ ...prev, title: placeholders.title }));
    }
  };

  const handleDescriptionFocus = () => {
    if (formData.description === placeholders.description) {
      setFormData(prev => ({ ...prev, description: '' }));
    }
  };

  const handleDescriptionBlur = () => {
    if (formData.description.trim() === '') {
      setFormData(prev => ({ ...prev, description: placeholders.description }));
    }
  };

  // Date quick buttons (equivalent to btnToday, btnTomorrow, etc.)
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

  const refreshTitle = () => {
    const randomTitle = titleSuggestions[Math.floor(Math.random() * titleSuggestions.length)];
    setPlaceholders(prev => ({ ...prev, title: randomTitle }));
    setFormData(prev => ({ ...prev, title: randomTitle }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title.trim() || formData.title === placeholders.title) {
      alert('El título es obligatorio');
      return;
    }

    try {
      const taskData = {
        ...formData,
        title: formData.title === placeholders.title ? '' : formData.title.trim(),
        description: formData.description === placeholders.description ? '' : formData.description.trim()
      };

      await createTask(taskData);
      onTaskAdded?.();
      onClose();
    } catch (error) {
      alert('Error al crear la tarea: ' + error.message);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  // Priority color mapping (equivalent to cbPriority_SelectedIndexChanged)
  const getPriorityColor = (priorityId) => {
    switch (priorityId) {
      case 1: return 'bg-red-200 border-red-500'; // Alta
      case 2: return 'bg-orange-200 border-orange-500'; // Media
      case 3: return 'bg-green-200 border-green-500'; // Baja
      default: return 'bg-gray-200 border-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header with logo and close button */}
        <div className="bg-green-100 p-4 rounded-t-lg flex items-center justify-between">
          <img src="/LogoCaptusAddTask.png" alt="Captus Logo" className="h-12" />
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form content */}
        <div className="p-6">
          {/* Title input */}
          <div className="mb-4 relative">
            <textarea
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              onFocus={handleTitleFocus}
              onBlur={handleTitleBlur}
              className="w-full p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              rows="2"
              style={{ fontFamily: 'Arial', fontSize: '14px' }}
            />
            <button
              onClick={refreshTitle}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              title="Refrescar tarea"
            >
              <RefreshCw size={20} />
            </button>
          </div>

          {/* Description input */}
          <div className="mb-4">
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              onFocus={handleDescriptionFocus}
              onBlur={handleDescriptionBlur}
              className="w-full p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              rows="4"
              style={{ fontFamily: 'Segoe UI', fontSize: '14px', fontWeight: 'bold' }}
            />
          </div>

          {/* Date picker and quick buttons */}
          <div className="mb-4">
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => handleInputChange('due_date', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              style={{ fontFamily: 'Segoe UI', fontSize: '12px' }}
            />
          </div>

          {/* Quick date buttons */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={handleToday}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
              title="Establecer para hoy"
            >
              Hoy
            </button>
            <button
              onClick={handleTomorrow}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
              title="Establecer para mañana"
            >
              Mañana
            </button>
            <button
              onClick={handleWeekend}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
              title="Establecer para el fin de semana"
            >
              Fin de semana
            </button>
            <button
              onClick={handleNextWeek}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
              title="Establecer para la próxima semana"
            >
              Próxima semana
            </button>
          </div>

          {/* Priority and Category selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <select
                value={formData.priority_id}
                onChange={(e) => handleInputChange('priority_id', parseInt(e.target.value))}
                className={`w-full p-3 border-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${getPriorityColor(formData.priority_id)}`}
                style={{ fontFamily: 'Century Gothic', fontSize: '14px' }}
              >
                {priorities.map(priority => (
                  <option key={priority.id} value={priority.id}>
                    {priority.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={formData.category_id}
                onChange={(e) => handleInputChange('category_id', parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                style={{ fontFamily: 'Century Gothic', fontSize: '14px' }}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 justify-end">
            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              style={{ fontFamily: 'Century Gothic', fontSize: '14px' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
              style={{ fontFamily: 'Century Gothic', fontSize: '14px' }}
            >
              {loading ? 'Creating...' : 'Add Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTaskForm;
