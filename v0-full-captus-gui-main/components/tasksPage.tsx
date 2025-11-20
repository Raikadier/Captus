'use client'

import React, { useState } from 'react'
import { Filter, SearchIcon, Flame, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { useTheme } from '@/contexts/themeContext'

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { darkMode } = useTheme()

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <header className={`rounded-xl shadow-sm p-6 mb-6 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div>
            <h1 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Mis Tareas
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Gestiona tus tareas y mantén tu racha de productividad
            </p>
          </div>
        </header>

        <Card className={`p-6 rounded-xl shadow-sm mb-6 border-0 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame size={20} className="text-orange-500" />
              <h2 className="text-lg font-semibold text-gray-900">Mi Racha</h2>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Target size={16} />
              <span>Meta: 5 tareas/día</span>
            </div>
          </div>

          <div className="text-center py-4">
            <div className="text-6xl font-bold text-gray-400 mb-2">0</div>
            <p className="text-gray-600 mb-3">días consecutivos</p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <span className="inline-block">📅</span>
              <span>Completa tareas hoy para mantener la racha</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progreso diario</span>
              <span className="font-medium">0/5</span>
            </div>
            <Progress value={0} className="h-2" />
          </div>
        </Card>

        <Card className={`p-5 rounded-xl shadow-sm mb-6 border-0 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Button variant="outline" className={`border-gray-300 hover:bg-gray-50 text-gray-700 ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : 'bg-white'
            }`}>
              <Filter size={18} className="mr-2" />
              Filtros
            </Button>
            <div className="flex-1" />
            <span className={`text-sm self-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              0 de 0 tareas
            </span>
          </div>

          <div className="relative">
            <SearchIcon className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`} size={18} />
            <Input
              placeholder="Buscar tareas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 border-gray-300 focus:border-green-600 focus:ring-green-600 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500' : ''
              }`}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}
