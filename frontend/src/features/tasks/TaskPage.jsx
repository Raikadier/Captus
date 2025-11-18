// TaskPage - Diseño como la plantilla con mejor UI
import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search as SearchIcon, Bell, Calendar as CalendarIcon } from 'lucide-react';
import { useTasks } from './hooks/useTasks';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';
import StreakWidget from '../../shared/components/StreakWidget';
import apiClient from '../../shared/api/client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';

const TaskPage = () => {
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion
  } = useTasks();

  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    searchText: '',
    categoryId: '',
    priorityId: '',
    completed: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchReferenceData();
  }, []);

  const fetchReferenceData = async () => {
    try {
      const [categoriesRes, prioritiesRes] = await Promise.all([
        apiClient.get('/categories'),
        apiClient.get('/priorities')
      ]);
      setCategories(categoriesRes.data);
      setPriorities(prioritiesRes.data);
    } catch (error) {
      console.error('Error fetching reference data:', error);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await updateTask(editingTask.id, taskData);
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleCancelForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({ ...prev, [filterKey]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchText: '',
      categoryId: '',
      priorityId: '',
      completed: ''
    });
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.searchText && !task.title.toLowerCase().includes(filters.searchText.toLowerCase()) &&
        !task.description?.toLowerCase().includes(filters.searchText.toLowerCase())) {
      return false;
    }
    if (filters.categoryId && task.category_id !== parseInt(filters.categoryId)) {
      return false;
    }
    if (filters.priorityId && task.priority_id !== parseInt(filters.priorityId)) {
      return false;
    }
    if (filters.completed !== '' && task.completed !== (filters.completed === 'true')) {
      return false;
    }
    return true;
  });

  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando tareas...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <header className="sticky top-0 bg-white rounded-xl shadow-sm p-6 mb-6 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Tareas</h1>
            <p className="text-gray-600 mt-1">Gestiona tus tareas y mantén tu racha de productividad</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-gray-300 relative bg-transparent">
              <Bell size={18} className="text-gray-500" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-600 items-center justify-center text-[10px] text-white font-bold">
                  3
                </span>
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* Streak Widget */}
      <div className="mb-6">
        <StreakWidget />
      </div>

      {/* Actions Bar */}
      <Card className="p-6 bg-white rounded-xl shadow-sm mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={() => setShowTaskForm(true)} className="bg-green-600 hover:bg-green-700">
              <Plus size={18} className="mr-2" />
              Nueva Tarea
            </Button>
            <Button
              variant="outline"
              className="border-gray-300 bg-white"
              onClick={() => setShowFilters((v) => !v)}
              title="Filtros"
            >
              <Filter size={18} className="mr-2 text-gray-500" />
              Filtros
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            {filteredTasks.length} de {tasks.length} tareas
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar tareas..."
              value={filters.searchText}
              onChange={(e) => handleFilterChange('searchText', e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  value={filters.categoryId}
                  onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 bg-white"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridad
                </label>
                <select
                  value={filters.priorityId}
                  onChange={(e) => handleFilterChange('priorityId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 bg-white"
                >
                  <option value="">Todas las prioridades</option>
                  {priorities.map((priority) => (
                    <option key={priority.id} value={priority.id}>
                      {priority.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={filters.completed}
                  onChange={(e) => handleFilterChange('completed', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 bg-white"
                >
                  <option value="">Todos</option>
                  <option value="false">Pendientes</option>
                  <option value="true">Completadas</option>
                </select>
              </div>

              <div className="flex md:items-end">
                <Button variant="ghost" onClick={clearFilters} className="text-gray-700">
                  Limpiar filtros
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Task Form */}
      {(showTaskForm || editingTask) && (
        <div className="mb-6">
          <TaskForm
            task={editingTask}
            categories={categories}
            priorities={priorities}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="todas" className="w-full">
        <TabsList className="bg-white mb-6 rounded-xl">
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="pendiente">Pendientes</TabsTrigger>
          <TabsTrigger value="en-progreso">En Progreso</TabsTrigger>
          <TabsTrigger value="completada">Completadas</TabsTrigger>
        </TabsList>

        <TabsContent value="todas">
          {/* Tasks List */}
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <Card className="p-12 text-center bg-white rounded-xl shadow-sm">
                <div className="text-gray-500 text-lg mb-2">
                  {tasks.length === 0 ? 'No tienes tareas aún' : 'No se encontraron tareas con los filtros aplicados'}
                </div>
                <p className="text-gray-400">
                  {tasks.length === 0 ? 'Crea tu primera tarea para comenzar' : 'Prueba cambiando los filtros'}
                </p>
              </Card>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  categories={categories}
                  priorities={priorities}
                  onToggleComplete={(taskId) => toggleTaskCompletion(taskId)}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="pendiente">
          <div className="space-y-4">
            {filteredTasks
              .filter((t) => t.completed === false)
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  categories={categories}
                  priorities={priorities}
                  onToggleComplete={(taskId) => toggleTaskCompletion(taskId)}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
          </div>
        </TabsContent>

        {/* Until we have a separate status field, treat "En Progreso" as pendientes (no completadas). */}
        <TabsContent value="en-progreso">
          <div className="space-y-4">
            {filteredTasks
              .filter((t) => t.completed === false)
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  categories={categories}
                  priorities={priorities}
                  onToggleComplete={(taskId) => toggleTaskCompletion(taskId)}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="completada">
          <div className="space-y-4">
            {filteredTasks
              .filter((t) => t.completed === true)
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  categories={categories}
                  priorities={priorities}
                  onToggleComplete={(taskId) => toggleTaskCompletion(taskId)}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskPage;
