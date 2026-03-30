import { Code, TrendingUp, BrainIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export function FeatureCards() {
	const { t } = useTranslation();

	const features = [
		{
			icon: <BrainIcon size={18} />,
			title: t("landing.features.ai.title"),
			description: t("landing.features.ai.description"),
		},
		{
			icon: <Code size={18} />,
			title: t("landing.features.editor.title"),
			description: t("landing.features.editor.description"),
		},
		{
			icon: <TrendingUp size={18} />,
			title: t("landing.features.progressive.title"),
			description: t("landing.features.progressive.description"),
		},
	];

	return (
		<div className="max-w-7xl mx-auto">
			<div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
				{features.map((f) => (
					<div key={f.title} className="p-10 flex flex-col gap-5">
						<div className="w-10 h-10 border border-border flex items-center justify-center text-amber">
							{f.icon}
						</div>
						<div>
							<h3 className="font-black uppercase text-xs tracking-widest text-text">
								{f.title}
							</h3>
							<p className="text-sm text-muted mt-2 leading-relaxed">
								{f.description}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
