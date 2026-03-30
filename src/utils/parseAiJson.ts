export function parseAiJson(text: string): unknown {
	const cleaned = text
		.trim()
		.replace(/^```json\s*/i, "")
		.replace(/^```\s*/i, "")
		.replace(/```\s*$/i, "");
	return JSON.parse(cleaned);
}
