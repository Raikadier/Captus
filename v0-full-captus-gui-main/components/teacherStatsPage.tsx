'use client'

import React from 'react'
import { BarChart3, Users, ListChecks, BookOpen } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTheme } from '@/contexts/themeContext'

const mockStats = {
  totalCourses: 2,
  totalStudents: 60,
  pendingReviews: 7,
  submissionsToday: 12,
}

export function TeacherStatsPage() {
  const { darkMode, compactView } = useTheme()

  return (
    <div className={compactView ? 'p-4' : 'p-6'}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-2xl shadow-sm ${compactView ? 'p-4' : 'p-6'} ${compactView ? 'mb-4' : 'mb-6'} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className={`${compactView ? 'w-10 h-10' : 'w-12 h-12'} bg-green-100 rounded-xl flex items-center justify-center`}>
              <BarChart3 className="text-green-600" size={compactView ? 20 : 24} />
            </div>
            <div>
              <h1 className={`${compactView ? 'text-xl' : 'text-2xl'} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Estadísticas del Profesor</h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sábado, 15 de noviembre de 2025</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors relative">
            {/* Bell icon and notification dot */}
          </button>
        </div>

        {/* Stats Cards Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${compactView ? 'gap-4 mb-4' : 'gap-6 mb-6'}`}>
          {/* Total Courses */}
          <Card className={`border-none shadow-sm ${darkMode ? 'bg-gray-800' : ''}`}>
            <CardHeader className={compactView ? 'pb-2' : 'pb-3'}>
              <div className="flex items-center justify-between">
                <CardDescription className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Cursos</CardDescription>
                <div className={`${compactView ? 'w-8 h-8' : 'w-10 h-10'} bg-blue-100 rounded-lg flex items-center justify-center`}>
                  <BookOpen className="text-blue-600" size={compactView ? 16 : 20} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`${compactView ? 'text-2xl' : 'text-3xl'} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{mockStats.totalCourses}</div>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>Cursos activos</p>
            </CardContent>
          </Card>

          {/* Total Students */}
          <Card className={`border-none shadow-sm ${darkMode ? 'bg-gray-800' : ''}`}>
            <CardHeader className={compactView ? 'pb-2' : 'pb-3'}>
              <div className="flex items-center justify-between">
                <CardDescription className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Estudiantes</CardDescription>
                <div className={`${compactView ? 'w-8 h-8' : 'w-10 h-10'} bg-purple-100 rounded-lg flex items-center justify-center`}>
                  <Users className="text-purple-600" size={compactView ? 16 : 20} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`${compactView ? 'text-2xl' : 'text-3xl'} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{mockStats.totalStudents}</div>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>En todos los cursos</p>
            </CardContent>
          </Card>

          {/* Pending Reviews */}
          <Card className={`border-none shadow-sm ${darkMode ? 'bg-gray-800' : ''}`}>
            <CardHeader className={compactView ? 'pb-2' : 'pb-3'}>
              <div className="flex items-center justify-between">
                <CardDescription className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Revisiones Pendientes</CardDescription>
                <div className={`${compactView ? 'w-8 h-8' : 'w-10 h-10'} bg-orange-100 rounded-lg flex items-center justify-center`}>
                  <ListChecks className="text-orange-600" size={compactView ? 16 : 20} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`${compactView ? 'text-2xl' : 'text-3xl'} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{mockStats.pendingReviews}</div>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>Por revisar</p>
            </CardContent>
          </Card>

          {/* Submissions Today */}
          <Card className={`border-none shadow-sm ${darkMode ? 'bg-gray-800' : ''}`}>
            <CardHeader className={compactView ? 'pb-2' : 'pb-3'}>
              <div className="flex items-center justify-between">
                <CardDescription className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Entregas de Hoy</CardDescription>
                <div className={`${compactView ? 'w-8 h-8' : 'w-10 h-10'} bg-green-100 rounded-lg flex items-center justify-center`}>
                  <BarChart3 className="text-green-600" size={compactView ? 16 : 20} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`${compactView ? 'text-2xl' : 'text-3xl'} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{mockStats.submissionsToday}</div>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>Entregas recibidas</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart Placeholder */}
        <Card className={`border-none shadow-sm ${darkMode ? 'bg-gray-800' : ''}`}>
          <CardHeader>
            <CardTitle className={`text-lg font-semibold ${darkMode ? 'text-white' : ''}`}>Análisis de Rendimiento</CardTitle>
            <CardDescription className={darkMode ? 'text-gray-400' : ''}>Gráficas y estadísticas detalladas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`h-64 flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg border-2 border-dashed ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="text-center">
                <BarChart3 className={`w-16 h-16 ${darkMode ? 'text-gray-600' : 'text-gray-300'} mx-auto mb-3`} />
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Gráficas próximamente</p>
                <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>Visualizaciones de datos en desarrollo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
