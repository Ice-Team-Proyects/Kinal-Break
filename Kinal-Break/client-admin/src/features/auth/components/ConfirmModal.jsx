import { useUIStore } from "../store/uiStore.js";

export const UiConfirmHost = () => {
  const confirm = useUIStore((s) => s.confirm);
  const closeConfirm = useUIStore((s) => s.closeConfirm);

  if (!confirm) return null;

  const handleCancel = () => {
    confirm.onCancel?.();
    closeConfirm();
  };
  const handleConfirm = async () => {
    try {
      await Promise.resolve(confirm.onConfirm?.());
    } finally {
      closeConfirm();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div
        className="bg-white p-6 rounded-2xl w-full max-w-sm text-center shadow-2xl border border-gray-100 animate-scaleIn"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: "linear-gradient(135deg,#fff7ed,#ffedd5)" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 9v4m0 4h.01M10.293 4.293a1 1 0 011.414 0l7 7a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 010-1.414l7-7z"
              stroke="#ea580c"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="9" stroke="#ea580c" strokeWidth="2" />
            <path
              d="M12 8v4"
              stroke="#ea580c"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="16" r="1" fill="#ea580c" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-1">
          {confirm.title}
        </h2>
        <p className="text-gray-500 text-sm mb-6">{confirm.message}</p>
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={() => void handleConfirm()}
            className="flex-1 py-2.5 rounded-xl text-white font-semibold transition text-sm"
            style={{ background: "linear-gradient(90deg,#ea580c,#dc2626)" }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};
