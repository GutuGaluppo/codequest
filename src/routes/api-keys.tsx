import { createFileRoute, redirect } from "@tanstack/react-router";
import { requireAuthenticatedRoute } from "../utils/requireAuthenticatedRoute";

export const Route = createFileRoute("/api-keys")({
	beforeLoad: async () => {
		await requireAuthenticatedRoute("/api-keys");
		throw redirect({ to: "/profile" });
	},
	component: ApiKeysRedirectPage,
});

function ApiKeysRedirectPage() {
	return null;
}
