import { useEditorStore } from "../../stores/editorStore";

export function OutputPanel() {
	const { output } = useEditorStore();

	return (
		<div className="border-t bg-surface px-4 py-3 h-36 overflow-y-auto">
			<p className="text-xs text-muted uppercase tracking-widest mb-2 font-mono">
				Output
			</p>
			{output ? (
				<pre className="text-sm font-mono text-text whitespace-pre-wrap">
					{output}
				</pre>
			) : (
				<p className="text-sm font-mono text-muted">
					Run your code to see the output here...
				</p>
			)}
		</div>
	);
}
