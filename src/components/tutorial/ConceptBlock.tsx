import ReactMarkdown from "react-markdown";

interface ConceptBlockProps {
	concept: string;
}

export function ConceptBlock({ concept }: ConceptBlockProps) {
	return (
		<div className="prose max-w-none text-background">
			<ReactMarkdown>{concept}</ReactMarkdown>
		</div>
	);
}
