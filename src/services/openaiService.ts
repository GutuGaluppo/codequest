import OpenAI from "openai";
import type { Level, Tutorial } from "../types/tutorial";
import { buildSystemPrompt } from "./systemPrompt";

export const openaiService = {
	async generate(
		topic: string,
		apiKey: string,
		level: Level,
	): Promise<Tutorial> {
		const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

		const prompt = `${buildSystemPrompt(level)} Topic: ${topic}`;

		const response = await client.chat.completions.create({
			model: "gpt-4o",
			messages: [{ role: "user", content: prompt }],
		});

		const text = response.choices[0].message.content ?? "";
		const raw = JSON.parse(text) as Tutorial;

		return { ...raw, generatedWith: "openai", createdAt: null };
	},
};
