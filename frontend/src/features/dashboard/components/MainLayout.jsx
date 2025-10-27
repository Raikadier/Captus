// MainLayout - Layout principal con sidebar fijo como la plantilla
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      {/* Sidebar fijo */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="ml-60">
        {children || <Outlet />}
      </div>
    </div>
  );
};

export default MainLayout;