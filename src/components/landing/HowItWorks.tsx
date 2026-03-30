import { useTranslation } from "react-i18next";

export function HowItWorks() {
	const { t } = useTranslation();

	const steps = [
		{
			title: t("landing.howItWorks.step1.title"),
			description: t("landing.howItWorks.step1.description"),
		},
		{
			title: t("landing.howItWorks.step2.title"),
			description: t("landing.howItWorks.step2.description"),
		},
		{
			title: t("landing.howItWorks.step3.title"),
			description: t("landing.howItWorks.step3.description"),
		},
	];

	return (
		<div className="max-w-7xl mx-auto px-6 py-16">
			<div className="flex items-center gap-5 mb-12">
				<span className="text-xs font-mono text-muted uppercase tracking-widest whitespace-nowrap">
					{t("landing.howItWorks.label")}
				</span>
				<div className="flex-1 border-t border-border" />
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 border border-border divide-y md:divide-y-0 md:divide-x divide-border">
				{steps.map((step, i) => (
					<div key={i} className="p-10">
						<div className="text-5xl font-black text-amber mb-6 font-mono leading-none">
							0{i + 1}
						</div>
						<h3 className="font-bold text-text mb-2">{step.title}</h3>
						<p className="text-sm text-muted leading-relaxed">
							{step.description}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
