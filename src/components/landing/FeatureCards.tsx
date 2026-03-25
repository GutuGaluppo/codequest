import { Code, Zap, TrendingUp } from "lucide-react";

const FEATURES = [
	{
		icon: <Code size={22} className="text-amber" />,
		title: "Editor Interativo",
		description: "Escreva e teste código diretamente no browser com feedback em tempo real.",
	},
	{
		icon: <Zap size={22} className="text-amber" />,
		title: "Gerado por AI",
		description: "Tutoriais personalizados para o seu tópico, do básico ao avançado.",
	},
	{
		icon: <TrendingUp size={22} className="text-amber" />,
		title: "Aprendizado Progressivo",
		description: "A dificuldade aumenta gradualmente, garantindo uma curva de aprendizado suave.",
	},
];

export function FeatureCards() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mt-4">
			{FEATURES.map((f) => (
				<div key={f.title} className="border border-border rounded-lg p-5 text-left flex flex-col gap-3 bg-surface/30">
					{f.icon}
					<div>
						<h3 className="font-mono font-medium text-text">{f.title}</h3>
						<p className="text-sm text-muted mt-1">{f.description}</p>
					</div>
				</div>
			))}
		</div>
	);
}
