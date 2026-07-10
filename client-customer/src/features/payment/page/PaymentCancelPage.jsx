import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export function PaymentCancelPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const [message, setMessage] = useState('El pago fue cancelado. Puedes intentar nuevamente o revisar tu carrito.');

  useEffect(() => {
    if (orderId) {
      setMessage('El pago fue cancelado. Tu pedido queda pendiente y puedes intentarlo nuevamente.');
    }
  }, [orderId]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-[#031633] uppercase font-display tracking-wide">
          Pago cancelado
        </h2>
        <p className="text-xs font-bold text-[#ff8928] uppercase tracking-wide">
          No se completó el pago
        </p>
      </div>

      <div className="bg-white rounded-3xl border-2 border-[#031633] p-8 shadow-[4px_4px_0_0_#031633] text-center">
        <p className="text-base font-black text-[#031633] mb-4">{message}</p>

        <div className="space-y-3">
          <button
            onClick={() => navigate(orderId ? `/payment/${orderId}` : '/orders')}
            className="w-full bg-[#ff8928] hover:bg-[#ff9d47] text-white font-black py-3 rounded-2xl border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] uppercase tracking-wider text-xs"
          >
            Intentar pago de nuevo
          </button>
          <button
            onClick={() => navigate('/orders')}
            className="w-full bg-white text-[#031633] border-2 border-[#031633] font-black py-3 rounded-2xl shadow-[2px_2px_0_0_#031633] hover:bg-[#f5f3f6] uppercase tracking-wider text-xs"
          >
            Ver mis pedidos
          </button>
        </div>
      </div>
    </div>
  );
}
