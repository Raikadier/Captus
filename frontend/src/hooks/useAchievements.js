import { useState, useCallback } from 'react';
import apiClient from '../shared/api/client';
import { useAuth } from '../context/AuthContext';
import { achievements as achievementsConfig } from '../shared/achievementsConfig';

export function useAchievements() {
  const { user } = useAuth();
  const [userAchievements, setUserAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const fetchAchievements = useCallback(async () => {
    if (!user || loaded) return;

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get('/achievements/my');
      if (response.data && response.data.success) {
        setUserAchievements(response.data.data || []);
        setLoaded(true);
      } else {
        // Don't set error for non-critical failures, just log
        console.warn('Achievements not available:', response.data?.message);
        setUserAchievements([]);
        setLoaded(true);
      }
    } catch (err) {
      console.error('Error fetching achievements:', err);
      // Don't set error state, just log and continue with empty achievements
      setUserAchievements([]);
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [user, loaded]);

  // Combinar configuración de logros con progreso del usuario
  const achievements = Object.keys(achievementsConfig).map(achievementId => {
    const config = achievementsConfig[achievementId];
    const userAchievement = userAchievements.find(ua => ua.achievementId === achievementId);

    return {
      achievementId,
      ...config,
      userAchievement: userAchievement || null
    };
  });

  const load = () => {
    fetchAchievements();
  };

  const refresh = () => {
    setLoaded(false);
    setUserAchievements([]);
    fetchAchievements();
  };

  return {
    achievements,
    loading,
    error,
    loaded,
    load,
    refresh
  };
}