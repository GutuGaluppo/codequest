export type ModelProvider = "gemini" | "claude" | "openai";

export interface UserApiKeys {
	anthropic?: string;
	openai?: string;
}

export interface Challenge {
	prompt: string;
	starterCode: string;
	solution: string;
	hints: string[];
}

export interface TutorialStep {
	id: string;
	order: number;
	title: string;
	concept: string;
	codeExample: string;
	challenge: Challenge;
}

export interface Tutorial {
	id: string;
	topic: string;
	steps: TutorialStep[];
	generatedWith: ModelProvider;
	createdAt: number;
}
