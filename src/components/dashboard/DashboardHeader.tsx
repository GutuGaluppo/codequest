import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export function DashboardHeader() {
	const { t } = useTranslation();

	return (
		<section className="border-b border-border">
			<div className="max-w-7xl mx-auto px-6 py-10 flex items-end justify-between gap-4">
				<div>
					<span className="text-xs font-mono text-muted uppercase tracking-widest">
						{t("dashboard.subtitle")}
					</span>
					<h1 className="text-4xl font-black uppercase text-text mt-1 leading-none">
						{t("dashboard.title")}
					</h1>
				</div>
				<Link
					to="/"
					className="flex items-center gap-2 bg-amber text-background px-5 py-3 font-black text-xs uppercase tracking-wide shrink-0"
				>
					{t("dashboard.newTutorialButton")} <ChevronRight size={14} />
				</Link>
			</div>
		</section>
	);
}
