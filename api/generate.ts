import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { buildSystemPrompt } from "../src/services/systemPrompt";
import { parseAiJson } from "../src/utils/parseAiJson";
import type { Level, ModelProvider, Tutorial } from "../src/types/tutorial";

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const { topic, model, level, language } = req.body as {
		topic: string;
		model: ModelProvider;
		level: Level;
		language: string;
	};
	const apiKey = req.headers["x-api-key"] as string | undefined;

	try {
		let raw: Tutorial;

		if (model === "claude" && apiKey) {
			const client = new Anthropic({ apiKey });
			const message = await client.messages.create({
				model: "claude-3-5-sonnet-20241022",
				max_tokens: 4096,
				messages: [
					{
						role: "user",
						content: `${buildSystemPrompt(level, language)} Topic: ${topic}`,
					},
				],
			});
			const text =
				message.content[0].type === "text" ? message.content[0].text : "";
			raw = { ...(parseAiJson(text) as Tutorial), generatedWith: "claude", createdAt: null };
		} else if (model === "openai" && apiKey) {
			const client = new OpenAI({ apiKey });
			const response = await client.chat.completions.create({
				model: "gpt-4o",
				response_format: { type: "json_object" },
				messages: [
					{ role: "system", content: buildSystemPrompt(level, language) },
					{ role: "user", content: `Topic: ${topic}` },
				],
			});
			const text = response.choices[0].message.content ?? "";
			raw = { ...(parseAiJson(text) as Tutorial), generatedWith: "openai", createdAt: null };
		} else {
			const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
			const result = await ai.models.generateContent({
				model: "gemini-2.5-flash-lite",
				contents: `${buildSystemPrompt(level, language)} Topic: ${topic}`,
			});
			raw = { ...(parseAiJson(result.text || "") as Tutorial), generatedWith: "gemini", createdAt: null };
		}

		return res.status(200).json(raw);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return res.status(500).json({ error: message });
	}
}
