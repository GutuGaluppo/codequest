import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export function HeroBadge() {
	const { t } = useTranslation();
	return (
		<div className="group flex items-center gap-0 border border-amber/40 text-amber text-xs font-mono rounded-full overflow-hidden cursor-default transition-all duration-300 hover:border-amber/70">
			<span className="flex items-center justify-center w-8 h-8 shrink-0">
				<Sparkles size={13} />
			</span>
			<span className="max-w-0 group-hover:max-w-xs overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out pr-0 group-hover:pr-3 opacity-0 group-hover:opacity-100">
				{t("landing.badge.text")}
			</span>
		</div>
	);
}
