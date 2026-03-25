import { Sparkles } from "lucide-react";

export function HeroBadge() {
	return (
		<div className="flex items-center gap-2 border border-amber/30 text-amber text-sm font-mono px-4 py-2 rounded-full">
			<Sparkles size={14} />
			AI-Powered Interactive Learning
		</div>
	);
}
