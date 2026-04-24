import { getAuth } from "firebase/auth";
import type { ModelProvider } from "../types/tutorial";
import type { Feedback } from "../stores/editorStore";

interface VerifyParams {
	prompt: string;
	solution: string;
	userCode: string;
	output: string;
	model: ModelProvider;
}

async function getIdToken(): Promise<string | null> {
	return getAuth().currentUser?.getIdToken() ?? null;
}

function getDevServerHint(): string {
	return "In local development, start the full stack with `npm run dev:full` so `/api/verify` is available.";
}

export const verifyService = {
	async verify(params: VerifyParams): Promise<Feedback> {
		const headers: Record<string, string> = { "Content-Type": "application/json" };

		const token = await getIdToken();
		if (token) headers["Authorization"] = `Bearer ${token}`;

		let response: Response;
		try {
			response = await fetch("/api/verify", {
				method: "POST",
				headers,
				body: JSON.stringify({
					prompt: params.prompt,
					solution: params.solution,
					userCode: params.userCode,
					output: params.output,
					model: params.model,
				}),
			});
		} catch (error) {
			const message =
				error instanceof Error && error.message
					? `${error.message}. ${getDevServerHint()}`
					: `Could not reach /api/verify. ${getDevServerHint()}`;
			throw new Error(message);
		}

		if (!response.ok) {
			const text = await response.text();
			let message = "Verification failed";
			try {
				const body = JSON.parse(text);
				message = body.error ?? message;
			} catch {
				if (
					text.includes("ECONNREFUSED") ||
					text.includes("proxy error") ||
					text.includes("Error occurred while trying to proxy")
				) {
					message = `Could not reach /api/verify. ${getDevServerHint()}`;
				}
			}
			throw new Error(message);
		}

		return response.json();
	},
};
