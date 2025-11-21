import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Globe, Lock, MessageSquare, Palette, Shield, User, Bell, Eye, EyeOff, Check, Sparkles } from 'lucide-react'
import { Button } from '../../ui/button'
import { Card } from '../../ui/card'
import { Label } from '../../ui/label'
import { Switch } from '../../ui/switch'
import { useTheme } from '../../context/themeContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../shared/api/supabase'
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
          ? 'bg-green-50 text-green-600'
          : darkMode
            ? 'text-gray-300 hover:bg-gray-700'
            : 'text-gray-700 hover:bg-gray-50'
      }`}
      type="button"
    >
      <div className="flex items-center space-x-3">
        <span className={active ? 'text-green-600' : darkMode ? 'text-gray-400' : 'text-gray-500'}>{icon}</span>
        <span className="font-medium text-sm">{label}</span>
      </div>
      <ChevronRight size={16} className="text-gray-400" />
    </button>
  )
}

export default function SettingsPage() {
  const { darkMode, setDarkMode } = useTheme()
  const { user } = useAuth()
  // compactView is not in the context in frontend codebase yet, so I'll simulate it locally or assume false
  const [compactView, setCompactView] = useState(false)

  const [activeSection, setActiveSection] = useState('perfil')
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
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
            fullName: user.name
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

  // Notification settings
  const [taskReminders, setTaskReminders] = useState(true)
  const [calendarEvents, setCalendarEvents] = useState(true)
  const [syncedNotes, setSyncedNotes] = useState(false)
  const [weeklySummary, setWeeklySummary] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)

  // Security settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Privacy settings
  const [profilePublic, setProfilePublic] = useState(true)
  const [showEmail, setShowEmail] = useState(false)
  const [showActivity, setShowActivity] = useState(true)
  const [dataCollection, setDataCollection] = useState(true)

  // Language settings
  const [selectedLanguage, setSelectedLanguage] = useState('es')
  const [selectedTimezone, setSelectedTimezone] = useState('America/Bogota')
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY')

  return (
    <div className={`${darkMode ? 'bg-gray-900' : 'bg-[#F6F7FB]'}`}>
      <div className={`max-w-7xl mx-auto ${compactView ? 'p-4' : 'p-8'} ${compactView ? 'pb-24' : 'pb-8'}`}>
        <header className={`sticky top-0 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm ${compactView ? 'p-4' : 'p-6'} mb-6 z-10 animate-in slide-in-from-top duration-300`}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>⚙️ Configuración</h1>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>{getCurrentDate()}</p>
            </div>
          </div>
        </header>

        <div className={`grid grid-cols-1 lg:grid-cols-3 ${compactView ? 'gap-4' : 'gap-6'}`}>
          <div className="lg:col-span-1 animate-in slide-in-from-left duration-500">
            <Card className={`${compactView ? 'p-3' : 'p-4'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl shadow-sm`}>
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
                  icon={<Bell size={18} />}
                  label="Notificaciones"
                  active={activeSection === 'notificaciones'}
                  onClick={() => setActiveSection('notificaciones')}
                />
                <SettingsMenuItem
                  icon={<Palette size={18} />}
                  label="Apariencia"
                  active={activeSection === 'apariencia'}
                  onClick={() => setActiveSection('apariencia')}
                />
                <SettingsMenuItem
                  icon={<Globe size={18} />}
                  label="Idioma y Región"
                  active={activeSection === 'idioma'}
                  onClick={() => setActiveSection('idioma')}
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
              <Card className={`${compactView ? 'p-4' : 'p-6'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl shadow-sm`}>
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} ${compactView ? 'mb-4' : 'mb-6'}`}>
                  Información Personal
                </h2>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="text-xl">Cargando información del perfil...</div>
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
                      <div className={`${compactView ? 'w-16 h-16' : 'w-20 h-20'} rounded-full overflow-hidden bg-green-600 flex items-center justify-center`}>
                        <span className={`text-white ${compactView ? 'text-xl' : 'text-2xl'} font-semibold`}>MG</span>
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
                          className={`mt-1 w-full px-3 ${compactView ? 'py-1.5' : 'py-2'} border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600`}
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
                          className={`mt-1 w-full px-3 ${compactView ? 'py-1.5' : 'py-2'} border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600`}
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
                        className={`mt-1 w-full px-3 ${compactView ? 'py-1.5' : 'py-2'} border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 opacity-60 cursor-not-allowed`}
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
                        className={`mt-1 w-full px-3 ${compactView ? 'py-1.5' : 'py-2'} border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600`}
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
                        className={`mt-1 w-full px-3 ${compactView ? 'py-1.5' : 'py-2'} border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600`}
                      />
                    </div>
                    <div className={compactView ? 'mt-4' : 'mt-6'}>
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                      >
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* SEGURIDAD SECTION */}
            {activeSection === 'seguridad' && (
              <>
                <Card className={`${compactView ? 'p-4' : 'p-6'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl shadow-sm`}>
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
                          className={`mt-1 w-full px-3 ${compactView ? 'py-1.5' : 'py-2'} pr-10 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600`}
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
                        className={`mt-1 w-full px-3 ${compactView ? 'py-1.5' : 'py-2'} border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600`}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password" className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Confirmar Nueva Contraseña
                      </Label>
                      <input
                        id="confirm-password"
                        type="password"
                        className={`mt-1 w-full px-3 ${compactView ? 'py-1.5' : 'py-2'} border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600`}
                      />
                    </div>
                  </div>
                  <div className={compactView ? 'mt-4' : 'mt-6'}>
                    <Button className="bg-green-600 hover:bg-green-700">Actualizar Contraseña</Button>
                  </div>
                </Card>

                <Card className={`${compactView ? 'p-4' : 'p-6'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl shadow-sm`}>
                  <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} ${compactView ? 'mb-4' : 'mb-6'}`}>
                    Autenticación de Dos Factores
                  </h2>
                  <div className={`flex items-center justify-between ${compactView ? 'py-2' : 'py-3'}`}>
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Habilitar 2FA
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                        Añade una capa extra de seguridad a tu cuenta
                      </p>
                    </div>
                    <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
                  </div>
                  {twoFactorAuth && (
                    <div className={`${compactView ? 'mt-3' : 'mt-4'} p-4 ${darkMode ? 'bg-gray-700' : 'bg-green-50'} rounded-lg`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Escanea este código QR con tu aplicación de autenticación
                      </p>
                      <div className={`${compactView ? 'w-32 h-32' : 'w-40 h-40'} ${darkMode ? 'bg-gray-600' : 'bg-white'} rounded-lg mt-3 mx-auto flex items-center justify-center`}>
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-400'}>QR Code</span>
                      </div>
                    </div>
                  )}
                </Card>

                <Card className={`${compactView ? 'p-4' : 'p-6'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl shadow-sm`}>
                  <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} ${compactView ? 'mb-4' : 'mb-6'}`}>
                    Sesiones Activas
                  </h2>
                  <div className={compactView ? 'space-y-2' : 'space-y-3'}>
                    <div className={`p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Chrome en Windows</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Bogotá, Colombia • Ahora</p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Activa</span>
                      </div>
                    </div>
                    <div className={`p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Safari en iPhone</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Medellín, Colombia • Hace 2 días</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          Cerrar
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className={compactView ? 'mt-3' : 'mt-4'}>
                    <Button variant="outline" className="w-full">Cerrar todas las sesiones</Button>
                  </div>
                </Card>
              </>
            )}

            {/* NOTIFICACIONES SECTION */}
            {activeSection === 'notificaciones' && (
              <Card className={`${compactView ? 'p-4' : 'p-6'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl shadow-sm`}>
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} ${compactView ? 'mb-4' : 'mb-6'}`}>
                  Preferencias de Notificaciones
                </h2>
                <div className={compactView ? 'space-y-3' : 'space-y-4'}>
                  <div className={`flex items-center justify-between ${compactView ? 'py-2' : 'py-3'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notificaciones por email</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Recibe actualizaciones por correo electrónico</p>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>
                  <div className={`flex items-center justify-between ${compactView ? 'py-2' : 'py-3'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notificaciones push</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Recibe notificaciones en tiempo real</p>
                    </div>
                    <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                  </div>
                  <div className={`flex items-center justify-between ${compactView ? 'py-2' : 'py-3'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recordatorios de tareas</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Recibe notificaciones sobre tareas pendientes</p>
                    </div>
                    <Switch checked={taskReminders} onCheckedChange={setTaskReminders} />
                  </div>
                  <div className={`flex items-center justify-between ${compactView ? 'py-2' : 'py-3'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Eventos del calendario</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Recibe alertas sobre próximos eventos</p>
                    </div>
                    <Switch checked={calendarEvents} onCheckedChange={setCalendarEvents} />
                  </div>
                  <div className={`flex items-center justify-between ${compactView ? 'py-2' : 'py-3'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notas sincronizadas</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Notificaciones cuando se actualicen tus notas</p>
                    </div>
                    <Switch checked={syncedNotes} onCheckedChange={setSyncedNotes} />
                  </div>
                  <div className={`flex items-center justify-between ${compactView ? 'py-2' : 'py-3'}`}>
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Resumen semanal</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Recibe un resumen de tu progreso cada semana</p>
                    </div>
                    <Switch checked={weeklySummary} onCheckedChange={setWeeklySummary} />
                  </div>
                </div>
              </Card>
            )}

            {/* APARIENCIA SECTION */}
            {activeSection === 'apariencia' && (
              <Card className={`${compactView ? 'p-4' : 'p-6'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl shadow-sm`}>
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} ${compactView ? 'mb-4' : 'mb-6'}`}>
                  Personalización de la Interfaz
                </h2>
                <div className={compactView ? 'space-y-3' : 'space-y-4'}>
                  <div className={`flex items-center justify-between ${compactView ? 'py-2' : 'py-3'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Modo oscuro</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Activa el tema oscuro en toda la aplicación</p>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} />
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
                      <Button variant="outline" size="sm">Pequeña</Button>
                      <Button variant="outline" size="sm" className="bg-green-50 border-green-600 text-green-600">Media</Button>
                      <Button variant="outline" size="sm">Grande</Button>
                    </div>
                  </div>
                  <div className={compactView ? 'py-2' : 'py-3'}>
                    <Label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3 block`}>
                      Color de acento
                    </Label>
                    <div className="flex gap-2">
                      <button className="w-10 h-10 rounded-full bg-green-600 border-2 border-green-700 flex items-center justify-center">
                        <Check size={20} className="text-white" />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-blue-600 hover:border-2 hover:border-blue-700"></button>
                      <button className="w-10 h-10 rounded-full bg-purple-600 hover:border-2 hover:border-purple-700"></button>
                      <button className="w-10 h-10 rounded-full bg-orange-600 hover:border-2 hover:border-orange-700"></button>
                      <button className="w-10 h-10 rounded-full bg-pink-600 hover:border-2 hover:border-pink-700"></button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* IDIOMA Y REGIÓN SECTION */}
            {activeSection === 'idioma' && (
              <Card className={`${compactView ? 'p-4' : 'p-6'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl shadow-sm`}>
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} ${compactView ? 'mb-4' : 'mb-6'}`}>
                  Configuración Regional
                </h2>
                <div className={compactView ? 'space-y-3' : 'space-y-4'}>
                  <div>
                    <Label htmlFor="language" className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Idioma
                    </Label>
                    <select
                      id="language"
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className={`mt-1 w-full px-3 ${compactView ? 'py-1.5' : 'py-2'} border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600`}
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="pt">Português</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="timezone" className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Zona Horaria
                    </Label>
                    <select
                      id="timezone"
                      value={selectedTimezone}
                      onChange={(e) => setSelectedTimezone(e.target.value)}
                      className={`mt-1 w-full px-3 ${compactView ? 'py-1.5' : 'py-2'} border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600`}
                    >
                      <option value="America/Bogota">Bogotá (GMT-5)</option>
                      <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                      <option value="America/Buenos_Aires">Buenos Aires (GMT-3)</option>
                      <option value="America/Santiago">Santiago (GMT-3)</option>
                      <option value="Europe/Madrid">Madrid (GMT+1)</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="dateformat" className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Formato de Fecha
                    </Label>
                    <select
                      id="dateformat"
                      value={dateFormat}
                      onChange={(e) => setDateFormat(e.target.value)}
                      className={`mt-1 w-full px-3 ${compactView ? 'py-1.5' : 'py-2'} border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600`}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div className={`p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <strong>Vista previa:</strong> {new Date().toLocaleDateString('es-CO')}
                    </p>
                  </div>
                </div>
                <div className={compactView ? 'mt-4' : 'mt-6'}>
                  <Button className="bg-green-600 hover:bg-green-700">Guardar Cambios</Button>
                </div>
              </Card>
            )}

            {/* PRIVACIDAD SECTION */}
            {activeSection === 'privacidad' && (
              <>
                <Card className={`${compactView ? 'p-4' : 'p-6'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl shadow-sm`}>
                  <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} ${compactView ? 'mb-4' : 'mb-6'}`}>
                    Configuración de Privacidad
                  </h2>
                  <div className={compactView ? 'space-y-3' : 'space-y-4'}>
                    <div className={`flex items-center justify-between ${compactView ? 'py-2' : 'py-3'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Perfil público</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Permite que otros usuarios vean tu perfil</p>
                      </div>
                      <Switch checked={profilePublic} onCheckedChange={setProfilePublic} />
                    </div>
                    <div className={`flex items-center justify-between ${compactView ? 'py-2' : 'py-3'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Mostrar email</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tu email será visible en tu perfil público</p>
                      </div>
                      <Switch checked={showEmail} onCheckedChange={setShowEmail} />
                    </div>
                    <div className={`flex items-center justify-between ${compactView ? 'py-2' : 'py-3'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Mostrar actividad</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Otros pueden ver tu última actividad</p>
                      </div>
                      <Switch checked={showActivity} onCheckedChange={setShowActivity} />
                    </div>
                    <div className={`flex items-center justify-between ${compactView ? 'py-2' : 'py-3'}`}>
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recopilación de datos</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Permitir análisis para mejorar la experiencia</p>
                      </div>
                      <Switch checked={dataCollection} onCheckedChange={setDataCollection} />
                    </div>
                  </div>
                </Card>

                <Card className={`${compactView ? 'p-4' : 'p-6'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl shadow-sm`}>
                  <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} ${compactView ? 'mb-4' : 'mb-6'}`}>
                    Gestión de Datos
                  </h2>
                  <div className={compactView ? 'space-y-2' : 'space-y-3'}>
                    <Button variant="outline" className="w-full justify-start">
                      Descargar mis datos
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                      Eliminar mi cuenta
                    </Button>
                  </div>
                  <div className={`${compactView ? 'mt-3' : 'mt-4'} p-3 ${darkMode ? 'bg-gray-700' : 'bg-yellow-50'} rounded-lg`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      ⚠️ La eliminación de cuenta es permanente y no se puede deshacer
                    </p>
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
