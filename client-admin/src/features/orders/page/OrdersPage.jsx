import React, { useEffect, useState } from 'react';
import { useOrdersStore } from '../store/ordersStore';
import { getUserProfileByIdRequest } from '../../../shared/api/adminApi';
import { Check, ShieldAlert, Trash2, User, Calendar, Clock } from 'lucide-react';
import { useAuthStore } from '../../auth/store/authStore';
import toast from 'react-hot-toast';

export function OrdersPage() {
  const { orders, isLoading, fetchOrders, updateOrderStatus, deleteOrder } = useOrdersStore();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'ADMIN_ROLE';
  const isUser  = user?.role === 'USER_ROLE';
  const [statusFilter, setStatusFilter] = useState('');
  
  // Cache de perfiles de usuario
  const [userProfiles, setUserProfiles] = useState({});
  const [doubleConfirmOrder, setDoubleConfirmOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Cargar perfiles de los usuarios de las órdenes
  useEffect(() => {
    const fetchMissingProfiles = async () => {
      const missingUserIds = orders
        .map(o => o.usuarioId)
        .filter(uid => uid && !userProfiles[uid]);

      // Filtrar duplicados
      const uniqueMissing = [...new Set(missingUserIds)];

      if (uniqueMissing.length > 0) {
        const newProfiles = { ...userProfiles };
        for (const uid of uniqueMissing) {
          try {
            const res = await getUserProfileByIdRequest(uid);
            newProfiles[uid] = res.data?.data || res.data;
          } catch (err) {
            newProfiles[uid] = { username: 'Desconocido', email: 'N/A' };
          }
        }
        setUserProfiles(newProfiles);
      }
    };

    if (orders.length > 0) {
      fetchMissingProfiles();
    }
  }, [orders]);

  const onFilterChange = (status) => {
    setStatusFilter(status);
    useOrdersStore.getState().setFilters({ estado: status });
  };

  const handleUpdateStatus = async (id, newStatus, force = false) => {
    const res = await updateOrderStatus(id, newStatus, force);
    if (!res.success && res.requireDoubleConfirm) {
      setDoubleConfirmOrder(id);
    }
  };

  const handleConfirmDouble = async () => {
    if (doubleConfirmOrder) {
      await updateOrderStatus(doubleConfirmOrder, 'No pagado', true);
      setDoubleConfirmOrder(null);
    }
  };

  const filters = [
    { value: '', label: 'Todos' },
    { value: 'Pendiente', label: 'Pendientes' },
    { value: 'Pagado', label: 'Pagados' },
    { value: 'Entregado', label: 'Entregados' },
    { value: 'No pagado', label: 'No Pagados' }
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-[#ffdcc6] text-[#642f00] border-[#964900] shadow-[2px_2px_0_0_#964900]';
      case 'Pagado':
        return 'bg-[#d7e2ff] text-[#031633] border-[#031633] shadow-[2px_2px_0_0_#031633]';
      case 'Entregado':
        return 'bg-emerald-100 text-emerald-800 border-emerald-800 shadow-[2px_2px_0_0_rgba(6,95,70,1)]';
      case 'No pagado':
        return 'bg-[#ffd6d6] text-[#7d0a42] border-[#7d0a42] shadow-[2px_2px_0_0_#7d0a42]';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div>
        <h1 className="text-3xl font-black text-[#031633] uppercase font-display tracking-wider">
          {isAdmin ? 'Gestión de Pedidos' : 'Mis Pedidos'}
        </h1>
        <p className="text-sm font-bold text-[#ff8928] uppercase tracking-wide">
          {isAdmin ? 'Monitorea y despacha las órdenes de los estudiantes' : 'Revisa el estado de tus pedidos'}
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white p-5 rounded-3xl border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`px-4 py-2 text-xs font-black uppercase rounded-xl border-2 border-[#031633] transition-all cursor-pointer ${
              statusFilter === f.value
                ? 'bg-[#ff8928] text-white shadow-[2px_2px_0_0_#031633]'
                : 'bg-white text-[#031633] hover:bg-[#f5f3f6]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista de Pedidos */}
      {isLoading ? (
        <div className="text-center py-12 font-bold text-[#031633]">Cargando pedidos...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 font-bold text-slate-400 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          No se encontraron pedidos con este filtro.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const profile = userProfiles[order.usuarioId] || { name: 'Cargando...', surname: '', email: '...' };
            const dateObj = new Date(order.createdAt);

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
              >
                {/* Info del Pedido y Estudiante */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center flex-wrap gap-3">
                    <span className="font-black text-secondary text-sm">#{order.numeroPedido?.substring(0, 8) || order._id.substring(18)}</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase font-black border-2 ${getStatusStyle(order.estado)}`}>
                      {order.estado}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-[#031633]/70">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-[#ff8928]" />
                      <span>{profile.name ? `${profile.name} ${profile.surname}` : profile.username || 'Estudiante'} ({profile.email})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-[#ff8928]" />
                      <span>{dateObj.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-[#ff8928]" />
                      <span>{dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* Productos (se asume que server-admin entrega un array de items) */}
                  <div className="border-t border-[#efedf0] pt-2 mt-2">
                    <p className="text-[10px] font-black uppercase text-[#ff8928] tracking-widest mb-1">Detalle:</p>
                    <div className="flex flex-wrap gap-2">
                      {order.productos?.map((p, idx) => (
                        <span key={idx} className="text-xs bg-[#f5f3f6] border border-[#031633]/15 px-2.5 py-1 rounded-lg font-bold text-[#031633]">
                          {p.cantidad}x {p.productoId?.name || 'Producto'}
                          {p.acompanamientoId && (
                            <span className="ml-1 text-[#ff8928]">+ {p.acompanamientoId?.name || 'acompañamiento'}</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Total y Acciones */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center w-full lg:w-auto border-t lg:border-t-0 border-[#efedf0] pt-4 lg:pt-0 gap-4">
                  <div className="text-left lg:text-right">
                    <p className="text-[10px] font-black uppercase text-[#ff8928] tracking-widest">Total a cobrar</p>
                    <p className="text-2xl font-black text-[#031633]">Q{(order.totalCobrar || order.totalFinal || 0).toFixed(2)}</p>
                  </div>

                  <div className="flex gap-2">
                    {isAdmin && order.estado === 'Pendiente' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'Pagado')}
                          className="bg-emerald-400 hover:bg-emerald-500 text-white font-black p-2.5 rounded-xl border-2 border-[#031633] shadow-[2px_2px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#031633] flex items-center justify-center cursor-pointer"
                          title="Marcar como Pagado"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'No pagado')}
                          className="bg-[#7d0a42] hover:bg-red-800 text-white font-black p-2.5 rounded-xl border-2 border-[#031633] shadow-[2px_2px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#031633] flex items-center justify-center cursor-pointer"
                          title="Marcar como No Pagado"
                        >
                          <ShieldAlert size={16} />
                        </button>
                      </>
                    )}
                    {isAdmin && order.estado === 'Pagado' && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'Entregado')}
                        className="bg-[#ff8928] hover:bg-[#ff9d47] text-white font-black px-4 py-2 rounded-xl border-2 border-[#031633] shadow-[2px_2px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#031633] flex items-center gap-2 cursor-pointer text-xs uppercase"
                      >
                        <Check size={14} /> Entregar
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => deleteOrder(order._id)}
                        className="p-2.5 bg-white border-2 border-[#031633] rounded-xl hover:bg-[#efedf0] transition-colors text-[#031633] cursor-pointer shadow-[2px_2px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#031633]"
                        title="Eliminar/Cancelar"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Doble Confirmación para "No Pagado" */}
      {doubleConfirmOrder && (
        <div className="fixed inset-0 bg-[#031633]/60 backdrop-blur-[4px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border-2 border-[#031633] shadow-[8px_8px_0_0_#031633] w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3 text-[#7d0a42]">
              <ShieldAlert size={28} />
              <h3 className="text-lg font-black uppercase font-display tracking-wider">Confirmación Requerida</h3>
            </div>
            <p className="text-xs font-bold text-[#031633]/80 leading-relaxed">
              ¿Estás seguro de que deseas marcar este pedido como **No Pagado**? Esto podría inhabilitar temporalmente la cuenta del estudiante para evitar abuso.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDoubleConfirmOrder(null)}
                className="flex-1 bg-white border-2 border-[#031633] text-[#031633] font-black py-3 rounded-2xl cursor-pointer hover:bg-[#efedf0]"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDouble}
                className="flex-1 bg-[#7d0a42] text-white border-2 border-[#031633] font-black py-3 rounded-2xl shadow-[2px_2px_0_0_#031633] hover:bg-red-800 cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
