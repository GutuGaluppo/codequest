import { GoogleGenAI } from "@google/genai";
import type { Level, Tutorial } from "../types/tutorial";
import { buildSystemPrompt } from "./systemPrompt";
import { handleServiceError } from "./serviceErrors";
import { parseAiJson } from "../utils/parseAiJson";

export const geminiService = {
	async generate(
		topic: string,
		apiKey: string,
		level: Level,
	): Promise<Tutorial> {
		const ai = new GoogleGenAI({ apiKey });

		const prompt = `${buildSystemPrompt(level)} Topic: ${topic}`;

		let result;
		try {
			result = await ai.models.generateContent({
				model: "gemini-2.5-flash-lite",
				contents: prompt,
			});
		} catch (error) {
			handleServiceError(error);
		}

		const raw = parseAiJson(result!.text || "") as Tutorial;

		return {
			...raw,
			generatedWith: "gemini",
			createdAt: null, // Will be set when saved to Firestore
		};
	},
};
