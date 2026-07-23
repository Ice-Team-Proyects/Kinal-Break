import { useEffect, useState } from 'react';
import { usePaymentsStore } from '../store/paymentsStore';
import { useOrdersStore } from '../../orders/store/ordersStore';
import { getUserProfileByIdRequest } from '../../../shared/api/adminApi';
import { Plus, Trash2, ShieldAlert, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

export function PaymentsPage() {
  const { payments, isLoading: isPaymentsLoading, fetchPayments, createPayment, deletePayment, setPaymentUnpaid } = usePaymentsStore();
  const { orders, fetchOrders } = useOrdersStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userProfiles, setUserProfiles] = useState({});
  const [doubleConfirmPayment, setDoubleConfirmPayment] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchPayments();
    fetchOrders(); // Para tener la lista de órdenes disponibles al pagar
  }, [fetchPayments, fetchOrders]);

  // Cargar perfiles de los usuarios de los pagos
  useEffect(() => {
    const fetchMissingProfiles = async () => {
      const missingUserIds = payments
        .map(p => p.userId)
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

    if (payments.length > 0) {
      fetchMissingProfiles();
    }
  }, [payments, userProfiles]);

  const handleOpenAddModal = () => {
    reset({
      orderId: '',
      amount: '',
      paymentMethod: 'Efectivo',
      status: 'Pagado'
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    // Buscar la orden elegida para sacar el userId de forma opcional o mandarlo directo
    const selectedOrder = orders.find(o => o._id === data.orderId);
    const paymentPayload = {
      orderId: data.orderId,
      amount: parseFloat(data.amount),
      paymentMethod: data.paymentMethod,
      status: data.status,
      userId: selectedOrder ? selectedOrder.usuarioId : 'usr_anonimo'
    };

    const success = await createPayment(paymentPayload);
    if (success) {
      setIsModalOpen(false);
    }
  };

  const handleSetUnpaid = async () => {
    if (doubleConfirmPayment) {
      await setPaymentUnpaid(doubleConfirmPayment, true);
      setDoubleConfirmPayment(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pagado':
        return 'bg-emerald-100 text-emerald-800 border-emerald-800';
      case 'Pendiente':
        return 'bg-[#ffdcc6] text-[#642f00] border-[#964900]';
      case 'No Pagado':
      case 'No pagado':
        return 'bg-[#ffd6d6] text-[#7d0a42] border-[#7d0a42]';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#031633] uppercase font-display tracking-wider">Módulo de Pagos</h1>
          <p className="text-sm font-bold text-[#ff8928] uppercase tracking-wide">Registra y audita transacciones de caja de la cafetería</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-[#ff8928] hover:bg-[#ff9d47] text-white font-black px-6 py-3 rounded-2xl border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#031633] transition-all flex items-center gap-2 uppercase text-sm cursor-pointer"
        >
          <Plus size={18} /> Registrar Pago
        </button>
      </div>

      {/* Tabla de Pagos */}
      {isPaymentsLoading ? (
        <div className="text-center py-12 font-bold text-[#031633]">Cargando transacciones...</div>
      ) : payments.length === 0 ? (
        <div className="text-center py-12 font-bold text-slate-400 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          No hay registros de pago cargados en el sistema.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] overflow-hidden">
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left border-separate border-spacing-y-2.5">
              <thead>
                <tr className="text-[#031633] text-[11px] font-black uppercase tracking-wider">
                  <th className="px-4 py-2 border-b-2 border-[#031633]/20">ID Transacción</th>
                  <th className="px-4 py-2 border-b-2 border-[#031633]/20">ID Pedido</th>
                  <th className="px-4 py-2 border-b-2 border-[#031633]/20">Estudiante</th>
                  <th className="px-4 py-2 border-b-2 border-[#031633]/20">Monto</th>
                  <th className="px-4 py-2 border-b-2 border-[#031633]/20">Método</th>
                  <th className="px-4 py-2 border-b-2 border-[#031633]/20">Estado</th>
                  <th className="px-4 py-2 border-b-2 border-[#031633]/20 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => {
                  const profile = userProfiles[p.userId] || { username: 'Anonimo' };
                  return (
                    <tr key={p._id} className="group hover:bg-[#f5f3f6] transition-colors rounded-2xl">
                      <td className="px-4 py-4 font-black text-secondary rounded-l-2xl border-y-2 border-l-2 border-transparent group-hover:border-[#031633]/10 text-sm">
                        {p._id.substring(18)}
                      </td>
                      <td className="px-4 py-4 font-bold text-[#031633] bg-white group-hover:bg-transparent border-y-2 border-transparent group-hover:border-[#031633]/10 text-xs">
                        {p.orderId ? p.orderId.substring(18) : 'N/A'}
                      </td>
                      <td className="px-4 py-4 font-bold text-[#031633] bg-white group-hover:bg-transparent border-y-2 border-transparent group-hover:border-[#031633]/10 text-sm">
                        {profile.name ? `${profile.name} ${profile.surname}` : profile.username}
                      </td>
                      <td className="px-4 py-4 font-black text-[#031633] bg-white group-hover:bg-transparent border-y-2 border-transparent group-hover:border-[#031633]/10 text-sm">
                        Q{p.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 font-bold text-[#031633]/80 bg-white group-hover:bg-transparent border-y-2 border-transparent group-hover:border-[#031633]/10 text-xs uppercase">
                        {p.paymentMethod || 'Efectivo'}
                      </td>
                      <td className="px-4 py-4 bg-white group-hover:bg-transparent border-y-2 border-transparent group-hover:border-[#031633]/10 text-xs">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase font-black border-2 ${getStatusColor(p.status)}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-black text-right bg-white group-hover:bg-transparent rounded-r-2xl border-y-2 border-r-2 border-transparent group-hover:border-[#031633]/10 text-sm">
                        <div className="flex gap-2 justify-end">
                          {p.status !== 'No Pagado' && (
                            <button
                              onClick={() => setDoubleConfirmPayment(p._id)}
                              className="p-2 bg-white border-2 border-[#031633] rounded-xl hover:bg-[#efedf0] text-[#7d0a42] cursor-pointer shadow-[2px_2px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#031633]"
                              title="Marcar como No Pagado"
                            >
                              <ShieldAlert size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => deletePayment(p._id)}
                            className="p-2 bg-white border-2 border-[#031633] rounded-xl hover:bg-[#efedf0] text-[#031633] cursor-pointer shadow-[2px_2px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#031633]"
                            title="Anular Pago"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Registrar Pago */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#031633]/60 backdrop-blur-[4px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border-2 border-[#031633] shadow-[8px_8px_0_0_#031633] w-full max-w-md overflow-hidden">
            <div className="p-6 bg-[#f5f3f6] border-b-2 border-[#031633] flex justify-between items-center">
              <h2 className="text-xl font-black text-[#031633] uppercase font-display tracking-wider">Registrar Pago</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#031633] hover:text-[#ff8928] cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-[#031633] uppercase">Selecciona el Pedido</label>
                <select
                  required
                  {...register('orderId')}
                  className="px-4 py-3 bg-[#f5f3f6] rounded-2xl border-2 border-[#031633] font-bold text-sm focus:outline-none input-focus-animation cursor-pointer"
                >
                  <option value="">-- Elige un pedido pendiente --</option>
                  {orders
                    .filter(o => o.estado === 'Pendiente')
                    .map((o) => (
                      <option key={o._id} value={o._id}>
                        Pedido #{o.numeroPedido?.substring(0, 8) || o._id.substring(18)} - Total Q{(o.totalCobrar || o.totalFinal || 0).toFixed(2)}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-[#031633] uppercase">Monto Recibido (Q)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  {...register('amount')}
                  className="px-4 py-3 bg-[#f5f3f6] rounded-2xl border-2 border-[#031633] font-bold text-sm focus:outline-none input-focus-animation"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-[#031633] uppercase">Método</label>
                  <select
                    {...register('paymentMethod')}
                    className="px-4 py-3 bg-[#f5f3f6] rounded-2xl border-2 border-[#031633] font-bold text-sm focus:outline-none input-focus-animation cursor-pointer"
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta">Tarjeta</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-[#031633] uppercase">Estado</label>
                  <select
                    {...register('status')}
                    className="px-4 py-3 bg-[#f5f3f6] rounded-2xl border-2 border-[#031633] font-bold text-sm focus:outline-none input-focus-animation cursor-pointer"
                  >
                    <option value="Pagado">Pagado</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#ff8928] hover:bg-[#ff9d47] text-white font-black py-4 rounded-2xl border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#031633] transition-all uppercase tracking-wider text-sm cursor-pointer mt-4"
              >
                Confirmar Pago
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Doble Confirmación para "No Pagado" */}
      {doubleConfirmPayment && (
        <div className="fixed inset-0 bg-[#031633]/60 backdrop-blur-[4px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border-2 border-[#031633] shadow-[8px_8px_0_0_#031633] w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3 text-[#7d0a42]">
              <ShieldAlert size={28} />
              <h3 className="text-lg font-black uppercase font-display tracking-wider">Confirmación Requerida</h3>
            </div>
            <p className="text-xs font-bold text-[#031633]/80 leading-relaxed">
              ¿Estás seguro de que deseas marcar este pago como **No Pagado**? Esto inhabilitará el pedido asociado y notificará de saldo deudor.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDoubleConfirmPayment(null)}
                className="flex-1 bg-white border-2 border-[#031633] text-[#031633] font-black py-3 rounded-2xl cursor-pointer hover:bg-[#efedf0]"
              >
                Cancelar
              </button>
              <button
                onClick={handleSetUnpaid}
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
