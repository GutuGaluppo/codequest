import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../stores/authStore";
import { HeroHeadline } from "../components/landing/HeroHeadline";
import { ApiKeysCard } from "../components/landing/ApiKeysCard";
import { TopicSearch } from "../components/landing/TopicSearch";
import { FeatureCards } from "../components/landing/FeatureCards";

export const Route = createFileRoute("/")({
	component: IndexPage,
});

function IndexPage() {
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
		navigate({ to: "/tutorial/$id", params: { id: topic.trim() } });
	}

	return (
		<div className="flex flex-col items-center min-h-[80vh] gap-10 text-center px-6 pt-16 pb-24">
			<HeroHeadline />
			{user && <ApiKeysCard uid={user.uid} />}
			<TopicSearch topic={topic} onChange={setTopic} onSubmit={handleSubmit} />
			<FeatureCards />
		</div>
	);
}
