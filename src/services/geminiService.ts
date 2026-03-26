import { GoogleGenAI } from "@google/genai";
import type { Tutorial } from "../types/tutorial";
import { SYSTEM_PROMPT } from "./systemPrompt";
import { handleServiceError } from "./serviceErrors";

export const geminiService = {
	async generate(topic: string, apiKey: string): Promise<Tutorial> {
		const ai = new GoogleGenAI({ apiKey });

		const prompt = `${SYSTEM_PROMPT} Generate exactly 5 steps with progressive difficulty. Topic: ${topic}`;

		let result;
		try {
			result = await ai.models.generateContent({
				model: "gemini-2.5-flash-lite",
				contents: prompt,
			});
		} catch (error) {
			handleServiceError(error);
		}

		const text = (result!.text ?? "")
			.replace(/^```json\s*/m, "")
			.replace(/```\s*$/m, "")
			.trim();
		const raw = JSON.parse(text) as Tutorial;

		return {
			...raw,
			generatedWith: "gemini",
			createdAt: Date.now(),
		};
	},
};
