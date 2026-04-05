import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";

export function TutorialComplete() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-center h-[calc(100vh-60px)] gap-6 text-center px-6">
			<div className="flex flex-col gap-2">
				<h2 className="text-2xl font-mono font-bold text-text">
					{t("tutorial.complete.heading")}
				</h2>
				<p className="text-sm text-muted max-w-sm leading-relaxed">
					{t("tutorial.complete.message")}
				</p>
			</div>
			<button
				onClick={() => navigate({ to: "/" })}
				className="text-xs font-mono font-bold uppercase tracking-widest border border-border text-muted px-6 py-2.5 hover:border-text hover:text-text transition-colors"
			>
				{t("tutorial.complete.back")}
			</button>
		</div>
	);
}
