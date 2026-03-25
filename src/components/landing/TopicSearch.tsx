import { Search } from "lucide-react";

const SUGGESTED_TOPICS = ["JavaScript", "React", "Node.js", "Python", "TypeScript"];

interface TopicSearchProps {
	topic: string;
	onChange: (value: string) => void;
	onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
}

export function TopicSearch({ topic, onChange, onSubmit }: TopicSearchProps) {
	return (
		<div className="w-full max-w-xl flex flex-col gap-4">
			<form onSubmit={onSubmit} className="flex gap-2">
				<div className="relative flex-1">
					<Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
					<input
						value={topic}
						onChange={(e) => onChange(e.target.value)}
						placeholder="O que você quer aprender? (ex: React, Python, Rust...)"
						className="w-full bg-surface border rounded pl-10 pr-4 py-3 text-text placeholder:text-muted focus:outline-none focus:border-amber transition-colors text-base"
					/>
				</div>
				<button
					type="submit"
					className="bg-amber text-background px-6 py-3 rounded font-medium text-base hover:opacity-90 transition-opacity whitespace-nowrap"
				>
					Gerar →
				</button>
			</form>

			<div className="flex items-center gap-2 flex-wrap justify-center">
				{SUGGESTED_TOPICS.map((t) => (
					<button
						key={t}
						onClick={() => onChange(t)}
						className="text-sm text-muted hover:text-text transition-colors px-3 py-1.5 border border-border rounded hover:border-amber/50"
					>
						{t}
					</button>
				))}
			</div>
		</div>
	);
}
