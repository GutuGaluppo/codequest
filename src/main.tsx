import { RouterProvider } from "@tanstack/react-router";
import { queryClient } from "./lib/queryClient";
import { createAppRouter } from "./lib/router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";

const router = createAppRouter(queryClient);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<ReactQueryDevtools />
			<Toaster />
		</QueryClientProvider>
	</StrictMode>,
);
