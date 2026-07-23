import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../../features/auth/page/LoginPage.jsx";
import { RegisterPage } from "../../features/auth/page/RegisterPage.jsx";
import { VerifyEmailPage } from "../../features/auth/page/VerifyEmailPage.jsx";
import { ForgotPasswordPage } from "../../features/auth/page/ForgotPasswordPage.jsx";
import { ResetPasswordPage } from "../../features/auth/page/ResetPasswordPage.jsx";
import { useAuthStore } from "../../features/auth/store/authStore.js";
import DashboardContainer from "../../shared/component/layout/DashboardContainer.jsx";
import { ProductsPage } from "../../features/products/page/ProductsPage.jsx";
import { OrdersPage } from "../../features/orders/page/OrdersPage.jsx";
import { PaymentsPage } from "../../features/payments/page/PaymentsPage.jsx";
import { ReportsPage } from "../../features/reports/page/ReportsPage.jsx";
import DashboardIndex from "../../features/dashboard/page/DashboardIndex.jsx";

export const AppRouter = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const isAdmin = user?.role === 'ADMIN_ROLE';
    const isUser  = user?.role === 'USER_ROLE';

    return (
    <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {isAuthenticated ? (
        <Route path="/" element={<DashboardContainer />}>
            {/* USER_ROLE lands on products; ADMIN_ROLE lands on dashboard */}
            <Route index element={isUser ? <ProductsPage /> : <DashboardIndex />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            {/* Admin-only routes */}
            {isAdmin && <Route path="payments" element={<PaymentsPage />} />}
            {isAdmin && <Route path="reports" element={<ReportsPage />} />}
            
            <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
        )}
    </Routes>
    );
};
