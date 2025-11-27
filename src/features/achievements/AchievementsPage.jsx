import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Lock, CheckCircle, Star, Flame, Crown, Zap, Trophy, Target, Sparkles } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Progress } from '../../ui/progress';
import Loading from '../../ui/loading';
import { useAchievements } from '../../hooks/useAchievements';

// Configuración de achievements (debe coincidir con backend)
const achievementsConfig = {
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

function getCurrentDate() {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const now = new Date();
  return `${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`;
}

function AchievementCard({ achievement, userAchievement }) {
  const config = achievementsConfig[achievement.achievementId];
  const isUnlocked = userAchievement?.isCompleted || false;
  const progress = userAchievement?.progress || 0;
  const targetValue = config?.targetValue || 1;
  const progressPercentage = Math.min((progress / targetValue) * 100, 100);

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'easy': return <Star className="w-4 h-4 text-green-500" />;
      case 'medium': return <Flame className="w-4 h-4 text-orange-500" />;
      case 'hard': return <Zap className="w-4 h-4 text-red-500" />;
      case 'special': return <Sparkles className="w-4 h-4 text-purple-500" />;
      case 'epic': return <Crown className="w-4 h-4 text-purple-700" />;
      default: return <Award className="w-4 h-4 text-gray-500" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-50 border-green-200';
      case 'medium': return 'bg-orange-50 border-orange-200';
      case 'hard': return 'bg-red-50 border-red-200';
      case 'special': return 'bg-purple-50 border-purple-200';
      case 'epic': return 'bg-purple-100 border-purple-300';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className={`p-6 transition-all duration-300 hover:shadow-lg ${getDifficultyColor(config?.difficulty)} ${isUnlocked ? 'ring-2 ring-green-300' : ''}`}>
      <div className="flex items-start space-x-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${isUnlocked ? 'bg-green-100' : 'bg-gray-100'}`}>
          {isUnlocked ? <CheckCircle className="w-8 h-8 text-green-600" /> : <Lock className="w-8 h-8 text-gray-400" />}
        </div>

        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className={`text-lg font-semibold ${isUnlocked ? 'text-gray-900' : 'text-gray-600'}`}>
              {config?.name || achievement.achievementId}
            </h3>
            {getDifficultyIcon(config?.difficulty)}
          </div>

          <p className={`text-sm mb-3 ${isUnlocked ? 'text-gray-700' : 'text-gray-500'}`}>
            {config?.description || 'Descripción no disponible'}
          </p>

          {!isUnlocked && targetValue > 1 && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progreso</span>
                <span>{progress} / {targetValue}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}

          {isUnlocked && userAchievement?.unlockedAt && (
            <div className="flex items-center space-x-2 text-sm text-green-700">
              <Trophy className="w-4 h-4" />
              <span>Desbloqueado el {new Date(userAchievement.unlockedAt).toLocaleDateString('es-ES')}</span>
            </div>
          )}

          {!isUnlocked && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Lock className="w-4 h-4" />
              <span>No desbloqueado aún</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

const AchievementsPage = () => {
  const { achievements, loading, error } = useAchievements();
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Create a map of user achievements for quick lookup
  const userAchievementsMap = achievements.reduce((map, ua) => {
    map[ua.achievementId] = ua;
    return map;
  }, {});

  // Get all achievements with user progress
  const allAchievements = Object.keys(achievementsConfig).map(achievementId => ({
    achievementId,
    ...achievementsConfig[achievementId],
    userAchievement: userAchievementsMap[achievementId]
  }));

  // Filter achievements by difficulty
  const filteredAchievements = selectedDifficulty === 'all'
    ? allAchievements
    : allAchievements.filter(a => a.difficulty === selectedDifficulty);

  // Group by difficulty for display
  const achievementsByDifficulty = allAchievements.reduce((groups, achievement) => {
    const difficulty = achievement.difficulty;
    if (!groups[difficulty]) groups[difficulty] = [];
    groups[difficulty].push(achievement);
    return groups;
  }, {});

  const difficultyOrder = ['easy', 'medium', 'hard', 'special', 'epic'];
  const difficultyLabels = {
    easy: 'Fáciles',
    medium: 'Medios',
    hard: 'Difíciles',
    special: 'Especiales',
    epic: 'Épicos'
  };

  const totalAchievements = allAchievements.length;
  const unlockedAchievements = achievements.filter(ua => ua.isCompleted).length;

  if (loading) {
    return <Loading message="Cargando logros..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar logros</h2>
          <p className="text-gray-600">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Trophy className="mr-3" size={32} />
                Mis Logros
              </h1>
              <p className="text-white/90 mt-1">{getCurrentDate()}</p>
            </div>
            <Link to="/stats">
              <Button variant="secondary" className="bg-white/10 hover:bg-white/20">
                ← Volver a Estadísticas
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center space-x-4">
              <Target className="text-blue-600" size={32} />
              <div>
                <p className="text-2xl font-bold text-blue-900">{totalAchievements}</p>
                <p className="text-sm text-blue-700">Logros Totales</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <div className="flex items-center space-x-4">
              <CheckCircle className="text-green-600" size={32} />
              <div>
                <p className="text-2xl font-bold text-green-900">{unlockedAchievements}</p>
                <p className="text-sm text-green-700">Logros Desbloqueados</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center space-x-4">
              <Award className="text-purple-600" size={32} />
              <div>
                <p className="text-2xl font-bold text-purple-900">{Math.round((unlockedAchievements / totalAchievements) * 100)}%</p>
                <p className="text-sm text-purple-700">Progreso General</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Difficulty Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={selectedDifficulty === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedDifficulty('all')}
            className="flex items-center space-x-2"
          >
            <Award size={16} />
            <span>Todos</span>
          </Button>
          {difficultyOrder.map(difficulty => (
            <Button
              key={difficulty}
              variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
              onClick={() => setSelectedDifficulty(difficulty)}
              className="flex items-center space-x-2"
            >
              {difficulty === 'easy' && <Star size={16} className="text-green-500" />}
              {difficulty === 'medium' && <Flame size={16} className="text-orange-500" />}
              {difficulty === 'hard' && <Zap size={16} className="text-red-500" />}
              {difficulty === 'special' && <Sparkles size={16} className="text-purple-500" />}
              {difficulty === 'epic' && <Crown size={16} className="text-purple-700" />}
              <span>{difficultyLabels[difficulty]}</span>
            </Button>
          ))}
        </div>

        {/* Achievements by Difficulty */}
        {difficultyOrder.map(difficulty => {
          const difficultyAchievements = achievementsByDifficulty[difficulty] || [];
          if (selectedDifficulty !== 'all' && selectedDifficulty !== difficulty) return null;
          if (difficultyAchievements.length === 0) return null;

          return (
            <div key={difficulty} className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                {difficulty === 'easy' && <Star className="w-6 h-6 text-green-500" />}
                {difficulty === 'medium' && <Flame className="w-6 h-6 text-orange-500" />}
                {difficulty === 'hard' && <Zap className="w-6 h-6 text-red-500" />}
                {difficulty === 'special' && <Sparkles className="w-6 h-6 text-purple-500" />}
                {difficulty === 'epic' && <Crown className="w-6 h-6 text-purple-700" />}
                <h2 className="text-2xl font-bold text-foreground">{difficultyLabels[difficulty]}</h2>
                <span className="text-sm text-muted-foreground">
                  ({difficultyAchievements.filter(a => a.userAchievement?.isCompleted).length}/{difficultyAchievements.length})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {difficultyAchievements.map(achievement => (
                  <AchievementCard
                    key={achievement.achievementId}
                    achievement={achievement}
                    userAchievement={achievement.userAchievement}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsPage;