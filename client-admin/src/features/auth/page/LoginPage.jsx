import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import BackLogin from "../../../assets/BackLogin.png";
import Logo from "../../../assets/Logo.png";

import { Mail, Lock, Eye } from "lucide-react";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoadingAuth } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) {
      toast.success(result.message || "¡Bienvenido a Kinal-Break!");
      navigate("/");
    } else {
      toast.error(result.error || "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col justify-between font-sans selection:bg-secondary-container selection:text-white">
      {/* Background Grid Pattern of the right side matching original */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(var(--color-surface-container-highest)_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-80" />

      {/* Main Split Screen Container */}
      <main className="relative z-10 flex-grow flex flex-col md:flex-row w-full min-h-[calc(100vh-68px)]">
        {/* Left Column: Ambient Cafeteria and Motivational Text */}
        <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative bg-primary items-center justify-center overflow-hidden">
          {/* Background Image of Kinal Cafeteria */}
          <div className="absolute inset-0 z-0">
            <img
              alt="Kinal Cafeteria Ambient"
              className="w-full h-full object-cover opacity-60 mix-blend-multiply"
              src={BackLogin}
            />
          </div>

          {/* Ambient Warm Golden Blur Light */}
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-secondary-container/15 rounded-full filter blur-[120px] pointer-events-none" />

          {/* Text Content */}
          <div className="relative z-20 flex flex-col items-center justify-center p-12 text-center max-w-xl">
            <h1 className="text-white text-5xl lg:text-7xl font-display uppercase tracking-wider mb-6 drop-shadow-[0_4px_12px_rgba(3,22,51,0.6)]">
              Tu camino al éxito está en Kinal
            </h1>
            <p className="text-lg lg:text-xl text-inverse-primary leading-relaxed font-normal max-w-md drop-shadow-sm">
              Accede a Kinal-Break para consultar menús y organizar tu tiempo en
              cafetería de manera eficiente.
            </p>
          </div>

          {/* Bottom vignette */}
          <div className="absolute bottom-0 left-0 w-full h-44 bg-gradient-to-t from-primary to-transparent pointer-events-none" />
        </div>

        {/* Right Column: Clean Login card over layout pattern */}
        <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center items-center p-6 md:p-12 relative">
          {/* Main Visual Login Card - 1:1 match of shadow and rounded shape with Neobrutalism styles */}
          <div className="w-full max-w-md space-y-8 border-4 border-primary p-8 bg-white backdrop-blur-md shadow-[12px_12px_0px_0px_#03163326] rounded-[3rem] relative z-10 transition-transform duration-300">
            {/* Header / Logo */}
            <div className="text-center md:text-left flex flex-col items-center md:items-start space-y-4">
              {/* Logo wrapper */}
              <div className="inline-block p-1 bg-white border-2 border-dashed border-secondary-container rounded-2xl shadow-sm">
                <img
                  alt="Kinal-Break Institutional Logo"
                  className="h-20 w-auto object-contain select-none"
                  referrerPolicy="no-referrer"
                  src={Logo}
                />
              </div>

              {/* Title group */}
              <div className="space-y-1 w-full text-center md:text-left">
                <h2 className="text-3xl md:text-4xl text-primary font-display uppercase tracking-wide">
                  Bienvenido a Kinal-Break
                </h2>
                <p className="text-on-surface-variant text-sm font-semibold tracking-wide">
                  Ingresa con tus credenciales institucionales.
                </p>
              </div>
            </div>

            {/* Form Container */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email item */}
              <div className="space-y-1.5 text-left group">
                <label
                  className="block text-sm font-display tracking-wider text-on-surface uppercase group-focus-within:text-secondary-container transition-colors"
                  htmlFor="email"
                >
                  Correo Institucional
                </label>
                <div className="relative rounded-full">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-primary/70 group-focus-within:text-secondary-container transition-colors" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="usuario@kinal.edu.gt"
                    {...register("email", { required: "El correo es requerido" })}
                    className="block w-full pl-11 pr-4 py-3.5 border-2 border-primary bg-surface-bright text-on-surface placeholder-on-surface-variant/50 rounded-full text-base font-medium outline-none transition-all duration-200 input-focus-animation"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-status-error font-semibold pl-4">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password item */}
              <div className="space-y-1.5 text-left group">
                <label
                  className="block text-sm font-display tracking-wider text-on-surface uppercase group-focus-within:text-secondary-container transition-colors"
                  htmlFor="password"
                >
                  Contraseña
                </label>
                <div className="relative rounded-full">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-primary/70 group-focus-within:text-secondary-container transition-colors" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password", { required: "La contraseña es requerida" })}
                    className="block w-full pl-11 pr-11 py-3.5 border-2 border-primary bg-surface-bright text-on-surface placeholder-on-surface-variant/50 rounded-full text-base font-medium outline-none transition-all duration-200 input-focus-animation"
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Eye className={`w-5 h-5 transition-colors ${showPassword ? 'text-primary' : 'text-outline hover:text-primary'}`} />
                  </div>
                </div>
                {errors.password && (
                  <p className="text-xs text-status-error font-semibold pl-4">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot link */}
              <div className="text-left pt-1">
                <span 
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs font-semibold text-primary hover:text-secondary-container transition-colors cursor-pointer underline decoration-dotted"
                >
                  ¿Olvidaste tu contraseña?
                </span>
              </div>

              {/* Primary action CTA matching original styled login button */}
              <button
                type="submit"
                disabled={isLoadingAuth}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent shadow-[4px_4px_0px_0px_var(--color-primary)] text-xl font-display text-white bg-primary active:translate-y-1 active:translate-x-1 active:shadow-none transition-all duration-150 uppercase tracking-widest rounded-full cursor-pointer hover:bg-primary-container disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoadingAuth ? "Iniciando..." : "Iniciar Sesión"}
              </button>

              {/* Secondary CTA options */}
              <div className="text-center pt-3">
                <span className="text-sm font-medium text-on-surface-variant">
                  ¿No tienes cuenta?
                </span>
                <span onClick={() => navigate('/register')} className="text-sm font-bold text-secondary-container hover:text-secondary transition-colors ml-1.5 cursor-pointer">
                  Solicitar acceso
                </span>
              </div>
            </form>
          </div>
        </div>
      </main>

      
    </div>
  );
}
