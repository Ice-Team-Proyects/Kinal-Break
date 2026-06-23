import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../features/auth/store/authStore.js";
import { Menu as MenuIcon } from "lucide-react";
import Sidebar from "../../../shared/component/layout/Sidebar.jsx";
import Logo from "../../../assets/Logo.png";
import BackLogin from "../../../assets/BackLogin.png";
import { ClosedOverlay } from "./ClosedOverlay.jsx";

// Returns true if current local time is outside service hours (6:15 AM – 3:20 PM)
function isClosedTime() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const totalMinutes = h * 60 + m;
  const openMinutes  = 6 * 60 + 15;   // 06:15
  const closeMinutes = 15 * 60 + 20;  // 15:20
  return totalMinutes < openMinutes || totalMinutes >= closeMinutes;
}

export default function DashboardContainer() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [closed, setClosed] = useState(false);
  const [devBypass, setDevBypass] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  // Check service hours every minute
  useEffect(() => {
    const check = () => {
      // Only block USER_ROLE — ADMIN_ROLE always has access
      if (user?.role === 'USER_ROLE') {
        setClosed(isClosedTime());
      } else {
        setClosed(false);
      }
    };
    check();
    const interval = setInterval(check, 60_000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-[#efedf0] antialiased text-[#1b1b1e]">
      
      {/* Sidebar del panel */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Vista de Contenido */}
      <main 
        className="flex-1 h-full overflow-y-auto flex flex-col relative"
        style={{
          backgroundImage: `url(${BackLogin})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        {/* Capa de desenfoque y opacidad */}
        <div className="absolute inset-0 bg-white/85 backdrop-blur-[6px] z-0" />

        {/* Header Superior Móvil */}
        <header className="md:hidden flex justify-between items-center px-4 h-[72px] bg-white border-b-2 border-[#031633] sticky top-0 z-30 shadow-md">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="text-[#031633] hover:text-[#ff8928] p-1 rounded-lg"
            >
              <MenuIcon size={28} />
            </button>
            <div className="bg-white rounded-xl border border-[#031633] p-1">
              <img 
                alt="Logo Kinal" 
                className="w-10 h-10 object-contain" 
                src={Logo}
              />
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#ff8928] border-2 border-[#031633] shadow-[2px_2px_0_0_#031633] flex items-center justify-center text-white font-black text-sm">
            {user?.username?.[0]?.toUpperCase() || 'K'}
          </div>
        </header>

        {/* Contenedor Principal */}
        <div className="p-4 md:p-8 flex-1 max-w-[1400px] mx-auto w-full relative z-10">
          <header className="mb-8 pt-4 md:pt-2">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#031633] manga-title uppercase">
              {user?.role === 'ADMIN_ROLE' ? 'Panel de Administración' : 'Menú Cafetería'}
            </h2>
            <p className="font-sans text-body-lg text-[#ff8928] font-bold mt-2 uppercase tracking-wide flex items-center gap-2">
              <span className="w-8 h-1 bg-[#ff8928] inline-block rounded-full"></span>
              Bienvenido, {user?.name ? user.name.split(' ')[0] : (user?.username || 'Usuario')}
            </p>
          </header>

          <div className="mb-6">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Dev Bypass floating button (only shown when closed and bypass is active) */}
      {closed && devBypass && (
        <button
          onClick={() => setDevBypass(false)}
          className="fixed bottom-4 right-4 z-[9999] px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl border-2 border-[#031633] font-black shadow-[4px_4px_0_0_#031633] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#031633] active:translate-y-[4px] active:shadow-none transition-all text-xs flex items-center gap-2"
        >
          <span>🔒</span> REACTIVAR CIERRE (DEV)
        </button>
      )}

      {/* Overlay de cierre de servicio (solo USER_ROLE fuera de horario) */}
      {closed && !devBypass && <ClosedOverlay onBypass={() => setDevBypass(true)} />}
    </div>
  );
}