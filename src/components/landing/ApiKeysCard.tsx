import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Zap, CheckCircle } from "lucide-react";
import { userProfileQueryOptions } from "../../queries/userQueries";
import { useTranslation } from "react-i18next";

export function ApiKeysCard({ uid }: { uid: string }) {
	const { data: profile } = useQuery(userProfileQueryOptions(uid));
	const { t } = useTranslation();

	const allConfigured = !!profile?.apiKeys?.anthropic && !!profile?.apiKeys?.openai;

	return (
		<div className="w-full max-w-xl border border-border rounded-lg p-4 text-left flex items-center justify-between gap-4 bg-surface/50">
			<div className="flex items-start gap-3">
				<Zap size={18} className="text-amber mt-0.5 shrink-0" />
				<div className="flex flex-col gap-1.5">
					<p className="text-base font-medium text-text">{t("landing.apiKeys.title")}</p>
					{allConfigured ? (
						<div className="flex items-center gap-1.5">
							<CheckCircle size={14} className="text-green" />
							<span className="text-sm text-muted">{t("landing.apiKeys.configured")}</span>
						</div>
					) : (
						<p className="text-sm text-muted">
							{t("landing.apiKeys.description")}
						</p>
					)}
				</div>
			</div>
			<Link
				to="/profile"
				className="shrink-0 text-sm bg-amber text-background px-4 py-2 rounded font-medium hover:opacity-90 transition-opacity"
			>
				{allConfigured ? t("landing.apiKeys.buttonManage") : t("landing.apiKeys.buttonSetup")}
			</Link>
		</div>
	);
}
