import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
	allProgressQueryOptions,
	userTutorialsQueryOptions,
} from "../../queries/tutorialQueries";
import { userProfileQueryOptions } from "../../queries/userQueries";
import { getAuth } from "firebase/auth";
import { TutorialCard } from "./TutorialCard";
import { ApiKeyBanner } from "./ApiKeyBanner";
import { Link } from "@tanstack/react-router";
import { Code } from "lucide-react";
import type { Tutorial } from "../../types/tutorial";

export function DashboardContent() {
	const uid = getAuth().currentUser!.uid;
	const { t } = useTranslation();

	const { data: tutorials, isPending } = useQuery(
		userTutorialsQueryOptions(uid),
	);
	const { data: progress } = useQuery(allProgressQueryOptions(uid));
	const { data: profile, isPending: profilePending } = useQuery(
		userProfileQueryOptions(uid),
	);

	const progressMap = progress?.reduce(
		(acc, progress) => {
			acc[progress.tutorialId] = progress.completedSteps;
			return acc;
		},
		{} as Record<string, string[]>,
	);

	const model = profile?.preferredModel;
	const keys = profile?.configuredKeys ?? {};
	const hasKeyForModel =
		model === "gemini" ||
		(model === "openai" && !!keys.openai) ||
		(model === "claude" && !!keys.anthropic);

	const showBanner = !profilePending && (!profile || !hasKeyForModel);

	return (
		<div className="max-w-7xl mx-auto px-6 py-10">
			{showBanner && <ApiKeyBanner />}

			{isPending ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={i}
							className="border border-border bg-surface h-48 animate-pulse"
						/>
					))}
				</div>
			) : !tutorials?.length ? (
				<div className="border border-border p-16 flex flex-col items-center justify-center gap-4 text-center">
					<Code size={28} className="text-muted" />
					<p className="text-sm text-muted font-mono">
						{t("dashboard.empty.message")}
					</p>
					<Link
						to="/"
						className="text-xs font-black uppercase tracking-wide text-amber border border-amber/30 px-4 py-2 hover:border-amber/60 transition-colors"
					>
						{t("dashboard.empty.link")}
					</Link>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{tutorials.map((tutorial) => (
						<TutorialCard
							key={tutorial.id as string}
							tutorial={tutorial as Tutorial}
							progress={progressMap?.[tutorial.id] ?? []}
						/>
					))}
				</div>
			)}
		</div>
	);
}
