import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/store/authStore.js";
import { useReportsStore } from "../../reports/store/reportsStore.js";
import { useOrdersStore } from "../../orders/store/ordersStore.js";
import { getUserProfileByIdRequest } from "../../../shared/api/adminApi.js";
import { 
  ShoppingBag, 
  Banknote, 
  Star, 
  TrendingUp, 
  MoreVertical, 
  Store, 
  Power, 
  BarChart, 
  Plus, 
  Bell,
  ArrowRight,
  Package
} from "lucide-react";

export default function DashboardIndex() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { totalSales, topProducts, fetchAllReports } = useReportsStore();
  const { orders, fetchOrders } = useOrdersStore();
  const safeOrders = Array.isArray(orders) ? orders : [];

  const [userProfiles, setUserProfiles] = useState({});

  useEffect(() => {
    fetchAllReports();
    fetchOrders();
  }, [fetchAllReports, fetchOrders]);

  useEffect(() => {
    const fetchRecentProfiles = async () => {
      const missingUserIds = safeOrders
        .slice(0, 5)
        .map(o => o.usuarioId)
        .filter(uid => uid && !userProfiles[uid]);

      const uniqueMissing = [...new Set(missingUserIds)];
      if (uniqueMissing.length > 0) {
        const newProfiles = { ...userProfiles };
        for (const uid of uniqueMissing) {
          try {
            const res = await getUserProfileByIdRequest(uid);
            newProfiles[uid] = res.data?.data || res.data;
          } catch (error) {
            console.warn(error);
            newProfiles[uid] = { username: 'Desconocido', email: 'N/A' };
          }
        }
        setUserProfiles(newProfiles);
      }
    };

    if (safeOrders.length > 0) {
      fetchRecentProfiles();
    }
  }, [orders, safeOrders, userProfiles]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const recentOrders = safeOrders.slice(0, 5);

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-[#ffdcc6] text-[#642f00] border-secondary';
      case 'Pagado':
        return 'bg-[#d7e2ff] text-[#031633] border-primary';
      case 'Entregado':
        return 'bg-emerald-100 text-emerald-800 border-emerald-800';
      case 'No pagado':
        return 'bg-[#ffd6d6] text-[#7d0a42] border-[#7d0a42]';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Grid de Métricas Bento */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Pedidos del Día */}
        <div className="bg-white rounded-3xl p-5 flex flex-col justify-between anime-card relative overflow-hidden group border-2 border-[#031633] shadow-[4px_4px_0_0_#031633]">
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
            <span className="text-4xl font-black text-[#031633] leading-none">
              {safeOrders.filter(o => {
                const today = new Date().toDateString();
                return new Date(o.createdAt).toDateString() === today;
              }).length}
            </span>
            <span className="text-xs text-white bg-[#ff8928] border-2 border-primary px-3 py-1 rounded-full flex items-center shadow-[2px_2px_0_0_#031633] font-bold">
              <TrendingUp className="mr-1" size={14} /> Hoy
            </span>
          </div>
        </div>

        {/* Ingresos Est. */}
        <div className="bg-white rounded-3xl p-5 flex flex-col justify-between anime-card relative overflow-hidden group border-2 border-[#031633] shadow-[4px_4px_0_0_#031633]">
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity transform group-hover:scale-110 duration-500">
            <Banknote className="text-primary" size={120} />
          </div>
          <div className="flex items-center justify-between mb-4 relative z-10 border-b-2 border-[#031633]/15 pb-2">
            <h3 className="text-xs font-bold text-[#031633] uppercase tracking-widest">Ingresos Totales</h3>
            <div className="w-10 h-10 rounded-2xl bg-[#ff8928]/10 flex items-center justify-center border-2 border-[#ff8928]/20 text-[#ff8928]">
              <Banknote size={20} />
            </div>
          </div>
          <div className="relative z-10 mt-auto">
            <span className="text-3xl text-primary leading-none font-black tracking-tight anime-glow-text">
              Q{(totalSales.totalVentas || 0).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Plato Top */}
        <div className="bg-white rounded-3xl p-5 flex flex-col justify-between anime-card relative overflow-hidden group border-2 border-[#031633] shadow-[4px_4px_0_0_#031633]">
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
            <span className="text-base font-black text-primary truncate block w-full uppercase tracking-wide">
              {topProducts[0]?.name || 'Ninguno aún'}
            </span>
          </div>
        </div>

        {/* Total Pedidos (Total histórico) */}
        <div className="bg-white rounded-3xl p-5 flex flex-col justify-between anime-card relative overflow-hidden group border-2 border-[#031633] shadow-[4px_4px_0_0_#031633]">
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity transform group-hover:scale-110 duration-500">
            <Package className="text-primary" size={120} />
          </div>
          <div className="flex items-center justify-between mb-4 relative z-10 border-b-2 border-[#031633]/15 pb-2">
            <h3 className="text-xs font-bold text-[#031633] uppercase tracking-widest">Total Pedidos</h3>
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-primary/20 text-primary">
              <Package size={20} />
            </div>
          </div>
          <div className="relative z-10 mt-auto">
            <span className="text-3xl font-black text-primary">
              {safeOrders.length}
            </span>
          </div>
        </div>
      </section>

      {/* Área Central: Tabla de Actividad y Barra de Herramientas Lateral */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Tabla de Actividad Reciente */}
        <div className="flex-[2] bg-white rounded-3xl border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] flex flex-col overflow-hidden">
          <div className="p-5 border-b-2 border-[#031633] bg-[#f5f3f6] flex justify-between items-center">
            <h3 className="text-xl font-black text-[#031633] uppercase tracking-wide manga-title font-display">
              Actividad Reciente
            </h3>
            <Link to="/orders" className="w-10 h-10 rounded-xl border-2 border-[#031633] flex items-center justify-center text-[#031633] hover:bg-[#031633] hover:text-white transition-colors cursor-pointer">
              <MoreVertical size={18} />
            </Link>
          </div>

          {/* Contenedor de la Tabla */}
          <div className="overflow-x-auto p-4 flex-1">
            {recentOrders.length === 0 ? (
              <p className="text-xs text-slate-400 font-bold text-center py-8">No hay pedidos registrados.</p>
            ) : (
              <table className="w-full text-left border-separate border-spacing-y-2.5">
                <thead>
                  <tr className="text-primary text-[11px] font-black uppercase tracking-wider">
                    <th className="px-4 py-2 border-b-2 border-primary/20">ID Pedido</th>
                    <th className="px-4 py-2 border-b-2 border-primary/20">Estudiante</th>
                    <th className="px-4 py-2 border-b-2 border-primary/20">Artículos</th>
                    <th className="px-4 py-2 border-b-2 border-primary/20">Estado</th>
                    <th className="px-4 py-2 border-b-2 border-primary/20 text-right">Hora</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {recentOrders.map((o) => {
                    const profile = userProfiles[o.usuarioId] || { username: 'Anonimo' };
                    const time = new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return (
                      <tr key={o._id} className="group hover:bg-[#f5f3f6] transition-colors rounded-2xl">
                        <td className="px-4 py-4 font-black text-secondary rounded-l-2xl border-y-2 border-l-2 border-transparent group-hover:border-primary/10 text-sm">
                          #{o.numeroPedido?.substring(0, 8) || o._id.substring(18)}
                        </td>
                        <td className="px-4 py-4 font-bold text-[#031633] flex items-center gap-3 bg-white group-hover:bg-transparent border-y-2 border-transparent group-hover:border-primary/10 text-sm">
                          <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-black text-xs shadow-[2px_2px_0_0_#ff8928]">
                            {(profile.name || profile.username || 'E')[0].toUpperCase()}
                          </div>
                          {profile.name ? `${profile.name} ${profile.surname}` : profile.username}
                        </td>
                        <td className="px-4 py-4 text-primary font-semibold bg-white group-hover:bg-transparent border-y-2 border-transparent group-hover:border-primary/10 text-xs line-clamp-1">
                          {o.productos?.map(p => p.productoId?.name).join(', ') || 'Varios'}
                        </td>
                        <td className="px-4 py-4 bg-white group-hover:bg-transparent border-y-2 border-transparent group-hover:border-primary/10 text-sm">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase font-black border-2 shadow-[2px_2px_0_0_#031633] ${getStatusBadgeStyle(o.estado)}`}>
                            {o.estado}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-black text-primary text-right bg-white group-hover:bg-transparent rounded-r-2xl border-y-2 border-r-2 border-transparent group-hover:border-primary/10 text-sm">
                          {time}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer del Panel */}
          <div className="p-4 border-t-2 border-[#031633] bg-[#f5f3f6] text-center mt-auto">
            <Link to="/orders" className="text-secondary hover:text-[#031633] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 mx-auto cursor-pointer">
              Ver todos los pedidos <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Sidebar Interno Secundario: Estado & Acciones */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Card de Estado del Servicio */}
          <div className="bg-white rounded-3xl p-6 border-2 border-[#031633] shadow-[4px_4px_0_0_#031633]">
            <h3 className="text-lg font-black text-[#031633] mb-5 flex items-center gap-3 uppercase tracking-wide manga-title font-display">
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

          {/* Card Cuenta */}
          <div className="bg-white rounded-3xl p-6 border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] flex flex-col gap-6">
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

            <button onClick={handleLogout} className="w-full bg-[#ff8928] text-white font-black py-4 px-4 rounded-2xl flex items-center justify-center gap-3 border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] uppercase tracking-wider text-sm hover:shadow-[5px_5px_0_0_#031633] cursor-pointer">
              <Power size={18} />
              Cerrar Sesión
            </button>
          </div>

          {/* Botonera de Acciones Rápidas */}
          <div className="bg-white rounded-3xl p-6 border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] flex flex-col justify-between gap-6">
            <div>
              <h3 className="text-xs text-primary uppercase tracking-widest mb-4 font-black flex items-center gap-2">
                <span className="w-2.5 h-5 bg-[#ff8928] inline-block rounded-full"></span>
                Acciones Rápidas
              </h3>
              
              <div className="space-y-4">
                <Link to="/products" className="w-full bg-[#ff8928] text-white font-black py-4 px-4 rounded-2xl flex items-center justify-center gap-3 border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] uppercase tracking-wider text-sm cursor-pointer hover:shadow-[5px_5px_0_0_#031633]">
                  <Plus size={16} />
                  Actualizar Menú
                </Link>

                <Link to="/reports" className="w-full bg-white text-primary border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] font-black py-4 px-4 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-wider text-sm cursor-pointer hover:shadow-[5px_5px_0_0_#031633]">
                  <BarChart size={16} />
                  Ver Reportes
                </Link>
              </div>
            </div>

            <button className="w-full bg-[#efedf0] text-primary border-2 border-[#031633] border-dashed font-bold py-4 px-4 rounded-2xl flex items-center justify-center gap-3 transition-colors uppercase tracking-wider text-xs cursor-pointer hover:bg-white">
              <Bell size={16} />
              Enviar Anuncio
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
