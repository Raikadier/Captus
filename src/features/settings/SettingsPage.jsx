import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Globe, Lock, MessageSquare, Palette, Shield, User, Bell, Eye, EyeOff, Check, Sparkles, Award, Star, Flame, Zap, Crown, Trophy, Target, CheckCircle, Lock as LockIcon } from 'lucide-react'
import { Button } from '../../ui/button'
import { Card } from '../../ui/card'
import { Label } from '../../ui/label'
import { Switch } from '../../ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog'
import { useTheme } from '../../context/themeContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../shared/api/supabase'
import apiClient from '../../shared/api/client'
import Loading from '../../ui/loading'
import { toast } from 'sonner'
import { useAchievementsContext } from '../../context/AchievementContext'
import { Progress } from '../../ui/progress'
import { Badge } from '../../ui/badge'
import { Filter } from 'lucide-react'
import { achievements as achievementsConfig, difficultyOrder, difficultyLabels, difficultyColors } from '../../shared/achievementsConfig'

function getCurrentDate() {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ]
  const now = new Date()
  return `${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`
}

function SettingsMenuItem({
  icon,
  label,
  active = false,
  onClick
}) {
  const { darkMode } = useTheme()

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
        active
          ? 'bg-primary/10 text-primary'
          : darkMode
            ? 'text-gray-300 hover:bg-gray-700'
            : 'text-gray-700 hover:bg-gray-50'
      }`}
      type="button"
    >
      <div className="flex items-center space-x-3">
        <span className={active ? 'text-primary' : darkMode ? 'text-gray-400' : 'text-gray-500'}>{icon}</span>
        <span className="font-medium text-sm">{label}</span>
      </div>
      <ChevronRight size={16} className="text-gray-400" />
    </button>
  )
}

export default function SettingsPage() {
  const { darkMode, toggleTheme, compactView, setCompactView, fontSize, changeFontSize, accentColor, changeAccentColor } = useTheme()
  const { user } = useAuth()
  const { userAchievements, loading: achievementsLoading, error: achievementsError, refreshAchievements } = useAchievementsContext()

  const [activeSection, setActiveSection] = useState('perfil')
  const [statusFilter, setStatusFilter] = useState('all') // all, completed, pending
  const [difficultyFilter, setDifficultyFilter] = useState('all') // all, easy, medium, hard, special, epic
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteStep, setDeleteStep] = useState(1) // 1: primera confirmación, 2: segunda confirmación
  const [countdown, setCountdown] = useState(10) // 10 segundos para la confirmación final
  const [countdownActive, setCountdownActive] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    career: '',
    bio: ''
  })

  useEffect(() => {
    fetchUserProfile()
  }, [])

  // Combine configuration with user achievements data
  const achievements = Object.keys(achievementsConfig).map(achievementId => {
    const config = achievementsConfig[achievementId];
    const userAchievement = userAchievements.find(ua => ua.achievementId === achievementId);

    return {
      achievementId,
      ...config,
      userAchievement: userAchievement || null
    };
  });

  // Filter achievements by status and difficulty
  let filteredAchievements = achievements;

  // Apply status filter
  if (statusFilter !== 'all') {
    filteredAchievements = filteredAchievements.filter(achievement => {
      const isCompleted = achievement.userAchievement?.isCompleted || false;
      return statusFilter === 'completed' ? isCompleted : !isCompleted;
    });
  }

  // Apply difficulty filter
  if (difficultyFilter !== 'all') {
    filteredAchievements = filteredAchievements.filter(a => a && a.difficulty === difficultyFilter);
  }

  // Group filtered achievements by difficulty for display
  const achievementsByDifficulty = filteredAchievements.reduce((groups, achievement) => {
    if (achievement && achievement.difficulty) {
      const difficulty = achievement.difficulty;
      if (!groups[difficulty]) groups[difficulty] = [];
      groups[difficulty].push(achievement);
    }
    return groups;
  }, {});

  const getDifficultyColor = (difficulty) => {
    return difficultyColors[difficulty] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter(a => a.userAchievement?.isCompleted).length;

  // Show toast when achievements are refreshed
  useEffect(() => {
    if (!achievementsLoading && achievementsError === null && userAchievements.length > 0) {
      toast.success(`Logros actualizados: ${unlockedAchievements}/${totalAchievements} completados`, {
        duration: 3000,
      });
    }
  }, [achievementsLoading, achievementsError, userAchievements.length, unlockedAchievements, totalAchievements]);

  // Contador para la confirmación final
  useEffect(() => {
    let interval
    if (countdownActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    } else if (countdown === 0) {
      setCountdownActive(false)
    }
    return () => clearInterval(interval)
  }, [countdownActive, countdown])

  const handleSave = async () => {
    setSaving(true)
    try {
      // Get the current session to obtain the access token
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !sessionData?.session?.access_token) {
        console.error('No valid session found:', sessionError)
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.')
        return
      }

      // Combine first and last name
      const fullName = `${formData.firstName} ${formData.lastName}`.trim()

      const updateData = {
        name: fullName,
        carrer: formData.career,
        bio: formData.bio
      }

      console.log('Updating profile:', updateData)

      // Make API call to update profile using apiClient
      const userId = sessionData.session.user.id
      const response = await apiClient.put(`/users/${userId}`, updateData)

      // apiClient.put returns { data: responseData }
      // Assuming backend response shape. If success, it returns JSON.
      console.log('Profile updated successfully:', response.data)

      // Update local state
      setUserData(prev => ({
        ...prev,
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: fullName,
        carrer: formData.career,
        bio: formData.bio
      }))

      toast.success('Perfil actualizado exitosamente')

    } catch (error) {
      console.error('Error updating profile:', error)
      const message = error.response?.data?.message || 'Error al actualizar el perfil'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    // Validar campos
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Todos los campos de contraseña son obligatorios')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas nuevas no coinciden')
      return
    }

    // Validar fortaleza de la nueva contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!passwordRegex.test(passwordData.newPassword)) {
      toast.error('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número')
      return
    }

    setChangingPassword(true)

    try {
      // Usar Supabase Auth para cambiar la contraseña
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })

      if (error) {
        console.error('Error changing password:', error)
        toast.error(`Error al cambiar contraseña: ${error.message}`)
        return
      }

      // Limpiar campos
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })

      toast.success('Contraseña cambiada exitosamente')

    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('Error al cambiar contraseña')
    } finally {
      setChangingPassword(false)
    }
  }

  const handleDeleteAccount = () => {
    setShowDeleteModal(true)
    setDeleteStep(1)
  }

  const handleConfirmDelete = () => {
    if (deleteStep === 1) {
      // Pasar a la segunda confirmación
      setDeleteStep(2)
      setCountdown(10)
      setCountdownActive(true)
    } else if (deleteStep === 2 && countdown === 0) {
      // Ejecutar la eliminación
      executeDeleteAccount()
    }
  }

  const executeDeleteAccount = async () => {
    setDeletingAccount(true)
    setCountdownActive(false)

    try {
      // Llamar al endpoint de eliminación de cuenta usando apiClient
      const response = await apiClient.delete('/users/account')

      console.log('Account deleted successfully:', response.data)

      toast.success('Cuenta eliminada exitosamente. Redirigiendo...')

      // Cerrar sesión en Supabase
      await supabase.auth.signOut()

      // Redirigir al login después de un breve delay
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)

    } catch (error) {
      console.error('Error deleting account:', error)
      const message = error.response?.data?.message || 'Error al eliminar cuenta'
      toast.error(message)
      setShowDeleteModal(false)
    } finally {
      setDeletingAccount(false)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setDeleteStep(1)
    setCountdown(10)
    setCountdownActive(false)
  }

  const fetchUserProfile = async () => {
    setError('')
    setLoading(true)

    try {
      console.log('Fetching user profile from settings...')

      // apiClient will handle token injection
      const response = await apiClient.get('/users/profile')

      console.log('Response data:', response.data)
      const userDataResponse = response.data

      if (userDataResponse.success && userDataResponse.data) {
        const user = userDataResponse.data
        console.log('User object:', user)

        // Split full name into first and last name
        const nameParts = user.name ? user.name.split(' ') : ['', '']
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''

        const userWithSplitName = {
          ...user,
          firstName,
          lastName,
          fullName: user.name,
          createdAt: user.createdAt || user.created_at
        }

        console.log('Setting user data:', userWithSplitName)
        setUserData(userWithSplitName)
        setFormData({
          firstName,
          lastName,
          email: user.email || '',
          career: user.carrer || '',
          bio: user.bio || ''
        })
      } else {
        console.error('No success or no data in response:', userDataResponse)
        setError('No se pudieron cargar los datos del perfil')
      }

    } catch (error) {
      console.error('Error fetching user profile:', error)
      // Don't set error state for auth issues, just log
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.warn('Authentication issue, user may need to re-login')
        // Don't set error state to avoid crashes
      } else {
        setError(error.message || 'Error de conexión al cargar perfil')
      }
    } finally {
      setLoading(false)
    }
  }

  // Security settings
  const [showPassword, setShowPassword] = useState(false)

  const colors = [
    { name: 'green', bg: 'bg-green-600', border: 'border-green-700' },
    { name: 'blue', bg: 'bg-blue-600', border: 'border-blue-700' },
    { name: 'purple', bg: 'bg-purple-600', border: 'border-purple-700' },
    { name: 'orange', bg: 'bg-orange-600', border: 'border-orange-700' },
    { name: 'pink', bg: 'bg-pink-600', border: 'border-pink-700' },
  ];




  return (
    <div className={`${darkMode ? 'bg-background' : 'bg-[#F6F7FB]'}`}>
      <div className={`max-w-7xl mx-auto ${compactView ? 'p-4' : 'p-8'} ${compactView ? 'pb-24' : 'pb-8'}`}>
        <header className={`sticky top-0 ${darkMode ? 'bg-card' : 'bg-white'} rounded-xl shadow-sm ${compactView ? 'p-4' : 'p-6'} mb-6 z-10 animate-in slide-in-from-top duration-300`}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>⚙️ Configuración</h1>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>{getCurrentDate()}</p>
            </div>
          </div>
        </header>

        <div className={`grid grid-cols-1 lg:grid-cols-3 ${compactView ? 'gap-4' : 'gap-6'}`}>
          <div className="lg:col-span-1 animate-in slide-in-from-left duration-500">
            <Card className={`${compactView ? 'p-3' : 'p-4'} ${darkMode ? 'bg-card border-gray-700' : 'bg-white'} rounded-xl shadow-sm`}>
              <nav className={compactView ? 'space-y-1' : 'space-y-2'}>
                <SettingsMenuItem
                  icon={<User size={18} />}
                  label="Perfil"
                  active={activeSection === 'perfil'}
                  onClick={() => setActiveSection('perfil')}
                />
                <SettingsMenuItem
                  icon={<Lock size={18} />}
                  label="Seguridad"
                  active={activeSection === 'seguridad'}
                  onClick={() => setActiveSection('seguridad')}
                />
                <SettingsMenuItem
                  icon={<Palette size={18} />}
                  label="Apariencia"
                  active={activeSection === 'apariencia'}
                  onClick={() => setActiveSection('apariencia')}
                />
                <SettingsMenuItem
                  icon={<Shield size={18} />}
                  label="Privacidad"
                  active={activeSection === 'privacidad'}
                  onClick={() => setActiveSection('privacidad')}
                />
                <SettingsMenuItem
                  icon={<Award size={18} />}
                  label="Logros"
                  active={activeSection === 'logros'}
                  onClick={() => setActiveSection('logros')}
                />
              </nav>
            </Card>
          </div>

          <div className={`lg:col-span-2 ${compactView ? 'space-y-4' : 'space-y-6'} animate-in fade-in slide-in-from-right duration-500`}>

            {/* PERFIL SECTION */}
            {activeSection === 'perfil' && (
              <Card className={`${compactView ? 'p-4' : 'p-6'} ${darkMode ? 'bg-card border-gray-700' : 'bg-white'} rounded-xl shadow-sm`}>
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} ${compactView ? 'mb-4' : 'mb-6'}`}>
                  Información Personal
                </h2>
                {loading ? (
                  <div className="text-center py-8">
                    <Loading message="Cargando información del perfil..." fullScreen={false} />
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <div className="text-red-600 text-lg mb-4">Error: {error}</div>
                    <Button onClick={fetchUserProfile} variant="outline">
                      Reintentar
                    </Button>
                  </div>
                ) : (
                  <div className={compactView ? 'space-y-3' : 'space-y-4'}>
                    <div className="flex items-center space-x-4">
                    <div className={`${compactView ? 'w-16 h-16' : 'w-20 h-20'} rounded-full overflow-hidden bg-primary flex items-center justify-center`}>
                      <span className={`text-primary-foreground ${compactView ? 'text-xl' : 'text-2xl'} font-semibold`}>MG</span>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">
                          Cambiar Foto
                        </Button>
                      </div>
                    </div>
                    <div className={`grid grid-cols-1 md:grid-cols-2 ${compactView ? 'gap-3' : 'gap-4'}`}>
                      <div>
                        <Label htmlFor="nombre" className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Nombre
                        </Label>
                        <input
                          id="nombre"
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                          placeholder="Tu nombre"
                        className={`mt-1 w-full px-3 ${compactView ? 'py-1.5' : 'py-2'} border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="apellido" className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Apellido
                        </Label>
                        <input
                          id="apellido"
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                          placeholder="Tu apellido"
                        className={`mt-1 w-full px-3 ${compactView ? 'py-1.5' : 'py-2'} border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email
                      </Label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        disabled
                      className={`mt-1 w-full px-3 ${compactView ? 'py-1.5' : 'py-2'} border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary opacity-60 cursor-not-allowed`}
                      />
                    </div>
                    <div>
                      <Label htmlFor="carrera" className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Carrera
                      </Label>
                      <input
                        id="carrera"
                        type="text"
                        value={formData.career}
                        onChange={(e) => setFormData(prev => ({ ...prev, career: e.target.value }))}
                        placeholder="Ej: Ingeniería de Sistemas"
                      className={`mt-1 w-full px-3 ${compactView ? 'py-1.5' : 'py-2'} border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio" className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Biografía
                      </Label>
                      <textarea
                        id="bio"
                        rows={3}
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Cuéntanos un poco sobre ti..."
                      className={`mt-1 w-full px-3 ${compactView ? 'py-1.5' : 'py-2'} border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                      />
                    </div>
                    <div className={compactView ? 'mt-4' : 'mt-6'}>
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                      className="bg-primary hover:bg-primary/90 disabled:opacity-50"
                      >
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                      </Button>
                    </div>

                    {/* Fecha de registro decorativa */}
                    {userData?.createdAt && (
                      <div className={`mt-6 text-center ${compactView ? 'py-3' : 'py-4'}`}>
                        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 ${
                          darkMode
                            ? 'bg-gradient-to-r from-primary/20 to-blue-900/20 border-primary/30'
                            : 'bg-gradient-to-r from-primary/10 to-blue-50 border-primary/20'
                        } backdrop-blur-sm`}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full bg-primary animate-pulse`}></div>
                            <span className={`text-sm font-medium ${
                              darkMode ? 'text-primary/80' : 'text-primary'
                            }`}>
                              Miembro desde
                            </span>
                          </div>
                          <div className={`px-3 py-1 rounded-lg ${
                            darkMode ? 'bg-gray-800/50' : 'bg-white/70'
                          } border border-primary/20`}>
                            <span className={`font-bold ${
                              darkMode ? 'text-white' : 'text-gray-800'
                            }`}>
                              {new Date(userData.createdAt).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${
                              darkMode ? 'text-blue-300' : 'text-blue-700'
                            }`}>
                              🎉
                            </span>
                            <div className={`w-2 h-2 rounded-full ${
                              darkMode ? 'bg-blue-400' : 'bg-blue-500'
                            } animate-pulse`}></div>
                          </div>
                        </div>
                        <p className={`text-xs mt-2 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          ¡Gracias por ser parte de Captus!
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )}

            {/* SEGURIDAD SECTION */}
            {activeSection === 'seguridad' && (
              <Card className={`${compactView ? 'p-4' : 'p-6'} ${darkMode ? 'bg-card border-gray-700' : 'bg-white'} rounded-xl shadow-sm`}>
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} ${compactView ? 'mb-4' : 'mb-6'}`}>
                  Cambiar Contraseña
                </h2>
                <div className={compactView ? 'space-y-3' : 'space-y-4'}>
                  <div>
                    <Label htmlFor="current-password" className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Contraseña Actual
                    </Label>
                    <div className="relative">
                      <input
                        id="current-password"
                        type={showPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Ingresa tu contraseña actual"
                          className={`mt-1 w-full px-3 ${compactView ? 'py-1.5' : 'py-2'} pr-10 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="new-password" className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Nueva Contraseña
                    </Label>
                    <input
                      id="new-password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Ingresa tu nueva contraseña"
                        className={`mt-1 w-full px-3 ${compactView ? 'py-1.5' : 'py-2'} border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password" className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Confirmar Nueva Contraseña
                    </Label>
                    <input
                      id="confirm-password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirma tu nueva contraseña"
                        className={`mt-1 w-full px-3 ${compactView ? 'py-1.5' : 'py-2'} border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                    />
                  </div>
                  <div className={`p-3 ${darkMode ? 'bg-blue-900/20 border-blue-600/30' : 'bg-blue-50 border-blue-200'} border rounded-lg`}>
                    <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                      <strong>Requisitos de contraseña:</strong> Mínimo 8 caracteres, una mayúscula, una minúscula y un número.
                    </p>
                  </div>
                </div>
                <div className={compactView ? 'mt-4' : 'mt-6'}>
                  <Button
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                      className="bg-primary hover:bg-primary/90 disabled:opacity-50"
                  >
                    {changingPassword ? 'Cambiando...' : 'Actualizar Contraseña'}
                  </Button>
                </div>
              </Card>
            )}


            {/* APARIENCIA SECTION */}
            {activeSection === 'apariencia' && (
              <Card className={`${compactView ? 'p-4' : 'p-6'} ${darkMode ? 'bg-card border-gray-700' : 'bg-white'} rounded-xl shadow-sm`}>
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} ${compactView ? 'mb-4' : 'mb-6'}`}>
                  Personalización de la Interfaz
                </h2>
                <div className={compactView ? 'space-y-3' : 'space-y-4'}>
                  <div className={`flex items-center justify-between ${compactView ? 'py-2' : 'py-3'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Modo oscuro</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Activa el tema oscuro en toda la aplicación</p>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={toggleTheme} />
                  </div>
                  <div className={`flex items-center justify-between ${compactView ? 'py-2' : 'py-3'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Vista compacta</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Reduce el espaciado entre elementos</p>
                    </div>
                    <Switch checked={compactView} onCheckedChange={setCompactView} />
                  </div>
                  <div className={compactView ? 'py-2' : 'py-3'}>
                    <Label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3 block`}>
                      Tamaño de fuente
                    </Label>
                    <div className="flex gap-2">
                      <Button
                        variant={fontSize === 'small' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => changeFontSize('small')}
                        className={fontSize === 'small' ? 'bg-primary hover:bg-primary/90' : ''}
                      >
                        Pequeña
                      </Button>
                      <Button
                        variant={fontSize === 'medium' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => changeFontSize('medium')}
                        className={fontSize === 'medium' ? 'bg-primary hover:bg-primary/90' : ''}
                      >
                        Media
                      </Button>
                      <Button
                        variant={fontSize === 'large' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => changeFontSize('large')}
                        className={fontSize === 'large' ? 'bg-primary hover:bg-primary/90' : ''}
                      >
                        Grande
                      </Button>
                    </div>
                  </div>
                  <div className={compactView ? 'py-2' : 'py-3'}>
                    <Label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3 block`}>
                      Color de acento
                    </Label>
                    <div className="flex gap-2">
                      {colors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => changeAccentColor(color.name)}
                          className={`w-10 h-10 rounded-full ${color.bg} flex items-center justify-center transition-all ${
                            accentColor === color.name
                              ? `border-2 ${darkMode ? 'border-white' : 'border-gray-900'} ring-2 ${darkMode ? 'ring-gray-700' : 'ring-gray-200'}`
                              : 'hover:scale-110'
                          }`}
                        >
                          {accentColor === color.name && <Check size={20} className="text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}



            {/* PRIVACIDAD SECTION */}
            {activeSection === 'privacidad' && (
              <Card className={`${compactView ? 'p-4' : 'p-6'} ${darkMode ? 'bg-card border-gray-700' : 'bg-white'} rounded-xl shadow-sm`}>
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} ${compactView ? 'mb-4' : 'mb-6'}`}>
                  Gestión de Datos
                </h2>
                <div className={compactView ? 'space-y-2' : 'space-y-3'}>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleDeleteAccount}
                    disabled={deletingAccount}
                  >
                    {deletingAccount ? 'Eliminando cuenta...' : 'Eliminar mi cuenta'}
                  </Button>
                </div>
                <div className={`${compactView ? 'mt-3' : 'mt-4'} p-3 ${darkMode ? 'bg-red-900/20 border-red-600/30' : 'bg-red-50 border-red-200'} border rounded-lg`}>
                  <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                    ⚠️ <strong>Advertencia importante:</strong> La eliminación de tu cuenta es <strong>permanente</strong> e <strong>irreversible</strong>.
                    Perderás acceso a todas tus tareas, estadísticas, rachas y datos almacenados. Esta acción no se puede deshacer.
                  </p>
                </div>
              </Card>
            )}

            {/* LOGROS SECTION */}
            {activeSection === 'logros' && (
              <Card className={`${compactView ? 'p-4' : 'p-6'} ${darkMode ? 'bg-card border-gray-700' : 'bg-white'} rounded-xl shadow-sm`}>
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} ${compactView ? 'mb-4' : 'mb-6'}`}>
                  🏆 Mis Logros
                </h2>

                {achievementsLoading ? (
                  <div className="text-center py-8">
                    <Loading message="Cargando logros..." fullScreen={false} />
                  </div>
                ) : achievementsError ? (
                  <div className="text-center py-8">
                    <div className="text-red-600 text-lg mb-4">Error: {achievementsError}</div>
                    <Button onClick={() => window.location.reload()} variant="outline">
                      Reintentar
                    </Button>
                  </div>
                ) : (
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

                        {/* Refresh button */}
                        <Button
                          onClick={() => refreshAchievements(true)}
                          disabled={achievementsLoading}
                          variant="outline"
                          size="sm"
                          className="bg-white/70 hover:bg-white border-yellow-300 text-yellow-700 hover:text-yellow-800"
                        >
                          {achievementsLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                              Actualizando...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              🔄 Actualizar
                            </div>
                          )}
                        </Button>

                        {/* Stats rápidas */}
                        <div className="flex gap-4">
                          <div className="bg-white/70 rounded-lg px-4 py-2 border border-yellow-200 text-center">
                            <div className="text-lg font-bold text-yellow-600">{unlockedAchievements}</div>
                            <div className="text-xs text-gray-600">Completados</div>
                          </div>
                          <div className="bg-white/70 rounded-lg px-4 py-2 border border-yellow-200 text-center">
                            <div className="text-lg font-bold text-orange-600">{totalAchievements}</div>
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
                                    ? `${getDifficultyColor(difficulty).split(' ')[0]} hover:opacity-90 text-white`
                                    : `${getDifficultyColor(difficulty)} border-opacity-50`
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
                      {difficultyOrder.map(difficulty => {
                        const difficultyAchievements = achievementsByDifficulty[difficulty] || [];
                        if (difficultyAchievements.length === 0) return null;

                        return (
                          <div key={difficulty}>
                            <div className="flex items-center mb-4">
                              <div className={`px-3 py-1 rounded-full border font-semibold text-sm ${
                                getDifficultyColor(difficulty)
                              }`}>
                                {difficultyLabels[difficulty]}
                              </div>
                              <div className="ml-3 h-px bg-gradient-to-r from-gray-300 to-transparent flex-1"></div>
                              <div className="text-xs text-gray-500">
                                {difficultyAchievements.length} logro{difficultyAchievements.length !== 1 ? 's' : ''}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {difficultyAchievements.map(achievement => {
                                if (!achievement || !achievement.achievementId) return null;

                                const config = achievementsConfig[achievement.achievementId];
                                const isCompleted = achievement.userAchievement?.isCompleted || false;
                                const progress = achievement.userAchievement?.progress || 0;
                                const progressPercent = Math.min((progress / (config?.targetValue || 1)) * 100, 100);

                                return (
                                  <Card key={achievement.achievementId} className={`p-4 hover:shadow-md transition-shadow relative overflow-hidden ${
                                    isCompleted
                                      ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50'
                                      : 'border-gray-200'
                                  }`}>
                                    {!isCompleted && (
                                      <div className="absolute top-0 left-0 right-0 h-3/4 bg-gradient-to-b from-black/60 via-black/40 to-transparent flex items-start justify-center pt-6 rounded-t-lg">
                                        <div className="bg-gray-800/95 text-white px-3 py-1 rounded-full font-semibold text-xs shadow-lg">
                                          🔒 Bloqueado
                                        </div>
                                      </div>
                                    )}

                                    <div className="flex items-start space-x-3">
                                      <div className={`text-3xl ${isCompleted ? '' : 'opacity-70'}`}>{config?.icon || '🏆'}</div>
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                          <h3 className={`font-semibold text-lg ${isCompleted ? 'text-green-800' : 'text-gray-900'}`}>
                                            {config?.name || achievement.achievementId}
                                          </h3>
                                          {isCompleted && (
                                            <CheckCircle className="text-green-600" size={24} />
                                          )}
                                        </div>
                                        <p className={`text-sm mb-3 ${isCompleted ? 'text-green-700' : 'text-gray-600'}`}>
                                          {config?.description || 'Descripción no disponible'}
                                        </p>
                                        <div className="space-y-2">
                                          <div className="flex justify-between text-xs">
                                            <span className={isCompleted ? 'text-green-700' : 'text-gray-600'}>Progreso</span>
                                            <span className={`font-medium ${isCompleted ? 'text-green-800' : 'text-gray-900'}`}>
                                              {progress}/{config?.targetValue || 1}
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
                              })}
                            </div>
                          </div>
                        );
                      })}

                      {filteredAchievements.length === 0 && (
                        <div className="text-center py-12">
                          <Trophy size={48} className="mx-auto text-gray-400 mb-4" />
                          <h3 className="text-lg font-semibold text-gray-600 mb-2">No se encontraron logros</h3>
                          <p className="text-gray-500 text-sm">Prueba cambiando los filtros para ver más logros</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Delete Account Modal */}
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
              <DialogContent className={`${darkMode ? 'bg-card border-gray-700' : 'bg-white'} max-w-md`}>
                <DialogHeader>
                  <DialogTitle className={`text-xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                    ⚠️ Eliminar Cuenta
                  </DialogTitle>
                  <DialogDescription className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {deleteStep === 1 ? (
                      <div className="space-y-3">
                        <p>¿Estás seguro de que quieres eliminar tu cuenta?</p>
                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
                          <p className={`text-sm font-medium ${darkMode ? 'text-red-300' : 'text-red-700'} mb-2`}>
                            Esta acción es <strong>IRREVERSIBLE</strong> y eliminará:
                          </p>
                          <ul className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} space-y-1`}>
                            <li>• Todas tus tareas y subtareas</li>
                            <li>• Tus estadísticas y rachas de productividad</li>
                            <li>• Tus logros y medallas desbloqueadas</li>
                            <li>• Toda tu información personal</li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className={`p-4 rounded-lg border-2 ${darkMode ? 'bg-red-900/30 border-red-600' : 'bg-red-50 border-red-300'}`}>
                          <h3 className={`font-bold text-lg ${darkMode ? 'text-red-400' : 'text-red-600'} mb-2`}>
                            🚨 ÚLTIMA ADVERTENCIA 🚨
                          </h3>
                          <p className={`${darkMode ? 'text-red-300' : 'text-red-700'} font-medium`}>
                            Esta es tu última oportunidad para cancelar.
                          </p>
                          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
                            ¿Realmente quieres <strong>ELIMINAR DEFINITIVAMENTE</strong> tu cuenta de Captus?
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
                            No podrás recuperar ningún dato después de esto.
                          </p>
                        </div>
                        {countdownActive && (
                          <div className={`text-center p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              El botón se habilitará en: <span className="font-bold text-red-500">{countdown}s</span>
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div
                                className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${(countdown / 10) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCancelDelete}
                    disabled={deletingAccount}
                    className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleConfirmDelete}
                    disabled={deleteStep === 2 && countdown > 0}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {deletingAccount ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Eliminando...
                      </div>
                    ) : deleteStep === 1 ? (
                      'Continuar'
                    ) : countdown > 0 ? (
                      `Eliminar en ${countdown}s`
                    ) : (
                      '🗑️ Eliminar Definitivamente'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </div>
        </div>
      </div>
    </div>
  )
}
