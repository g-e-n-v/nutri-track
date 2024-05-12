import { useGetMe } from "@/api/hooks/useGetMe";
import { Layout } from "@/components/Layout";
import { useUserStore } from "@/stores/user.store";
import { Skeleton } from "antd";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useReadLocalStorage } from "usehooks-ts";

export default function App() {
  const [user, setUser] = useUserStore();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const token = useReadLocalStorage<string>("token");
  const { data, isLoading, isError } = useGetMe({ enabled: !!token && !user });

  useEffect(() => {
    data && setUser(data);
  }, [data, setUser]);

  useEffect(() => {
    isError && navigate("/auth");
  }, [isError, navigate]);

  useEffect(() => {
    if (token) return;

    navigate("/auth");
  }, [navigate, token]);

  if (pathname === "/auth") {
    return <Outlet />;
  }

  return (
    <Layout>
      <Skeleton loading={isLoading}>
        <Outlet />
      </Skeleton>
    </Layout>
  );
}
