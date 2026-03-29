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
		<div className="w-full max-w-2xl border border-border p-4 text-left flex items-center justify-between gap-4">
			<div className="flex items-start gap-3">
				<Zap size={16} className="text-amber mt-0.5 shrink-0" />
				<div className="flex flex-col gap-1">
					<p className="text-xs font-black uppercase tracking-widest text-text">{t("landing.apiKeys.title")}</p>
					{allConfigured ? (
						<div className="flex items-center gap-1.5">
							<CheckCircle size={12} className="text-green" />
							<span className="text-xs font-mono text-muted">{t("landing.apiKeys.configured")}</span>
						</div>
					) : (
						<p className="text-xs font-mono text-muted">
							{t("landing.apiKeys.description")}
						</p>
					)}
				</div>
			</div>
			<Link
				to="/profile"
				className="shrink-0 text-xs font-black uppercase tracking-wide bg-amber text-background px-4 py-2"
			>
				{allConfigured ? t("landing.apiKeys.buttonManage") : t("landing.apiKeys.buttonSetup")}
			</Link>
		</div>
	);
}
