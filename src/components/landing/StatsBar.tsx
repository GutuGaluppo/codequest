import { useTranslation } from "react-i18next";

export function StatsBar() {
	const { t } = useTranslation();

	const stats = [
		{ value: "50+", label: t("landing.stats.languages") },
		{ value: "< 3s", label: t("landing.stats.generation") },
		{ value: "100%", label: t("landing.stats.browser") },
	];

	return (
		<div className="max-w-7xl mx-auto">
			<div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
				{stats.map((stat) => (
					<div key={stat.label} className="px-10 py-12 flex flex-col gap-2">
						<div className="text-4xl font-black text-amber leading-none">
							{stat.value}
						</div>
						<div className="text-xs font-mono text-muted uppercase tracking-widest">
							{stat.label}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
