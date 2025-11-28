import SidebarDocente from "../componentsDc/SidebarDocente";

export default function MainLayoutDocente({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <SidebarDocente />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6 md:ml-64 transition-all duration-300">
        {children}
      </main>

    </div>
  );
}
