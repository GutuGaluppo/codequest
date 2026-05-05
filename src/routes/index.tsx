import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
	CodeSnippetDemo,
	HeroHeadline,
	SuggestedTopics,
	TopicSearchForm,
	ApiKeysCard,
	LevelSelector,
} from "../components/landing";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../stores/authStore";
import { useBetaModalStore } from "../stores/betaModalStore";
import { userProfileQueryOptions } from "../queries/userQueries";
import type { Level, ModelProvider } from "../types/tutorial";
import type { UserProfile } from "../types/user";

const TechStrip = lazy(() => import("../components/landing/TechStrip").then((m) => ({ default: m.TechStrip })));
const FeatureCards = lazy(() => import("../components/landing/FeatureCards").then((m) => ({ default: m.FeatureCards })));
const HowItWorks = lazy(() => import("../components/landing/HowItWorks").then((m) => ({ default: m.HowItWorks })));
const StatsBar = lazy(() => import("../components/landing/StatsBar").then((m) => ({ default: m.StatsBar })));
const EditorPreview = lazy(() => import("../components/landing/EditorPreview").then((m) => ({ default: m.EditorPreview })));
const FinalCTA = lazy(() => import("../components/landing/FinalCTA").then((m) => ({ default: m.FinalCTA })));
const LandingFooter = lazy(() => import("../components/landing/LandingFooter").then((m) => ({ default: m.LandingFooter })));

const PROVIDER_FOR_MODEL: Record<ModelProvider, keyof NonNullable<UserProfile["configuredKeys"]>> = {
	claude: "anthropic",
	openai: "openai",
	gemini: "gemini",
	other: "other",
};

function hasKeyForModel(profile: UserProfile | null | undefined, model: ModelProvider): boolean {
	if (!profile?.configuredKeys) return false;
	return !!profile.configuredKeys[PROVIDER_FOR_MODEL[model]];
}

export const Route = createFileRoute("/")({
	component: IndexPage,
});

function IndexPage() {
	const [level, setLevel] = useState<Level>("beginner");
	const [topic, setTopic] = useState("");
	const { user } = useAuth();
	const { openDrawer } = useAuthStore();
	const { openModal } = useBetaModalStore();
	const navigate = useNavigate();

	const { data: profile } = useQuery({
		...userProfileQueryOptions(user?.uid ?? ""),
		enabled: !!user?.uid,
	});

	function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!topic.trim()) return;
		if (!user) {
			openDrawer();
			return;
		}

		const model = profile?.preferredModel ?? "gemini";
		if (!hasKeyForModel(profile, model)) {
			openModal({ topic: topic.trim(), level });
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

			<Suspense>
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
			</Suspense>
		</div>
	);
}
