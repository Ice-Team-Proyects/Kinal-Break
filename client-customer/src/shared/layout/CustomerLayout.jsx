import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/authStore";
import { useCartStore } from "../../features/cart/store/cartStore";
import { Utensils, ShoppingCart, ClipboardList, User, LogOut } from "lucide-react";
import Logo from "../../assets/Logo.png";
import BackLogin from "../../assets/BackLogin.png";

export default function CustomerLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const cartItems = useCartStore((state) => state.cartItems);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const cartCount = cartItems.reduce((acc, curr) => acc + curr.cantidad, 0);

  const navItems = [
    { id: "menu", label: "Menú", icon: Utensils, path: "/" },
    { id: "cart", label: "Carrito", icon: ShoppingCart, path: "/cart", hasBadge: true },
    { id: "orders", label: "Mis Pedidos", icon: ClipboardList, path: "/orders" },
    { id: "profile", label: "Mi Cuenta", icon: User, path: "/profile" },
  ];

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-[#efedf0] antialiased text-[#1b1b1e]">
      {/* ================= SIDEBAR (Desktop/Large Screens) ================= */}
      <aside className="w-64 h-full hidden md:flex flex-col shrink-0 sidebar-gradient text-white border-r-2 border-[#031633] relative z-40">
        {/* Sidebar Header */}
        <div className="p-6 flex flex-col items-center border-b-2 border-white/10 mb-4">
          <div className="bg-white p-3 rounded-2xl border-2 border-[#031633] shadow-[2px_2px_0_0_#ff8928] mb-3 transform -rotate-2 cursor-pointer transition-transform hover:rotate-0">
            <img
              alt="Kinal-Break Logo"
              className="w-20 h-20 object-contain"
              src={Logo}
            />
          </div>
          <h1 className="text-2xl font-black text-[#ff8928] text-center leading-tight uppercase tracking-wider anime-glow-text-secondary">
            Kinal Break
          </h1>
          <p className="text-xs text-[#8293b6] tracking-widest uppercase font-semibold opacity-90 text-center mt-1">
            Estudiante
          </p>
          <span className="mt-2 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border bg-white/10 border-white/20 text-white/70">
            {user?.name ? user.name.split(' ')[0] : (user?.username || 'Estudiante')}
          </span>
        </div>

        {/* Sidebar Links */}
        <div className="flex-1 overflow-y-auto py-2">
          <ul className="space-y-3 px-3">
            {navItems.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `w-full flex items-center px-4 py-3 rounded-2xl transition-all duration-200 text-left relative ${
                      isActive
                        ? "bg-[#ff8928] text-white border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] font-bold transform -translate-y-0.5"
                        : "text-white/80 hover:text-white hover:bg-[#364766]/50"
                    }`
                  }
                >
                  <div className="mr-3 text-white/80">
                    <item.icon size={20} />
                  </div>
                  <span className="text-sm font-bold tracking-wider uppercase">
                    {item.label}
                  </span>
                  {item.hasBadge && cartCount > 0 && (
                    <span className="absolute right-4 bg-[#7d0a42] text-white font-black text-[9px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#031633] shadow-[1px_1px_0_0_#031633]">
                      {cartCount}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t-2 border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/10 hover:bg-[#7d0a42]/60 text-white rounded-2xl font-bold text-sm uppercase tracking-wider border-2 border-white/20 hover:border-[#7d0a42] transition-all cursor-pointer"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT VIEW (Responsive) ================= */}
      <main
        className="flex-1 h-full overflow-y-auto flex flex-col relative pb-16 md:pb-0"
        style={{
          backgroundImage: `url(${BackLogin})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        {/* Blur & opacity layer */}
        <div className="absolute inset-0 bg-white/85 backdrop-blur-[6px] z-0" />

        {/* Mobile Header */}
        <header className="md:hidden flex justify-between items-center px-4 h-[72px] bg-white border-b-2 border-[#031633] sticky top-0 z-30 shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-xl border border-[#031633] p-1">
              <img
                alt="Logo Kinal"
                className="w-10 h-10 object-contain"
                src={Logo}
              />
            </div>
            <span className="text-lg font-black text-[#031633] uppercase font-display tracking-wider">
              Kinal Break
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 border-2 border-[#031633] rounded-xl hover:bg-[#f5f3f6] text-[#031633] cursor-pointer"
          >
            <LogOut size={18} />
          </button>
        </header>

        {/* Main Content Container (Wide on Desktop, restricted on Mobile) */}
        <div className="p-4 md:p-8 flex-1 max-w-[1400px] mx-auto w-full relative z-10">
          <header className="mb-6 pt-2 hidden md:block">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#031633] manga-title uppercase">
              Menú Estudiante
            </h2>
            <p className="font-sans text-body-lg text-[#ff8928] font-bold mt-2 uppercase tracking-wide flex items-center gap-2">
              <span className="w-8 h-1 bg-[#ff8928] inline-block rounded-full"></span>
              Bienvenido, {user?.name ? user.name.split(' ')[0] : (user?.username || 'Estudiante')}
            </p>
          </header>

          <Outlet />
        </div>
      </main>

      {/* ================= BOTTOM NAVIGATION BAR (Mobile Only) ================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t-4 border-[#031633] flex justify-around items-center z-40 shadow-[0_-4px_0_0_rgba(3,22,51,0.05)]">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-12 h-12 rounded-xl border-2 transition-all ${
              isActive
                ? "bg-[#ff8928] text-white border-[#031633] shadow-[2px_2px_0_0_#031633] -translate-y-0.5"
                : "text-[#031633]/60 border-transparent"
            }`
          }
        >
          <Utensils size={20} />
        </NavLink>

        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-12 h-12 rounded-xl border-2 transition-all relative ${
              isActive
                ? "bg-[#ff8928] text-white border-[#031633] shadow-[2px_2px_0_0_#031633] -translate-y-0.5"
                : "text-[#031633]/60 border-transparent"
            }`
          }
        >
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#7d0a42] text-white font-black text-[9px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#031633] shadow-[1px_1px_0_0_#031633]">
              {cartCount}
            </span>
          )}
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-12 h-12 rounded-xl border-2 transition-all ${
              isActive
                ? "bg-[#ff8928] text-white border-[#031633] shadow-[2px_2px_0_0_#031633] -translate-y-0.5"
                : "text-[#031633]/60 border-transparent"
            }`
          }
        >
          <ClipboardList size={20} />
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-12 h-12 rounded-xl border-2 transition-all ${
              isActive
                ? "bg-[#ff8928] text-white border-[#031633] shadow-[2px_2px_0_0_#031633] -translate-y-0.5"
                : "text-[#031633]/60 border-transparent"
            }`
          }
        >
          <User size={20} />
        </NavLink>
      </nav>
    </div>
  );
}
