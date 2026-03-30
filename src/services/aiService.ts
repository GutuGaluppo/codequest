import type { Level, ModelProvider, UserApiKeys } from "../types/tutorial";
import { claudeService } from "./claudeService";
import { geminiService } from "./geminiService";
import { openaiService } from "./openaiService";

export async function generateTutorial(
	topic: string,
	preferredModel: ModelProvider,
	userKeys: UserApiKeys,
	level: Level,
) {
	if (preferredModel === "claude" && userKeys.anthropic) {
		try {
			return await claudeService.generate(topic, userKeys.anthropic, level);
		} catch (error) {
			console.warn(
				`Claude failed with the following error: ${error}. Falling back to Gemini`,
			);
		}
	}
	if (preferredModel === "openai" && userKeys.openai) {
		try {
			return await openaiService.generate(topic, userKeys.openai, level);
		} catch (error) {
			console.warn(
				`OpenAI failed with the following error: ${error}. Falling back to Gemini`,
			);
		}
	}
	return geminiService.generate(
		topic,
		import.meta.env.VITE_GEMINI_API_KEY,
		level,
	);
}
