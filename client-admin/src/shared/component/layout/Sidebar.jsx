import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  Utensils, 
  ReceiptText, 
  Package, 
  Banknote,
  BarChart2,
  LogOut,
  CupSoda,
  X 
} from "lucide-react";
import Logo from "../../../assets/Logo.png";
import { useAuthStore } from "../../../features/auth/store/authStore.js";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isAdmin = user?.role === 'ADMIN_ROLE';
  const isUser  = user?.role === 'USER_ROLE';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Build nav items based on role
  const navItems = [
    // Dashboard only for ADMIN_ROLE
    ...(isAdmin ? [{ id: "dashboard", label: "Panel", icon: Utensils, path: "/" }] : []),
    { id: "products", label: "Productos", icon: Package, path: isUser ? "/" : "/products" },
    { id: "orders", label: "Pedidos", icon: ReceiptText, path: "/orders" },
    // Pagos y Reportes solo para ADMIN_ROLE
    ...(isAdmin ? [
      { id: "payments", label: "Pagos", icon: Banknote, path: "/payments" },
      { id: "reports", label: "Reportes", icon: BarChart2, path: "/reports" },
    ] : []),
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full sidebar-gradient text-white border-r-2 border-[#031633] relative">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 md:hidden text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors z-50 focus:outline-none"
      >
        <X size={24} />
      </button>

      <div className="p-6 flex flex-col items-center border-b-2 border-white/10 mb-4 relative z-10">
        <div className="bg-white p-3 rounded-2xl border-2 border-[#031633] shadow-[2px_2px_0_0_#ff8928] mb-3 transform -rotate-2 cursor-pointer transition-transform hover:rotate-0">
          <img 
            alt="Kinal-Break Logo" 
            className="w-20 h-20 object-contain" 
            src={Logo}
          />
        </div>
        <h1 className="text-2xl font-black text-[#ff8928] text-center leading-tight uppercase tracking-wider anime-glow-text-secondary">
          {isAdmin ? 'Admin' : 'Menú'}
        </h1>
        <p className="text-xs text-[#8293b6] tracking-widest uppercase font-semibold opacity-90 text-center mt-1">
          Cafeteria
        </p>
        {user?.role && (
          <span className={`mt-2 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
            isAdmin 
              ? 'bg-[#ff8928]/20 border-[#ff8928]/50 text-[#ff8928]' 
              : 'bg-white/10 border-white/20 text-white/70'
          }`}>
            {isAdmin ? 'Administrador' : (user?.username || 'Estudiante')}
          </span>
        )}
      </div>

      {/* Lista de Navegación del Sidebar */}
      <div className="flex-1 overflow-y-auto py-2 relative z-10">
        <ul className="space-y-3 px-3">
          {navItems.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.path}
                end={item.path === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  `w-full flex items-center px-4 py-3 rounded-2xl transition-all duration-200 text-left ${
                    isActive
                      ? "bg-[#ff8928] text-white border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] font-bold transform -translate-y-0.5"
                      : "text-white/80 hover:text-white hover:bg-[#364766]/50"
                  }`
                }
              >
                <div className="mr-3 text-white/80">
                  <item.icon size={20} />
                </div>
                <span className="text-sm font-bold tracking-wider uppercase">
                  {item.label}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Botón Cerrar Sesión */}
      <div className="p-4 border-t-2 border-white/10 relative z-10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/10 hover:bg-[#7d0a42]/60 text-white rounded-2xl font-bold text-sm uppercase tracking-wider border-2 border-white/20 hover:border-[#7d0a42] transition-all cursor-pointer"
        >
          <LogOut size={16} />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar para pantallas Grandes (Desktop) */}
      <aside className="w-64 h-full hidden md:block shrink-0 relative z-40">
        {sidebarContent}
      </aside>

      {/* Drawer deslizante para pantallas móviles */}
      <aside className={`fixed inset-y-0 left-0 w-64 z-50 transition-transform duration-300 md:hidden ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {sidebarContent}
      </aside>
    </>
  );
}