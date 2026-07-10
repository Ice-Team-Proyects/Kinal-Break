import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getPaymentSessionRequest } from '../../../shared/api/paymentApi.js';

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('pending');
  const [orderId, setOrderId] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let intervalId;
    const fetchStatus = async () => {
      try {
        const response = await getPaymentSessionRequest(sessionId);
        const payment = response.data.payment;
        setOrderId(payment.orderId);
        setStatus(payment.status);
        if (payment.status === 'Pagado') {
          clearInterval(intervalId);
          setIsChecking(false);
          toast.success('Pago confirmado con éxito.');
        }
      } catch (error) {
        console.error(error);
        clearInterval(intervalId);
        setIsChecking(false);
        toast.error('No se pudo verificar el pago. Intenta nuevamente.');
      }
    };

    if (!sessionId) {
      setIsChecking(false);
      return;
    }

    fetchStatus();
    intervalId = setInterval(fetchStatus, 2500);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [sessionId]);

  useEffect(() => {
    if (status !== 'Pagado') return;

    const timer = window.setTimeout(() => {
      navigate('/', { replace: true });
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [status, navigate]);

  const title = status === 'Pagado' ? '¡Pago confirmado!' : 'Pago en revisión';
  const message =
    status === 'Pagado'
      ? 'Tu pago fue procesado correctamente. Ya puedes revisar el pedido en tu historial.'
      : 'Stripe procesó el pago y estamos verificando el estado. Mantén esta página abierta mientras confirmamos la transacción.';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-[#031633] uppercase font-display tracking-wide">
          {title}
        </h2>
        <p className="text-xs font-bold text-[#ff8928] uppercase tracking-wide">
          {status === 'Pagado' ? 'Gracias por tu compra' : 'Verificando pago...'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border-2 border-[#031633] p-8 shadow-[4px_4px_0_0_#031633] text-center">
        <p className="text-base font-black text-[#031633] mb-4">{message}</p>
        {status !== 'Pagado' && (
          <p className="text-sm text-[#031633]/70 mb-4">
            Estamos verificando la transacción con Stripe. Si tarda más de un minuto, vuelve a cargar la página.
          </p>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate('/', { replace: true })}
            className="w-full bg-[#ff8928] hover:bg-[#ff9d47] text-white font-black py-3 rounded-2xl border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] uppercase tracking-wider text-xs"
          >
            {status === 'Pagado' ? 'Ir al dashboard' : 'Ver mi estado'}
          </button>
          <button
            onClick={() => navigate(orderId ? `/payment/${orderId}` : '/orders')}
            className="w-full bg-white text-[#031633] border-2 border-[#031633] font-black py-3 rounded-2xl shadow-[2px_2px_0_0_#031633] hover:bg-[#f5f3f6] uppercase tracking-wider text-xs"
          >
            {status === 'Pagado' ? 'Ver pedido' : 'Revisar estado del pago'}
          </button>
        </div>
      </div>
    </div>
  );
}
