// MainLayout - Equivalente al diseño de frmMain.cs
// Diseño principal de la aplicación con barra lateral y área de contenido
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import AcademicFooter from '../../shared/components/AcademicFooter';

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-honeydew">
      {/* Barra lateral */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />

      {/* Área principal de contenido */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Barra superior con botón de menú (para móvil) */}
        <div className="bg-white shadow-sm border-b p-4 md:hidden">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Área de contenido */}
        <div className="flex-1 overflow-auto">
          <Outlet />
          <AcademicFooter />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;