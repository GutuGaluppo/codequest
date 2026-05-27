import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../stores/authStore";
import {
	allProgressQueryOptions,
	userTutorialsQueryOptions,
} from "../queries/tutorialQueries";
import {
	SitePage,
	primaryActionClass,
	secondaryActionClass,
	subtleActionClass,
} from "../components/site/SitePage";
import { TutorialCard } from "../components/dashboard/TutorialCard";
import type { Tutorial } from "../types/tutorial";

export const Route = createFileRoute("/progress")({
	component: ProgressPage,
});

function ProgressPage() {
	const { user } = useAuth();
	const { openDrawer } = useAuthStore();

	const { data: tutorials, isPending: tutorialsPending } = useQuery(
		userTutorialsQueryOptions(user?.uid ?? ""),
	);
	const { data: progress, isPending: progressPending } = useQuery({
		...allProgressQueryOptions(user?.uid ?? ""),
		enabled: !!user?.uid,
	});

	const tutorialList = (tutorials ?? []) as Tutorial[];
	const progressMap = (progress ?? []).reduce<Record<string, string[]>>(
		(acc, entry) => {
			const tutorialId =
				typeof entry?.tutorialId === "string" ? entry.tutorialId : null;
			const completedSteps = Array.isArray(entry?.completedSteps)
				? (entry.completedSteps as string[])
				: [];

			if (tutorialId) acc[tutorialId] = completedSteps;
			return acc;
		},
		{},
	);

	const totals = tutorialList.reduce(
		(acc, tutorial) => {
			const stepCount = tutorial.stepCount ?? tutorial.steps?.length ?? 0;
			const completed = (progressMap[tutorial.id] ?? []).length;

			acc.stepCount += stepCount;
			acc.completedSteps += completed;

			if (completed > 0) acc.activeTutorials += 1;
			if (stepCount > 0 && completed >= stepCount) acc.completedTutorials += 1;

			return acc;
		},
		{
			stepCount: 0,
			completedSteps: 0,
			activeTutorials: 0,
			completedTutorials: 0,
		},
	);

	const averageCompletion =
		totals.stepCount > 0
			? `${Math.round((totals.completedSteps / totals.stepCount) * 100)}%`
			: "0%";

	const rankedTutorials = [...tutorialList].sort((left, right) => {
		const leftSteps = left.stepCount ?? left.steps?.length ?? 0;
		const rightSteps = right.stepCount ?? right.steps?.length ?? 0;
		const leftPercent =
			leftSteps > 0
				? (progressMap[left.id] ?? []).length / leftSteps
				: 0;
		const rightPercent =
			rightSteps > 0
				? (progressMap[right.id] ?? []).length / rightSteps
				: 0;

		return rightPercent - leftPercent;
	});

	return (
		<SitePage
			eyebrow="Product"
			title="Progress"
			description="Track how far you have gone across saved tutorials, measure completion step by step and reopen the topics that deserve your next session."
			actions={
				<>
					{user ? (
						<Link to="/dashboard" className={primaryActionClass}>
							Go to dashboard
						</Link>
					) : (
						<button
							type="button"
							onClick={() => openDrawer("/progress")}
							className={primaryActionClass}
						>
							Sign in to see your progress
						</button>
					)}
					<Link to="/challenges" className={secondaryActionClass}>
						Explore challenge paths
					</Link>
				</>
			}
			stats={
				user
					? [
							{ label: "Saved tutorials", value: String(tutorialList.length) },
							{
								label: "Completed steps",
								value: String(totals.completedSteps),
							},
							{
								label: "Average completion",
								value: averageCompletion,
							},
							{
								label: "Finished tracks",
								value: String(totals.completedTutorials),
							},
						]
					: [
							{ label: "Tracked per step", value: "Yes" },
							{ label: "Resume support", value: "Fast" },
							{ label: "Dashboard sync", value: "Live" },
							{ label: "Saved sessions", value: "Account" },
						]
			}
			sections={[
				{
					title: "Per-step completion",
					description:
						"Every completed challenge writes back to your account so each tutorial keeps an accurate count of what is already done.",
				},
				{
					title: "Resume instantly",
					description:
						"Tutorial cards show completion bars and recent activity, which makes it easy to pick the right challenge for your next session.",
				},
				{
					title: "Dashboard integration",
					description:
						"New tutorials appear in the dashboard automatically and progress stays tied to the saved tutorial id for reliable reopen flows.",
				},
				{
					title: "Built for pacing",
					description:
						"Progress does not pressure you into streaks. It simply keeps the state clean so you can learn in short bursts or deep sessions.",
				},
			]}
			sidebar={{
				title: "What you can measure",
				description:
					"The progress view turns saved tutorials into a simple operating panel for your next learning decision.",
				items: [
					"How many tutorials are saved to your account.",
					"How many steps you have completed in total.",
					"Which tracks are most advanced right now.",
					"Which topic is best to resume next.",
				],
				note: "Sign in once and future challenge completions will keep this page updated automatically.",
			}}
		>
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
					<div>
						<h2 className="text-2xl font-black uppercase text-text">
							Most Advanced Tutorials
						</h2>
						<p className="mt-2 max-w-2xl text-sm text-muted">
							{user
								? "These cards are sorted by completion so your next best topic is easy to spot."
								: "Once you sign in, this page becomes a personal view of your saved completion across tutorials."}
						</p>
					</div>
					{user ? (
						<Link to="/dashboard" className={subtleActionClass}>
							Open dashboard grid
						</Link>
					) : null}
				</div>

				{user ? (
					tutorialsPending || progressPending ? (
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
							{Array.from({ length: 3 }).map((_, index) => (
								<div
									key={index}
									className="h-48 animate-pulse border border-border bg-surface"
								/>
							))}
						</div>
					) : rankedTutorials.length ? (
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
							{rankedTutorials.slice(0, 6).map((tutorial) => (
								<TutorialCard
									key={tutorial.id}
									tutorial={tutorial}
									progress={progressMap[tutorial.id] ?? []}
								/>
							))}
						</div>
					) : (
						<div className="border border-border bg-surface/30 p-8">
							<p className="text-sm text-muted">
								Progress starts appearing after you generate a tutorial and complete at least one challenge step.
							</p>
							<Link to="/" className={`${secondaryActionClass} mt-5`}>
								Generate your first tutorial
							</Link>
						</div>
					)
				) : (
					<div className="border border-border bg-surface/30 p-8">
						<p className="text-sm text-muted">
							Progress is tied to your account so the app can remember completed steps, saved code and recently active tutorial tracks.
						</p>
						<button
							type="button"
							onClick={() => openDrawer("/progress")}
							className={`${primaryActionClass} mt-5`}
						>
							Open account to track progress
						</button>
					</div>
				)}
			</div>
		</SitePage>
	);
}
