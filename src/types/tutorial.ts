export type ModelProvider = "gemini" | "claude" | "openai";
export type Level = "beginner" | "intermediate" | "advanced";

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
	level: Level;
	steps?: TutorialStep[];
	stepCount?: number;
	generatedWith: ModelProvider;
	createdAt: { seconds: number } | null;
	introduction?: TutorialIntroduction;
	finalProject?: FinalProject;
}

export interface TutorialIntroduction {
	overview: string;
	realWorldUse: string;
	pros: string[];
	cons: string[];
	prerequisites: string[];
}

export interface FinalProject {
	title: string;
	description: string;
	starterCode: string;
	solution: string;
}
