import OpenAI from "openai";
import { SYSTEM_PROMPT } from "./systemPrompt";
import type { Tutorial } from "../types/tutorial";

export const openaiService = {
	async generate(topic: string, apiKey: string): Promise<Tutorial> {
		const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

		const prompt = `${SYSTEM_PROMPT} Generate exactly 5 steps with progressive difficulty. Topic: ${topic}`;

		const response = await client.chat.completions.create({
			model: "gpt-4o",
			messages: [{ role: "user", content: prompt }],
		});

		const text = response.choices[0].message.content ?? "";
		const raw = JSON.parse(text) as Tutorial;

		return { ...raw, generatedWith: "openai", createdAt: Date.now() };
	},
};
