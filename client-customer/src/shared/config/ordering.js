/** Datos bancarios para pago por transferencia (cafetería / cuik / BelApp BI).
 *  Sustituye VITE_* en Render si cambian. Imagen: public/transferencia-qr.png
 */
const DEFAULT_TRANSFER_LINK =
  'https://belappgt.bi.com.gt/qr?type=tm&qrdata=6a5a4879080850317573673afc9affd7cc26246035a9043b2838e71fb1bb0557';

export const TRANSFER_PAYMENT = {
  banco: import.meta.env.VITE_BANK_NAME || 'Banco Industrial',
  tipoCuenta: import.meta.env.VITE_BANK_ACCOUNT_TYPE || 'Cuenta de ahorro',
  numeroCuenta: import.meta.env.VITE_BANK_ACCOUNT_NUMBER || '1228604',
  titular: import.meta.env.VITE_BANK_HOLDER || 'Huit Escobar',
  qrUrl: import.meta.env.VITE_BANK_QR_URL || '/transferencia-qr.png',
  transferLink: import.meta.env.VITE_BANK_TRANSFER_LINK || DEFAULT_TRANSFER_LINK,
  instruccion:
    import.meta.env.VITE_BANK_INSTRUCTION ||
    'Escanea el QR con tu app bancaria o abre el enlace para pagar con BelApp / cuik',
};

/** Ventanas de recogida (HH:MM) */
export const MEAL_PICKUP_WINDOWS = {
  desayunos: { start: 8 * 60 + 55, end: 9 * 60 + 20 },
  almuerzos: { start: 11 * 60 + 45, end: 15 * 60 + 25 },
};

export function formatMinutes(total) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function buildPickupSlots(category, stepMinutes = 5) {
  const window = MEAL_PICKUP_WINDOWS[category];
  if (!window) return [];
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const slots = [];
  for (let t = window.start; t <= window.end; t += stepMinutes) {
    // Solo horas de recogida que aún no pasaron hoy
    if (t >= nowMinutes) {
      slots.push(formatMinutes(t));
    }
  }
  return slots;
}

/** ¿Se puede iniciar un pedido de comida ahora? (ventana amplia de reserva del día) */
export function canReserveMealNow(category) {
  if (category !== 'desayunos' && category !== 'almuerzos') return true;
  const now = new Date();
  const total = now.getHours() * 60 + now.getMinutes();
  // Reserva disponible desde apertura cafetería hasta el fin de la ventana de esa comida
  const open = 6 * 60 + 15;
  const end = MEAL_PICKUP_WINDOWS[category]?.end ?? open;
  return total >= open && total <= end;
}

export function mealHoursLabel(category) {
  if (category === 'desayunos') return '8:55 a.m. y 9:20 a.m.';
  if (category === 'almuerzos') return '11:45 a.m. y 3:25 p.m.';
  return 'el horario permitido';
}
