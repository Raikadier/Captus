// MainLayout - Layout principal con sidebar fijo como la plantilla
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import TeacherSidebar from './TeacherSidebar';
import { useTheme } from '../../../context/themeContext';

const MainLayout = ({ children }) => {
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { darkMode } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      const sidebar = document.querySelector('[class*="fixed inset-y-0 left-0"]');
      if (sidebar) setSidebarWidth(sidebar.offsetWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const observer = new MutationObserver(handleResize);
    const sidebar = document.querySelector('[class*="fixed inset-y-0 left-0"]');
    if (sidebar) observer.observe(sidebar, { attributes: true, attributeFilter: ['style'] });

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  const isTeacher = location.pathname.startsWith('/teacher');

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#F6F7FB]'}`}>
      {/* Sidebar fijo */}
      {isTeacher ? (
        <TeacherSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      ) : (
        <Sidebar />
      )}

      {/* Contenido principal */}
      <motion.div
        initial={false}
        animate={{ marginLeft: sidebarWidth }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="min-h-screen"
      >
        {children || <Outlet />}
      </motion.div>
    </div>
  );
};

export default MainLayout;
