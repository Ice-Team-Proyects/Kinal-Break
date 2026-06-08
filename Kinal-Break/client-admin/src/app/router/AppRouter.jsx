import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../../features/auth/page/LoginPage.jsx";
import { RegisterPage } from "../../features/auth/page/RegisterPage.jsx";
import { VerifyEmailPage } from "../../features/auth/page/VerifyEmailPage.jsx";
import { useAuthStore } from "../../features/auth/store/authStore.js";
import DashboardContainer from "../../shared/component/layout/DashboardContainer.jsx";

export const AppRouter = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return (
    <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        
        {isAuthenticated ? (
        <Route path="/" element={<DashboardContainer />}>
            {/* 
                Placeholder for other developers to add their routes 
                Example: <Route path="products" element={<ProductsPage />} />
            */}
            <Route path="products" element={<div className="p-8 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-bold">Módulo de Productos (En construcción)</div>} />
            <Route path="orders" element={<div className="p-8 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-bold">Módulo de Pedidos (En construcción)</div>} />
            <Route path="accompaniments" element={<div className="p-8 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-bold">Módulo de Acompañamientos (En construcción)</div>} />
            <Route path="payments" element={<div className="p-8 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-bold">Módulo de Pagos (En construcción)</div>} />
            <Route path="reports" element={<div className="p-8 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-bold">Módulo de Reportes (En construcción)</div>} />
            
            
            <Route path="*" element={<div className="p-8 text-center text-slate-500 font-bold">Página no encontrada</div>} />
        </Route>
        ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
        )}
    </Routes>
    );
};
