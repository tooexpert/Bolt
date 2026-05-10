import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../lib/auth-context";
import { ClanHeader } from "./clan-header";
import { ClanSidebar } from "./clan-sidebar";

export function ClanLayout() {
  const { user, member, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (member && !member.is_elder_member) {
    return <Navigate to="/access-denied" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <ClanHeader />
      <div className="flex">
        <ClanSidebar activePath={location.pathname} />
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
