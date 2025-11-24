import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, MessageSquare, TrendingUp, CheckSquare, Target, Award, Settings, PlusCircle, CheckCircle2, ListChecks } from 'lucide-react'
import { Button } from '../../ui/button'
import { Card } from '../../ui/card'
import apiClient from '../../shared/api/client'
import Loading from '../../ui/loading'
import { ManageSubjectsDialog } from '../subjects/components/ManageSubjectsDialog'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

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
  // New state for detailed task stats
  const [taskStats, setTaskStats] = useState({
    tasksCreatedToday: 0,
    tasksCompletedToday: 0,
    subTasksCompletedToday: 0,
    productivityChart: [],
    totalCompleted: 0,
    weeklyCompletionRate: 0
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const [generalResponse, taskResponse] = await Promise.all([
        apiClient.get('/statistics'),
        apiClient.get('/statistics/tasks')
      ]);

      const data = generalResponse.data?.data || generalResponse.data;
      const tData = taskResponse.data;

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

      if (tData) {
        setTaskStats({
          tasksCreatedToday: tData.tasksCreatedToday || 0,
          tasksCompletedToday: tData.tasksCompletedToday || 0,
          subTasksCompletedToday: tData.subTasksCompletedToday || 0,
          productivityChart: tData.productivityChart || [],
          totalCompleted: tData.totalCompleted || 0,
          weeklyCompletionRate: tData.weeklyCompletionRate || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Use taskStats for completion percentage if available, otherwise fallback
  const completionPercent = taskStats.weeklyCompletionRate;

  const circumference = 2 * Math.PI * 88;
  const strokeDasharray = `${(completionPercent / 100) * circumference} ${circumference}`;

  if (loading) {
     return <Loading message="Cargando estadísticas..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <header className="sticky top-0 bg-card rounded-xl shadow-sm p-6 mb-6 z-10 border border-border">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">📊 Mis Estadísticas</h1>
              <p className="text-muted-foreground mt-1">{getCurrentDate()}</p>
            </div>
            <ManageSubjectsDialog
              onUpdate={fetchStats}
              trigger={
                <Button variant="outline" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Gestionar Materias
                </Button>
              }
            />
          </div>
        </header>

        {/* Daily Stats Row (New Requirement A) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
           <StatCard
            icon={<PlusCircle className="text-blue-600" size={24} />}
            label="Tareas Creadas Hoy"
            value={taskStats.tasksCreatedToday}
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<CheckCircle2 className="text-green-600" size={24} />}
            label="Tareas Completadas Hoy"
            value={taskStats.tasksCompletedToday}
            bgColor="bg-green-50"
          />
          <StatCard
            icon={<ListChecks className="text-purple-600" size={24} />}
            label="Subtareas Completadas"
            value={taskStats.subTasksCompletedToday}
            bgColor="bg-purple-50"
          />
        </div>

        {/* Key Stats (Existing + Enhanced) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            icon={<TrendingUp className="text-green-600" size={28} />}
            label="Promedio General"
            value={stats.averageGrade.toFixed(2)}
            bgColor="bg-green-50"
          />
          <StatCard
            icon={<CheckSquare className="text-blue-600" size={28} />}
            label="Total Completadas"
            value={taskStats.totalCompleted} // Using real total
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<Target className="text-orange-600" size={28} />}
            label="Productividad Semanal"
            value={`${taskStats.weeklyCompletionRate}%`} // Using real rate
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
          <Card className="p-6 bg-card rounded-xl shadow-sm mb-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-6">Progreso por Materia</h2>
            <div className="space-y-6">
              {stats.subjects.map((subject) => (
                <SubjectProgress key={subject.id || subject.name} subject={subject} />
              ))}
            </div>
          </Card>
        ) : (
           <Card className="p-6 bg-card rounded-xl shadow-sm mb-6 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-2">Materias</h2>
              <p className="text-muted-foreground">No hay materias registradas aún. ¡Agrega algunas para ver tu progreso académico!</p>
           </Card>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Productivity Chart (New Requirement B) */}
          <Card className="p-6 bg-card rounded-xl shadow-sm border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Productividad Semanal</h2>
            <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={taskStats.productivityChart}>
                    <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                    <Tooltip
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)' }}
                    />
                    <Bar dataKey="created" name="Creadas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="completed" name="Completadas" fill="#22c55e" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
          </Card>

          {/* Completion Circle */}
          <Card className="p-6 bg-card rounded-xl shadow-sm border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Tasa de Cumplimiento Semanal</h2>
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
                  <span className="text-4xl font-bold text-foreground">{completionPercent}%</span>
                  <span className="text-sm text-muted-foreground">Esta Semana</span>
                </div>
              </div>
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
