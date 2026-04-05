import { PlayIcon, TextIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function EditorToolbar({
	monacoLanguage,
	verifying,
	handleFormat,
	handleRun,
	handleVerify,
}: {
	monacoLanguage: string;
	verifying: boolean;
	handleFormat: () => void;
	handleRun: () => void;
	handleVerify: () => void;
}) {
	const { t } = useTranslation();

	return (
		<div className="flex items-center justify-between px-3 py-2 bg-surface border-b">
			<span className="text-xs font-mono uppercase tracking-widest text-amber border border-amber/30 px-2 py-0.5">
				{monacoLanguage}
			</span>

			<div className="flex items-center gap-2">
				<button
					onClick={handleFormat}
					className="flex items-center text-xs px-3 py-1.5 bg-amber text-background font-medium hover:opacity-90 transition-opacity"
					title={t("editor.buttons.format")}
				>
					Indent
					<TextIcon size={16} className="ml-1" />
				</button>
				<button
					onClick={handleRun}
					className="flex items-center text-xs px-3 py-1.5 bg-amber text-background font-medium hover:opacity-90 transition-opacity"
					title={t("editor.buttons.run")}
				>
					Run
					<PlayIcon size={16} className="ml-1" />
				</button>
				<button
					onClick={handleVerify}
					disabled={verifying}
					className="text-xs px-3 py-1.5 border text-muted hover:text-text transition-colors disabled:opacity-50"
					title={t("editor.buttons.verify")}
				>
					{verifying
						? t("editor.buttons.verifying")
						: t("editor.buttons.verify")}
				</button>
			</div>
		</div>
	);
}
