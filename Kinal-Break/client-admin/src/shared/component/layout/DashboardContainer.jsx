import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../features/auth/store/authStore.js";
import { 
  Menu as MenuIcon, 
  ShoppingBag, 
  Banknote, 
  Star, 
  TrendingUp, 
  MoreVertical, 
  Store, 
  Power, 
  BarChart, 
  Plus, 
  Trash2, 
  AlertTriangle,
  Bell,
  ArrowRight,
  Package
} from "lucide-react";
import Sidebar from "../../../shared/component/layout/Sidebar.jsx";

export default function DashboardContainer() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-[#efedf0] antialiased text-[#1b1b1e]">
      
      {/* Sidebar del panel */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Vista de Contenido con fondo de marca de cafetería escolar */}
      <main 
        className="flex-1 h-full overflow-y-auto flex flex-col relative"
        style={{
          backgroundImage: "url('https://lh3.googleusercontent.com/aida/AP1WRLtrs5ugCoAftVjbdHpRytrioouUr_NzQ2yyS2Yk24JohsDxeHZZiZapzNf4GTmIUdmOX83w05vI8ZYWOV9whmeX3dQz3v5GA9A8EIPD1968MooWjxfOyEh-zuBegVq-7tS1QHplh1lVJVTa8ha0CAzdfXvOOYwyX6pBcSbT3gfPCc__wiKdrL6ducI43DvUnG62ybdE3efwuPpJB0nt487lmLFdwfyiYrxhGztA7zdELVRuZOL_mGog8zY')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        {/* Capa de desenfoque y opacidad para resaltar el texto */}
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
                src="https://lh3.googleusercontent.com/aida/AP1WRLtnMJExCd2cDUpUye8d7i4szqQuSC8wdDN3mA4SiuJ4dqvrI_5yQ0QcM9viI2rA5zy9-bpz2rqoVa7FdLaqvam7lHqs-8j1L_0cXhOL9WG8k80XlYXWdU8IkukstVq2JH8ciR7QPV9BE1AhnqtvdwUp6ME66JeYJRX7CytCx_i02Y9EZs-_a--iVehjulY8sqmDHKoUwPJNv6nWL3J6F230K2ATdiSDfJiKyRv_hvhfKTiwxrT2RLLIs1w"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#ff8928] border-2 border-[#031633] shadow-[2px_2px_0_0_#031633] flex items-center justify-center text-white font-black text-sm">
            A
          </div>
        </header>

        {/* Contenedor Principal */}
        <div className="p-4 md:p-8 flex-1 max-w-[1400px] mx-auto w-full relative z-10">
          
          {/* Título de la Sección */}
          <header className="mb-8 pt-4 md:pt-2">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#031633] manga-title uppercase">
              Panel de Administración
            </h2>
            <p className="font-sans text-body-lg text-[#ff8928] font-bold mt-2 uppercase tracking-wide flex items-center gap-2">
              <span className="w-8 h-1 bg-[#ff8928] inline-block rounded-full"></span>
              Buenos días, Administrador
            </p>
          </header>

          {/* Grid de Métricas Bento */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            
            {/* Pedidos del Día */}
            <div className="bg-white rounded-3xl p-5 flex flex-col justify-between anime-card relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity transform group-hover:scale-110 duration-500">
                <ShoppingBag className="text-primary" size={120} />
              </div>
              <div className="flex items-center justify-between mb-4 relative z-10 border-b-2 border-[#031633]/15 pb-2">
                <h3 className="text-xs font-bold text-[#031633] uppercase tracking-widest">Pedidos del Día</h3>
                <div className="w-10 h-10 rounded-2xl bg-[#ff8928]/10 flex items-center justify-center border-2 border-[#ff8928]/20 text-[#ff8928]">
                  <ShoppingBag size={20} />
                </div>
              </div>
              <div className="flex items-end justify-between relative z-10 mt-auto">
                <span className="text-4xl font-black text-primary leading-none">128</span>
                <span className="text-xs text-white bg-[#ff8928] border-2 border-primary px-3 py-1 rounded-full flex items-center shadow-[2px_2px_0_0_#031633] font-bold">
                  <TrendingUp className="mr-1" size={14} /> +5%
                </span>
              </div>
            </div>

            {/* Ingresos Est. */}
            <div className="bg-white rounded-3xl p-5 flex flex-col justify-between anime-card relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity transform group-hover:scale-110 duration-500">
                <Banknote className="text-primary" size={120} />
              </div>
              <div className="flex items-center justify-between mb-4 relative z-10 border-b-2 border-[#031633]/15 pb-2">
                <h3 className="text-xs font-bold text-[#031633] uppercase tracking-widest">Ingresos Est.</h3>
                <div className="w-10 h-10 rounded-2xl bg-[#ff8928]/10 flex items-center justify-center border-2 border-[#ff8928]/20 text-[#ff8928]">
                  <Banknote size={20} />
                </div>
              </div>
              <div className="relative z-10 mt-auto">
                <span className="text-3xl text-primary leading-none font-black tracking-tight anime-glow-text">
                  Q4,250<span className="text-lg text-primary/60">.00</span>
                </span>
              </div>
            </div>

            {/* Plato Top */}
            <div className="bg-white rounded-3xl p-5 flex flex-col justify-between anime-card relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity transform group-hover:scale-110 duration-500">
                <Star className="text-primary" size={120} />
              </div>
              <div className="flex items-center justify-between mb-4 relative z-10 border-b-2 border-[#031633]/15 pb-2">
                <h3 className="text-xs font-bold text-[#031633] uppercase tracking-widest">Plato Top</h3>
                <div className="w-10 h-10 rounded-2xl bg-[#fdb500]/20 flex items-center justify-center border-2 border-[#fdb500]/30 text-[#fdb500]">
                  <Star size={20} />
                </div>
              </div>
              <div className="relative z-10 mt-auto">
                <span className="text-xl font-black text-primary truncate block w-full uppercase tracking-wide">
                  Bento Ejecutivo
                </span>
              </div>
            </div>

            {/* Inventario */}
            <div className="bg-white rounded-3xl p-5 flex flex-col justify-between anime-card relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity transform group-hover:scale-110 duration-500">
                <Package className="text-primary" size={120} />
              </div>
              <div className="flex items-center justify-between mb-4 relative z-10 border-b-2 border-[#031633]/15 pb-2">
                <h3 className="text-xs font-bold text-[#031633] uppercase tracking-widest">Inventario</h3>
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-primary/20 text-primary">
                  <Package size={20} />
                </div>
              </div>
              <div className="flex flex-col gap-2 relative z-10 mt-auto">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-primary">85%</span>
                  <span className="text-[10px] text-primary bg-[#d7e2ff] border-2 border-primary px-3 py-0.5 rounded-full font-bold">
                    Óptimo
                  </span>
                </div>
                <div className="w-full bg-[#e4e2e5] h-3 rounded-full overflow-hidden border-2 border-primary">
                  <div className="bg-[#ff8928] h-full w-[85%] relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/25 w-full h-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="mb-6">
            <Outlet />
          </div>

          {/* Área Central: Tabla de Actividad y Barra de Herramientas Lateral */}
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Tabla de Actividad Reciente */}
            <div className="flex-[2] bg-white rounded-3xl anime-card flex flex-col overflow-hidden">
              <div className="p-5 border-b-2 border-[#031633] bg-[#f5f3f6] flex justify-between items-center">
                <h3 className="text-xl font-black text-[#031633] uppercase tracking-wide manga-title">
                  Actividad Reciente
                </h3>
                <button className="w-10 h-10 rounded-xl border-2 border-[#031633] flex items-center justify-center text-[#031633] hover:bg-[#031633] hover:text-white transition-colors cursor-pointer">
                  <MoreVertical size={18} />
                </button>
              </div>

              {/* Contenedor de la Tabla */}
              <div className="overflow-x-auto p-4">
                <table className="w-full text-left border-separate border-spacing-y-2.5">
                  <thead>
                    <tr className="text-primary text-[11px] font-black uppercase tracking-wider">
                      <th className="px-4 py-2 border-b-2 border-primary/20">ID Pedido</th>
                      <th className="px-4 py-2 border-b-2 border-primary/20">Estudiante</th>
                      <th className="px-4 py-2 border-b-2 border-primary/20">Artículo</th>
                      <th className="px-4 py-2 border-b-2 border-primary/20">Estado</th>
                      <th className="px-4 py-2 border-b-2 border-primary/20 text-right">Hora</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {/* Fila 1 */}
                    <tr className="group hover:bg-[#f5f3f6] transition-colors rounded-2xl">
                      <td className="px-4 py-4 font-black text-secondary rounded-l-2xl border-y-2 border-l-2 border-transparent group-hover:border-primary/10 text-sm">
                        #KB-0892
                      </td>
                      <td className="px-4 py-4 font-bold text-on-surface flex items-center gap-3 bg-white group-hover:bg-transparent border-y-2 border-transparent group-hover:border-primary/10 text-sm animate-none">
                        <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-black text-xs shadow-[2px_2px_0_0_#ff8928]">M</div>
                        María López
                      </td>
                      <td className="px-4 py-4 text-primary font-semibold bg-white group-hover:bg-transparent border-y-2 border-transparent group-hover:border-primary/10 text-sm">
                        Bento Ejecutivo
                      </td>
                      <td className="px-4 py-4 bg-white group-hover:bg-transparent border-y-2 border-transparent group-hover:border-primary/10 text-sm">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase font-black bg-[#d7e2ff] border-2 border-primary text-primary shadow-[2px_2px_0_0_#031633]">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5"></span> Completado
                        </span>
                      </td>
                      <td className="px-4 py-4 font-black text-primary text-right bg-white group-hover:bg-transparent rounded-r-2xl border-y-2 border-r-2 border-transparent group-hover:border-primary/10 text-sm">
                        10:42 AM
                      </td>
                    </tr>

                    {/* Fila 2 */}
                    <tr className="group hover:bg-[#f5f3f6] transition-colors rounded-2xl">
                      <td className="px-4 py-4 font-black text-secondary rounded-l-2xl border-y-2 border-l-2 border-transparent group-hover:border-primary/10 text-sm">
                        #KB-0893
                      </td>
                      <td className="px-4 py-4 font-bold text-on-surface flex items-center gap-3 bg-white group-hover:bg-transparent border-y-2 border-transparent group-hover:border-primary/10 text-sm">
                        <div className="w-8 h-8 rounded-xl bg-secondary text-white flex items-center justify-center font-black text-xs shadow-[2px_2px_0_0_#031633]">C</div>
                        Carlos Ruiz
                      </td>
                      <td className="px-4 py-4 text-primary font-semibold bg-white group-hover:bg-transparent border-y-2 border-transparent group-hover:border-primary/10 text-sm">
                        Wrap de Pollo + Jugo
                      </td>
                      <td className="px-4 py-4 bg-white group-hover:bg-transparent border-y-2 border-transparent group-hover:border-primary/10 text-sm">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase font-black bg-[#ffdcc6] border-2 border-secondary text-[#964900] shadow-[2px_2px_0_0_#ff8928]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ff8928] mr-1.5 animate-pulse"></span> Pendiente
                        </span>
                      </td>
                      <td className="px-4 py-4 font-black text-primary text-right bg-white group-hover:bg-transparent rounded-r-2xl border-y-2 border-r-2 border-transparent group-hover:border-primary/10 text-sm">
                        10:45 AM
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Footer del Panel */}
              <div className="p-4 border-t-2 border-[#031633] bg-[#f5f3f6] text-center mt-auto">
                <button className="text-secondary hover:text-[#031633] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 mx-auto cursor-pointer">
                  Ver todos los pedidos <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Sidebar Interno Secundario: Estado & Acciones */}
            <div className="flex-1 flex flex-col gap-6">
              
              {/* Card de Estado del Servicio */}
              <div className="bg-white rounded-3xl p-6 anime-card">
                <h3 className="text-lg font-black text-[#031633] mb-5 flex items-center gap-3 uppercase tracking-wide manga-title">
                  <div className="w-9 h-9 rounded-xl bg-[#ff8928] border-2 border-[#031633] shadow-[2px_2px_0_0_#031633] flex items-center justify-center text-white">
                    <Store size={16} />
                  </div>
                  Estado
                </h3>

                <div className="space-y-4">
                  {/* Item 1: Servicio Activo */}
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-[#031633] shadow-[2px_2px_0_0_#031633]">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#d7e2ff] flex items-center justify-center border-2 border-[#031633] text-[#031633]">
                        <Power size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-[#031633] uppercase">Servicio Activo</p>
                        <p className="text-[10px] text-[#031633]/70 font-semibold uppercase tracking-wider">Recibiendo pedidos</p>
                      </div>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#031633] shadow-[0_0_8px_rgba(52,211,153,0.7)] animate-pulse" />
                  </div>

                  {/* Item 2: Flujo Actual */}
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-[#031633] shadow-[2px_2px_0_0_#031633]">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#ffdcc6] flex items-center justify-center border-2 border-secondary text-secondary">
                        <Store size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-[#031633] uppercase">Flujo Actual</p>
                        <p className="text-[10px] text-[#031633]/70 font-semibold uppercase tracking-wider">Demanda Moderada</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black border-2 border-secondary px-3 py-1 rounded-full uppercase bg-[#ffdcc6] text-secondary">
                      Medio
                    </span>
                  </div>
                </div>
              </div>

              {/* Botonera de Acciones Rápidas */}
              <div className="bg-white rounded-3xl p-6 anime-card flex flex-col gap-6">
                <div>
                  <h3 className="text-xs text-primary uppercase tracking-widest mb-4 font-black flex items-center gap-2">
                    <span className="w-2.5 h-5 bg-[#ff8928] inline-block rounded-full"></span>
                    Mi Cuenta
                  </h3>
                  <div className="rounded-3xl border-2 border-[#031633] bg-[#f5f3f6] p-5 space-y-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-[#031633]/70">Usuario</p>
                      <p className="text-sm font-black text-[#031633]">{user?.username ?? 'Invitado'}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-[#031633]/70">Correo</p>
                      <p className="text-sm text-[#031633]/80 break-words">{user?.email ?? 'No disponible'}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-[#031633]/70">Rol</p>
                      <p className="text-sm text-[#031633]">{user?.role ?? 'Usuario'}</p>
                    </div>
                  </div>
                </div>

                <button onClick={handleLogout} className="w-full bg-[#ff8928] text-white font-black py-4 px-4 rounded-2xl flex items-center justify-center gap-3 border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] uppercase tracking-wider text-sm hover:shadow-[5px_5px_0_0_#031633]">
                  <Power size={18} />
                  Cerrar Sesión
                </button>
              </div>

              <div className="bg-white rounded-3xl p-6 anime-card flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs text-primary uppercase tracking-widest mb-4 font-black flex items-center gap-2">
                    <span className="w-2.5 h-5 bg-[#ff8928] inline-block rounded-full"></span>
                    Acciones Rápidas
                  </h3>
                  
                  <div className="space-y-4">
                    <button className="w-full bg-[#ff8928] text-white font-black py-4 px-4 rounded-2xl flex items-center justify-center gap-3 border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] uppercase tracking-wider text-sm cursor-pointer hover:shadow-[5px_5px_0_0_#031633]">
                      <Plus size={16} />
                      Actualizar Menú
                    </button>

                    <button className="w-full bg-white text-primary border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] font-black py-4 px-4 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-wider text-sm cursor-pointer hover:shadow-[5px_5px_0_0_#031633]">
                      <BarChart size={16} />
                      Ver Reportes
                    </button>
                  </div>
                </div>

                <button className="w-full bg-[#efedf0] text-primary border-2 border-[#031633] border-dashed font-bold py-4 px-4 rounded-2xl flex items-center justify-center gap-3 transition-colors mt-6 uppercase tracking-wider text-xs cursor-pointer hover:bg-white">
                  <Bell size={16} />
                  Enviar Anuncio
                </button>
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}