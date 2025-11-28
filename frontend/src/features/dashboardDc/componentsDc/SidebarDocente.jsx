import { useState } from "react";
import { ChevronFirst, Menu } from "lucide-react";
import { Link } from "react-router-dom";

export default function SidebarDocente() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* BOTÓN RESPONSIVE */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-pink-500 text-white rounded-lg"
        onClick={() => setOpen(!open)}
      >
        <Menu size={22} />
      </button>

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg border-r 
          transform transition-transform duration-300 md:translate-x-0 
          ${open ? "translate-x-0" : "-translate-x-64"}`}
      >
        {/* LOGO */}
        <div className="flex items-center justify-between p-4 border-b">
          <img src="frontend/public/Logo_Captus.png" className="w-32" alt="Captus Logo" />

          <button className="hidden md:block p-2 rounded-lg hover:bg-gray-100">
            <ChevronFirst size={20} />
          </button>
        </div>

        {/* MENÚ */}
        <nav className="flex flex-col gap-2 p-4 text-gray-700">

          <Link className="sidebar-item" to="/teacher-dashboard">📊 Dashboard</Link>
          <Link className="sidebar-item" to="/teacher-courses">📘 Mis Cursos</Link>
          <Link className="sidebar-item" to="/teacher-students">👥 Estudiantes</Link>
          <Link className="sidebar-item" to="/teacher-register-notes">📝 Registrar Notas</Link>
          <Link className="sidebar-item" to="/teacher-reports">📄 Reportes</Link>
          <Link className="sidebar-item" to="/teacher-settings">⚙️ Configuración</Link>

        </nav>
      </aside>
    </>
  );
}
