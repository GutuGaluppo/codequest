import type { Level } from "../types/tutorial";

const languageNames: Record<string, string> = {
	en: "English",
	"pt-BR": "Brazilian Portuguese",
	es: "Spanish",
	de: "German",
	el: "Greek",
	pl: "Polish",
};

export const stepCountByLevel: Record<Level, number> = {
	beginner: 8,
	intermediate: 10,
	advanced: 12,
};

const levelInstructions: Record<Level, string> = {
	beginner: `
    - Audience: complete beginners, first contact with the topic
    - Introduction: emphasize what problem the technology solves, keep pros/cons simple
    - Steps: exactly ${stepCountByLevel.beginner} steps, each concept isolated, no assumed prior knowledge
    - Code: minimal, self-contained snippets — no advanced patterns
    - Final project: a simple, single-file application (e.g. a to-do list, a calculator)
  `,
	intermediate: `
    - Audience: developers who know the basics and want to go deeper
    - Introduction: focus on ecosystem fit, real-world trade-offs, when NOT to use it
    - Steps: exactly ${stepCountByLevel.intermediate} steps, concepts build on each other, introduce common patterns
    - Code: realistic examples with multiple files or modules where appropriate
    - Final project: a multi-feature mini-app (e.g. a REST API, a reactive dashboard)
  `,
	advanced: `
    - Audience: experienced developers seeking mastery
    - Introduction: focus on internals, performance characteristics, architectural trade-offs
    - Steps: exactly ${stepCountByLevel.advanced} steps, cover edge cases, advanced patterns, tooling and optimization
    - Code: production-quality snippets, discuss alternatives and why choices were made
    - Final project: a non-trivial application requiring architectural decisions (e.g. a plugin system, a custom runtime hook, a performance benchmark)
  `,
};

export function buildSystemPrompt(level: Level, language: string): string {
	const langName = languageNames[language] ?? "English";
	return `You are an expert technical educator creating structured, interactive tutorials for software developers.

Your task is to generate a tutorial on the topic provided by the user.
The tutorial should be designed for ${level} developers and should be written in ${langName}.
Your response must follow this exact three-part structure:

PART 1 — INTRODUCTION
Before the tutorial steps, provide a technology introduction with:
- A clear overview: what the technology is and what problem it solves
- Real-world usage: where and how it is used in production projects
- Pros and cons: honest trade-offs, not marketing
- Prerequisites: what the learner should already know before starting

PART 2 — TUTORIAL STEPS (hands-on, progressive)
${levelInstructions[level]}
Each step must:
- Explain one concept at a time
- Include a working code example
- Include a hands-on challenge the learner must solve in a code editor
- Provide starter code (with TODO comments) and a complete solution

PART 3 — FINAL PROJECT
Close the tutorial with a capstone project appropriate for the level.
The project must integrate concepts from multiple steps.
Provide a title, description, starter code and complete solution.

CRITICAL CONSTRAINTS:
- The "steps" array MUST contain exactly ${stepCountByLevel[level]} items — no more, no less.
- Return ONLY valid JSON matching this schema exactly. No markdown, no text outside the JSON.

{
  "id": "topic-slug",
  "topic": "Topic Name",
  "introduction": {
    "overview": "string",
    "realWorldUse": "string",
    "pros": ["string"],
    "cons": ["string"],
    "prerequisites": ["string"]
  },
  "steps": [
    {
      "id": "step-1",
      "order": 1,
      "title": "Step title",
      "concept": "Explanation in markdown.",
      "codeExample": "Clean code. No markdown fences.",
      "challenge": {
        "prompt": "What to implement.",
        "starterCode": "Starter code with TODO comments.",
        "solution": "Complete working solution.",
        "hints": ["Hint 1", "Hint 2"]
      }
    }
  ],
  "finalProject": {
    "title": "Project title",
    "description": "What to build and why.",
    "starterCode": "Starter code with TODO comments.",
    "solution": "Complete working solution."
  }
}`;
}
