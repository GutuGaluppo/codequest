import { useTranslation } from "react-i18next";
import { TECH_STRIP } from "../../constants";

export function TechStrip() {
	const { t } = useTranslation();

	return (
		<div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center gap-6">
			<span className="text-xs font-mono text-muted uppercase tracking-widest whitespace-nowrap shrink-0">
				{t("landing.techStrip.label")}
			</span>
			<div className="border-l border-border pl-6 flex items-center gap-8 overflow-hidden">
				{TECH_STRIP.map((tech) => (
					<span
						key={tech}
						className="text-sm font-mono text-muted/50 whitespace-nowrap"
					>
						{tech}
					</span>
				))}
			</div>
		</div>
	);
}
