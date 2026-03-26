// @refresh reset

import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { userTutorialsQueryOptions } from "../queries/tutorialQueries";
import { Code, Clock } from "lucide-react";
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
		<div className="px-6 py-8 max-w-6xl mx-auto w-full">
			<div className="flex items-start justify-between mb-8">
				<div>
					<h1 className="text-3xl font-mono font-medium text-text">
						{t("dashboard.title")}
					</h1>
					<p className="text-muted mt-1">
						{t("dashboard.subtitle")}
					</p>
				</div>
				<Link
					to="/"
					className="flex items-center gap-2 bg-amber text-background px-4 py-2 rounded font-medium text-sm hover:opacity-90 transition-opacity"
				>
					{t("dashboard.newTutorialButton")}
				</Link>
			</div>

			{isPending ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="bg-surface border rounded-lg p-5 h-48 animate-pulse" />
					))}
				</div>
			) : !tutorials?.length ? (
				<div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-center">
					<Code size={32} className="text-muted" />
					<p className="text-muted">{t("dashboard.empty.message")}</p>
					<Link to="/" className="text-amber text-sm hover:opacity-80 transition-opacity">
						{t("dashboard.empty.link")}
					</Link>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{tutorials.map((tutorial) => (
						<TutorialCard key={tutorial.id} tutorial={tutorial} />
					))}
				</div>
			)}
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
		<div className="bg-surface border rounded-lg p-5 flex flex-col gap-4 hover:border-amber/50 transition-colors">
			<div className="flex items-center justify-between">
				<div className="w-8 h-8 rounded bg-background border flex items-center justify-center">
					<Code size={14} className="text-muted" />
				</div>
				<span className="flex items-center gap-1 text-xs text-muted">
					<Clock size={12} />
					{timeAgo}
				</span>
			</div>

			<div>
				<h3 className="font-mono font-medium text-text capitalize">{topic}</h3>
				<p className="text-xs text-muted mt-1">
					{t("dashboard.card.generatedWith")}{generatedWith} · {stepCount}{t("dashboard.card.steps")}
				</p>
			</div>

			<Link
				to="/tutorial/$id"
				params={{ id }}
				className="mt-auto flex items-center justify-center gap-2 border border-border text-text text-sm px-4 py-2 rounded hover:border-amber hover:text-amber transition-colors"
			>
				{t("dashboard.card.button")}
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
