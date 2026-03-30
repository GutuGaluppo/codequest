import { useTranslation } from "react-i18next";

export function LandingFooter() {
	const { t } = useTranslation();

	const columns = [
		{
			title: t("landing.footer.product"),
			links: ["Challenges", "Dashboard", "Progress", "API Keys"],
		},
		{
			title: t("landing.footer.developers"),
			links: ["Docs", "Design System", "Dev Log", "GitHub"],
		},
		{
			title: t("landing.footer.company"),
			links: ["About", "Blog", "Privacy", "Terms"],
		},
	];

	return (
		<footer className="border-t border-border">
			<div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-10">
				<div>
					<div className="text-amber font-mono font-bold mb-4 text-sm">
						CodeQuest_
					</div>
					<p className="text-xs text-muted leading-relaxed">
						{t("landing.footer.tagline")}
					</p>
				</div>
				{columns.map((col) => (
					<div key={col.title}>
						<h4 className="text-xs font-mono uppercase tracking-widest text-muted mb-4">
							{col.title}
						</h4>
						<ul className="flex flex-col gap-2.5">
							{col.links.map((link) => (
								<li key={link}>
									<span className="text-sm text-muted/60 font-mono cursor-default">
										{link}
									</span>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
			<div className="border-t border-border">
				<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
					<span className="text-xs font-mono text-muted/30">
						{t("landing.footer.copyright")}
					</span>
					<span className="text-xs font-mono text-muted/30">{t("landing.footer.version")}</span>
				</div>
			</div>
		</footer>
	);
}
