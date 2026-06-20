import React, { useEffect } from "react";
import { useOrdersStore } from "../store/ordersStore";
import { Clock, Calendar, AlertTriangle, ShieldAlert } from "lucide-react";

export function MyOrdersPage() {
  const { ordersHistory, isLoading, fetchHistory, cancelOrder } = useOrdersStore();

  useEffect(() => {
    fetchHistory();
  }, []);

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Pendiente":
        return "bg-[#ffdcc6] text-[#642f00] border-secondary";
      case "Pagado":
        return "bg-[#d7e2ff] text-[#031633] border-primary";
      case "Entregado":
        return "bg-emerald-100 text-emerald-800 border-emerald-800";
      case "No pagado":
        return "bg-[#ffd6d6] text-[#7d0a42] border-[#7d0a42]";
      default:
        return "bg-slate-100 text-slate-700 border-slate-700";
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-black text-[#031633] uppercase font-display tracking-wide">
          Mis Pedidos
        </h2>
        <p className="text-xs font-bold text-[#ff8928] uppercase tracking-wide">
          Historial y estado de tus compras
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 font-bold text-[#031633] text-sm">
          Cargando historial...
        </div>
      ) : ordersHistory.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-xs font-bold text-slate-400">
          No has realizado ningún pedido aún.
        </div>
      ) : (
        <div className="space-y-4">
          {ordersHistory.map((order) => {
            const dateObj = new Date(order.createdAt);
            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl border-2 border-[#031633] p-5 shadow-[4px_4px_0_0_#031633] space-y-3"
              >
                <div className="flex justify-between items-center border-b-2 border-[#efedf0] pb-2">
                  <span className="text-xs font-black text-secondary">
                    #{order.numeroPedido?.substring(0, 8) || order._id.substring(18)}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] uppercase font-black border-2 ${getStatusBadgeStyle(order.estado)}`}>
                    {order.estado}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[10px] font-bold text-[#031633]/70">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {dateObj.toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  {order.productos?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs font-bold text-[#031633]/80">
                      <span>
                        {item.cantidad}x {item.productoId?.name || "Producto"}
                        {item.acompanamientoId && (
                          <span className="ml-1 text-[#ff8928] text-[10px] block">
                            + {item.acompanamientoId.name || 'Acompañamiento'}
                          </span>
                        )}
                      </span>
                      <span>
                        Q{((item.precioUnitario || item.productoId?.price || 0) * item.cantidad).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#efedf0] pt-2 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] font-black uppercase text-[#ff8928]">Total</span>
                    <p className="text-base font-black text-[#031633]">Q{(order.totalFinal || order.totalCobrar || 0).toFixed(2)}</p>
                  </div>

                  {order.estado === "Pendiente" && (
                    <button
                      onClick={() => cancelOrder(order._id)}
                      className="bg-[#7d0a42] hover:bg-red-800 text-white font-black px-4 py-2 rounded-xl border-2 border-[#031633] shadow-[2px_2px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#031633] transition-all cursor-pointer text-[10px] uppercase"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
