import ReactMarkdown from "react-markdown";

interface ConceptBlockProps {
	concept: string;
}

export function ConceptBlock({ concept }: ConceptBlockProps) {
	return (
		<div className="prose prose-invert max-w-none text-text">
			<ReactMarkdown>{concept}</ReactMarkdown>
		</div>
	);
}
