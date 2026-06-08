import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import BackLogin from "../../../assets/BackLogin.png";
import Logo from "../../../assets/Logo.png";

export function RegisterPage() {
  const { register: registerUser, isLoadingAuth } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { name: "", surname: "", username: "", email: "", password: "", phone: "" } });

  const onSubmit = async (data) => {
    // Validar dominios permitidos
    const allowed = /@kinal\.(edu|org)\.gt$/i;
    if (!allowed.test(data.email)) {
      toast.error('Solo se permiten correos @kinal.edu.gt o @kinal.org.gt');
      return;
    }

    if (data.password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    // phone validation is enforced by react-hook-form; ensure we send expected values
    const result = await registerUser({
      name: data.name,
      surname: data.surname,
      username: data.username || data.email.split('@')[0],
      email: data.email,
      password: data.password,
      phone: data.phone,
    });

    if (result.success) {
      toast.success(result.message || 'Registrado. Revisa tu correo para verificar.');
      navigate('/login');
    } else {
      toast.error(result.error || 'Error al registrarse');
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col justify-between font-sans selection:bg-secondary-container selection:text-white">
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(var(--color-surface-container-highest)_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-80" />

      <main className="relative z-10 flex-grow flex flex-col md:flex-row w-full min-h-[calc(100vh-68px)]">
        <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative bg-primary items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img alt="Kinal Cafeteria Ambient" className="w-full h-full object-cover opacity-60 mix-blend-multiply" src={BackLogin} />
          </div>
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-secondary-container/15 rounded-full filter blur-[120px] pointer-events-none" />
          <div className="relative z-20 flex flex-col items-center justify-center p-12 text-center max-w-xl">
            <h1 className="text-white text-5xl lg:text-7xl font-display uppercase tracking-wider mb-6 drop-shadow-[0_4px_12px_rgba(3,22,51,0.6)]">Únete a Kinal</h1>
            <p className="text-lg lg:text-xl text-inverse-primary leading-relaxed font-normal max-w-md drop-shadow-sm">Registra tu cuenta con tu correo institucional para acceder al panel administrativo.</p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-44 bg-gradient-to-t from-primary to-transparent pointer-events-none" />
        </div>

        <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center items-center p-6 md:p-12 relative">
          <div className="w-full max-w-md space-y-8 border-4 border-primary p-8 bg-white backdrop-blur-md shadow-[12px_12px_0px_0px_#03163326] rounded-[3rem] relative z-10 transition-transform duration-300">
            <div className="text-center md:text-left flex flex-col items-center md:items-start space-y-4">
              <div className="inline-block p-1 bg-white border-2 border-dashed border-secondary-container rounded-2xl shadow-sm">
                <img alt="Kinal-Break Institutional Logo" className="h-20 w-auto object-contain select-none" referrerPolicy="no-referrer" src={Logo} />
              </div>

              <div className="space-y-1 w-full text-center md:text-left">
                <h2 className="text-3xl md:text-4xl text-primary font-display uppercase tracking-wide">Registrar cuenta</h2>
                <p className="text-on-surface-variant text-sm font-semibold tracking-wide">Usa tu correo institucional @kinal.edu.gt o @kinal.org.gt</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 text-left group">
                  <label className="block text-sm font-display tracking-wider text-on-surface uppercase">Nombre</label>
                  <input {...register('name', { required: 'Nombre requerido', maxLength: { value: 25, message: 'Máx 25 caracteres' } })} className="block w-full py-3.5 border-2 border-primary bg-surface-bright text-on-surface placeholder-on-surface-variant/50 rounded-full px-4" />
                  {errors.name && <p className="text-xs text-status-error font-semibold">{errors.name.message}</p>}
                </div>
                <div className="space-y-1.5 text-left group">
                  <label className="block text-sm font-display tracking-wider text-on-surface uppercase">Apellido</label>
                  <input {...register('surname', { required: 'Apellido requerido', maxLength: { value: 25, message: 'Máx 25 caracteres' } })} className="block w-full py-3.5 border-2 border-primary bg-surface-bright text-on-surface placeholder-on-surface-variant/50 rounded-full px-4" />
                  {errors.surname && <p className="text-xs text-status-error font-semibold">{errors.surname.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5 text-left group">
                <label className="block text-sm font-display tracking-wider text-on-surface uppercase">Correo Institucional</label>
                <input type="email" placeholder="usuario@kinal.edu.gt" {...register('email', { required: 'El correo es requerido' })} className="block w-full py-3.5 border-2 border-primary bg-surface-bright text-on-surface rounded-full px-4" />
                {errors.email && <p className="text-xs text-status-error font-semibold">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5 text-left group">
                <label className="block text-sm font-display tracking-wider text-on-surface uppercase">Contraseña</label>
                <input type="password" {...register('password', { required: 'La contraseña es requerida', minLength: { value: 8, message: 'Mínimo 8 caracteres' } })} className="block w-full py-3.5 border-2 border-primary bg-surface-bright text-on-surface rounded-full px-4" />
                {errors.password && <p className="text-xs text-status-error font-semibold">{errors.password.message}</p>}
              </div>

              <div className="space-y-1.5 text-left group">
                <label className="block text-sm font-display tracking-wider text-on-surface uppercase">Teléfono (8 dígitos)</label>
                <input {...register('phone', { required: 'Teléfono requerido', minLength: { value: 8, message: 'Debe tener 8 dígitos' }, maxLength: { value: 8, message: 'Debe tener 8 dígitos' }, pattern: { value: /^\d{8}$/, message: 'Solo dígitos' } })} className="block w-full py-3.5 border-2 border-primary bg-surface-bright text-on-surface rounded-full px-4" />
                {errors.phone && <p className="text-xs text-status-error font-semibold">{errors.phone.message}</p>}
              </div>

              <button type="submit" disabled={isLoadingAuth} className="w-full py-4 px-4 border border-transparent shadow-[4px_4px_0px_0px_var(--color-primary)] text-xl font-display text-white bg-primary transition-all duration-150 uppercase tracking-widest rounded-full">
                {isLoadingAuth ? 'Registrando...' : 'Registrar'}
              </button>

              <div className="text-center pt-3">
                <span className="text-sm font-medium text-on-surface-variant">¿Ya tienes cuenta?</span>
                <span onClick={() => navigate('/login')} className="text-sm font-bold text-secondary-container hover:text-secondary transition-colors ml-1.5 cursor-pointer">Iniciar Sesión</span>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RegisterPage;
