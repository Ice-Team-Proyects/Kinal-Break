import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import {
  ShoppingBag,
  ArrowRight,
  Image as ImageIcon,
  Banknote,
  Landmark,
  Trash2,
  Clock,
  Upload,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import { TRANSFER_PAYMENT } from "../../../shared/config/ordering";

export function CartPage() {
  const { cartItems, totalTemporal, isLoading, fetchCart, confirmOrder, removeFromCart } =
    useCartStore();
  const navigate = useNavigate();
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [isConfirming, setIsConfirming] = useState(false);
  const [comprobanteFile, setComprobanteFile] = useState(null);
  const [comprobantePreview, setComprobantePreview] = useState("");

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleComprobanteChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setComprobanteFile(file);
    setComprobantePreview(URL.createObjectURL(file));
  };

  const handleConfirm = async () => {
    if (!metodoPago) {
      toast.error("Selecciona un método de pago");
      return;
    }
    if (metodoPago === "Transferencia" && !comprobanteFile) {
      toast.error("Sube la foto de tu comprobante de transferencia");
      return;
    }

    setIsConfirming(true);
    try {
      const success = await confirmOrder({
        metodoPago,
        comprobanteFile: metodoPago === "Transferencia" ? comprobanteFile : null,
      });
      if (success) {
        navigate("/orders");
      }
    } finally {
      setIsConfirming(false);
    }
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

      {isLoading && cartItems.length === 0 ? (
        <div className="text-center py-12 font-bold text-[#031633] text-sm">Cargando carrito...</div>
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
            className="bg-[#ff8928] text-white font-black px-5 py-3 rounded-2xl border-2 border-[#031633] shadow-[3px_3px_0_0_#031633] uppercase text-xs cursor-pointer"
          >
            Ver Menú
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {cartItems.map((item) => {
              const product = item.productoId || {};
              return (
                <div
                  key={item._id}
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
                        + {item.acompanamientoId.name || "Acompañamiento"}
                      </p>
                    )}
                    {item.horaReserva && (
                      <p className="text-[10px] font-bold text-[#031633] uppercase mt-0.5 flex items-center gap-1">
                        <Clock size={10} className="text-[#ff8928]" />
                        Reserva: {item.horaReserva}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end gap-2">
                    <span className="text-sm font-black text-[#031633]">
                      Q{((item.precioUnitario || product.price || 0) * item.cantidad).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item._id)}
                      className="text-[#7d0a42] hover:bg-[#ffd6d6] p-2 rounded-xl border-2 border-[#031633] cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-3xl border-2 border-[#031633] p-5 shadow-[4px_4px_0_0_#031633] space-y-4">
            <div>
              <p className="text-xs font-black uppercase text-[#031633] mb-3">Método de pago</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMetodoPago("Efectivo")}
                  className={`flex flex-col items-center gap-2 px-3 py-4 rounded-2xl border-2 font-black text-[10px] uppercase transition-all cursor-pointer ${
                    metodoPago === "Efectivo"
                      ? "border-[#ff8928] bg-[#fff4ea] text-[#031633] shadow-[2px_2px_0_0_#ff8928]"
                      : "border-[#031633] bg-[#f5f3f6] text-[#031633]"
                  }`}
                >
                  <Banknote size={18} className="text-[#ff8928]" />
                  Efectivo
                </button>
                <button
                  type="button"
                  onClick={() => setMetodoPago("Transferencia")}
                  className={`flex flex-col items-center gap-2 px-3 py-4 rounded-2xl border-2 font-black text-[10px] uppercase transition-all cursor-pointer ${
                    metodoPago === "Transferencia"
                      ? "border-[#ff8928] bg-[#fff4ea] text-[#031633] shadow-[2px_2px_0_0_#ff8928]"
                      : "border-[#031633] bg-[#f5f3f6] text-[#031633]"
                  }`}
                >
                  <Landmark size={18} className="text-[#ff8928]" />
                  Transferencia
                </button>
              </div>
            </div>

            {metodoPago === "Transferencia" && (
              <div className="space-y-3 border-2 border-[#031633] rounded-2xl p-4 bg-[#f5f3f6]">
                <p className="text-[10px] font-black uppercase text-[#031633]">
                  Pago con transferencia (BelApp / cuik)
                </p>
                <p className="text-[10px] font-bold text-[#031633]/80">
                  {TRANSFER_PAYMENT.instruccion}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <a
                    href={TRANSFER_PAYMENT.transferLink}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0"
                    title="Abrir enlace de transferencia"
                  >
                    <img
                      src={TRANSFER_PAYMENT.qrUrl}
                      alt="QR transferencia Banco Industrial"
                      className="w-full max-w-[220px] object-contain bg-white border-2 border-[#031633] rounded-xl"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </a>
                  <div className="text-xs font-bold text-[#031633] space-y-1 w-full">
                    <p>
                      <span className="uppercase text-[#ff8928]">Banco:</span> {TRANSFER_PAYMENT.banco}
                    </p>
                    <p>
                      <span className="uppercase text-[#ff8928]">Tipo:</span>{" "}
                      {TRANSFER_PAYMENT.tipoCuenta}
                    </p>
                    <p>
                      <span className="uppercase text-[#ff8928]">Cuenta:</span>{" "}
                      {TRANSFER_PAYMENT.numeroCuenta}
                    </p>
                    <p>
                      <span className="uppercase text-[#ff8928]">A nombre de:</span>{" "}
                      {TRANSFER_PAYMENT.titular}
                    </p>
                    <p className="text-[10px] text-[#031633]/70 pt-1">
                      Referencia: tu correo o carné. Monto: Q{totalTemporal.toFixed(2)}
                    </p>
                    <a
                      href={TRANSFER_PAYMENT.transferLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 bg-[#5c2d91] text-white font-black px-3 py-2.5 rounded-xl border-2 border-[#031633] shadow-[2px_2px_0_0_#031633] uppercase text-[10px] cursor-pointer"
                    >
                      Abrir enlace de transferencia <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                <label className="flex flex-col gap-2 cursor-pointer">
                  <span className="text-[10px] font-black uppercase text-[#031633] flex items-center gap-1">
                    <Upload size={12} className="text-[#ff8928]" />
                    Sube foto del comprobante
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleComprobanteChange}
                    className="text-xs font-bold"
                  />
                  {comprobantePreview && (
                    <img
                      src={comprobantePreview}
                      alt="Vista previa comprobante"
                      className="w-full max-h-40 object-contain rounded-xl border-2 border-[#031633] bg-white"
                    />
                  )}
                </label>
              </div>
            )}

            <div className="flex justify-between items-center border-b-2 border-[#efedf0] pb-3">
              <span className="text-xs font-black uppercase text-[#031633]">Total a pagar</span>
              <span className="text-xl font-black text-[#031633]">Q{totalTemporal.toFixed(2)}</span>
            </div>

            <button
              onClick={handleConfirm}
              disabled={isConfirming || isLoading}
              className="w-full bg-[#ff8928] hover:bg-[#ff9d47] text-white font-black py-4 rounded-2xl border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs cursor-pointer disabled:opacity-60"
            >
              {isConfirming ? (
                "Confirmando..."
              ) : (
                <>
                  Confirmar Pedido <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
