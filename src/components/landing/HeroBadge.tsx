import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export function HeroBadge() {
	const { t } = useTranslation();
	return (
		<div className="flex items-center gap-2 border border-amber/30 text-amber text-sm font-mono px-4 py-2 rounded-full">
			<Sparkles size={14} />
			{t("landing.badge.text")}
		</div>
	);
}
