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

export const verifyService = {
	async verify(params: VerifyParams): Promise<Feedback> {
		const headers: Record<string, string> = { "Content-Type": "application/json" };

		const token = await getIdToken();
		if (token) headers["Authorization"] = `Bearer ${token}`;

		const response = await fetch("/api/verify", {
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

		if (!response.ok) {
			const text = await response.text();
			let message = "Verification failed";
			try {
				const body = JSON.parse(text);
				message = body.error ?? message;
			} catch {}
			throw new Error(message);
		}

		return response.json();
	},
};
