import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/authStore.js";

const REQUIRE_AUTH = import.meta.env.VITE_REQUIRE_AUTH === "true";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoadingAuth } = useAuthStore();

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-orange-200 border-t-orange-600 animate-spin" />
      </div>
    );
  }

  if (REQUIRE_AUTH && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
