import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export function HeroBadge() {
	const { t } = useTranslation();
	return (
		<div className="group flex items-center gap-0 border border-amber/30 text-amber text-xs font-mono overflow-hidden cursor-default transition-all duration-300 hover:border-amber/60">
			<span className="flex items-center justify-center w-7 h-7 shrink-0">
				<Sparkles size={11} />
			</span>
			<span className="max-w-0 group-hover:max-w-xs overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out pr-0 group-hover:pr-3 opacity-0 group-hover:opacity-100 uppercase tracking-widest">
				{t("landing.badge.text")}
			</span>
		</div>
	);
}
