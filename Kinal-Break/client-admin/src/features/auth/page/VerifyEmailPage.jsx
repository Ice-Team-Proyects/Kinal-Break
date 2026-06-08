import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { verifyEmail } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!token) {
        toast.error('Token inválido');
        navigate('/login');
        return;
      }
      setLoading(true);
      const res = await verifyEmail(token);
      setLoading(false);
      if (res.success) {
        toast.success(res.message || 'Correo verificado, ya puedes iniciar sesión');
        navigate('/login');
      } else {
        toast.error(res.error || 'No se pudo verificar el correo');
        navigate('/login');
      }
    };
    run();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 bg-white rounded-2xl border-2 border-primary text-center">
        {loading ? <p>Verificando...</p> : <p>Redirigiendo...</p>}
      </div>
    </div>
  );
}

export default VerifyEmailPage;
