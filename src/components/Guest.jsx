import { useUser } from "@/lib/user";
import { Navigate, Outlet } from "react-router";

export default function Guest() {
  const { isAuthenticated, loading } = useUser();

  if (loading)
    return (
      <p className="shimmer text-sm text-muted-foreground">
        Memuat&hellip;
      </p>
    );

  return !isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}
