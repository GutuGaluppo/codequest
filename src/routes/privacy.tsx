import { createFileRoute } from "@tanstack/react-router";
import { SitePage } from "../components/site/SitePage";

export const Route = createFileRoute("/privacy")({
	component: PrivacyPage,
});

function PrivacyPage() {
	return (
		<SitePage
			eyebrow="Company"
			title="Privacy"
			description="This page summarizes the current data-handling model inside CodeQuest so users can understand what is stored, why it is stored and which third-party services participate in the workflow."
			stats={[
				{ label: "Auth provider", value: "Firebase" },
				{ label: "Profile store", value: "Firestore" },
				{ label: "Key storage", value: "Encrypted" },
				{ label: "Image upload", value: "Optional" },
			]}
			sections={[
				{
					title: "Account data",
					description:
						"CodeQuest stores basic account and profile fields such as uid, email, display name, selected model and saved tutorial metadata so the product can restore your workspace across sessions.",
				},
				{
					title: "API keys",
					description:
						"User-provided API keys are sent to the server, encrypted before storage and saved separately from the public profile document. The client stores only whether a provider has been configured.",
				},
				{
					title: "Third-party services",
					description:
						"Authentication and data persistence run through Firebase. If you upload a profile image, the file is sent to Cloudinary. Tutorial generation uses the AI provider associated with your configured key.",
				},
				{
					title: "Your controls",
					description:
						"You decide which model to configure, whether to upload a profile image and which topics to save. Without a signed-in account, tutorial persistence and personal progress tracking are limited.",
				},
			]}
			sidebar={{
				title: "Operational summary",
				items: [
					"Firebase Auth handles sign-in state.",
					"Firestore stores profiles, tutorials and progress.",
					"Encrypted API keys are retrieved server-side for generation.",
					"Profile image upload is optional and uses Cloudinary.",
				],
				note: "This is a product-facing summary of the current implementation, not a substitute for formal legal counsel.",
			}}
		/>
	);
}
