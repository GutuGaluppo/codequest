import { Code, Zap, BrainIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export function EditorPreview() {
	const { t } = useTranslation();

	const features = [
		{ icon: <Code size={16} />, text: t("landing.editorPreview.feature1") },
		{ icon: <Zap size={16} />, text: t("landing.editorPreview.feature2") },
		{ icon: <BrainIcon size={16} />, text: t("landing.editorPreview.feature3") },
	];

	return (
		<div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
			<div>
				<span className="text-xs font-mono text-muted uppercase tracking-widest">
					{t("landing.editorPreview.label")}
				</span>
				<h2 className="text-4xl font-black uppercase text-text mt-3 mb-4 leading-tight">
					{t("landing.editorPreview.headline1")}
					<br />
					<span className="text-amber">{t("landing.editorPreview.headline2")}</span>
				</h2>
				<p className="text-muted leading-relaxed mb-6">
					{t("landing.editorPreview.description")}
				</p>
				<div className="flex flex-col gap-3">
					{features.map((item) => (
						<div key={item.text} className="flex items-center gap-3">
							<div className="text-amber shrink-0">{item.icon}</div>
							<span className="text-sm text-muted">{item.text}</span>
						</div>
					))}
				</div>
			</div>
			<div className="border border-border bg-surface">
				<div className="border-b border-border px-4 py-2.5 flex items-center justify-between">
					<div className="flex gap-1.5">
						<div className="w-3 h-3 rounded-full bg-muted/20" />
						<div className="w-3 h-3 rounded-full bg-muted/20" />
						<div className="w-3 h-3 rounded-full bg-muted/20" />
					</div>
					<span className="text-xs font-mono text-muted">{t("landing.editorPreview.output")}</span>
				</div>
				<div className="p-5 font-mono text-xs leading-relaxed space-y-2">
					<div className="flex items-center gap-3">
						<span className="text-green-400">✓</span>
						<span className="text-muted">returns initial value</span>
					</div>
					<div className="flex items-center gap-3">
						<span className="text-green-400">✓</span>
						<span className="text-muted">increments count</span>
					</div>
					<div className="flex items-center gap-3">
						<span className="text-green-400">✓</span>
						<span className="text-muted">decrements count</span>
					</div>
					<div className="flex items-center gap-3">
						<span className="text-red-400">✗</span>
						<span className="text-muted">does not go below 0</span>
					</div>
					<div className="flex items-center gap-3">
						<span className="text-red-400">✗</span>
						<span className="text-muted">resets to initial value</span>
					</div>
					<div className="mt-4 border-t border-border pt-4">
						<div className="text-muted/60 mb-2">{"// AI suggestion:"}</div>
						<div className="text-amber/80 text-xs">
							Add a guard clause: if (count {">"} 0) before calling setCount(c =
							{">"} c - 1)
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
