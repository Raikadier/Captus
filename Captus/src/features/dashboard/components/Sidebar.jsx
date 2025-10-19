// Sidebar - Equivalent to the collapsible sidebar in frmMain.cs
// Animated sidebar with menu items and logo
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Plus,
  List,
  Bot,
  FileText,
  User,
  Calendar,
  Users,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/home', icon: Home, label: 'Home', color: 'text-green-600' },
    { path: '/tasks', icon: List, label: 'TaskList', color: 'text-gray-600' },
    { path: '/chatbot', icon: Bot, label: 'ChatBot', color: 'text-gray-600' },
    { path: '/notes', icon: FileText, label: 'Note', color: 'text-gray-600' },
    { path: '/calendar', icon: Calendar, label: 'Calendario', color: 'text-gray-600' },
    { path: '/groups', icon: Users, label: 'Grupos', color: 'text-gray-600' },
    { path: '/profile', icon: User, label: 'Profile', color: 'text-gray-600' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`bg-green-600 text-white transition-all duration-300 ease-in-out flex flex-col ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      style={{ minHeight: '100vh' }}
    >
      {/* Header with logo and toggle button */}
      <div className="p-4 border-b border-green-500">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <img
                src="/LogoCaptus2Main.png"
                alt="Captus Logo"
                className="h-10 w-10 object-contain"
              />
              <span className="text-xl font-bold text-white">CAPTUS</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded hover:bg-green-700 transition-colors"
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>
      </div>

      {/* Menu items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-3 rounded transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-green-700 shadow-lg'
                      : 'hover:bg-green-700'
                  }`}
                >
                  <Icon size={20} className={item.color} />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout button at bottom */}
      <div className="p-4 border-t border-green-500">
        <button
          onClick={() => {
            // Handle logout
            if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
              // Logout logic here
              window.location.href = '/login';
            }
          }}
          className={`flex items-center space-x-3 px-3 py-3 rounded hover:bg-green-700 transition-colors w-full text-left ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={20} className="text-gray-300" />
          {!isCollapsed && (
            <span className="font-medium">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;