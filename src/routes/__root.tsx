// @refresh reset

import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { Header } from "../components/layout/Header";
import { LoginDrawer } from "../components/auth/LoginDrawer/LoginDrawer";
import { ErrorScreen } from "../components/ErrorScreen";
import { NotFound } from "../components/NotFound";

interface RouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootLayout,
	notFoundComponent: () => (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 w-full overflow-hidden">
				<NotFound />
			</main>
		</div>
	),
	errorComponent: ({ error, reset }) => (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 w-full overflow-hidden">
				<ErrorScreen error={error} reset={reset} />
			</main>
		</div>
	),
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
