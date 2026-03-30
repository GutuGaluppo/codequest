import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
	CodeSnippetDemo,
	HeroHeadline,
	SuggestedTopics,
	TechStrip,
	TopicSearchForm,
	ApiKeysCard,
	FeatureCards,
	FinalCTA,
	HowItWorks,
	LandingFooter,
	LevelSelector,
	EditorPreview,
	StatsBar,
} from "../components/landing";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../stores/authStore";
import type { Level } from "../types/tutorial";

export const Route = createFileRoute("/")({
	component: IndexPage,
});

function IndexPage() {
	const [level, setLevel] = useState<Level>("beginner");
	const [topic, setTopic] = useState("");
	const { user } = useAuth();
	const { openDrawer } = useAuthStore();
	const navigate = useNavigate();

	function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!topic.trim()) return;
		if (!user) {
			openDrawer();
			return;
		}
		navigate({
			to: "/tutorial/$id",
			params: { id: topic.trim() },
			search: { level: level ?? "beginner" },
		});
	}

	return (
		<div className="w-full">
			<section className="border-b border-border">
				<div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
					<div>
						<HeroHeadline />
						<LevelSelector
							level={level}
							handleLevelSelection={(lvl) => setLevel(lvl)}
						/>
						<TopicSearchForm
							topic={topic}
							setTopic={setTopic}
							handleSubmit={handleSubmit}
						/>
						<SuggestedTopics setTopic={setTopic} />

						{user && (
							<div className="mt-6">
								<ApiKeysCard uid={user.uid} />
							</div>
						)}
					</div>
					<CodeSnippetDemo />
				</div>
			</section>

			<section className="border-b border-border overflow-hidden">
				<TechStrip />
			</section>

			<section className="border-b border-border">
				<FeatureCards />
			</section>

			<section className="border-b border-border">
				<HowItWorks />
			</section>

			<section className="border-b border-border">
				<StatsBar />
			</section>

			<section className="border-b border-border">
				<EditorPreview />
			</section>

			<section className="bg-amber">
				<FinalCTA user={user} openDrawer={openDrawer} />
			</section>
			<LandingFooter />
		</div>
	);
}
