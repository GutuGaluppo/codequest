import { useState } from "react";
import type { Challenge } from "../../types/tutorial";
import { useTranslation } from "react-i18next";

interface ChallengeProps {
	challenge: Challenge;
}

export function ChallengeBlock({ challenge }: ChallengeProps) {
	const [showHints, setShowHints] = useState(false);
	const { t } = useTranslation();

	return (
		<div className="flex flex-col gap-4 p-4 bg-surface rounded border">
			<span className="text-xs font-mono font-medium text-muted uppercase tracking-widest">{t("tutorial.challenge.label")}</span>
			<p className="text-text">{challenge.prompt}</p>

			<button
				onClick={() => setShowHints(!showHints)}
				className="self-start text-sm text-muted hover:text-amber transition-colors"
			>
				{showHints ? t("tutorial.challenge.hideHints") : t("tutorial.challenge.showHints")}
			</button>

			{showHints && (
				<ul className="flex flex-col gap-1">
					{challenge.hints.map((hint, i) => (
						<li key={i} className="text-sm text-muted">
							{i + 1}. {hint}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
