import { useTranslation } from "react-i18next";
import { getTimeAgo } from "../../utils";
import { ChevronRight, Clock, Code } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Tutorial } from "../../types/tutorial";

export function TutorialCard({
	tutorial,
	progress,
}: {
	tutorial: Tutorial;
	progress: string[];
}) {
	const { t } = useTranslation();

	const topic = tutorial.topic;
	const generatedWith = tutorial.generatedWith;
	const stepCount = tutorial.stepCount ?? tutorial.steps?.length ?? 0;
	const createdAt = tutorial.createdAt;

	const percent =
		stepCount > 0 ? Math.round((progress.length / stepCount) * 100) : 0;

	const timeAgo = createdAt
		? getTimeAgo(createdAt.seconds * 1000, t)
		: t("dashboard.timeAgo.justNow");

	return (
		<div className="border border-border p-5 flex flex-col gap-4 hover:border-amber/40 transition-colors">
			<div className="flex items-center justify-between">
				<div className="w-8 h-8 border border-border flex items-center justify-center">
					<Code size={14} className="text-muted" />
				</div>
				<span className="flex items-center gap-1 text-xs font-mono text-muted">
					<Clock size={11} />
					{timeAgo}
				</span>
			</div>

			<div>
				<h3 className="font-black uppercase text-xs tracking-widest text-text">
					{topic}
				</h3>
				<p className="text-xs font-mono text-muted mt-1">
					{t("dashboard.card.generatedWith")}
					{generatedWith} · {stepCount}
					{t("dashboard.card.steps")}
				</p>
			</div>

			<div className="flex flex-col gap-1">
				<div className="flex justify-between text-xs font-mono text-muted">
					<span>{percent}%</span>
					<span>
						{progress.length}/{stepCount}
					</span>
				</div>
				<div className="h-px bg-border w-full">
					<div
						className="h-px bg-amber transition-all"
						style={{ width: `${percent}%` }}
					/>
				</div>
			</div>

			<Link
				to="/tutorial/$id"
				params={{ id: tutorial.topic }}
				search={{ level: tutorial.level }}
				className="mt-auto flex items-center justify-between border border-border text-muted text-xs font-mono px-4 py-2.5 hover:border-amber hover:text-amber transition-colors"
			>
				{t("dashboard.card.button")}
				<ChevronRight size={12} />
			</Link>
		</div>
	);
}
