import { Link, createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../stores/authStore";
import {
	SitePage,
	primaryActionClass,
	secondaryActionClass,
} from "../components/site/SitePage";
import { GITHUB_REPO_URL } from "../constants/links";

export const Route = createFileRoute("/about")({
	component: AboutPage,
});

function AboutPage() {
	const { user } = useAuth();
	const { openDrawer } = useAuthStore();

	return (
		<SitePage
			eyebrow="Company"
			title="About"
			description="CodeQuest is a learning product built to turn curiosity about a topic into a guided coding path with practice, saved progress and real hands-on momentum."
			actions={
				<>
					{user ? (
						<Link to="/dashboard" className={primaryActionClass}>
							Open your dashboard
						</Link>
					) : (
						<button
							type="button"
							onClick={() => openDrawer("/dashboard")}
							className={primaryActionClass}
						>
							Create account
						</button>
					)}
					<a
						href={GITHUB_REPO_URL}
						target="_blank"
						rel="noopener noreferrer"
						className={secondaryActionClass}
					>
						Explore the repository
					</a>
				</>
			}
			stats={[
				{ label: "Topic to tutorial", value: "Fast" },
				{ label: "Practice format", value: "Step-based" },
				{ label: "Account storage", value: "Firebase" },
				{ label: "AI provider model", value: "BYO key" },
			]}
			sections={[
				{
					title: "Why it exists",
					description:
						"Many coding tutorials teach by showing. CodeQuest is designed to teach by alternating between explanation, example and an immediate coding task.",
				},
				{
					title: "How the loop works",
					description:
						"You choose the topic, difficulty and AI provider. The app turns that into a saved learning path and tracks your completion as you solve the exercises.",
				},
				{
					title: "Built for developers",
					description:
						"The interface is intentionally direct: fast routing, clear borders, editor-first interactions and minimal friction between reading and coding.",
				},
				{
					title: "Open product surface",
					description:
						"Design system, dev log and repository pages stay visible so product decisions, technical tradeoffs and recent work remain easy to inspect.",
				},
			]}
			sidebar={{
				title: "What defines CodeQuest",
				items: [
					"AI-generated tutorials around a user-selected topic.",
					"Hands-on steps with code challenges in an embedded editor.",
					"Dashboard persistence for tutorials and progress.",
					"User-managed API keys instead of a hidden shared model account.",
				],
				note: "The goal is not passive reading. The goal is fast entry into deliberate practice.",
			}}
		/>
	);
}
