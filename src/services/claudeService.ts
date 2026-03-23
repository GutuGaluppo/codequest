import Anthropic from "@anthropic-ai/sdk";
import type { Tutorial } from "../types/tutorial";
import { SYSTEM_PROMPT } from "./systemPrompt";

export const claudeService = {
	async generate(topic: string, apiKey: string): Promise<Tutorial> {
		const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

		const prompt = `${SYSTEM_PROMPT} Generate exactly 5 steps with progressive difficulty. Topic: ${topic}`;

		const message = await client.messages.create({
			model: "claude-3-5-sonnet-20241022",
			max_tokens: 4096,
			messages: [{ role: "user", content: prompt }],
		});

		const text =
			message.content[0].type === "text" ? message.content[0].text : "";
		const raw = JSON.parse(text) as Tutorial;

		return { ...raw, generatedWith: "claude", createdAt: Date.now() };
	},
};
