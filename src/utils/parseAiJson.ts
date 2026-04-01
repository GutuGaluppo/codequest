export function parseAiJson(text: string): unknown {
	// Extract JSON by finding the outermost { ... } block
	const start = text.indexOf("{");
	const end = text.lastIndexOf("}");

	if (start === -1 || end === -1 || end <= start) {
		throw new SyntaxError("No JSON object found in AI response");
	}

	const extracted = text.slice(start, end + 1);

	try {
		return JSON.parse(extracted);
	} catch {
		// Fix literal newlines/tabs inside JSON string values
		const sanitized = extracted.replace(
			/"((?:[^"\\]|\\.)*)"/gs,
			(_, inner) =>
				`"${inner.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t")}"`,
		);
		return JSON.parse(sanitized);
	}
}
