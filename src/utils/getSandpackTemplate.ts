import type { SandpackPredefinedTemplate } from "@codesandbox/sandpack-react";

const topicTemplateMap: Record<string, SandpackPredefinedTemplate> = {
	react: "react",
	"react hooks": "react",
	"react router": "react",
	"react context": "react",
	"react state": "react",
	"react forms": "react",
	"react components": "react",
	javascript: "vanilla",
	"javascript dom": "vanilla",
	html: "static",
	css: "static",
	"html css": "static",
	node: "node",
	nodejs: "node",
	"node.js": "node",
	typescript: "react-ts",
	"react typescript": "react-ts",
};

export function getSandpackTemplate(
	topic: string,
): SandpackPredefinedTemplate | null {
	const normalized = topic.toLowerCase().trim();
	for (const [key, template] of Object.entries(topicTemplateMap)) {
		if (normalized.includes(key)) return template;
	}
	return null;
}
