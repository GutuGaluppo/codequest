import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { useAuth } from "../hooks/useAuth";

export const Route = createFileRoute("/")({
	component: IndexPage,
});

function IndexPage() {
	const [topic, setTopic] = useState("");
	const navigate = useNavigate();

	function handleSubmit(e: React.SubmitEvent) {
		e.preventDefault();
		if (!topic.trim()) return;
		navigate({ to: "/tutorial/$id", params: { id: topic.trim() } });
	}

	const { user, signIn, signOut } = useAuth();

	return (
		<>
			{user ? (
				<>
					<button onClick={signOut}>Sair</button>
					<Link to="/profile">{user.displayName}</Link>
				</>
			) : (
				<button onClick={signIn}>Entrar com Google</button>
			)}
			<form onSubmit={handleSubmit}>
				<input
					value={topic}
					onChange={(e) => setTopic(e.target.value)}
					placeholder="Ex: React hooks"
				/>
				<button type="submit">Gerar tutorial</button>
			</form>
		</>
	);
}
