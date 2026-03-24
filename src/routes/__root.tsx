// @refresh reset

import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { Header } from "../components/layout/Header";

interface RouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootLayout,
});

function RootLayout() {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full">
				<Outlet />
			</main>
		</div>
	);
}
