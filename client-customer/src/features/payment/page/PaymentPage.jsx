import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';
import { getOrderByIdRequest, createCheckoutSessionRequest } from '../../../shared/api/paymentApi.js';

const stripePromise = import.meta.env.VITE_STRIPE_PK
  ? loadStripe(import.meta.env.VITE_STRIPE_PK)
  : null;

export function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [hasStartedCheckout, setHasStartedCheckout] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const response = await getOrderByIdRequest(orderId);
        setOrder(response.data.data);
      } catch (error) {
        console.error(error);
        toast.error('No se pudo cargar la orden');
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  const handlePay = async () => {
    if (!order || isPaying) return;
    if (order.estado !== 'Pendiente') {
      toast.error('Esta orden ya no está disponible para pago.');
      return;
    }

    setIsPaying(true);
    try {
      const response = await createCheckoutSessionRequest(orderId);
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('No hay una configuración de Stripe activa.');
      }

      await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || 'No se pudo iniciar el pago');
    } finally {
      setIsPaying(false);
    }
  };

  useEffect(() => {
    if (!order || isLoading || hasStartedCheckout || isPaying) return;

    setHasStartedCheckout(true);
    void handlePay();
  }, [order, isLoading, hasStartedCheckout, isPaying]);

  if (isLoading) {
    return (
      <div className="text-center py-20 font-black text-[#031633]">
        Cargando detalles de la orden...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 font-black text-[#031633]">
        Orden no encontrada.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-[#031633] uppercase font-display tracking-wide">
          Pago de pedido
        </h2>
        <p className="text-xs font-bold text-[#ff8928] uppercase tracking-wide">
          Revisa tu resumen antes de pagar
        </p>
      </div>

      <div className="bg-white rounded-3xl border-2 border-[#031633] p-6 shadow-[4px_4px_0_0_#031633] space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-black uppercase text-[#ff8928]">Pedido</span>
          <span className="text-[10px] font-black uppercase text-[#031633]">#{order.numeroPedido?.substring(0, 8) || order._id.substring(18)}</span>
        </div>

        <div className="space-y-3">
          {order.productos?.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm text-[#031633]/85">
              <div>
                <p className="font-black uppercase text-xs">{item.productoId?.name || 'Producto'}</p>
                <p className="text-[10px] text-[#ff8928] uppercase">
                  {item.cantidad} x Q{(item.precioUnitario || item.productoId?.price || 0).toFixed(2)}
                </p>
                {item.acompanamientoId && (
                  <p className="text-[10px] text-[#031633]/70">+ {item.acompanamientoId.name || 'Acompañamiento'}</p>
                )}
              </div>
              <p className="font-black">Q{((item.precioUnitario || item.productoId?.price || 0) * item.cantidad).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-[#efedf0] pt-4 flex justify-between items-center">
          <span className="text-xs font-black uppercase text-[#031633]">Total a pagar</span>
          <span className="text-xl font-black text-[#031633]">Q{(order.totalFinal || order.totalCobrar || 0).toFixed(2)}</span>
        </div>

        <button
          onClick={handlePay}
          disabled={isPaying}
          className="w-full bg-[#ff8928] hover:bg-[#ff9d47] text-white font-black py-4 rounded-2xl border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#031633] transition-all uppercase tracking-wider text-xs"
        >
          {isPaying ? 'Redirigiendo al pago...' : 'Pagar con tarjeta'}
        </button>

        <button
          onClick={() => navigate('/orders')}
          className="w-full bg-white text-[#031633] font-black py-4 rounded-2xl border-2 border-[#031633] shadow-[2px_2px_0_0_#031633] hover:bg-[#f5f3f6] transition-all uppercase tracking-wider text-xs"
        >
          Volver a pedidos
        </button>
      </div>
    </div>
  );
}
