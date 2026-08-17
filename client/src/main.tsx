import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./router";
import "./main.css";
import { App, ConfigProvider, theme } from "antd";
import { SocketProvider } from "./providers/SocketProvider";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <SocketProvider>
            <QueryClientProvider client={queryClient}>
                <ConfigProvider
                    theme={
                        {
                            // algorithm: theme.darkAlgorithm,
                        }
                    }
                >
                    <App>
                        <RouterProvider router={router} />
                    </App>
                </ConfigProvider>
            </QueryClientProvider>
        </SocketProvider>
    </StrictMode>,
);
