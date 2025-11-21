import { DashboardLayout } from '@/components/dashboardLayout'
import { ThemeProvider } from '@/contexts/themeContext'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </ThemeProvider>
  )
}
