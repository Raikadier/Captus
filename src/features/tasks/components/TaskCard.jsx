// TaskCard - Equivalent to individual task display in frmTask.cs
import React from 'react';
import { CheckCircle, Circle, Calendar, Tag, AlertTriangle } from 'lucide-react';

const TaskCard = ({
  task,
  categories = [],
  priorities = [],
  onToggleComplete,
  onEdit,
  onDelete,
  showActions = true
}) => {
  const category = categories.find(c => c.id === task.category_id);
  const priority = priorities.find(p => p.id === task.priority_id);

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.completed;

  return (
    <div className={`bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${
      task.completed ? 'opacity-75' : ''
    } ${isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => onToggleComplete(task.id)}
            className="mt-1 flex-shrink-0"
            disabled={!showActions}
          >
            {task.completed ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5 text-gray-400 hover:text-green-500" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-medium ${
              task.completed ? 'line-through text-gray-500' : 'text-gray-900'
            }`}>
              {task.title}
            </h3>

            {task.description && (
              <p className={`mt-1 text-sm ${
                task.completed ? 'line-through text-gray-400' : 'text-gray-600'
              }`}>
                {task.description}
              </p>
            )}

            <div className="flex items-center space-x-2 mt-2">
              {category && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <Tag className="h-3 w-3 mr-1" />
                  {category.name}
                </span>
              )}

              {priority && (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  priority.name === 'Alta' ? 'bg-red-100 text-red-800' :
                  priority.name === 'Media' ? 'bg-orange-100 text-orange-800' :
                  priority.name === 'Baja' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {priority.name}
                </span>
              )}

              {task.due_date && (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  isOverdue ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(task.due_date).toLocaleDateString()}
                  {isOverdue && <AlertTriangle className="h-3 w-3 ml-1" />}
                </span>
              )}
            </div>

            {task.parent_task_id && (
              <span className="inline-flex items-center px-2 py-1 mt-2 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Subtarea
              </span>
            )}
          </div>
        </div>

        {showActions && !task.completed && (
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => onEdit(task)}
              className="text-green-600 hover:text-green-900 text-sm font-medium"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-red-600 hover:text-red-900 text-sm font-medium"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
