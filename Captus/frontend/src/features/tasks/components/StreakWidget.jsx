// StreakWidget - Equivalent to the streak display in the desktop app
// Shows current streak and daily goal
import React, { useState, useEffect } from 'react';
import { Flame, Target, Calendar } from 'lucide-react';

const StreakWidget = ({ streakData }) => {
  const [animatedStreak, setAnimatedStreak] = useState(0);

  useEffect(() => {
    // Animate streak number
    const targetStreak = streakData?.current_streak || 0;
    const duration = 1000; // 1 second
    const steps = 60;
    const increment = targetStreak / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetStreak) {
        setAnimatedStreak(targetStreak);
        clearInterval(timer);
      } else {
        setAnimatedStreak(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [streakData?.current_streak]);

  if (!streakData) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center text-gray-500">Cargando racha...</div>
      </div>
    );
  }

  const isStreakActive = streakData.last_completed_date &&
    new Date(streakData.last_completed_date).toDateString() === new Date().toDateString();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <Flame className="mr-2 text-orange-500" size={20} />
          Mi Racha
        </h3>
        <div className="flex items-center text-sm text-gray-600">
          <Target size={16} className="mr-1" />
          Meta: {streakData.daily_goal} tareas/día
        </div>
      </div>

      {/* Streak counter */}
      <div className="text-center mb-4">
        <div className={`text-6xl font-bold mb-2 ${
          animatedStreak > 0 ? 'text-orange-500' : 'text-gray-400'
        }`}>
          {animatedStreak}
        </div>
        <div className="text-sm text-gray-600">
          {animatedStreak === 1 ? 'día consecutivo' : 'días consecutivos'}
        </div>
      </div>

      {/* Streak status */}
      <div className="text-center">
        {isStreakActive ? (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
            <Flame size={14} className="mr-1" />
            ¡Racha activa!
          </div>
        ) : (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">
            <Calendar size={14} className="mr-1" />
            Completa tareas hoy para mantener la racha
          </div>
        )}
      </div>

      {/* Last completed date */}
      {streakData.last_completed_date && (
        <div className="mt-4 text-center text-xs text-gray-500">
          Última tarea completada: {new Date(streakData.last_completed_date).toLocaleDateString('es-ES')}
        </div>
      )}

      {/* Progress towards daily goal */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progreso diario</span>
          <span>{streakData.completed_today || 0}/{streakData.daily_goal}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min((streakData.completed_today || 0) / streakData.daily_goal * 100, 100)}%`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StreakWidget;