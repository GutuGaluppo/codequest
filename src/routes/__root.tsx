// @refresh reset

import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { Header } from "../components/layout/Header";
import { LoginDrawer } from "../components/auth/LoginDrawer/LoginDrawer";

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
			<LoginDrawer />
			<main className="flex-1 w-full overflow-hidden">
				<Outlet />
			</main>
		</div>
	);
}
