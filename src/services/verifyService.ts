import { GoogleGenAI } from "@google/genai";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import type { ModelProvider, UserApiKeys } from "../types/tutorial";
import type { Feedback } from "../stores/editorStore";

interface VerifyParams {
	prompt: string;
	solution: string;
	userCode: string;
	output: string;
	model: ModelProvider;
	userKeys: UserApiKeys;
}

function buildPrompt(p: VerifyParams): string {
	return `Você é um revisor de código. O usuário recebeu o seguinte desafio:
"${p.prompt}"

Solução esperada:
${p.solution}

Código escrito pelo usuário:
${p.userCode}

Output gerado ao executar:
${p.output}

Avalie se a solução resolve o desafio. Responda APENAS com JSON válido, sem markdown:
{"status":"correct"|"partial"|"incorrect","message":"feedback em português, máximo 2 frases"}`;
}

function parseResponse(text: string): Feedback {
	const cleaned = text
		.replace(/^```json\s*/m, "")
		.replace(/```\s*$/m, "")
		.trim();
	return JSON.parse(cleaned) as Feedback;
}

export const verifyService = {
	async verify(params: VerifyParams): Promise<Feedback> {
		const userPrompt = buildPrompt(params);

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
		const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
		const res = await ai.models.generateContent({
			model: "gemini-2.5-flash-lite",
			contents: userPrompt,
		});
		return parseResponse(res.text ?? "");
	},
};
