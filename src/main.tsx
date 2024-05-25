import { Routes } from "@generouted/react-router/lazy";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { App, ConfigProvider, Empty } from "antd";
import { createRoot } from "react-dom/client";

import "@/styles/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throwOnError: (error: any, _query) => {
        const status = error?.response?.status;
        // if (status === 401) {
        //   localStorage.removeItem("token");
        // }

        return false;
      },
    },
  },
});

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
