import type { Level, ModelProvider, UserApiKeys, Tutorial } from "../types/tutorial";

export async function generateTutorial(
	topic: string,
	preferredModel: ModelProvider,
	userKeys: UserApiKeys,
	level: Level,
	language: string,
): Promise<Tutorial> {
	const headers: Record<string, string> = { "Content-Type": "application/json" };

	if (preferredModel === "claude" && userKeys.anthropic) {
		headers["x-api-key"] = userKeys.anthropic;
	} else if (preferredModel === "openai" && userKeys.openai) {
		headers["x-api-key"] = userKeys.openai;
	}

	const response = await fetch("/api/generate", {
		method: "POST",
		headers,
		body: JSON.stringify({ topic, model: preferredModel, level, language }),
	});

	if (!response.ok) {
		const text = await response.text();
		let message = "Tutorial generation failed";
		try {
			const body = JSON.parse(text);
			message = body.error ?? message;
		} catch {}
		throw new Error(message);
	}

	return response.json();
}
