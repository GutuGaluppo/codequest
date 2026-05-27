// @refresh reset

import { createFileRoute } from "@tanstack/react-router";
import { DashboardContent, DashboardHeader } from "../components/dashboard";
import { requireAuthenticatedRoute } from "../utils/requireAuthenticatedRoute";

export const Route = createFileRoute("/dashboard")({
	beforeLoad: () => requireAuthenticatedRoute("/dashboard"),
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
