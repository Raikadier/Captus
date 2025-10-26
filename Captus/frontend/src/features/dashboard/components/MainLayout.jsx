// MainLayout - Equivalent to frmMain.cs layout
// Main application layout with sidebar and content area
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const MainLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar with menu toggle (for mobile) */}
        <div className="bg-white shadow-sm border-b p-4 md:hidden">
          <button
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="p-2 rounded hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;