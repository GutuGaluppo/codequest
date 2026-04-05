import OpenAI from "openai";
import type { Level, Tutorial } from "../types/tutorial";
import { buildSystemPrompt } from "./systemPrompt";
import { parseAiJson } from "../utils/parseAiJson";

export const openaiService = {
	async generate(
		topic: string,
		apiKey: string,
		level: Level,
		language: string,
	): Promise<Tutorial> {
		const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

		const response = await client.chat.completions.create({
			model: "gpt-4o",
			response_format: { type: "json_object" },
			messages: [
				{ role: "system", content: buildSystemPrompt(level, language) },
				{ role: "user", content: `Topic: ${topic}` },
			],
		});

		const text = response.choices[0].message.content ?? "";
		const raw = parseAiJson(text) as Tutorial;

		return { ...raw, generatedWith: "openai", createdAt: null };
	},
};
