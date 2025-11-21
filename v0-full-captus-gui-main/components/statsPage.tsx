'use client'

import React from 'react'
import Link from 'next/link'
import { Sparkles, TrendingUp, CheckSquare, Target, Award, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

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

const subjects = [
  { name: 'Matemáticas III', grade: 8.5, progress: 85, tasks: 12, color: 'blue' },
  { name: 'Literatura Española', grade: 9.0, progress: 90, tasks: 8, color: 'purple' },
  { name: 'Historia Mundial', grade: 7.8, progress: 78, tasks: 10, color: 'red' },
  { name: 'Química Orgánica', grade: 8.2, progress: 82, tasks: 15, color: 'orange' },
  { name: 'Programación Web', grade: 9.2, progress: 92, tasks: 6, color: 'green' },
  { name: 'Filosofía Moderna', grade: 8.0, progress: 80, tasks: 9, color: 'yellow' },
]

const stats = {
  averageGrade: 8.45,
  completedTasks: 48,
  totalTasks: 60,
  studyHours: 156,
  streak: 12,
}

function StatCard({ icon, label, value, bgColor }: { icon: React.ReactNode; label: string; value: string; bgColor: string }) {
  return (
    <Card className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div className={`${bgColor} p-4 rounded-xl`}>{icon}</div>
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600 mt-1">{label}</p>
        </div>
      </div>
    </Card>
  )
}

function SubjectProgress({ subject }: { subject: typeof subjects[0] }) {
  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-600',
      purple: 'bg-purple-600',
      green: 'bg-green-600',
      orange: 'bg-orange-600',
      red: 'bg-red-600',
      yellow: 'bg-yellow-600',
    }
    return colors[color] || 'bg-gray-600'
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="font-medium text-gray-900">{subject.name}</h3>
          <p className="text-sm text-gray-500">{subject.tasks} tareas</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">{subject.grade}</p>
          <p className="text-sm text-gray-500">Promedio</p>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all ${getColorClass(subject.color)}`}
          style={{ width: `${subject.progress}%` }}
        />
      </div>
    </div>
  )
}

function MonthBar({ month, color, value, label }: { month: string; color: string; value: number; label: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600">{month}</span>
      <div className="flex items-center gap-2">
        <div className="w-32 bg-gray-200 rounded-full h-2">
          <div className={`${color} h-2 rounded-full`} style={{ width: `${value}%` }} />
        </div>
        <span className="text-sm font-medium text-gray-900">{label}</span>
      </div>
    </div>
  )
}

export default function StatsPage() {
  const completionPercent = Math.round((stats.completedTasks / stats.totalTasks) * 100)
  const circumference = 2 * Math.PI * 88
  const strokeDasharray = `${(stats.completedTasks / stats.totalTasks) * circumference} ${circumference}`

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 size={24} className="text-gray-400" />
                <h1 className="text-2xl font-bold text-gray-900">Mis Estadísticas</h1>
              </div>
              <p className="text-gray-600 text-sm">{getCurrentDate()}</p>
            </div>
          </div>
        </header>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            icon={<TrendingUp className="text-green-600" size={28} />}
            label="Promedio General"
            value={stats.averageGrade.toFixed(2)}
            bgColor="bg-green-50"
          />
          <StatCard
            icon={<CheckSquare className="text-blue-600" size={28} />}
            label="Tareas Completadas"
            value={`${stats.completedTasks}/${stats.totalTasks}`}
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<Target className="text-orange-600" size={28} />}
            label="Horas de Estudio"
            value={`${stats.studyHours}h`}
            bgColor="bg-orange-50"
          />
          <StatCard
            icon={<Award className="text-purple-600" size={28} />}
            label="Racha Actual"
            value={`${stats.streak} días`}
            bgColor="bg-purple-50"
          />
        </div>

        {/* Progress by Subject */}
        <Card className="p-6 bg-white rounded-xl shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Progreso por Materia</h2>
          <div className="space-y-6">
            {subjects.map((subject) => (
              <SubjectProgress key={subject.name} subject={subject} />
            ))}
          </div>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Completación de Tareas</h2>
            <div className="flex items-center justify-center h-64">
              <div className="relative w-48 h-48">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle cx="96" cy="96" r="88" stroke="#E5E7EB" strokeWidth="16" fill="none" className="opacity-30" />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="#10b981"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={strokeDasharray}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-4xl font-bold text-gray-900">{completionPercent}%</span>
                  <span className="text-sm text-gray-500">Completado</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Rendimiento Mensual</h2>
            <div className="space-y-4 pt-8">
              <MonthBar month="Septiembre" color="bg-blue-600" value={75} label="7.5" />
              <MonthBar month="Octubre" color="bg-green-600" value={85} label="8.5" />
              <MonthBar month="Noviembre" color="bg-green-600" value={90} label="9.0" />
            </div>
          </Card>
        </div>
      </div>

      {/* Floating AI Chat Button */}
      <Link href="/chatbot">
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
          size="icon"
        >
          <Sparkles size={24} />
        </Button>
      </Link>
    </div>
  )
}
