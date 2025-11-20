import React from 'react'
import { Link } from 'react-router-dom'
import { Bell, ChevronRight, Globe, Lock, MessageSquare, Palette, Shield, User } from 'lucide-react'
import { Button } from '../../ui/button'
import { Card } from '../../ui/card'
import { Switch } from '../../ui/switch'
import { Label } from '../../ui/label'

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

function SettingsMenuItem({ icon, label, active = false }) {
  return (
    <button
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
        active ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
      }`}
      type="button"
    >
      <div className="flex items-center space-x-3">
        <span className={active ? 'text-green-600' : 'text-gray-500'}>{icon}</span>
        <span className="font-medium text-sm">{label}</span>
      </div>
      <ChevronRight size={16} className="text-gray-400" />
    </button>
  )
}

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <header className="sticky top-0 bg-white rounded-xl shadow-sm p-6 mb-6 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">⚙️ Configuración</h1>
              <p className="text-gray-600 mt-1">{getCurrentDate()}</p>
            </div>
            <Button variant="outline" className="border-gray-300 relative bg-transparent">
              <Bell size={18} className="text-gray-500" />
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Menu */}
          <div className="lg:col-span-1">
            <Card className="p-4 bg-white rounded-xl shadow-sm">
              <nav className="space-y-2">
                <SettingsMenuItem icon={<User size={18} />} label="Perfil" active />
                <SettingsMenuItem icon={<Lock size={18} />} label="Seguridad" />
                <SettingsMenuItem icon={<Bell size={18} />} label="Notificaciones" />
                <SettingsMenuItem icon={<Palette size={18} />} label="Apariencia" />
                <SettingsMenuItem icon={<Globe size={18} />} label="Idioma y Región" />
                <SettingsMenuItem icon={<Shield size={18} />} label="Privacidad" />
              </nav>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Section */}
            <Card className="p-6 bg-white rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Información Personal</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-green-600 flex items-center justify-center">
                    <span className="text-white text-2xl font-semibold">MG</span>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Cambiar Foto</Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre" className="text-sm font-medium text-gray-700">Nombre</Label>
                    <input
                      id="nombre"
                      type="text"
                      defaultValue="María"
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="apellido" className="text-sm font-medium text-gray-700">Apellido</Label>
                    <input
                      id="apellido"
                      type="text"
                      defaultValue="García"
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                  <input
                    id="email"
                    type="email"
                    defaultValue="maria.garcia@universidad.edu"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div>
                  <Label htmlFor="carrera" className="text-sm font-medium text-gray-700">Carrera</Label>
                  <input
                    id="carrera"
                    type="text"
                    defaultValue="Ingeniería de Sistemas"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>
              <div className="mt-6">
                <Button className="bg-green-600 hover:bg-green-700">Guardar Cambios</Button>
              </div>
            </Card>

            {/* Notifications Section */}
            <Card className="p-6 bg-white rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Notificaciones</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Recordatorios de tareas</p>
                    <p className="text-sm text-gray-500">Recibe notificaciones sobre tareas pendientes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Eventos del calendario</p>
                    <p className="text-sm text-gray-500">Recibe alertas sobre próximos eventos</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Notas sincronizadas</p>
                    <p className="text-sm text-gray-500">Notificaciones cuando se actualicen tus notas</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">Resumen semanal</p>
                    <p className="text-sm text-gray-500">Recibe un resumen de tu progreso cada semana</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>

            {/* Appearance Section */}
            <Card className="p-6 bg-white rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Apariencia</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Modo oscuro</p>
                    <p className="text-sm text-gray-500">Activa el tema oscuro en toda la aplicación</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">Vista compacta</p>
                    <p className="text-sm text-gray-500">Reduce el espaciado entre elementos</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating AI Chat Button */}
      <Link to="/chatbot" title="Hablar con Captus">
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all"
          size="icon"
        >
          <MessageSquare size={24} />
        </Button>
      </Link>
    </div>
  )
}
