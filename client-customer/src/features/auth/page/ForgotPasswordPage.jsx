import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import BackLogin from "../../../assets/BackLogin.png";
import Logo from "../../../assets/Logo.png";
import { Mail, ArrowLeft } from "lucide-react";

export function ForgotPasswordPage() {
  const { forgotPassword } = useAuthStore();
  const navigate = useNavigate();
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    const email = data.email.trim();
    
    // Validar formato de correo especificado por el usuario
    const isValidDomain = email.endsWith("@kinal.edu.gt") || email.endsWith("@kinal.org.gt") || email === "ksadmin@local.com";
    if (!isValidDomain) {
      toast.error("Correo inválido. Debe usar @kinal.edu.gt, @kinal.org.gt o la cuenta administrativa.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await forgotPassword(email);
      if (result.success) {
        toast.success("Correo de recuperación enviado con éxito");
        setIsSent(true);
      } else {
        toast.error(result.error || "Ocurrió un error al enviar el correo");
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
              Recupera tu Cuenta
            </h1>
            <p className="text-lg lg:text-xl text-inverse-primary leading-relaxed font-normal max-w-md drop-shadow-sm">
              Ingresa tu correo para recibir un enlace seguro y restablecer tu contraseña.
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
              <ArrowLeft size={16} /> Volver al Login
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
                ¿Olvidaste tu contraseña?
              </h2>
              <p className="text-on-surface-variant text-xs font-semibold leading-relaxed">
                Ingresa tu correo registrado y te enviaremos las instrucciones de restablecimiento.
              </p>
            </div>

            {!isSent ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-1.5 text-left group">
                  <label className="block text-xs font-display tracking-wider text-on-surface uppercase">
                    Correo Institucional
                  </label>
                  <div className="relative rounded-full">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-primary/70" />
                    </div>
                    <input
                      type="email"
                      placeholder="usuario@kinal.edu.gt"
                      {...register("email", { 
                        required: "El correo es requerido",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Dirección de correo inválida"
                        }
                      })}
                      className="block w-full pl-11 pr-4 py-3.5 border-2 border-primary bg-surface-bright text-on-surface placeholder-on-surface-variant/50 rounded-full text-base font-medium outline-none"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-status-error font-semibold pl-4">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-4 px-4 border border-transparent shadow-[4px_4px_0px_0px_var(--color-primary)] text-lg font-display text-white bg-primary active:translate-y-1 active:translate-x-1 active:shadow-none transition-all duration-150 uppercase tracking-widest rounded-full cursor-pointer hover:bg-primary-container disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Enviando..." : "Enviar Enlace"}
                </button>
              </form>
            ) : (
              <div className="bg-emerald-50 rounded-2xl border-2 border-emerald-500 p-5 space-y-3 text-left">
                <h3 className="text-sm font-black text-emerald-800 uppercase font-display">¡Enlace Enviado!</h3>
                <p className="text-xs text-emerald-700 font-bold leading-relaxed">
                  Hemos enviado un correo con el token y enlace de recuperación. Por favor verifica tu bandeja de entrada o spam.
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3 rounded-xl border-2 border-[#031633] shadow-[2px_2px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#031633] transition-all cursor-pointer text-xs uppercase"
                >
                  Regresar a Iniciar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ForgotPasswordPage;
