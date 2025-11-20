import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TeacherSidebar from './TeacherSidebar'

const MainLayout = ({ children }) => {
  const location = useLocation()
  const isTeacher = location.pathname.startsWith('/teacher')
  const [isCollapsed, setIsCollapsed] = useState(false)

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
    </div>
  )
}

export default MainLayout
