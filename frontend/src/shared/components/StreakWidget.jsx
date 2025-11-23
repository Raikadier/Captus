// StreakWidget - Widget mejorado con animación y mejor diseño
import React, { useState, useEffect } from 'react';
import { Flame, Target, Calendar } from 'lucide-react';
import apiClient from '../api/client';

const StreakWidget = () => {
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animatedStreak, setAnimatedStreak] = useState(0);

  useEffect(() => {
    fetchStreakData();
  }, []);

  useEffect(() => {
    // Animate streak number
    if (streakData?.currentStreak !== undefined) {
      const targetStreak = streakData.currentStreak;
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
    }
  }, [streakData?.currentStreak]);

  const fetchStreakData = async () => {
    try {
      // Use the statistics endpoint for streak data
      const response = await apiClient.get('/statistics/streak-stats');
      const data = response?.data;
      if (data) {
        setStreakData(data);
      } else {
        // Default streak data if none exists
        setStreakData({
          currentStreak: 0,
          lastCompletedDate: null,
          dailyGoal: 5,
          completionRate: 0
        });
      }
    } catch (error) {
      console.error('Error fetching streak data:', error);
      setStreakData({
        currentStreak: 0,
        lastCompletedDate: null,
        dailyGoal: 5,
        completionRate: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-xl shadow-sm p-6">
        <div className="text-center text-muted-foreground">Cargando racha...</div>
      </div>
    );
  }

  if (!streakData) {
    return (
      <div className="bg-card rounded-xl shadow-sm p-6">
        <div className="text-center text-muted-foreground">No se pudo cargar la información de racha</div>
      </div>
    );
  }

  const isStreakActive = streakData.lastCompletedDate &&
    new Date(streakData.lastCompletedDate).toDateString() === new Date().toDateString();

  return (
    <div className="bg-card rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground flex items-center">
          <Flame className="mr-2 text-orange-500" size={20} />
          Mi Racha
        </h3>
        <div className="flex items-center text-sm text-muted-foreground">
          <Target size={16} className="mr-1" />
          Meta: {streakData.dailyGoal} tareas/día
        </div>
      </div>

      {/* Streak counter */}
      <div className="text-center mb-4">
        <div className={`text-6xl font-bold mb-2 ${
          animatedStreak > 0 ? 'text-orange-500' : 'text-muted-foreground'
        }`}>
          {animatedStreak}
        </div>
        <div className="text-sm text-muted-foreground">
          {animatedStreak === 1 ? 'día consecutivo' : 'días consecutivos'}
        </div>
      </div>

      {/* Streak status */}
      <div className="text-center mb-4">
        {isStreakActive ? (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
            <Flame size={14} className="mr-1" />
            ¡Racha activa!
          </div>
        ) : (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
            <Calendar size={14} className="mr-1" />
            Completa tareas hoy para mantener la racha
          </div>
        )}
      </div>

      {/* Progress towards daily goal (using completionRate as proxy if daily completions not sent explicitly,
          or assuming 0/goal if not in stats payload. The stats payload has completionRate over 30 days,
          but not 'completed_today'. We might need to adjust backend if we want today's precise progress bar here.
          For now, let's hide the progress bar if we don't have 'completed_today' or mock it based on activity) */}

      {/* Note: The original mockup used 'completed_today'. The /streaks/stats endpoint returns 'completionRate'.
          If we want 'completed_today' we might need to call /streaks or just accept the stats data.
          Let's render what we have safely. */}

      {/* Last completed date */}
      {streakData.lastCompletedDate && (
        <div className="text-center text-xs text-muted-foreground mt-2">
          Última: {new Date(streakData.lastCompletedDate).toLocaleDateString('es-ES')}
        </div>
      )}
    </div>
  );
};

export default StreakWidget;
