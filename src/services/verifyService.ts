import type { ModelProvider, UserApiKeys } from "../types/tutorial";
import type { Feedback } from "../stores/editorStore";

interface VerifyParams {
	prompt: string;
	solution: string;
	userCode: string;
	output: string;
	model: ModelProvider;
	userKeys: UserApiKeys;
}

export const verifyService = {
	async verify(params: VerifyParams): Promise<Feedback> {
		const headers: Record<string, string> = { "Content-Type": "application/json" };

		if (params.model === "claude" && params.userKeys.anthropic) {
			headers["x-api-key"] = params.userKeys.anthropic;
		} else if (params.model === "openai" && params.userKeys.openai) {
			headers["x-api-key"] = params.userKeys.openai;
		}

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
