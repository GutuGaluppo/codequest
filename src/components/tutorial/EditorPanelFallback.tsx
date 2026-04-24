interface EditorPanelFallbackProps {
	label?: string;
}

export function EditorPanelFallback({
	label = "code",
}: EditorPanelFallbackProps) {
	return (
		<div className="flex flex-col h-full">
			<div className="flex items-center justify-between px-3 py-2 bg-surface border-b">
				<span className="text-xs font-mono uppercase tracking-widest text-amber border border-amber/30 px-2 py-0.5">
					{label}
				</span>
				<div className="flex items-center gap-2">
					<div className="h-7 w-18 bg-amber/20 rounded" />
					<div className="h-7 w-14 bg-amber/20 rounded" />
					<div className="h-7 w-16 border border-border rounded" />
				</div>
			</div>

			<div className="flex-1 min-h-0 bg-[#0f1117] border-b border-border p-4">
				<div className="h-full rounded border border-border/70 bg-surface/40 animate-pulse" />
			</div>

			<div className="h-max min-h-30 bg-surface p-4 flex flex-col gap-3">
				<div className="h-3 w-24 bg-border rounded" />
				<div className="h-3 w-3/4 bg-border rounded" />
				<div className="h-3 w-1/2 bg-border rounded" />
			</div>
		</div>
	);
}
