import { Layout } from "@/components/Layout";
import { useUserStore } from "@/stores/user.store";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function App() {
  const [user] = useUserStore();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (user) return;

    navigate("/auth");
  }, [navigate, user]);

  if (pathname === "/auth") {
    return <Outlet />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
