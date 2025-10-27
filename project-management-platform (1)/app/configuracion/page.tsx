"use client"

import type React from "react"
import {
  BookOpen,
  Calendar,
  CheckSquare,
  Home,
  MessageSquare,
  Settings,
  BarChart3,
  StickyNote,
  Bell,
  User,
  Lock,
  Palette,
  Globe,
  Shield,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function ConfiguracionPage() {
  const getCurrentDate = () => {
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    const months = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ]
    const now = new Date()
    return `${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`
  }

  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-60 bg-white border-r border-gray-200 z-10">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <BookOpen className="text-green-600 mr-2" size={24} />
          <h1 className="text-xl font-semibold text-green-600">Captus</h1>
        </div>
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-6 p-3 bg-green-50 rounded-xl">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-green-600 flex items-center justify-center">
              <span className="text-white font-semibold">MG</span>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <p className="font-medium text-gray-900">María García</p>
              <p className="text-xs text-gray-500">Estudiante</p>
            </div>
          </div>

          <nav className="space-y-1">
            <NavItem icon={<Home size={18} />} label="Inicio" href="/" />
            <NavItem icon={<CheckSquare size={18} />} label="Tareas" href="/tareas" />
            <NavItem icon={<Calendar size={18} />} label="Calendario" href="/calendario" />
            <NavItem icon={<StickyNote size={18} />} label="Notas" href="/notas" />
            <NavItem icon={<BarChart3 size={18} />} label="Estadísticas" href="/estadisticas" />
            <NavItem icon={<MessageSquare size={18} />} label="Chat IA" href="/chat" />
            <NavItem icon={<Settings size={18} />} label="Configuración" active />
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-60 p-8">
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
                    <Button variant="outline" size="sm">
                      Cambiar Foto
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                      Nombre
                    </Label>
                    <input
                      id="nombre"
                      type="text"
                      defaultValue="María"
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="apellido" className="text-sm font-medium text-gray-700">
                      Apellido
                    </Label>
                    <input
                      id="apellido"
                      type="text"
                      defaultValue="García"
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <input
                    id="email"
                    type="email"
                    defaultValue="maria.garcia@universidad.edu"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div>
                  <Label htmlFor="carrera" className="text-sm font-medium text-gray-700">
                    Carrera
                  </Label>
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
      <Link href="/chat">
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all"
          size="icon"
          title="Hablar con Captus"
        >
          <MessageSquare size={24} />
        </Button>
      </Link>
    </div>
  )
}

function SettingsMenuItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
        active ? "bg-green-50 text-green-600" : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center space-x-3">
        <span className={active ? "text-green-600" : "text-gray-500"}>{icon}</span>
        <span className="font-medium text-sm">{label}</span>
      </div>
      <ChevronRight size={16} className="text-gray-400" />
    </button>
  )
}

function NavItem({
  icon,
  label,
  active = false,
  href = "#",
}: { icon: React.ReactNode; label: string; active?: boolean; href?: string }) {
  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-colors ${
        active ? "bg-green-50 text-green-600 border-l-4 border-green-600" : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <span className={active ? "text-green-600" : "text-gray-500"}>{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </Link>
  )
}
