import { GoogleGenAI } from "@google/genai";
import type { Tutorial } from "../types/tutorial";
import { SYSTEM_PROMPT } from "./systemPrompt";

export const geminiService = {
	async generate(topic: string, apiKey: string): Promise<Tutorial> {
		const ai = new GoogleGenAI({ apiKey });

		const prompt = `${SYSTEM_PROMPT} Generate exactly 5 steps with progressive difficulty. Topic: ${topic}`;

		const result = await ai.models.generateContent({
			model: "gemini-2.0-flash-lite",
			contents: prompt,
		});

		const raw = JSON.parse(result.text ?? "") as Tutorial;

		return {
			...raw,
			generatedWith: "gemini",
			createdAt: Date.now(),
		};
	},
};
