import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Utensils, 
  ReceiptText, 
  Package, 
  
  HelpCircle, 
  Settings,
  X 
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const navItems = [
    { id: "dashboard", label: "Panel", icon: Utensils, path: "/" },
    { id: "products", label: "Productos", icon: Package, path: "/products" },
    { id: "orders", label: "Pedidos", icon: ReceiptText, path: "/orders" },
    
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full sidebar-gradient text-white border-r-2 border-[#031633] relative">
      {/* Botón de cerrar para dispositivos móviles */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 md:hidden text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors z-50 focus:outline-none"
      >
        <X size={24} />
      </button>

      {/* Cabecera de Marca (Logo e Identidad de Kinal-Break) */}
      <div className="p-6 flex flex-col items-center border-b-2 border-white/10 mb-4 relative z-10">
        <div className="bg-white p-3 rounded-2xl border-2 border-[#031633] shadow-[2px_2px_0_0_#ff8928] mb-3 transform -rotate-2 cursor-pointer transition-transform hover:rotate-0">
          <img 
            alt="Kinal-Break Logo" 
            className="w-20 h-20 object-contain" 
            src="https://lh3.googleusercontent.com/aida/AP1WRLtnMJExCd2cDUpUye8d7i4szqQuSC8wdDN3mA4SiuJ4dqvrI_5yQ0QcM9viI2rA5zy9-bpz2rqoVa7FdLaqvam7lHqs-8j1L_0cXhOL9WG8k80XlYXWdU8IkukstVq2JH8ciR7QPV9BE1AhnqtvdwUp6ME66JeYJRX7CytCx_i02Y9EZs-_a--iVehjulY8sqmDHKoUwPJNv6nWL3J6F230K2ATdiSDfJiKyRv_hvhfKTiwxrT2RLLIs1w"
            referrerPolicy="no-referrer"
          />
        </div>
        <h1 className="text-2xl font-black text-[#ff8928] text-center leading-tight uppercase tracking-wider anime-glow-text-secondary">
          Admin
        </h1>
        <p className="text-xs text-[#8293b6] tracking-widest uppercase font-semibold opacity-90 text-center mt-1">
          Cafeteria
        </p>
      </div>

      {/* Lista de Navegación del Sidebar */}
      <div className="flex-1 overflow-y-auto py-2 relative z-10">
        <ul className="space-y-3 px-3">
          {navItems.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.path}
                end={item.path === "/"}
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

      {/* Botón inferior Generador de Reporte y Enlaces de Soporte */}
      <div className="p-6 border-t-2 border-white/10 relative z-10 bg-[#031633]/20">
        <button className="w-full py-3 px-4 bg-[#ff8928] text-white rounded-2xl font-bold text-sm uppercase tracking-wider border-2 border-[#031633] shadow-[3px_3px_0_0_#031633] hover:shadow-[5px_5px_0_0_#031633] transition-all cursor-pointer text-center">
          Generate Report
        </button>
        
        <ul className="mt-4 space-y-2">
          <li>
            <button className="w-full flex items-center px-3 py-2 text-white/70 hover:text-white hover:bg-[#364766]/30 rounded-xl transition-all text-left">
              <HelpCircle size={16} className="mr-3 text-white/50" />
              <span className="text-[11px] font-bold tracking-widest uppercase">Support</span>
            </button>
          </li>
          <li>
            <button className="w-full flex items-center px-3 py-2 text-white/70 hover:text-white hover:bg-[#364766]/30 rounded-xl transition-all text-left">
              <Settings size={16} className="mr-3 text-white/50" />
              <span className="text-[11px] font-bold tracking-widest uppercase">Settings</span>
            </button>
          </li>
        </ul>
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