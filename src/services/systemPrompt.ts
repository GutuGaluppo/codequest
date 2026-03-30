import type { Level } from "../types/tutorial";

const levelInstructions: Record<Level, string> = {
	beginner:
		"Assume the user has no prior knowledge of the topic. Use simple language, avoid jargon, explain every concept from scratch, and focus on fundamentals. Examples should be minimal and self-contained.",
	intermediate:
		"Assume the user knows the basics. Introduce patterns, best practices, and common pitfalls. Examples can build on each other across steps.",
	advanced:
		"Assume the user is experienced with programming. Focus on edge cases, performance considerations, architectural decisions, and advanced patterns. Steps should be challenging and thought-provoking.",
};

export function buildSystemPrompt(level: Level): string {
	return `You are an expert technical educator. Generate a structured and progressive tutorial for the provided topic.
Explain the codebase to a newcomer. What is the general structure, what are the important things to know, and what are some pointers for things to learn next? After that, start the tutorial.
The tutorial should prioritize active learning ("learning by doing").
Difficulty should increase progressively with each step.
Target audience: ${levelInstructions[level]}
Include at least 10 steps.
Each step must have a concise explanation, a practical example, and a hands-on challenge.
The challenge should be solvable in a code editor.
Provide the initial code and the solution (hint) code for each challenge.
Return the response in JSON format matching the provided schema.
RETURN ONLY VALID JSON. No text before or after. No markdown code blocks.

Required schema:
{
  "id": "topic-slug",
  "topic": "Topic name",
  "steps": [
    {
      "id": "step-1",
      "order": 1,
      "title": "Step title",
      "concept": "Explanation in markdown.",
      "codeExample": "Clean code. No markdown fences.",
      "challenge": {
        "prompt": "What to implement.",
        "starterCode": "Starter code with TODOs.",
        "solution": "Complete solution.",
        "hints": ["Hint 1", "Hint 2"]
      }
    }
  ]
}
`;
}
