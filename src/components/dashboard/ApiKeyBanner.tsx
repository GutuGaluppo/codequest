import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { KeyRound } from "lucide-react";
import { modelKeyLinks } from "../../utils/modelKeyLinks";

export function ApiKeyBanner() {
	const { t } = useTranslation();

	return (
		<div className="border border-amber/30 bg-amber/5 p-6 mb-8 flex flex-col gap-5">
			<div className="flex items-center gap-3">
				<KeyRound size={18} className="text-amber shrink-0" />
				<div>
					<p className="text-sm font-mono font-bold text-text">
						{t("dashboard.apiKeyBanner.title")}
					</p>
					<p className="text-xs text-muted mt-0.5">
						{t("dashboard.apiKeyBanner.subtitle")}
					</p>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row gap-4">
				{(["gemini", "openai", "claude"] as const).map((provider, i) => (
					<div key={provider} className="flex-1 flex flex-col gap-1.5">
						<span className="text-xs font-mono text-amber">0{i + 1}</span>
						<p className="text-xs font-mono font-bold text-text">
							{t(`dashboard.apiKeyBanner.steps.${i}.title`)}
						</p>
						<p className="text-xs text-muted leading-relaxed whitespace-break-spaces">
							{t(`dashboard.apiKeyBanner.steps.${i}.description`)}
						</p>
						{i === 1 && (
							<div className="flex flex-wrap gap-2 mt-1">
								{Object.entries(modelKeyLinks).map(([name, url]) => (
									<a
										key={name}
										href={url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-xs font-mono text-muted border border-border px-2 py-1 hover:border-amber/50 hover:text-text transition-colors"
									>
										{name}
									</a>
								))}
							</div>
						)}
						{i === 2 && (
							<Link
								to="/profile"
								className="self-start text-xs font-mono font-bold text-amber border border-amber/30 px-3 py-1.5 hover:border-amber/60 transition-colors mt-1"
							>
								{t("dashboard.apiKeyBanner.steps.2.cta")}
							</Link>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
