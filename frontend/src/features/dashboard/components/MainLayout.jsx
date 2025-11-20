import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TeacherSidebar from './TeacherSidebar';
// eslint-disable-next-line no-unused-vars
import { useTheme } from '../../../context/themeContext';

const MainLayout = ({ children }) => {
  const [sidebarWidth, setSidebarWidth] = useState(240);
  // eslint-disable-next-line no-unused-vars
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const sidebar = document.querySelector('[class*="fixed inset-y-0 left-0"]');
      if (sidebar) setSidebarWidth(sidebar.offsetWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const observer = new MutationObserver(handleResize);
    const sidebar = document.querySelector('[class*="fixed inset-y-0 left-0"]');
    if (sidebar) observer.observe(sidebar, { attributes: true, attributeFilter: ['style', 'class'] });

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  const isTeacher = location.pathname.startsWith('/teacher');

  return (
    <div className="min-h-screen bg-background animate-in fade-in duration-500">
      {/* Sidebar fijo */}
      {isTeacher ? (
        <TeacherSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      ) : (
        <Sidebar />
      )}

      {/* Contenido principal */}
      <div
        style={{ marginLeft: sidebarWidth }}
        className="min-h-screen transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
      >
        {children || <Outlet />}
      </div>
    </div>
  );
};

export default MainLayout;
