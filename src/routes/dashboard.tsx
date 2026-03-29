// @refresh reset

import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { userTutorialsQueryOptions } from "../queries/tutorialQueries";
import { Code, Clock, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

export const Route = createFileRoute("/dashboard")({
	beforeLoad: () =>
		new Promise<void>((resolve, reject) => {
			const unsub = onAuthStateChanged(auth, (user) => {
				unsub();
				if (!user) reject(redirect({ to: "/" }));
				else resolve();
			});
		}),
	component: DashboardPage,
});

function DashboardPage() {
	const uid = getAuth().currentUser!.uid;
	const { t } = useTranslation();

	const { data: tutorials, isPending } = useQuery(
		userTutorialsQueryOptions(uid),
	);

	return (
		<div className="w-full">
			{/* ─── HEADER ─────────────────────────────────────────────────────── */}
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

			{/* ─── CONTENT ────────────────────────────────────────────────────── */}
			<div className="max-w-7xl mx-auto px-6 py-10">
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
						<p className="text-sm text-muted font-mono">{t("dashboard.empty.message")}</p>
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
							<TutorialCard key={tutorial.id as string} tutorial={tutorial} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}

function TutorialCard({ tutorial }: { tutorial: Record<string, unknown> }) {
	const { t } = useTranslation();
	const id = tutorial.id as string;
	const topic = tutorial.topic as string;
	const generatedWith = tutorial.generatedWith as string;
	const stepCount = tutorial.stepCount as number;
	const createdAt = tutorial.createdAt as { seconds: number } | null;

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

			<Link
				to="/tutorial/$id"
				params={{ id }}
				className="mt-auto flex items-center justify-between border border-border text-muted text-xs font-mono px-4 py-2.5 hover:border-amber hover:text-amber transition-colors"
			>
				{t("dashboard.card.button")}
				<ChevronRight size={12} />
			</Link>
		</div>
	);
}

function getTimeAgo(timestamp: number, t: TFunction): string {
	const diff = Date.now() - timestamp;
	const minutes = Math.floor(diff / 60_000);
	const hours = Math.floor(diff / 3_600_000);
	const days = Math.floor(diff / 86_400_000);

	if (minutes < 1) return t("dashboard.timeAgo.justNow");
	if (minutes < 60) return t("dashboard.timeAgo.minutes", { count: minutes });
	if (hours < 24) return t("dashboard.timeAgo.hours", { count: hours });
	return t("dashboard.timeAgo.days", { count: days });
}
