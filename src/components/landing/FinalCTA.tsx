import { useNavigate } from "@tanstack/react-router";
import type { User } from "firebase/auth";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export function FinalCTA({
	user,
	openDrawer,
}: {
	user: User | null;
	openDrawer: () => void;
}) {
	const navigate = useNavigate();
	const { t } = useTranslation();

	return (
		<div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
			<div>
				<h2 className="text-4xl font-black uppercase text-background leading-tight">
					{t("landing.finalCta.headline")}
				</h2>
				<p className="text-background/60 mt-1 text-sm font-mono">
					{t("landing.finalCta.subtitle")}
				</p>
			</div>
			<button
				onClick={() => (user ? navigate({ to: "/dashboard" }) : openDrawer())}
				className="bg-background text-amber px-8 py-4 font-black uppercase text-sm tracking-wide flex items-center gap-2 shrink-0"
			>
				{user ? t("landing.finalCta.dashboard") : t("landing.finalCta.start")}
				<ChevronRight size={16} />
			</button>
		</div>
	);
}
