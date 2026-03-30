import { useTranslation } from "react-i18next";
import type { Level } from "../../types/tutorial";

const levels: Level[] = ["beginner", "intermediate", "advanced"];

export function LevelSelector({
	level,
	handleLevelSelection,
}: {
	level: Level;
	handleLevelSelection: (level: Level) => void;
}) {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col gap-4 mb-3">
			<h2 className="text-2xl font-bold">{t("landing.level.label")}</h2>
			<div className="flex gap-2">
				{levels.map((lvl) => (
					<button
						key={lvl}
						type="button"
						onClick={() => handleLevelSelection(lvl)}
						className={`text-xs border border-border px-2.5 py-1 font-mono hover:border-amber/40 hover:text-text transition-colors ${
							level === lvl
								? "bg-amber text-background"
								: "text-muted border border-border"
						}`}
					>
						{t(`landing.level.${lvl}`)}
					</button>
				))}
			</div>
		</div>
	);
}
