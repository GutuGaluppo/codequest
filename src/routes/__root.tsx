// @refresh reset

import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { Header } from "../components/layout/Header";
import { ErrorScreen } from "../components/ErrorScreen";
import { NotFound } from "../components/NotFound";
import { LoginDrawer } from "../components/auth/LoginDrawer/LoginDrawer";
import { BetaModal } from "../components/onboarding/BetaModal";
import { useAuthStore } from "../stores/authStore";
import { useBetaModalStore } from "../stores/betaModalStore";
import { useAuth } from "../hooks/useAuth";
import { userProfileQueryOptions } from "../queries/userQueries";

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
	const drawerOpen = useAuthStore((state) => state.drawerOpen);
	const { openModal } = useBetaModalStore();
	const { user } = useAuth();
	const shownForRef = useRef<Set<string>>(new Set());

	const { data: profile } = useQuery({
		...userProfileQueryOptions(user?.uid ?? ""),
		enabled: !!user?.uid,
	});

	useEffect(() => {
		if (!user) {
			shownForRef.current.clear();
			return;
		}
		if (!profile) return;
		if (shownForRef.current.has(user.uid)) return;

		const hasAnyKey = profile.configuredKeys &&
			Object.values(profile.configuredKeys).some(Boolean);

		if (!hasAnyKey) {
			shownForRef.current.add(user.uid);
			openModal();
		}
	}, [user, profile, openModal]);

	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			{drawerOpen ? <LoginDrawer /> : null}
			<BetaModal />
			<main className="flex-1 w-full overflow-hidden mt-15">
				<Outlet />
			</main>
		</div>
	);
}
