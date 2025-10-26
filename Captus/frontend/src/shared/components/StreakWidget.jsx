// StreakWidget - Shows user streak information
import React, { useState, useEffect } from 'react';
import { Flame, Target, Calendar } from 'lucide-react';
import apiClient from '../api/client';

const StreakWidget = () => {
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreakData();
  }, []);

  const fetchStreakData = async () => {
    try {
      const response = await apiClient.get('/streaks');
      const data = response?.data;
      if (data) {
        setStreakData(data);
      } else {
        // Default streak data if none exists
        setStreakData({
          current_streak: 0,
          last_completed_date: null,
          daily_goal: 5
        });
      }
    } catch (error) {
      console.error('Error fetching streak data:', error);
      setStreakData({
        current_streak: 0,
        last_completed_date: null,
        daily_goal: 5
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center text-gray-500">Cargando racha...</div>
      </div>
    );
  }

  if (!streakData) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center text-gray-500">No se pudo cargar la información de racha</div>
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
          streakData.current_streak > 0 ? 'text-orange-500' : 'text-gray-400'
        }`}>
          {streakData.current_streak}
        </div>
        <div className="text-sm text-gray-600">
          {streakData.current_streak === 1 ? 'día consecutivo' : 'días consecutivos'}
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
    </div>
  );
};

export default StreakWidget;