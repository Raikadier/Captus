import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TeacherSidebar from './TeacherSidebar'

const MainLayout = ({ children }) => {
  const location = useLocation()
  const isTeacher = location.pathname.startsWith('/teacher')

  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      {isTeacher ? <TeacherSidebar /> : <Sidebar />}
      <div className="min-h-screen ml-60 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] px-4 md:px-6 pb-8">
        {children || <Outlet />}
      </div>
    </div>
  )
}

export default MainLayout
