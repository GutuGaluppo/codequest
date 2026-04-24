import { getAuth } from "firebase/auth";
import type { Level, ModelProvider, Tutorial } from "../types/tutorial";

async function getIdToken(): Promise<string | null> {
	return getAuth().currentUser?.getIdToken() ?? null;
}

function getDevServerHint(): string {
	return "In local development, start the full stack with `npm run dev:full` so `/api/generate` is available.";
}

export async function generateTutorial(
	topic: string,
	preferredModel: ModelProvider,
	level: Level,
	language: string,
): Promise<Tutorial> {
	const headers: Record<string, string> = { "Content-Type": "application/json" };

	const token = await getIdToken();
	if (token) headers["Authorization"] = `Bearer ${token}`;

	let response: Response;
	try {
		response = await fetch("/api/generate", {
			method: "POST",
			headers,
			body: JSON.stringify({ topic, model: preferredModel, level, language }),
		});
	} catch (error) {
		const message =
			error instanceof Error && error.message
				? `${error.message}. ${getDevServerHint()}`
				: `Could not reach /api/generate. ${getDevServerHint()}`;
		throw new Error(message);
	}

	if (!response.ok) {
		const text = await response.text();
		let message = `Tutorial generation failed (HTTP ${response.status})`;
		try {
			const body = JSON.parse(text);
			message = body.error ?? message;
		} catch {
			if (
				text.includes("ECONNREFUSED") ||
				text.includes("proxy error") ||
				text.includes("Error occurred while trying to proxy")
			) {
				message = `Could not reach /api/generate. ${getDevServerHint()}`;
			} else {
				message = `Tutorial generation failed (HTTP ${response.status}): response was not JSON`;
			}
		}
		throw new Error(message);
	}

	return response.json();
}
