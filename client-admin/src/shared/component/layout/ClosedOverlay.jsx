import { useEffect, useState } from "react";
import { Coffee, Moon, Clock } from "lucide-react";

// Pre-generated static star positions to keep render pure
const STARS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  width: `${(i % 5) + 2}px`,
  height: `${(i % 5) + 2}px`,
  top: `${(i * 17) % 100}%`,
  left: `${(i * 23) % 100}%`,
  duration: `${2 + (i % 4)}s`,
  delay: `${(i % 3)}s`
}));

// Returns the "time remaining until opening" string
function timeUntilOpen() {
  const now = new Date();
  const open = new Date(now);
  open.setHours(6, 15, 0, 0);
  if (now >= open) {
    // Already past 6:15 AM today, so next opening is tomorrow
    open.setDate(open.getDate() + 1);
  }
  const diffMs = open - now;
  const totalSec = Math.floor(diffMs / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function ClosedOverlay({ onBypass }) {
  const [countdown, setCountdown] = useState(timeUntilOpen());

  useEffect(() => {
    const timer = setInterval(() => setCountdown(timeUntilOpen()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center text-center px-6"
      style={{
        background: "linear-gradient(135deg, #031633 0%, #0d2a5e 40%, #1a1535 100%)",
      }}
    >
      {/* Floating stars decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {STARS.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white/20"
            style={{
              width: star.width,
              height: star.height,
              top: star.top,
              left: star.left,
              animation: `pulse ${star.duration} infinite ease-in-out`,
              animationDelay: star.delay
            }}
          />
        ))}
      </div>

      {/* Moon icon */}
      <div className="relative mb-6">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#1e3a72] to-[#0d2255] border-4 border-[#ff8928]/40 shadow-[0_0_40px_rgba(255,137,40,0.3)] flex items-center justify-center">
          <Moon className="text-[#ff8928]" size={56} />
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[#ff8928] flex items-center justify-center shadow-lg">
          <Coffee className="text-white" size={20} />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-wide leading-tight">
        ¡Estamos <span className="text-[#ff8928]">Cerrados</span>!
      </h1>

      {/* Message */}
      <p className="text-white/80 text-base md:text-lg max-w-md mb-6 leading-relaxed">
        En este momento la cafetería no está disponible para pedidos.{" "}
        <span className="text-[#ff8928] font-bold">¡Descansa bien!</span>{" "}
        Volveremos a atenderte a partir de las{" "}
        <span className="font-black text-white">6:15 a.m.</span> 🌅
      </p>

      {/* Countdown */}
      <div className="bg-white/10 border-2 border-[#ff8928]/40 rounded-2xl px-8 py-5 backdrop-blur-sm mb-6">
        <div className="flex items-center gap-2 mb-1 justify-center text-white/60 text-xs uppercase tracking-widest font-semibold">
          <Clock size={14} />
          Abrimos en
        </div>
        <p className="text-4xl md:text-5xl font-black text-[#ff8928] font-mono tracking-widest">
          {countdown}
        </p>
      </div>

      {/* Hours card */}
      <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm text-white/60 max-w-xs mb-6">
        <p className="font-bold text-white mb-2 text-center">🕐 Horario de servicio</p>
        <div className="flex justify-between gap-8">
          <span>Apertura:</span>
          <span className="font-bold text-green-400">6:15 a.m.</span>
        </div>
        <div className="flex justify-between gap-8 mt-1">
          <span>Cierre:</span>
          <span className="font-bold text-red-400">3:20 p.m.</span>
        </div>
      </div>

      {/* Dev Bypass Button */}
      {onBypass && (
        <button
          onClick={onBypass}
          className="px-6 py-2.5 bg-[#ff8928] hover:bg-[#ff8928]/80 text-[#031633] rounded-xl border-2 border-[#031633] font-black shadow-[4px_4px_0_0_#031633] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#031633] active:translate-y-[4px] active:shadow-none transition-all text-xs flex items-center gap-2"
        >
          <span>🔓</span> IGNORAR HORARIO (MODO DESARROLLO)
        </button>
      )}
    </div>
  );
}
