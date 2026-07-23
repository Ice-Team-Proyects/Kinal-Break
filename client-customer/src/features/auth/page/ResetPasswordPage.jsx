import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import BackLogin from "../../../assets/BackLogin.png";
import Logo from "../../../assets/Logo.png";
import { Lock, Eye, ArrowLeft } from "lucide-react";

export function ResetPasswordPage() {
  const { resetPassword } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const token = searchParams.get("token") || "";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const watchPassword = watch("password");

  const onSubmit = async (data) => {
    if (!token) {
      toast.error("Token de recuperación ausente de la URL. Vuelve a solicitar el enlace.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await resetPassword(token, data.password);
      if (result.success) {
        toast.success("Tu contraseña ha sido restablecida. Inicia sesión con tu nueva contraseña.");
        navigate("/login");
      } else {
        toast.error(result.error || "Ocurrió un error al restablecer tu contraseña");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al procesar la solicitud");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col justify-between font-sans selection:bg-secondary-container selection:text-white">
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(var(--color-surface-container-highest)_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-80" />

      <main className="relative z-10 flex-grow flex flex-col md:flex-row w-full min-h-[calc(100vh-68px)]">
        {/* Left decoration column */}
        <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative bg-primary items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              alt="Kinal Cafeteria Ambient"
              className="w-full h-full object-cover opacity-60 mix-blend-multiply"
              src={BackLogin}
            />
          </div>
          <div className="relative z-20 flex flex-col items-center justify-center p-12 text-center max-w-xl">
            <h1 className="text-white text-5xl lg:text-7xl font-display uppercase tracking-wider mb-6 drop-shadow-[0_4px_12px_rgba(3,22,51,0.6)]">
              Nueva Contraseña
            </h1>
            <p className="text-lg lg:text-xl text-inverse-primary leading-relaxed font-normal max-w-md drop-shadow-sm">
              Define tu nueva contraseña de acceso de manera segura.
            </p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-44 bg-gradient-to-t from-primary to-transparent pointer-events-none" />
        </div>

        {/* Right form column */}
        <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center items-center p-6 md:p-12 relative">
          <div className="w-full max-w-md space-y-8 border-4 border-primary p-8 bg-white backdrop-blur-md shadow-[12px_12px_0px_0px_#03163326] rounded-[3rem] relative z-10">
            
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-xs font-bold text-primary hover:text-secondary-container transition-colors uppercase cursor-pointer"
            >
              <ArrowLeft size={16} /> Ir al Login
            </button>

            <div className="text-center md:text-left flex flex-col items-center md:items-start space-y-4 pt-2">
              <div className="inline-block p-1 bg-white border-2 border-dashed border-secondary-container rounded-2xl shadow-sm">
                <img
                  alt="Logo"
                  className="h-16 w-auto object-contain select-none"
                  src={Logo}
                />
              </div>
              <h2 className="text-2xl md:text-3xl text-primary font-display uppercase tracking-wide">
                Restablecer contraseña
              </h2>
              <p className="text-on-surface-variant text-xs font-semibold leading-relaxed">
                Ingresa una contraseña fuerte de al menos 8 caracteres.
              </p>
            </div>

            {!token && (
              <div className="bg-amber-50 rounded-2xl border-2 border-amber-500 p-4 text-left text-xs font-bold text-amber-800 leading-relaxed">
                Advertencia: No se detectó un token en la dirección de la página. Asegúrate de haber hecho clic en el enlace exacto enviado a tu correo.
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* New Password */}
              <div className="space-y-1.5 text-left group">
                <label className="block text-xs font-display tracking-wider text-on-surface uppercase">
                  Nueva Contraseña
                </label>
                <div className="relative rounded-full">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-primary/70" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password", { 
                      required: "La contraseña es requerida",
                      minLength: { value: 8, message: "Debe tener al menos 8 caracteres" }
                    })}
                    className="block w-full pl-11 pr-11 py-3.5 border-2 border-primary bg-surface-bright text-on-surface placeholder-on-surface-variant/50 rounded-full text-base font-medium outline-none"
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Eye className={`w-5 h-5 ${showPassword ? 'text-primary' : 'text-outline hover:text-primary'}`} />
                  </div>
                </div>
                {errors.password && (
                  <p className="text-xs text-status-error font-semibold pl-4">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5 text-left group">
                <label className="block text-xs font-display tracking-wider text-on-surface uppercase">
                  Confirmar Contraseña
                </label>
                <div className="relative rounded-full">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-primary/70" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword", { 
                      required: "Debe confirmar la contraseña",
                      validate: (val) => val === watchPassword || "Las contraseñas no coinciden"
                    })}
                    className="block w-full pl-11 pr-11 py-3.5 border-2 border-primary bg-surface-bright text-on-surface placeholder-on-surface-variant/50 rounded-full text-base font-medium outline-none"
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Eye className={`w-5 h-5 ${showConfirmPassword ? 'text-primary' : 'text-outline hover:text-primary'}`} />
                  </div>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-status-error font-semibold pl-4">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !token}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent shadow-[4px_4px_0px_0px_var(--color-primary)] text-lg font-display text-white bg-primary active:translate-y-1 active:translate-x-1 active:shadow-none transition-all duration-150 uppercase tracking-widest rounded-full cursor-pointer hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Restableciendo..." : "Actualizar Contraseña"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ResetPasswordPage;
