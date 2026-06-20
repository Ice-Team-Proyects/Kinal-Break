import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { Mail, Lock, Eye } from "lucide-react";
import Logo from "../../../assets/Logo.png";

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
      toast.success(result.message || "Bienvenido a Kinal Break");
      navigate("/");
    } else {
      toast.error(result.error || "Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col justify-center items-center p-4 relative font-sans">
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(var(--color-surface-container-highest)_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-80" />

      <div className="w-full max-w-md space-y-6 border-4 border-primary p-6 bg-white shadow-[8px_8px_0px_0px_#031633] rounded-3xl relative z-10">
        <div className="text-center flex flex-col items-center space-y-3">
          <div className="inline-block p-1 bg-white border-2 border-dashed border-secondary-container rounded-2xl">
            <img
              alt="Kinal Break Logo"
              className="h-16 w-auto object-contain select-none"
              src={Logo}
            />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl text-primary font-display uppercase tracking-wide">
              Kinal Break Estudiantes
            </h2>
            <p className="text-on-surface-variant text-xs font-semibold">
              Ordena y evita hacer filas en el receso
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1 text-left group">
            <label className="block text-xs font-display tracking-wider text-on-surface uppercase" htmlFor="email">
              Correo Institucional
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-primary/70" />
              </div>
              <input
                id="email"
                type="email"
                placeholder="usuario@kinal.edu.gt"
                {...register("email", { required: "El correo es requerido" })}
                className="block w-full pl-10 pr-4 py-3 border-2 border-primary bg-surface-bright text-on-surface rounded-2xl text-sm font-medium outline-none transition-all duration-200 input-focus-animation"
              />
            </div>
            {errors.email && (
              <p className="text-[10px] text-status-error font-semibold pl-2">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1 text-left group">
            <label className="block text-xs font-display tracking-wider text-on-surface uppercase" htmlFor="password">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-primary/70" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", { required: "La contraseña es requerida" })}
                className="block w-full pl-10 pr-10 py-3 border-2 border-primary bg-surface-bright text-on-surface rounded-2xl text-sm font-medium outline-none transition-all duration-200 input-focus-animation"
              />
              <div
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <Eye className={`w-4 h-4 ${showPassword ? 'text-primary' : 'text-outline'}`} />
              </div>
            </div>
            {errors.password && (
              <p className="text-[10px] text-status-error font-semibold pl-2">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoadingAuth}
            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent shadow-[4px_4px_0px_0px_var(--color-primary)] text-lg font-display text-white bg-primary active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all duration-150 uppercase tracking-widest rounded-2xl cursor-pointer hover:bg-primary-container disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoadingAuth ? "Ingresando..." : "Ingresar"}
          </button>

          <div className="text-center pt-2">
            <span className="text-xs font-medium text-on-surface-variant">
              ¿No tienes una cuenta?
            </span>
            <span onClick={() => navigate('/register')} className="text-xs font-bold text-secondary-container hover:text-secondary transition-colors ml-1.5 cursor-pointer">
              Regístrate aquí
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
