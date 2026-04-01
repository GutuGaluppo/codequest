import type { Level, ModelProvider, UserApiKeys } from "../types/tutorial";
import { claudeService } from "./claudeService";
import { geminiService } from "./geminiService";
import { openaiService } from "./openaiService";

export async function generateTutorial(
	topic: string,
	preferredModel: ModelProvider,
	userKeys: UserApiKeys,
	level: Level,
	language: string,
) {
	if (preferredModel === "claude" && userKeys.anthropic) {
		try {
			return await claudeService.generate(
				topic,
				userKeys.anthropic,
				level,
				language,
			);
		} catch (error) {
			throw new Error(
				`Claude generation failed with the following error: ${error}`,
			);
		}
	}
	if (preferredModel === "openai" && userKeys.openai) {
		try {
			return await openaiService.generate(
				topic,
				userKeys.openai,
				level,
				language,
			);
		} catch (error) {
			throw new Error(
				`OpenAI generation failed with the following error: ${error}`,
			);
		}
	}
	return geminiService.generate(
		topic,
		import.meta.env.VITE_GEMINI_API_KEY,
		level,
		language,
	);
}
