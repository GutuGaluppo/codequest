import { Code, Zap, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

export function FeatureCards() {
	const { t } = useTranslation();

	const features = [
		{
			icon: <Code size={22} className="text-amber" />,
			title: t("landing.features.editor.title"),
			description: t("landing.features.editor.description"),
		},
		{
			icon: <Zap size={22} className="text-amber" />,
			title: t("landing.features.ai.title"),
			description: t("landing.features.ai.description"),
		},
		{
			icon: <TrendingUp size={22} className="text-amber" />,
			title: t("landing.features.progressive.title"),
			description: t("landing.features.progressive.description"),
		},
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mt-4">
			{features.map((f) => (
				<div key={f.title} className="border border-border rounded-lg p-5 text-left flex flex-col gap-3 bg-surface/30">
					{f.icon}
					<div>
						<h3 className="font-mono font-medium text-text">{f.title}</h3>
						<p className="text-sm text-muted mt-1">{f.description}</p>
					</div>
				</div>
			))}
		</div>
	);
}
