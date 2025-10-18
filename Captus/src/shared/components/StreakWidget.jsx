// Streak widget component
import React, { useState, useEffect } from 'react';
import { Flame, TrendingUp, Target } from 'lucide-react';
import apiClient from '../api/client';

const StreakWidget = () => {
  const [streakData, setStreakData] = useState({
    current_streak: 0,
    last_completed_date: null,
    daily_goal: 5
  });
  const [stats, setStats] = useState({
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreakData();
  }, []);

  const fetchStreakData = async () => {
    try {
      setLoading(true);
      const [streakResponse, statsResponse] = await Promise.all([
        apiClient.get('/streaks'),
        apiClient.get('/streaks/stats')
      ]);

      setStreakData(streakResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error fetching streak data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStreakColor = (streak) => {
    if (streak === 0) return 'text-gray-500';
    if (streak < 7) return 'text-orange-500';
    if (streak < 30) return 'text-blue-500';
    return 'text-purple-600';
  };

  const getStreakMessage = (streak) => {
    if (streak === 0) return '¡Empieza tu racha hoy!';
    if (streak === 1) return '¡Primer día completado!';
    if (streak < 7) return '¡Vas por buen camino!';
    if (streak < 30) return '¡Eres increíble!';
    return '¡Campeón de la productividad!';
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-lg p-6 text-white">
        <div className="animate-pulse">
          <div className="h-8 bg-white/20 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-white/20 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-lg p-6 text-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Flame className={`h-8 w-8 ${getStreakColor(streakData.current_streak)}`} />
          <div>
            <h3 className="text-xl font-bold">Racha Actual</h3>
            <p className="text-orange-100 text-sm">{getStreakMessage(streakData.current_streak)}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{streakData.current_streak}</div>
          <div className="text-sm text-orange-100">días</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span className="text-sm">Meta diaria</span>
          </div>
          <div className="text-lg font-semibold">{streakData.daily_goal}</div>
        </div>

        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Tasa de éxito</span>
          </div>
          <div className="text-lg font-semibold">{Math.round(stats.completionRate * 100)}%</div>
        </div>
      </div>

      {streakData.last_completed_date && (
        <div className="mt-4 text-sm text-orange-100">
          Última tarea completada: {new Date(streakData.last_completed_date).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default StreakWidget;