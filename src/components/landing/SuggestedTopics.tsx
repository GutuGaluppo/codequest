const SUGGESTED_TOPICS = [
	"JavaScript",
	"React",
	"Python",
	"Node.js",
	"TypeScript",
];

export function SuggestedTopics({
	setTopic,
}: {
	setTopic: (topic: string) => void;
}) {
	return (
		<div className="flex gap-2 mt-3 flex-wrap">
			{SUGGESTED_TOPICS.map((t) => (
				<button
					key={t}
					onClick={() => setTopic(t)}
					className="text-xs text-muted border border-border px-2.5 py-1 font-mono hover:border-amber/40 hover:text-text transition-colors"
				>
					{t}
				</button>
			))}
		</div>
	);
}
