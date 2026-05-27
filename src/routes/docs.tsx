import { Link, createFileRoute } from "@tanstack/react-router";
import { SitePage, primaryActionClass, secondaryActionClass } from "../components/site/SitePage";
import { GITHUB_REPO_URL } from "../constants/links";
import { modelKeyLinks } from "../utils/modelKeyLinks";

export const Route = createFileRoute("/docs")({
	component: DocsPage,
});

function DocsPage() {
	return (
		<SitePage
			eyebrow="Developers"
			title="Docs"
			description="A practical overview of how CodeQuest works: configure your model, generate a topic, solve each challenge and keep progress synced to your account."
			actions={
				<>
					<Link to="/api-keys" className={primaryActionClass}>
						Open API key form
					</Link>
					<Link to="/design" className={secondaryActionClass}>
						View design system
					</Link>
					<a
						href={GITHUB_REPO_URL}
						target="_blank"
						rel="noopener noreferrer"
						className={secondaryActionClass}
					>
						GitHub repository
					</a>
				</>
			}
			stats={[
				{ label: "Core workflows", value: "4" },
				{ label: "Built-in providers", value: "3" },
				{ label: "Custom model support", value: "Yes" },
				{ label: "Saved tutorial sync", value: "Account" },
			]}
			sections={[
				{
					title: "Generate a tutorial",
					description:
						"Pick a topic and a difficulty level on the landing page. CodeQuest creates an introduction, lesson steps, exercises and a final project for that topic.",
				},
				{
					title: "Configure your model",
					description:
						"API keys are managed from the profile flow. You can save Gemini, OpenAI, Claude or a custom model endpoint and choose the preferred provider for new generations.",
				},
				{
					title: "Work inside the editor",
					description:
						"Every step combines a concept explanation, code example and challenge. Completing a step updates your saved progress and helps the dashboard stay current.",
				},
				{
					title: "Return to saved work",
					description:
						"Signed-in users get tutorial persistence, progress bars and saved code so an interrupted session can be reopened without losing context.",
				},
			]}
			sidebar={{
				title: "Quick start",
				description:
					"This is the shortest route from a fresh account to a working tutorial session.",
				items: [
					"Create an account or sign in.",
					"Open API Keys and select your preferred model.",
					"Save a valid provider key.",
					"Generate a topic from the landing page.",
					"Finish challenges and monitor progress in the dashboard.",
				],
				note: "The full product behavior is also visible in the design system, dev log and repository history.",
			}}
		>
			<div className="flex flex-col gap-6">
				<div>
					<h2 className="text-2xl font-black uppercase text-text">
						Provider Portals
					</h2>
					<p className="mt-2 max-w-2xl text-sm text-muted">
						Need a key before filling the form? These are the direct provider pages used by the profile flow.
					</p>
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<a
						href={modelKeyLinks.gemini}
						target="_blank"
						rel="noopener noreferrer"
						className="border border-border bg-surface/30 p-5 transition-colors hover:border-amber"
					>
						<h3 className="text-xs font-black uppercase tracking-widest text-text">
							Gemini
						</h3>
						<p className="mt-3 text-sm text-muted">
							Create or manage a Gemini API key through Google AI Studio.
						</p>
					</a>
					<a
						href={modelKeyLinks.openai}
						target="_blank"
						rel="noopener noreferrer"
						className="border border-border bg-surface/30 p-5 transition-colors hover:border-amber"
					>
						<h3 className="text-xs font-black uppercase tracking-widest text-text">
							OpenAI
						</h3>
						<p className="mt-3 text-sm text-muted">
							Open your API key list on the OpenAI platform and copy the key into CodeQuest.
						</p>
					</a>
					<a
						href={modelKeyLinks.claude}
						target="_blank"
						rel="noopener noreferrer"
						className="border border-border bg-surface/30 p-5 transition-colors hover:border-amber"
					>
						<h3 className="text-xs font-black uppercase tracking-widest text-text">
							Claude
						</h3>
						<p className="mt-3 text-sm text-muted">
							Access Anthropic console keys and plug the selected secret into your profile form.
						</p>
					</a>
				</div>
			</div>
		</SitePage>
	);
}
