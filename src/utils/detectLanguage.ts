export function detectLanguage(topic: string): string {
	const t = topic.toLowerCase();
	if (t.includes("typescript")) return "typescript";
	if (t.includes("python")) return "python";
	if (t.includes("rust")) return "rust";
	if (t.includes("go") || t.includes("golang")) return "go";
	if (t.includes("css")) return "css";
	if (t.includes("html")) return "html";
	if (t.includes("sql")) return "sql";
	if (t.includes("json")) return "json";
	if (t.includes("java") && !t.includes("javascript")) return "java";
	if (t.includes("c#") || t.includes("csharp")) return "csharp";
	return "javascript";
}
