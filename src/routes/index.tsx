import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

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

	return (
		<div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 text-center px-6">
			<div className="flex flex-col gap-3">
				<h1 className="text-5xl font-mono font-medium text-text tracking-tight">
					Aprenda qualquer coisa,{" "}
					<span className="text-amber">passo a passo.</span>
				</h1>
				<p className="text-muted text-lg max-w-xl mx-auto">
					Digite um tópico e o CodeQuest gera um tutorial interativo com
					desafios de código.
				</p>
			</div>

			<form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-lg">
				<input
					value={topic}
					onChange={(e) => setTopic(e.target.value)}
					placeholder="Ex: React hooks, Python decorators..."
					className="flex-1 bg-surface border rounded px-4 py-2.5 text-text placeholder:text-muted focus:outline-none focus:border-amber transition-colors"
				/>
				<button
					type="submit"
					className="bg-amber text-background px-5 py-2.5 rounded font-medium hover:opacity-90 transition-opacity"
				>
					Gerar
				</button>
			</form>
		</div>
	);
}
