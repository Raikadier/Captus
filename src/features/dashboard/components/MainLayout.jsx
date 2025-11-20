import React, { useState } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import Sidebar from './Sidebar'
import TeacherSidebar from './TeacherSidebar'
import { Button } from '../../../ui/button'

const MainLayout = ({ children }) => {
  const location = useLocation()
  const isTeacher = location.pathname.startsWith('/teacher')
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Don't show the floating button on the chatbot page itself to avoid redundancy
  const showFloatingButton = location.pathname !== '/chatbot'

  return (
    <div className="min-h-screen bg-background animate-in fade-in duration-500">
      {isTeacher ? (
        <TeacherSidebar />
      ) : (
        <Sidebar onCollapseChange={setIsCollapsed} />
      )}
      <div
        className={`min-h-screen transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isCollapsed ? 'ml-20' : 'ml-60'
        }`}
      >
        {children || <Outlet />}
      </div>

      {showFloatingButton && (
        <Link to="/chatbot" title="Hablar con Captus AI">
          <Button
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 animate-pulse z-50"
            size="icon"
          >
            <Sparkles size={24} />
          </Button>
        </Link>
      )}
    </div>
  )
}

export default MainLayout
