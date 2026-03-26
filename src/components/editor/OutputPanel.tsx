import { useEditorStore } from "../../stores/editorStore";
import { useTranslation } from "react-i18next";

const statusStyles = {
	correct: "border-green text-green",
	partial: "border-amber text-amber",
	incorrect: "border-red-400 text-red-400",
};

export function OutputPanel() {
	const { output, feedback } = useEditorStore();
	const { t } = useTranslation();

	return (
		<div className="border-t bg-surface px-4 py-3 h-36 overflow-y-auto flex flex-col gap-3">
			<div>
				<p className="text-xs text-muted uppercase tracking-widest mb-2 font-mono">
					{t("editor.output.label")}
				</p>
				{output ? (
					<pre className="text-sm font-mono text-text whitespace-pre-wrap">
						{output}
					</pre>
				) : (
					<p className="text-sm font-mono text-muted">
						{t("editor.output.placeholder")}
					</p>
				)}
			</div>

			{feedback && (
				<div
					className={`border rounded px-3 py-2 text-sm font-mono ${statusStyles[feedback.status]}`}
				>
					{feedback.status === "correct" && "✓ "}
					{feedback.status === "partial" && "◑ "}
					{feedback.status === "incorrect" && "✗ "}
					{feedback.message}
				</div>
			)}
		</div>
	);
}
