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

export const Route = createFileRoute("/challenges")({
	component: ChallengesPage,
});

function ChallengesPage() {
	const { user } = useAuth();
	const { openDrawer } = useAuthStore();

	const { data: tutorials, isPending } = useQuery(
		userTutorialsQueryOptions(user?.uid ?? ""),
	);
	const { data: progress } = useQuery({
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
	const completedStepsCount = Object.values(progressMap).reduce(
		(total, steps) => total + steps.length,
		0,
	);

	return (
		<SitePage
			eyebrow="Product"
			title="Challenges"
			description="Generate guided coding paths for any topic, save them to your account and come back later exactly where you stopped."
			actions={
				<>
					{user ? (
						<Link to="/dashboard" className={primaryActionClass}>
							Open dashboard
						</Link>
					) : (
						<button
							type="button"
							onClick={() => openDrawer("/dashboard")}
							className={primaryActionClass}
						>
							Start with an account
						</button>
					)}
					<Link to="/" className={secondaryActionClass}>
						Generate a new topic
					</Link>
				</>
			}
			stats={
				user
					? [
							{ label: "Saved challenge tracks", value: String(tutorialList.length) },
							{ label: "Completed steps", value: String(completedStepsCount) },
							{
								label: "Active topics",
								value: String(
									tutorialList.filter(
										(tutorial) => (progressMap[tutorial.id] ?? []).length > 0,
									).length,
								),
							},
							{ label: "Final projects", value: String(tutorialList.length) },
						]
					: [
							{ label: "Path structure", value: "4" },
							{ label: "Difficulty levels", value: "3" },
							{ label: "Code editor", value: "1" },
							{ label: "Final project", value: "1" },
						]
			}
			sections={[
				{
					title: "Structured practice",
					description:
						"Each topic becomes a learning path with introduction, concept blocks, code examples, hands-on challenges and a closing project.",
				},
				{
					title: "Saved to your library",
					description:
						"Signed-in users keep every generated tutorial in their dashboard, so the same topic is easy to reopen and continue.",
				},
				{
					title: "Context-aware exercises",
					description:
						"Challenges are attached to the lesson you just read, which makes the practice feel like a progression instead of a random quiz.",
				},
				{
					title: "Built for momentum",
					description:
						"Completion is tracked step by step, making it easy to finish one exercise, pause, and return later without losing context.",
				},
			]}
			sidebar={{
				title: "How it flows",
				description:
					"The product path stays intentionally short so you can get from idea to hands-on practice quickly.",
				items: [
					"Choose a topic and difficulty level.",
					"Generate a tutorial with an AI model you control.",
					"Work through each step in the embedded editor.",
					"Finish the final project and keep the track saved.",
				],
				note: "Dashboard, progress sync and saved tutorials are available once you sign in.",
			}}
		>
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
					<div>
						<h2 className="text-2xl font-black uppercase text-text">
							Your Recent Challenges
						</h2>
						<p className="mt-2 max-w-2xl text-sm text-muted">
							{user
								? "Your latest saved tutorials appear here so you can jump back into practice immediately."
								: "Sign in to save challenge tracks, sync completion and reopen them from any session."}
						</p>
					</div>
					{user ? (
						<Link to="/dashboard" className={subtleActionClass}>
							View full dashboard
						</Link>
					) : null}
				</div>

				{user ? (
					isPending ? (
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
							{Array.from({ length: 3 }).map((_, index) => (
								<div
									key={index}
									className="h-48 animate-pulse border border-border bg-surface"
								/>
							))}
						</div>
					) : tutorialList.length ? (
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
							{tutorialList.slice(0, 6).map((tutorial) => (
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
								You do not have saved challenges yet. Generate your first topic from the home page and it will appear here.
							</p>
							<Link to="/" className={`${secondaryActionClass} mt-5`}>
								Create first challenge path
							</Link>
						</div>
					)
				) : (
					<div className="border border-border bg-surface/30 p-8">
						<p className="text-sm text-muted">
							Account-based challenge storage unlocks your dashboard, progress tracking and API-key powered tutorial generation.
						</p>
						<button
							type="button"
							onClick={() => openDrawer("/dashboard")}
							className={`${primaryActionClass} mt-5`}
						>
							Sign in to unlock saved challenges
						</button>
					</div>
				)}
			</div>
		</SitePage>
	);
}
