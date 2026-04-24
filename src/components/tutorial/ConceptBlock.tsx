import { Suspense, lazy } from "react";

const ReactMarkdown = lazy(() => import("react-markdown"));

interface ConceptBlockProps {
	concept: string;
}

export function ConceptBlock({ concept }: ConceptBlockProps) {
	return (
		<div className="prose max-w-none text-background">
			<Suspense fallback={<div className="whitespace-pre-wrap">{concept}</div>}>
				<ReactMarkdown>{concept}</ReactMarkdown>
			</Suspense>
		</div>
	);
}
