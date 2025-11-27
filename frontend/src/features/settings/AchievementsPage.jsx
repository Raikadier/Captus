import React, { useState } from 'react';
import { Card } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { CheckCircle, Circle, Trophy, Filter } from 'lucide-react';

const achievements = {
  // LOGROS FÁCILES
  "first_task": {
    name: "Primer Paso",
    description: "Completaste tu primera tarea",
    icon: "🎯",
    difficulty: "easy",
    targetValue: 1,
    type: "completed_tasks",
    color: "#4CAF50"
  },
  "prioritario": {
    name: "Prioritario",
    description: "Creaste tu primera tarea de prioridad alta",
    icon: "⭐",
    difficulty: "easy",
    targetValue: 1,
    type: "high_priority_tasks",
    color: "#4CAF50"
  },
  "subdivisor": {
    name: "Subdivisor",
    description: "Creaste tu primera subtarea",
    icon: "📝",
    difficulty: "easy",
    targetValue: 1,
    type: "subtasks_created",
    color: "#4CAF50"
  },
  "explorador": {
    name: "Explorador",
    description: "Creaste 5 tareas diferentes",
    icon: "🗺️",
    difficulty: "easy",
    targetValue: 5,
    type: "tasks_created",
    color: "#4CAF50"
  },

  // LOGROS MEDIOS
  "productivo": {
    name: "Productivo",
    description: "Completaste 25 tareas totales",
    icon: "⚡",
    difficulty: "medium",
    targetValue: 25,
    type: "completed_tasks",
    color: "#FF9800"
  },
  "consistente": {
    name: "Consistente",
    description: "Mantuviste una racha de 3 días",
    icon: "🔥",
    difficulty: "medium",
    targetValue: 3,
    type: "streak",
    color: "#FF9800"
  },
  "tempranero": {
    name: "Tempranero",
    description: "Completaste 3 tareas antes de las 9 AM",
    icon: "🌅",
    difficulty: "medium",
    targetValue: 3,
    type: "early_tasks",
    color: "#FF9800"
  },
  "multitarea": {
    name: "Multitarea",
    description: "Completaste 5 subtareas en una tarea padre",
    icon: "🎪",
    difficulty: "medium",
    targetValue: 5,
    type: "subtasks_completed",
    color: "#FF9800"
  },

  // LOGROS DIFÍCILES
  "maraton": {
    name: "Maratón",
    description: "Completaste 100 tareas totales",
    icon: "🏃",
    difficulty: "hard",
    targetValue: 100,
    type: "completed_tasks",
    color: "#F44336"
  },
  "leyenda": {
    name: "Leyenda",
    description: "Mantuviste una racha de 30 días",
    icon: "👑",
    difficulty: "hard",
    targetValue: 30,
    type: "streak",
    color: "#F44336"
  },
  "velocista": {
    name: "Velocista",
    description: "Completaste 10 tareas en un día",
    icon: "💨",
    difficulty: "hard",
    targetValue: 10,
    type: "tasks_in_day",
    color: "#F44336"
  },
  "perfeccionista": {
    name: "Perfeccionista",
    description: "Completaste 50 tareas sin subtareas",
    icon: "🎯",
    difficulty: "hard",
    targetValue: 50,
    type: "solo_tasks",
    color: "#F44336"
  },

  // LOGROS ESPECIALES
  "dominguero": {
    name: "Dominguero",
    description: "Completaste 5 tareas en domingo",
    icon: "⛱️",
    difficulty: "special",
    targetValue: 5,
    type: "sunday_tasks",
    color: "#9C27B0"
  },
  "maestro": {
    name: "Maestro",
    description: "Completaste 500 tareas totales",
    icon: "🎓",
    difficulty: "special",
    targetValue: 500,
    type: "completed_tasks",
    color: "#9C27B0"
  },

  // LOGROS ÉPICOS
  "inmortal": {
    name: "Inmortal",
    description: "Mantuviste una racha de 100 días",
    icon: "⚡",
    difficulty: "epic",
    targetValue: 100,
    type: "streak",
    color: "#673AB7"
  },
  "titan": {
    name: "Titán",
    description: "Completaste 1000 tareas totales",
    icon: "🏔️",
    difficulty: "epic",
    targetValue: 1000,
    type: "completed_tasks",
    color: "#673AB7"
  },
  "dios_productividad": {
    name: "Dios de la Productividad",
    description: "Completaste 5000 tareas totales",
    icon: "👑",
    difficulty: "epic",
    targetValue: 5000,
    type: "completed_tasks",
    color: "#673AB7"
  }
};

const difficultyOrder = ['easy', 'medium', 'hard', 'special', 'epic'];
const difficultyLabels = {
  easy: 'Fácil',
  medium: 'Medio',
  hard: 'Difícil',
  special: 'Especial',
  epic: 'Épico'
};

const difficultyColors = {
  easy: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-orange-100 text-orange-800 border-orange-200',
  hard: 'bg-red-100 text-red-800 border-red-200',
  special: 'bg-purple-100 text-purple-800 border-purple-200',
  epic: 'bg-indigo-100 text-indigo-800 border-indigo-200'
};

