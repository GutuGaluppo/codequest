import { GoogleGenAI } from "@google/genai";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import type { ModelProvider, UserApiKeys } from "../types/tutorial";
import type { Feedback } from "../stores/editorStore";
import { handleServiceError } from "./serviceErrors";
import { parseAiJson } from "../utils/parseAiJson";

interface VerifyParams {
	prompt: string;
	solution: string;
	userCode: string;
	output: string;
	model: ModelProvider;
	userKeys: UserApiKeys;
}

function buildPrompt(p: VerifyParams): string {
	return `You are a code reviewer. The user received the following challenge:
"${p.prompt}"

Expected solution:
${p.solution}

User's code:
${p.userCode}

Output when executed:
${p.output}

Evaluate whether the solution correctly solves the challenge.
Respond ONLY with valid JSON, no markdown:
{"status":"correct"|"partial"|"incorrect","message":"Feedback in 1–2 sentences, in the same language as the challenge prompt."}`;
}

function parseResponse(text: string): Feedback {
	return parseAiJson(text) as Feedback;
}

export const verifyService = {
	async verify(params: VerifyParams): Promise<Feedback> {
		const userPrompt = buildPrompt(params);

		try {
			if (params.model === "claude" && params.userKeys.anthropic) {
				const client = new Anthropic({
					apiKey: params.userKeys.anthropic,
					dangerouslyAllowBrowser: true,
				});
				const res = await client.messages.create({
					model: "claude-3-5-sonnet-20241022",
					max_tokens: 256,
					messages: [{ role: "user", content: userPrompt }],
				});
				return parseResponse((res.content[0] as { text: string }).text);
			}

			if (params.model === "openai" && params.userKeys.openai) {
				const client = new OpenAI({
					apiKey: params.userKeys.openai,
					dangerouslyAllowBrowser: true,
				});
				const res = await client.chat.completions.create({
					model: "gpt-4o",
					messages: [{ role: "user", content: userPrompt }],
					max_tokens: 256,
				});
				return parseResponse(res.choices[0].message.content ?? "");
			}

			// fallback: Gemini
			const ai = new GoogleGenAI({
				apiKey: import.meta.env.VITE_GEMINI_API_KEY,
			});
			const res = await ai.models.generateContent({
				model: "gemini-2.5-flash-lite",
				contents: userPrompt,
			});
			return parseResponse(res.text ?? "");
		} catch (error) {
			handleServiceError(error);
		}
	},
};
