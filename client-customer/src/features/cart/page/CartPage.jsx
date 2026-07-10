import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { ShoppingBag, ArrowRight, Image as ImageIcon } from "lucide-react";

export function CartPage() {
  const { cartItems, totalTemporal, isLoading, fetchCart, confirmOrder } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleConfirm = async () => {
    const order = await confirmOrder();
    if (order) {
      const orderId = order._id || order.id;
      if (orderId) {
        navigate(`/payment/${orderId}`);
        return;
      }
    }

    navigate("/orders");
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-black text-[#031633] uppercase font-display tracking-wide">
          Tu Carrito
        </h2>
        <p className="text-xs font-bold text-[#ff8928] uppercase tracking-wide">
          Verifica tus productos antes de confirmar
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 font-bold text-[#031633] text-sm">
          Cargando carrito...
        </div>
      ) : cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200 p-6 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#ffdcc6] text-[#ff8928] flex items-center justify-center border-2 border-[#031633] mx-auto shadow-[2px_2px_0_0_#031633]">
            <ShoppingBag size={22} />
          </div>
          <div>
            <p className="text-sm font-black text-[#031633] uppercase">Tu carrito está vacío</p>
            <p className="text-xs text-on-surface-variant mt-1">Agrega productos desde el menú</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-[#ff8928] text-white font-black px-5 py-3 rounded-2xl border-2 border-[#031633] shadow-[3px_3px_0_0_#031633] uppercase text-xs cursor-pointer active:translate-y-0.5 active:translate-x-0.5"
          >
            Ver Menú
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {cartItems.map((item, idx) => {
              const product = item.productoId || {};
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border-2 border-[#031633] p-4 flex gap-4 items-center shadow-[2px_2px_0_0_#031633]"
                >
                  <div className="w-14 h-14 rounded-2xl border-2 border-[#031633] bg-[#efedf0] overflow-hidden flex items-center justify-center shrink-0">
                    {product.photo ? (
                      <img src={product.photo} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={20} className="text-slate-400" />
                    )}
                  </div>

                  <div className="flex-grow min-w-0">
                    <h4 className="text-xs font-extrabold text-[#031633] uppercase truncate">
                      {product.name || "Producto"}
                    </h4>
                    <p className="text-[10px] font-black text-[#ff8928] uppercase mt-0.5">
                      Cant: {item.cantidad} x Q{(item.precioUnitario || product.price || 0).toFixed(2)}
                    </p>
                    {item.acompanamientoId && (
                      <p className="text-[10px] font-bold text-[#ff8928] uppercase mt-0.5">
                        + {item.acompanamientoId.name || 'Acompañamiento'}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-[#031633]">
                      Q{((item.precioUnitario || product.price || 0) * item.cantidad).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-3xl border-2 border-[#031633] p-5 shadow-[4px_4px_0_0_#031633] space-y-4">
            <div className="flex justify-between items-center border-b-2 border-[#efedf0] pb-3">
              <span className="text-xs font-black uppercase text-[#031633]">Total a pagar</span>
              <span className="text-xl font-black text-[#031633]">Q{totalTemporal.toFixed(2)}</span>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full bg-[#ff8928] hover:bg-[#ff9d47] text-white font-black py-4 rounded-2xl border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#031633] transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs cursor-pointer"
            >
              Confirmar Pedido <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
