import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { User, Mail, Lock, Phone } from "lucide-react";

export function RegisterPage() {
  const { register: registerAuth, isLoadingAuth } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      surname: "",
      username: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  const onSubmit = async (data) => {
    const result = await registerAuth(data);
    if (result.success) {
      toast.success("Registro completado. Revisa tu correo institucional para activar tu cuenta.");
      navigate("/login");
    } else {
      toast.error(result.error || "Error al registrarse");
    }
  };

  const emailValue = watch("email");

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col justify-center items-center p-4 relative font-sans">
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(var(--color-surface-container-highest)_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-80" />

      <div className="w-full max-w-md space-y-5 border-4 border-primary p-6 bg-white shadow-[8px_8px_0px_0px_#031633] rounded-3xl relative z-10 max-h-[90vh] overflow-y-auto">
        <div className="text-center flex flex-col items-center">
          <h2 className="text-2xl text-primary font-display uppercase tracking-wide">
            Registro de Estudiantes
          </h2>
          <p className="text-on-surface-variant text-xs font-semibold">
            Crea tu cuenta institucional para Kinal Break
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 text-left">
              <label className="block text-[10px] font-display tracking-wider text-on-surface uppercase">Nombre</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  {...register("name", { required: "Requerido" })}
                  className="block w-full px-3 py-2 border-2 border-primary bg-surface-bright text-on-surface rounded-xl text-xs font-medium outline-none transition-all duration-200 input-focus-animation"
                />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="block text-[10px] font-display tracking-wider text-on-surface uppercase">Apellido</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  {...register("surname", { required: "Requerido" })}
                  className="block w-full px-3 py-2 border-2 border-primary bg-surface-bright text-on-surface rounded-xl text-xs font-medium outline-none transition-all duration-200 input-focus-animation"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="block text-[10px] font-display tracking-wider text-on-surface uppercase">Nombre de Usuario</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-3.5 h-3.5 text-primary/70" />
              </div>
              <input
                type="text"
                required
                {...register("username", { required: "Requerido" })}
                className="block w-full pl-9 pr-3 py-2.5 border-2 border-primary bg-surface-bright text-on-surface rounded-xl text-xs font-medium outline-none transition-all duration-200 input-focus-animation"
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="block text-[10px] font-display tracking-wider text-on-surface uppercase">Correo Institucional</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-3.5 h-3.5 text-primary/70" />
              </div>
              <input
                type="email"
                required
                {...register("email", { 
                  required: "Requerido",
                  validate: value => 
                    value.endsWith("@kinal.edu.gt") || value.endsWith("@kinal.org.gt") || "Debe ser correo @kinal.edu.gt o @kinal.org.gt"
                })}
                className="block w-full pl-9 pr-3 py-2.5 border-2 border-primary bg-surface-bright text-on-surface rounded-xl text-xs font-medium outline-none transition-all duration-200 input-focus-animation"
              />
            </div>
            {errors.email && (
              <p className="text-[9px] text-status-error font-semibold pl-2">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 text-left">
              <label className="block text-[10px] font-display tracking-wider text-on-surface uppercase">Teléfono (8 dígitos)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="w-3.5 h-3.5 text-primary/70" />
                </div>
                <input
                  type="text"
                  required
                  {...register("phone", { 
                    required: "Requerido",
                    pattern: {
                      value: /^[0-9]{8}$/,
                      message: "Debe tener 8 dígitos"
                    }
                  })}
                  className="block w-full pl-9 pr-3 py-2.5 border-2 border-primary bg-surface-bright text-on-surface rounded-xl text-xs font-medium outline-none transition-all duration-200 input-focus-animation"
                />
              </div>
              {errors.phone && (
                <p className="text-[9px] text-status-error font-semibold pl-2">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-1 text-left">
              <label className="block text-[10px] font-display tracking-wider text-on-surface uppercase">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-3.5 h-3.5 text-primary/70" />
                </div>
                <input
                  type="password"
                  required
                  {...register("password", { 
                    required: "Requerido",
                    minLength: {
                      value: 8,
                      message: "Mínimo 8 caracteres"
                    }
                  })}
                  className="block w-full pl-9 pr-3 py-2.5 border-2 border-primary bg-surface-bright text-on-surface rounded-xl text-xs font-medium outline-none transition-all duration-200 input-focus-animation"
                />
              </div>
              {errors.password && (
                <p className="text-[9px] text-status-error font-semibold pl-2">{errors.password.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoadingAuth}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent shadow-[4px_4px_0px_0px_var(--color-primary)] text-base font-display text-white bg-primary active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all duration-150 uppercase tracking-widest rounded-2xl cursor-pointer hover:bg-primary-container disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoadingAuth ? "Registrando..." : "Registrarse"}
          </button>

          <div className="text-center pt-2">
            <span className="text-xs font-medium text-on-surface-variant">
              ¿Ya tienes cuenta?
            </span>
            <span onClick={() => navigate('/login')} className="text-xs font-bold text-secondary-container hover:text-secondary transition-colors ml-1.5 cursor-pointer">
              Inicia sesión aquí
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
