// Dashboard docente principal - componente contenedor
import { useAuth } from '@/context/AuthContext'
import { DashboardHeader } from './components/DashboardHeader'
import { DashboardStats } from './components/DashboardStats'
import { PerformanceChart } from './components/PerformanceChart'
import { CourseSelector } from './components/CourseSelector'

export function TeacherDashboard() {
  const { user, profile } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <DashboardHeader
          teacherName={profile?.full_name || user?.email || 'Docente'}
        />

        {/* Course Selector */}
        <div className="mt-8">
          <CourseSelector />
        </div>

        {/* Stats Cards */}
        <div className="mt-8">
          <DashboardStats />
        </div>

        {/* Performance Chart */}
        <div className="mt-8">
          <PerformanceChart />
        </div>
      </div>
    </div>
  )
}
