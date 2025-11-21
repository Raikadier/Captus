import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, MessageSquare, TrendingUp, CheckSquare, Target, Award } from 'lucide-react'
import { Button } from '../../ui/button'
import { Card } from '../../ui/card'
import apiClient from '../../shared/api/client'

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

function StatCard({ icon, label, value, bgColor }) {
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

function SubjectProgress({ subject }) {
  const getColorClass = (color) => {
    const colors = {
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
          {/* Display progress if available, or default text */}
          <p className="text-sm text-gray-500">{subject.progress ? `${subject.progress}% completado` : ''}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">{subject.grade}</p>
          <p className="text-sm text-gray-500">Promedio</p>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all ${getColorClass(subject.color)}`}
          style={{ width: `${subject.progress || 0}%` }}
        />
      </div>
    </div>
  )
}

export default function StatsPage() {
  const [stats, setStats] = useState({
    averageGrade: 0,
    completedTasks: 0,
    totalTasks: 0,
    studyHours: 0,
    racha: 0, // Backend uses 'racha' or 'streak'
    subjects: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/statistics');
        // Backend returns { success: true, data: {...} } or just {...} depending on controller
        // Based on StatisticsController.js: res.status(200).json(result.data) where result.data is the object
        // But let's be safe
        const data = response.data?.data || response.data;

        if (data) {
          setStats({
            averageGrade: data.averageGrade || 0,
            completedTasks: data.completedTasks || 0,
            totalTasks: data.totalTasks || 0,
            studyHours: data.studyHours || 0,
            racha: data.racha || data.streak || 0,
            subjects: data.subjects || []
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const completionPercent = stats.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  const circumference = 2 * Math.PI * 88;
  const strokeDasharray = `${(completionPercent / 100) * circumference} ${circumference}`;

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center bg-[#F6F7FB]">Cargando estadísticas...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <header className="sticky top-0 bg-white rounded-xl shadow-sm p-6 mb-6 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📊 Mis Estadísticas</h1>
              <p className="text-gray-600 mt-1">{getCurrentDate()}</p>
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
            value={`${stats.racha} días`}
            bgColor="bg-purple-50"
          />
        </div>

        {/* Progress by Subject */}
        {stats.subjects && stats.subjects.length > 0 ? (
          <Card className="p-6 bg-white rounded-xl shadow-sm mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Progreso por Materia</h2>
            <div className="space-y-6">
              {stats.subjects.map((subject) => (
                <SubjectProgress key={subject.id || subject.name} subject={subject} />
              ))}
            </div>
          </Card>
        ) : (
           <Card className="p-6 bg-white rounded-xl shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Materias</h2>
              <p className="text-gray-500">No hay materias registradas aún. ¡Agrega algunas para ver tu progreso académico!</p>
           </Card>
        )}

        {/* Charts mock (no external libs) */}
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
            <div className="space-y-4">
              {/* Mock data for monthly performance as backend doesn't support this granularity yet */}
              <MonthBar month="Septiembre" color="bg-blue-600" value={75} label="7.5" />
              <MonthBar month="Octubre" color="bg-green-600" value={85} label="8.5" />
              <MonthBar month="Noviembre" color="bg-green-600" value={90} label="9.0" />
            </div>
          </Card>
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

function MonthBar({ month, color, value, label }) {
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
