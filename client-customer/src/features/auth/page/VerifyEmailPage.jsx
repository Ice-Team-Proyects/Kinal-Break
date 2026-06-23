import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const { verifyEmail } = useAuthStore();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const token = searchParams.get("token");

    const performVerification = async () => {
      if (!token) {
        await Promise.resolve();
        toast.error("Token de verificación ausente");
        setStatus("error");
        return;
      }
      const result = await verifyEmail(token);
      if (result.success) {
        toast.success(result.message || "Correo verificado exitosamente");
        setStatus("success");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        toast.error(result.error || "Fallo en la verificación");
        setStatus("error");
      }
    };

    performVerification();
  }, [searchParams, navigate, verifyEmail]);

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col justify-center items-center p-4 relative font-sans">
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(var(--color-surface-container-highest)_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-80" />

      <div className="w-full max-w-sm space-y-6 border-4 border-primary p-6 bg-white shadow-[8px_8px_0px_0px_#031633] rounded-3xl relative z-10 text-center">
        <h2 className="text-2xl text-primary font-display uppercase tracking-wide">
          Verificación de Correo
        </h2>
        {status === "verifying" && (
          <p className="text-sm font-bold text-secondary-container animate-pulse">
            Verificando tu cuenta institucional...
          </p>
        )}
        {status === "success" && (
          <div className="space-y-2">
            <p className="text-sm font-bold text-emerald-600">
              ¡Cuenta activada exitosamente!
            </p>
            <p className="text-xs text-on-surface-variant">
              Redirigiendo al inicio de sesión en unos segundos...
            </p>
          </div>
        )}
        {status === "error" && (
          <div className="space-y-4">
            <p className="text-sm font-bold text-status-error">
              El enlace de verificación es inválido o ha expirado.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-[#ff8928] text-white font-black py-3 rounded-2xl border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#031633] transition-all uppercase tracking-wider text-xs cursor-pointer"
            >
              Ir a Iniciar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
