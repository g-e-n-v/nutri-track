import { createRoot } from "react-dom/client";
import { Routes } from "@generouted/react-router/lazy";
import { App, ConfigProvider, Empty } from "antd";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "@/styles/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ConfigProvider renderEmpty={() => <Empty description="No data" />}>
      <App>
        <Routes />
      </App>
    </ConfigProvider>

    <ReactQueryDevtools />
  </QueryClientProvider>
);
