import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../../features/auth/page/LoginPage";
import { RegisterPage } from "../../features/auth/page/RegisterPage";
import { VerifyEmailPage } from "../../features/auth/page/VerifyEmailPage";
import { MenuPage } from "../../features/menu/page/MenuPage";
import { CartPage } from "../../features/cart/page/CartPage";
import { MyOrdersPage } from "../../features/orders/page/MyOrdersPage";
import { ProfilePage } from "../../features/profile/page/ProfilePage";
import { useAuthStore } from "../../features/auth/store/authStore";
import CustomerLayout from "../../shared/layout/CustomerLayout";

export function AppRouter() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      {isAuthenticated ? (
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<MenuPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="orders" element={<MyOrdersPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}
export default AppRouter;
