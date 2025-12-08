import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import LoadingScreen from "./LoadingScreen";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, initialized } = useAuthStore();
  const location = useLocation();

  // ⏳ Still loading auth session
  if (!initialized || loading) {
    return <LoadingScreen />;
  }

  // ❌ No user = block access ONLY to protected routes
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Character creation check
  const char = user.character;
  const needsCharacter =
    char &&
    char.name === "Hunter" &&
    (char.level === 1 || char.level === undefined) &&
    (char.totalXP === 0 || char.totalXP === undefined);

  if (needsCharacter && location.pathname !== "/character") {
    return <Navigate to="/character" replace />;
  }

  return <>{children}</>;
}
