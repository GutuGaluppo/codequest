// @refresh reset

import { createFileRoute, redirect } from "@tanstack/react-router";
import { onAuthStateChanged } from "firebase/auth";
import { DashboardContent, DashboardHeader } from "../components/dashboard";
import { auth } from "../lib/firebase";

export const Route = createFileRoute("/dashboard")({
	beforeLoad: () =>
		new Promise<void>((resolve, reject) => {
			const unsub = onAuthStateChanged(auth, (user) => {
				unsub();
				if (!user) reject(redirect({ to: "/" }));
				else resolve();
			});
		}),
	component: DashboardPage,
});

function DashboardPage() {
	return (
		<div className="w-full">
			<DashboardHeader />
			<DashboardContent />
		</div>
	);
}