function AchievementCard({ achievement, progress = 0, isCompleted = false }) {
  const progressPercent = Math.min((progress / achievement.targetValue) * 100, 100);

  return (
    <Card className={`p-4 hover:shadow-md transition-shadow relative overflow-hidden ${
      isCompleted
        ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50'
        : 'border-gray-200'
    }`}>
      {/* Overlay hasta 3/4 para logros bloqueados */}
      {!isCompleted && (
        <div className="absolute top-0 left-0 right-0 h-3/4 bg-gradient-to-b from-black/60 via-black/40 to-transparent flex items-start justify-center pt-6 rounded-t-lg">
          <div className="bg-gray-800/95 text-white px-3 py-1 rounded-full font-semibold text-xs shadow-lg">
            🔒 Bloqueado
          </div>
        </div>
      )}

      <div className="flex items-start space-x-3">
        <div className={`text-3xl ${isCompleted ? '' : 'opacity-70'}`}>{achievement.icon}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-semibold text-lg ${isCompleted ? 'text-green-800' : 'text-gray-900'}`}>
              {achievement.name}
            </h3>
            {isCompleted && (
              <CheckCircle className="text-green-600" size={24} />
            )}
          </div>
          <p className={`text-sm mb-3 ${isCompleted ? 'text-green-700' : 'text-gray-600'}`}>
            {achievement.description}
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className={isCompleted ? 'text-green-700' : 'text-gray-600'}>Progreso</span>
              <span className={`font-medium ${isCompleted ? 'text-green-800' : 'text-gray-900'}`}>
                {progress}/{achievement.targetValue}
              </span>
            </div>
            <Progress
              value={progressPercent}
              className={`h-2 ${isCompleted ? 'bg-green-200' : 'bg-gray-200'}`}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function AchievementsPage() {
  const [statusFilter, setStatusFilter] = useState('all'); // all, completed, pending
  const [difficultyFilter, setDifficultyFilter] = useState('all'); // all, easy, medium, hard, special, epic

  const allAchievements = Object.values(achievements);

  const groupedAchievements = difficultyOrder.reduce((acc, difficulty) => {
    let achievementsInDifficulty = allAchievements.filter(a => a.difficulty === difficulty);

    // Apply filters within each difficulty group
    if (difficultyFilter !== 'all' && difficulty !== difficultyFilter) {
      achievementsInDifficulty = [];
    }

    if (statusFilter !== 'all') {
      achievementsInDifficulty = achievementsInDifficulty.filter(achievement => {
        const isCompleted = false; // TODO: usar estado real
        return statusFilter === 'completed' ? isCompleted : !isCompleted;
      });
    }

    acc[difficulty] = achievementsInDifficulty;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Trophy className="text-yellow-500" size={32} />
          Sistema de Logros
        </h2>
        <p className="text-muted-foreground">Completa desafíos y desbloquea logros para demostrar tu productividad</p>
      </div>

      {/* Sidebar de filtros arriba */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Trophy className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">🏆 Tu Progreso</h3>
              <p className="text-xs text-gray-600">Estadísticas y filtros</p>
            </div>
          </div>

          {/* Stats rápidas */}
          <div className="flex gap-4">
            <div className="bg-white/70 rounded-lg px-4 py-2 border border-yellow-200 text-center">
              <div className="text-lg font-bold text-yellow-600">0</div>
              <div className="text-xs text-gray-600">Completados</div>
            </div>
            <div className="bg-white/70 rounded-lg px-4 py-2 border border-yellow-200 text-center">
              <div className="text-lg font-bold text-orange-600">17</div>
              <div className="text-xs text-gray-600">Por Descubrir</div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Filter size={14} />
              Estado
            </h4>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
                className={`${statusFilter === 'all' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'border-yellow-300 text-yellow-700 hover:bg-yellow-50'}`}
              >
                Todos
              </Button>
              <Button
                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('pending')}
                className={`${statusFilter === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'border-yellow-300 text-yellow-700 hover:bg-yellow-50'}`}
              >
                🔍 Por Descubrir
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('completed')}
                className={`${statusFilter === 'completed' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'border-yellow-300 text-yellow-700 hover:bg-yellow-50'}`}
              >
                ✅ Completados
              </Button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Dificultad</h4>
            <div className="flex gap-2">
              <Button
                variant={difficultyFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDifficultyFilter('all')}
                className={`${difficultyFilter === 'all' ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'border-orange-300 text-orange-700 hover:bg-orange-50'}`}
              >
                Todas
              </Button>
              {difficultyOrder.map(difficulty => (
                <Button
                  key={difficulty}
                  variant={difficultyFilter === difficulty ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDifficultyFilter(difficulty)}
                  className={`${
                    difficultyFilter === difficulty
                      ? `${difficultyColors[difficulty].split(' ')[0]} hover:opacity-90 text-white`
                      : `${difficultyColors[difficulty]} border-opacity-50`
                  }`}
                >
                  {difficultyLabels[difficulty]}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido de logros */}
      <div className="space-y-6">
          {difficultyOrder.map(difficulty => (
            groupedAchievements[difficulty].length > 0 && (
              <div key={difficulty}>
                <div className="flex items-center mb-4">
                  <div className={`px-3 py-1 rounded-full border font-semibold text-sm ${
                    difficultyColors[difficulty]
                  }`}>
                    {difficultyLabels[difficulty]}
                  </div>
                  <div className="ml-3 h-px bg-gradient-to-r from-gray-300 to-transparent flex-1"></div>
                  <div className="text-xs text-gray-500">
                    {groupedAchievements[difficulty].length} logro{groupedAchievements[difficulty].length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedAchievements[difficulty].map(achievement => (
                    <AchievementCard
                      key={achievement.name}
                      achievement={achievement}
                      progress={0} // TODO: Implementar progreso real
                      isCompleted={false} // TODO: Implementar estado real
                    />
                  ))}
                </div>
              </div>
            )
          ))}

          {Object.values(groupedAchievements).every(group => group.length === 0) && (
            <div className="text-center py-12">
              <Trophy size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No se encontraron logros</h3>
              <p className="text-gray-500 text-sm">Prueba cambiando los filtros para ver más logros</p>
            </div>
          )}
        </div>
    </div>
  );
}