import { getAuth } from "firebase/auth";
import type { Level, ModelProvider, Tutorial } from "../types/tutorial";

async function getIdToken(): Promise<string | null> {
	return getAuth().currentUser?.getIdToken() ?? null;
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
