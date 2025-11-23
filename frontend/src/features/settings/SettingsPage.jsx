import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Globe, Lock, MessageSquare, Palette, Shield, User, Bell, Eye, EyeOff, Check, Sparkles } from 'lucide-react'
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
import Loading from '../../ui/loading'
import { toast } from 'sonner'

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

  const [activeSection, setActiveSection] = useState('perfil')
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

      const token = sessionData.session.access_token

      // Combine first and last name
      const fullName = `${formData.firstName} ${formData.lastName}`.trim()

      const updateData = {
        name: fullName,
        carrer: formData.career,
        bio: formData.bio
      }

      console.log('Updating profile:', updateData)

      // Make API call to update profile
      const userId = sessionData.session.user.id
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Profile updated successfully:', result)

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
      } else {
        const errorData = await response.json()
        console.error('Failed to update profile:', response.status, errorData)
        toast.error(`Error al actualizar perfil: ${errorData.message || 'Error desconocido'}`)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Error al actualizar el perfil')
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
      // Get the current session to obtain the access token
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !sessionData?.session?.access_token) {
        console.error('No valid session found:', sessionError)
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.')
        setShowDeleteModal(false)
        return
      }

      const token = sessionData.session.access_token

      // Llamar al endpoint de eliminación de cuenta
      const response = await fetch('/api/users/account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Account deleted successfully:', result)

        toast.success('Cuenta eliminada exitosamente. Redirigiendo...')

        // Cerrar sesión en Supabase
        await supabase.auth.signOut()

        // Redirigir al login después de un breve delay
        setTimeout(() => {
          window.location.href = '/'
        }, 2000)

      } else {
        const errorData = await response.json()
        console.error('Failed to delete account:', response.status, errorData)
        toast.error(`Error al eliminar cuenta: ${errorData.message || 'Error desconocido'}`)
        setShowDeleteModal(false)
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error('Error de conexión al eliminar cuenta')
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

      // Get the current session to obtain the access token
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !sessionData?.session?.access_token) {
        console.error('No valid session found:', sessionError)
        setError('Sesión no válida. Por favor, inicia sesión nuevamente.')
        setLoading(false)
        return
      }

      const token = sessionData.session.access_token
      console.log('Using token:', token.substring(0, 20) + '...')

      const response = await fetch('/api/users/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      console.log('Response status:', response.status)

      if (response.ok) {
        const userDataResponse = await response.json()
        console.log('Raw response:', userDataResponse)

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
      } else {
        const errorText = await response.text()
        console.error('Failed to fetch user profile:', response.status, errorText)
        setError(`Error al cargar perfil: ${response.status}`)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setError('Error de conexión al cargar perfil')
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
