import { useEditorStore } from "../../stores/editorStore";
import type { TutorialStep } from "../../types/tutorial";
import { MonacoWrapper } from "../editor/MonacoWrapper";
import { ChallengeBlock } from "./ChallengeBlock";
import { ConceptBlock } from "./ConceptBlock";

interface TutorialStepProps {
	step: TutorialStep;
	onComplete: () => void;
}

export function TutorialStepView({ step, onComplete }: TutorialStepProps) {
	const { setEditorCode } = useEditorStore();

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
			{/* Coluna esquerda */}
			<div className="flex flex-col gap-6 overflow-y-auto pr-2">
				<h2 className="text-xl font-mono font-medium text-text">
					{step.title}
				</h2>
				<ConceptBlock concept={step.concept} />
				<pre className="bg-surface border rounded p-4 text-sm font-mono text-text overflow-x-auto">
					{step.codeExample}
				</pre>
				<ChallengeBlock challenge={step.challenge} />
				<button
					onClick={onComplete}
					className="self-start bg-green text-background px-5 py-2.5 rounded font-medium hover:opacity-90 transition-opacity"
				>
					Concluir step
				</button>
			</div>

			{/* Coluna direita */}
			<div className="border rounded overflow-hidden">
				<MonacoWrapper
					defaultValue={step.challenge.starterCode}
					onChange={setEditorCode}
				/>
			</div>
		</div>
	);
}
