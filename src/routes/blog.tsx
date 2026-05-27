import { Link, createFileRoute } from "@tanstack/react-router";
import { SitePage, primaryActionClass, secondaryActionClass } from "../components/site/SitePage";
import { GITHUB_REPO_URL } from "../constants/links";

export const Route = createFileRoute("/blog")({
	component: BlogPage,
});

function BlogPage() {
	return (
		<SitePage
			eyebrow="Company"
			title="Blog"
			description="This page is the public entry point for ongoing updates. Product notes, technical decisions and shipping progress currently live across Dev Log and GitHub."
			actions={
				<>
					<Link to="/devlog" className={primaryActionClass}>
						Read Dev Log
					</Link>
					<a
						href={GITHUB_REPO_URL}
						target="_blank"
						rel="noopener noreferrer"
						className={secondaryActionClass}
					>
						Follow GitHub updates
					</a>
				</>
			}
			stats={[
				{ label: "Shipping log", value: "Live" },
				{ label: "Code history", value: "Public" },
				{ label: "Design notes", value: "Tracked" },
				{ label: "Feature context", value: "Documented" },
			]}
			sections={[
				{
					title: "Product updates",
					description:
						"High-level changes, new feature launches and experience improvements are easiest to follow from this page and the linked Dev Log timeline.",
				},
				{
					title: "Technical write-ups",
					description:
						"When implementation details matter, the repository history and development notes provide the deeper engineering context behind each change.",
				},
				{
					title: "Design decisions",
					description:
						"Visual system choices, route changes and UX refinements are documented alongside the product work instead of being hidden in isolated changelogs.",
				},
				{
					title: "What to expect",
					description:
						"The blog surface will keep pointing to the most useful update streams until a dedicated long-form publishing workflow is added.",
				},
			]}
			sidebar={{
				title: "Where updates live today",
				items: [
					"Dev Log for chronological product and engineering notes.",
					"GitHub for commits, PRs and repo-level visibility.",
					"Design System for interface conventions and UI direction.",
				],
				note: "This page keeps the entry point simple while the deeper update channels stay fully accessible.",
			}}
		/>
	);
}
