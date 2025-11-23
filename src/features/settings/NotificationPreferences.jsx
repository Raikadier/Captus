import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Label } from '../../ui/label'
import { Switch } from '../../ui/switch'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import { Loader2, Save, Bell, Mail, Phone } from 'lucide-react'
import { toast } from 'sonner'

export default function NotificationPreferences() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [prefs, setPrefs] = useState({
    email_enabled: true,
    whatsapp_enabled: false,
    email: '',
    whatsapp: ''
  })

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    try {
      const { data } = await api.get('/notifications/preferences')
      setPrefs({
        email_enabled: data.email_enabled,
        whatsapp_enabled: data.whatsapp_enabled,
        email: data.email || user.email || '',
        whatsapp: data.whatsapp || ''
      })
    } catch (error) {
      console.error('Error fetching preferences', error)
      toast.error('Error al cargar preferencias')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/notifications/preferences', prefs)
      toast.success('Preferencias actualizadas correctamente')
    } catch (error) {
      console.error('Error updating preferences', error)
      toast.error('Error al guardar cambios')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Preferencias de Notificación</h1>
      <p className="text-gray-500 mb-8">Gestiona cómo y cuándo quieres recibir alertas de Captus</p>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Canales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" /> Canales de Comunicación
            </CardTitle>
            <CardDescription>
              Activa los medios por los que deseas ser contactado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Email */}
            <div className="flex items-start justify-between space-x-4">
              <div className="space-y-1">
                <Label htmlFor="email-toggle" className="text-base font-medium">Notificaciones por Correo</Label>
                <p className="text-sm text-gray-500">Recibe resúmenes de tareas, recordatorios y alertas importantes.</p>
              </div>
              <Switch
                id="email-toggle"
                checked={prefs.email_enabled}
                onCheckedChange={(checked) => setPrefs({ ...prefs, email_enabled: checked })}
              />
            </div>

            {prefs.email_enabled && (
              <div className="pl-4 border-l-2 border-gray-100">
                <Label htmlFor="email">Correo Electrónico Alternativo (Opcional)</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={user.email}
                    value={prefs.email}
                    onChange={(e) => setPrefs({ ...prefs, email: e.target.value })}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Si lo dejas vacío, usaremos tu correo de cuenta ({user.email}).</p>
              </div>
            )}

            <div className="border-t border-gray-100 my-4" />

            {/* WhatsApp */}
            <div className="flex items-start justify-between space-x-4">
              <div className="space-y-1">
                <Label htmlFor="whatsapp-toggle" className="text-base font-medium">Notificaciones por WhatsApp</Label>
                <p className="text-sm text-gray-500">Recibe alertas urgentes directamente en tu celular.</p>
              </div>
              <Switch
                id="whatsapp-toggle"
                checked={prefs.whatsapp_enabled}
                onCheckedChange={(checked) => setPrefs({ ...prefs, whatsapp_enabled: checked })}
              />
            </div>

            {prefs.whatsapp_enabled && (
              <div className="pl-4 border-l-2 border-gray-100">
                <Label htmlFor="whatsapp">Número de WhatsApp</Label>
                <div className="relative mt-2">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="+52 123 456 7890"
                    value={prefs.whatsapp}
                    onChange={(e) => setPrefs({ ...prefs, whatsapp: e.target.value })}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Incluye el código de país (ej. +52).</p>
              </div>
            )}

          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="w-full md:w-auto">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Guardar Preferencias
              </>
            )}
          </Button>
        </div>

      </form>
    </div>
  )
}
