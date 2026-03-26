import { useTranslation } from "react-i18next";

export function HeroHeadline() {
	const { t } = useTranslation();
	return (
		<div className="flex flex-col gap-5 max-w-3xl">
			<h1 className="text-6xl font-mono font-medium text-text tracking-tight leading-tight">
				{t("landing.hero.titlePart1")}<span className="text-amber">{t("landing.hero.titlePart2")}</span>
			</h1>
			<p className="text-muted text-xl max-w-2xl mx-auto">
				{t("landing.hero.subtitle")}
			</p>
		</div>
	);
}
