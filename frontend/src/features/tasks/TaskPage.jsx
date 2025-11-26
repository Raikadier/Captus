// TaskPage - Diseño como la plantilla con mejor UI
import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search as SearchIcon, Bell, Calendar as CalendarIcon, AlertTriangle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useTasks } from './hooks/useTasks';
import { useSubTasks } from '../../hooks/useSubTasks';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';
import { MiniStreakWidget } from '../../shared/components/StreakWidget';
import CategoryManagement from '../categories/CategoryManagement';
import apiClient from '../../shared/api/client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../ui/dialog';
import Loading from '../../ui/loading';
import './TaskTabs.css';

const TaskPage = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'categories' ? 'categories' : 'tasks';

  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    refetch
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
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    task: null
  });
  const [tasksWithSubTasks, setTasksWithSubTasks] = useState(new Set());

  useEffect(() => {
    fetchReferenceData();
  }, []);

  useEffect(() => {
    checkTasksWithSubTasks();
  }, [tasks]);

  const fetchReferenceData = async () => {
    try {
      const [categoriesRes, prioritiesRes] = await Promise.all([
        apiClient.get('/categories'),
        apiClient.get('/priorities')
      ]);
      setCategories(categoriesRes.data?.data || categoriesRes.data || []);
      setPriorities(prioritiesRes.data?.data || prioritiesRes.data || []);
    } catch (error) {
      console.error('Error fetching reference data:', error);
    }
  };

  const checkTasksWithSubTasks = async () => {
    if (tasks.length === 0) return;

    try {
      const response = await apiClient.get('/subtasks/tasks/with-subtasks');
      if (response.data.success) {
        const taskIdsWithSubTasks = new Set(response.data.data);
        setTasksWithSubTasks(taskIdsWithSubTasks);
      } else {
        console.error('Error fetching tasks with subtasks:', response.data.message);
        setTasksWithSubTasks(new Set());
      }
    } catch (error) {
      console.error('Error checking tasks with subtasks:', error);
      setTasksWithSubTasks(new Set());
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

  const handleDeleteTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    setDeleteDialog({
      isOpen: true,
      task: task
    });
  };

  const confirmDeleteTask = async () => {
    if (deleteDialog.task) {
      try {
        await deleteTask(deleteDialog.task.id);
        setDeleteDialog({ isOpen: false, task: null });
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const cancelDeleteTask = () => {
    setDeleteDialog({ isOpen: false, task: null });
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
    if (filters.completed !== '') {
      if (filters.completed === 'overdue') {
        // Mostrar solo tareas vencidas (no completadas y con fecha límite pasada)
        const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.completed;
        if (!isOverdue) return false;
      } else {
        // Filtro normal de completadas/pendientes
        const isCompleted = filters.completed === 'true';
        if (task.completed !== isCompleted) return false;
      }
    }
    return true;
  });

  if (loading && tasks.length === 0) {
    return <Loading message="Cargando tareas..." />;
  }

  return (
    <div className="p-8 bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-card rounded-xl shadow-sm p-6 mb-6 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {activeTab === 'tasks' ? 'Mis Tareas' : 'Categorías'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {activeTab === 'tasks'
                ? 'Gestiona tus tareas y mantén tu racha de productividad'
                : 'Organiza tus tareas con categorías personalizadas'
              }
            </p>
          </div>
        </div>
      </header>

      {/* Show Streak Widget and Task Controls only in tasks tab */}
      {activeTab === 'tasks' && (
        <>
          {/* Mini Streak Widget */}
          <div className="mb-6">
            <MiniStreakWidget />
          </div>

          {/* Actions Bar */}
          <Card className="p-6 bg-card rounded-xl shadow-sm mb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Button onClick={() => setShowTaskForm(true)} className="bg-primary hover:bg-primary/90">
                  <Plus size={18} className="mr-2" />
                  Nueva Tarea
                </Button>
                <Button
                  variant="outline"
                  className="border-input bg-background"
                  onClick={() => setShowFilters((v) => !v)}
                  title="Filtros"
                >
                  <Filter size={18} className="mr-2 text-muted-foreground" />
                  Filtros
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredTasks.length} de {tasks.length} tareas
              </div>
            </div>

            {/* Search */}
            <div className="mt-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Buscar tareas..."
                  value={filters.searchText}
                  onChange={(e) => handleFilterChange('searchText', e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Categoría
                    </label>
                    <select
                      value={filters.categoryId}
                      onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white"
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
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Prioridad
                    </label>
                    <select
                      value={filters.priorityId}
                      onChange={(e) => handleFilterChange('priorityId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white"
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
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Estado
                    </label>
                    <select
                      value={filters.completed}
                      onChange={(e) => handleFilterChange('completed', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white"
                    >
                      <option value="">Todos</option>
                      <option value="false">Pendientes</option>
                      <option value="true">Completadas</option>
                      <option value="overdue">Expiradas</option>
                    </select>
                  </div>

                  <div className="flex md:items-end">
                    <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
                      Limpiar filtros
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </>
      )}

      {/* Task Form - Only show in tasks tab */}
      {activeTab === 'tasks' && (showTaskForm || editingTask) && (
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

      {/* Main Tabs */}
      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList className="task-main-tabs bg-card mb-6 rounded-xl p-1 shadow-sm">
          <TabsTrigger
            value="tasks"
            className="tab-trigger px-6 py-2.5 rounded-lg font-medium data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            <span className="tab-icon">📝</span> Mis Tareas
          </TabsTrigger>
          <TabsTrigger
            value="categories"
            className="tab-trigger px-6 py-2.5 rounded-lg font-medium data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            <span className="tab-icon">🏷️</span> Categorías
          </TabsTrigger>
        </TabsList>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="tab-content space-y-6">
          {/* Sub-tabs for task status */}
          <Tabs defaultValue="todas" className="w-full">
            <TabsList className="task-sub-tabs bg-muted mb-4 rounded-lg p-1">
              <TabsTrigger
                value="todas"
                className="tab-trigger px-4 py-2 rounded-md text-sm font-medium"
              >
                <span className="tab-icon">📋</span> Todas
              </TabsTrigger>
              <TabsTrigger
                value="pendiente"
                className="tab-trigger px-4 py-2 rounded-md text-sm font-medium"
              >
                <span className="tab-icon">⏳</span> Pendientes
              </TabsTrigger>
              <TabsTrigger
                value="con-subtareas"
                className="tab-trigger px-4 py-2 rounded-md text-sm font-medium"
              >
                <span className="tab-icon">📋</span> Con Subtareas
              </TabsTrigger>
              <TabsTrigger
                value="completada"
                className="tab-trigger px-4 py-2 rounded-md text-sm font-medium"
              >
                <span className="tab-icon">✅</span> Completadas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="todas">
              <div className="space-y-4">
                {filteredTasks.length === 0 ? (
                  <Card className="p-12 text-center bg-card rounded-xl shadow-sm">
                    <div className="text-muted-foreground text-lg mb-2">
                      {tasks.length === 0 ? 'No tienes tareas aún' : 'No se encontraron tareas con los filtros aplicados'}
                    </div>
                    <p className="text-muted-foreground">
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
                      onRefreshTasks={refetch}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="con-subtareas">
              <div className="space-y-4">
                {filteredTasks
                  .filter((task) => {
                    // Mostrar solo tareas no completadas que tienen subtareas
                    return !task.completed && tasksWithSubTasks.has(task.id);
                  })
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
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="tab-content">
          <CategoryManagement />
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.isOpen} onOpenChange={(open) => !open && cancelDeleteTask()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirmar Eliminación
            </DialogTitle>
            <DialogDescription className="text-left">
              ¿Estás seguro de que quieres eliminar la tarea <strong>"{deleteDialog.task?.title}"</strong>?
              <br /><br />
              <span className="text-red-600 font-medium">
                ⚠️ Esta acción no se puede deshacer y la tarea será removida permanentemente de tu lista.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDeleteTask}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteTask}>
              Eliminar Tarea
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskPage;
