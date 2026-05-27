import { createFileRoute } from "@tanstack/react-router";
import { SitePage } from "../components/site/SitePage";

export const Route = createFileRoute("/terms")({
	component: TermsPage,
});

function TermsPage() {
	return (
		<SitePage
			eyebrow="Company"
			title="Terms"
			description="These terms outline the current operating expectations for using CodeQuest, including account responsibility, acceptable use and the practical limits of AI-generated tutorial content."
			stats={[
				{ label: "Account use", value: "Personal" },
				{ label: "Generated content", value: "Review it" },
				{ label: "Rate limits", value: "Applied" },
				{ label: "Availability", value: "Evolving" },
			]}
			sections={[
				{
					title: "Acceptable use",
					description:
						"Use the product for legitimate educational and development work. Do not attempt to abuse rate limits, misuse provider integrations or submit harmful prompts through the tutorial generation flow.",
				},
				{
					title: "Account responsibility",
					description:
						"You are responsible for the account credentials you use, the API keys you connect and the code or content you choose to save inside your workspace.",
				},
				{
					title: "AI output disclaimer",
					description:
						"Generated tutorials and code should be reviewed before production use. AI output can be incomplete or incorrect, so final implementation decisions remain with the user.",
				},
				{
					title: "Service changes",
					description:
						"CodeQuest may evolve in interface, provider support, storage strategy or feature set as the product develops. Availability and behavior can change over time.",
				},
			]}
			sidebar={{
				title: "Plain-language summary",
				items: [
					"Bring your own API key and keep it valid.",
					"Review generated code before relying on it.",
					"Use the product responsibly and within system limits.",
					"Expect the service to keep evolving as features ship.",
				],
				note: "This page is a concise product terms summary intended for clarity and orientation.",
			}}
		/>
	);
}
