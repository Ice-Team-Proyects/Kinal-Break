import Stripe from 'stripe';
import Payment from '../payment.model.js';
import Order from '../../Order/order.model.js';

const stripeKey = process.env.STRIPE_SECRET_KEY || null;
let stripe = null;
if (stripeKey && stripeKey !== 'sk_test_placeholder') {
  try {
    // Do not force an API version here; let the Stripe SDK use its compatible default.
    // If you want to use a newer API version, upgrade the `stripe` package first
    // to a release that supports that API version.
    stripe = new Stripe(stripeKey);
  } catch (err) {
    console.error('Error inicializando Stripe:', err.message);
    stripe = null;
  }
} else {
  console.warn('Stripe no configurado o usando placeholder. Algunas rutas relacionadas con Stripe no estarán disponibles.');
}

export const createCheckoutSession = async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ success: false, message: 'Stripe no configurado' });
  }
  try {
    const { orderId } = req.body;
    const userId = req.user.id;

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId es obligatorio' });
    }

    const order = await Order.findOne({ _id: orderId, usuarioId: userId, activo: { $ne: false } });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Orden no encontrada' });
    }

    if (order.estado !== 'Pendiente') {
      return res.status(400).json({ success: false, message: 'La orden ya no está en estado pendiente' });
    }

    const lineItems = order.productos.map((item) => ({
      price_data: {
        currency: 'gtq',
        product_data: {
          name: item.productoId?.name || 'Producto',
          description: item.acompanamientoId?.name ? `Acompañamiento: ${item.acompanamientoId.name}` : undefined
        },
        unit_amount: Math.round((item.precioUnitario || 0) * 100)
      },
      quantity: item.cantidad
    }));

    const successUrl = `${process.env.CLIENT_CUSTOMER_URL || 'http://localhost:5173'}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.CLIENT_CUSTOMER_URL || 'http://localhost:5173'}/payment/cancel?orderId=${orderId}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        orderId: orderId,
        userId: userId
      }
    });

    await Payment.findOneAndUpdate(
      { orderId },
      {
        orderId,
        userId,
        amount: order.totalFinal || order.totalCobrar || 0,
        paymentMethod: 'Stripe',
        status: 'Pendiente',
        stripeSessionId: session.id,
        isDeleted: false,
        deletedAt: null
      },
      { upsert: true, setDefaultsOnInsert: true, returnDocument: 'after' }
    );

    return res.status(201).json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error('createCheckoutSession error:', error);
    return res.status(500).json({ success: false, message: 'No se pudo crear la sesión de pago', error: error.message });
  }
};

export const getPaymentSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const payment = await Payment.findOne({ stripeSessionId: sessionId, isDeleted: false });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Pago no encontrado' });
    }

    if (payment.status !== 'Pagado' && stripe) {
      try {
        const stripeSession = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['payment_intent'] });
        const isPaid = stripeSession.payment_status === 'paid'
          || stripeSession.status === 'complete'
          || stripeSession.payment_intent?.status === 'succeeded';

        if (isPaid) {
          const updatedPayment = await Payment.findOneAndUpdate(
            { _id: payment._id },
            { status: 'Pagado' },
            { returnDocument: 'after' }
          );

          if (updatedPayment?.orderId) {
            await Order.findOneAndUpdate(
              { _id: updatedPayment.orderId, activo: { $ne: false } },
              { estado: 'Pagado' },
              { returnDocument: 'after' }
            );
          }

          return res.json({ success: true, payment: updatedPayment || payment });
        }
      } catch (stripeError) {
        console.error('No se pudo sincronizar el estado del pago desde Stripe:', stripeError.message);
      }
    }

    return res.json({ success: true, payment });
  } catch (error) {
    console.error('getPaymentSession error:', error);
    res.status(500).json({ success: false, message: 'Error al consultar el estado del pago' });
  }
};

export const stripeWebhook = async (req, res) => {
  if (!stripe) {
    console.error('Stripe no configurado para webhook');
    return res.status(503).json({ success: false, message: 'Stripe no configurado' });
  }
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Stripe webhook secret no configurada');
    return res.status(500).json({ success: false, message: 'Configuración de Stripe incompleta' });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (error) {
    console.error('Error construyendo evento Stripe:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const payment = await Payment.findOneAndUpdate(
        { stripeSessionId: session.id },
        { status: 'Pagado' },
        { returnDocument: 'after' }
      );

      if (payment) {
        await Order.findOneAndUpdate(
          { _id: payment.orderId, activo: { $ne: false } },
          { estado: 'Pagado' },
          { returnDocument: 'after' }
        );
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('stripeWebhook handler error:', error);
    return res.status(500).json({ success: false, message: 'Error procesando el webhook' });
  }
};
