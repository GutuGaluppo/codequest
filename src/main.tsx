import { Suspense, StrictMode, lazy } from "react";
import { RouterProvider } from "@tanstack/react-router";
import { queryClient } from "./lib/queryClient";
import { createAppRouter } from "./lib/router";
import { createRoot } from "react-dom/client";
import "./index.css";
import { initI18n } from "./i18n";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

const ReactQueryDevtools = import.meta.env.DEV
	? lazy(() =>
			import("@tanstack/react-query-devtools").then((module) => ({
				default: module.ReactQueryDevtools,
			})),
		)
	: null;

async function bootstrap() {
	await initI18n();

	const rootElement = document.getElementById("root");
	if (!rootElement) return;

	const router = createAppRouter(queryClient);

	createRoot(rootElement).render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
				{ReactQueryDevtools ? (
					<Suspense fallback={null}>
						<ReactQueryDevtools />
					</Suspense>
				) : null}
				<Toaster />
			</QueryClientProvider>
		</StrictMode>,
	);
}

void bootstrap();
