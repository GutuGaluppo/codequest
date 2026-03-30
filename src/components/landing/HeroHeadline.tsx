import { useTranslation } from "react-i18next";

export function HeroHeadline() {
	const { t } = useTranslation();

	return (
		<div>
			<div className="inline-flex items-center gap-2 border border-amber/30 text-amber text-xs font-mono px-3 py-1 mb-8 uppercase tracking-widest">
				<span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
				{t("landing.hero.badge")}
			</div>
			<h1 className="text-7xl font-black uppercase leading-none tracking-tight text-text mb-6">
				{t("landing.hero.headline1")}
				<br />
				{t("landing.hero.headline2")}
				<br />
				<span className="text-amber">{t("landing.hero.headline3")}</span>
			</h1>
			<p className="text-lg text-muted mb-8 max-w-md leading-relaxed">
				{t("landing.hero.subtitle")}
			</p>
		</div>
	);
}
