
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/store/authStore";
import { Power, Mail, Shield } from "lucide-react";

export function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-black text-[#031633] uppercase font-display tracking-wide">
          Mi Perfil
        </h2>
        <p className="text-xs font-bold text-[#ff8928] uppercase tracking-wide">
          Información de tu cuenta estudiantil
        </p>
      </div>

      <div className="bg-white rounded-3xl border-2 border-[#031633] p-5 shadow-[4px_4px_0_0_#031633] space-y-4">
        <div className="flex items-center gap-4 border-b-2 border-[#efedf0] pb-4">
          <div className="w-16 h-16 rounded-2xl bg-[#ff8928] text-white flex items-center justify-center font-black text-2xl border-2 border-[#031633] shadow-[2px_2px_0_0_#031633]">
            {user?.username ? user.username[0].toUpperCase() : "U"}
          </div>
          <div>
            <h3 className="text-sm font-black text-[#031633] uppercase">
              {user?.username || "Estudiante"}
            </h3>
            <span className="text-[10px] font-bold text-[#ff8928] uppercase tracking-wider">
              {user?.role || "USER_ROLE"}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs font-bold text-[#031633]/80">
            <Mail size={16} className="text-[#ff8928]" />
            <span>{user?.email || "No disponible"}</span>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold text-[#031633]/80">
            <Shield size={16} className="text-[#ff8928]" />
            <span>ID: {user?.id || "N/A"}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-[#ff8928] hover:bg-[#ff9d47] text-white font-black py-3.5 rounded-2xl border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#031633] transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs cursor-pointer mt-4"
        >
          <Power size={14} /> Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
export default ProfilePage;
