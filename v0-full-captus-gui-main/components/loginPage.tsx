'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Eye, EyeOff, User, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [name, setName] = useState('')
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    setLoading(true)

    try {
      // Simulate auth - replace with actual auth
      setTimeout(() => {
        setLoading(false)
        if (isRegistering) {
          setSuccessMessage('Registro exitoso. Puedes iniciar sesión.')
          setIsRegistering(false)
        } else {
          // Check if login is for teacher
          if (email === 'teacher@gmail.com' && password === '123456789') {
            router.push('/teacher/home')
          } else {
            router.push('/home')
          }
        }
      }, 1000)
    } catch (err) {
      setError('Ocurrió un error inesperado')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-600 p-3 rounded-xl">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isRegistering ? 'Únete a Captus' : 'Accede a tu cuenta de Captus'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {isRegistering && (
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full"
                  placeholder="Tu nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            {isRegistering && (
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo de usuario
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUserRole('student')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      userRole === 'student'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <GraduationCap className={`h-6 w-6 ${userRole === 'student' ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${userRole === 'student' ? 'text-green-600' : 'text-gray-700'}`}>
                      Estudiante
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserRole('teacher')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      userRole === 'teacher'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <User className={`h-6 w-6 ${userRole === 'teacher' ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${userRole === 'teacher' ? 'text-green-600' : 'text-gray-700'}`}>
                      Profesor
                    </span>
                  </button>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="w-full"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full pr-10"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-600 text-sm">{successMessage}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Cargando...' : (isRegistering ? 'Crear cuenta' : 'Iniciar sesión')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-green-600 hover:text-green-500 text-sm font-medium"
            >
              {isRegistering
                ? '¿Ya tienes cuenta? Inicia sesión'
                : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
