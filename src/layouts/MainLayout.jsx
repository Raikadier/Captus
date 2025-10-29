// MainLayout - Estructura principal con Sidebar fijo y soporte móvil
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Menu } from 'lucide-react';

const MainLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      {/* Barra superior (solo móvil) */}
      <header className="lg:hidden sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            aria-label="Abrir menú"
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>
          <h1 className="text-base font-semibold text-green-700">Captus</h1>
          <span className="w-6" />
        </div>
      </header>

      {/* Sidebar en escritorio */}
      <div className="hidden lg:block">
        <Sidebar onNavigate={() => setMobileOpen(false)} />
      </div>

      {/* Sidebar en móvil con overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-30 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="lg:hidden z-40">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </>
      )}

      {/* Contenido principal */}
      <main className="lg:ml-60 p-4 lg:p-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;

