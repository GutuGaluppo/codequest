export function CodeSnippetDemo() {
	return (
		<div className="border border-border bg-surface">
			<div className="border-b border-border px-4 py-2.5 flex items-center gap-2">
				<div className="flex gap-1.5">
					<div className="w-3 h-3 rounded-full bg-muted/20" />
					<div className="w-3 h-3 rounded-full bg-muted/20" />
					<div className="w-3 h-3 rounded-full bg-muted/20" />
				</div>
				<span className="text-xs font-mono text-muted ml-1">challenge.ts</span>
			</div>
			<div className="p-5 font-mono text-sm leading-relaxed">
				<div className="text-muted">{"// Complete the function below"}</div>
				<div className="mt-2">
					<span className="text-amber">function </span>
					<span className="text-green-400">useCounter</span>
					<span className="text-text">(initial: </span>
					<span className="text-amber">number</span>
					<span className="text-text">) {"{"}</span>
				</div>
				<div className="ml-5 mt-1">
					<span className="text-amber">const </span>
					<span className="text-text">[count, setCount] = </span>
					<span className="text-green-400">useState</span>
					<span className="text-text">(initial);</span>
				</div>
				<div className="ml-5 mt-1 text-muted">
					{"// ✏️ your code here..."}
				</div>
				<div className="ml-5 mt-1">
					<span className="text-amber">return </span>
					<span className="text-text">{"{ count }"}</span>
					<span className="text-muted">;</span>
				</div>
				<div className="mt-1 text-text">{"}"}</div>
				<div className="mt-4 border-t border-border pt-3 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-amber" />
						<span className="text-xs text-amber font-mono">
							3 / 5 tests passing
						</span>
					</div>
					<span className="text-xs text-muted font-mono">React Hooks</span>
				</div>
			</div>
		</div>
	);
}
