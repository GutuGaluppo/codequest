export function parseAiJson(text: string): unknown {
	const cleaned = text
		.trim()
		.replace(/^```json\s*/i, "")
		.replace(/^```\s*/i, "")
		.replace(/```\s*$/i, "");

	try {
		return JSON.parse(cleaned);
	} catch {
		// Fix literal newlines/tabs inside JSON string values
		const sanitized = cleaned.replace(
			/"((?:[^"\\]|\\.)*)"/gs,
			(_, inner) =>
				`"${inner.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t")}"`,
		);
		return JSON.parse(sanitized);
	}
}
