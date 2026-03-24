import { AnimatePresence, motion } from "motion/react";
import type { TutorialStep } from "../../types/tutorial";
import { MonacoWrapper } from "../editor/MonacoWrapper";
import { ChallengeBlock } from "./ChallengeBlock";
import { ConceptBlock } from "./ConceptBlock";
import { useEditorStore } from "../../stores/editorStore";

interface TutorialStepProps {
	step: TutorialStep;
	onComplete: () => void;
}

export function TutorialStepView({ step, onComplete }: TutorialStepProps) {
	const { setEditorCode } = useEditorStore();

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-0 flex-1 min-h-0 border rounded overflow-hidden">
			{/* Coluna esquerda */}
			<AnimatePresence mode="wait">
				<motion.div
					key={step.id}
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -20 }}
					transition={{ duration: 0.2 }}
					className="flex flex-col gap-5 p-6 overflow-y-auto border-r"
				>
					<h2 className="text-xl font-mono font-medium text-text">
						{step.title}
					</h2>
					<ConceptBlock concept={step.concept} />
					<pre className="bg-surface border rounded p-4 text-sm font-mono text-text overflow-x-auto shrink-0">
						{step.codeExample}
					</pre>
					<ChallengeBlock challenge={step.challenge} />
					<motion.button
						onClick={onComplete}
						whileTap={{ scale: 0.95 }}
						whileHover={{ scale: 1.02 }}
						className="self-start bg-green text-background px-5 py-2.5 rounded font-medium mt-auto"
					>
						Concluir step
					</motion.button>
				</motion.div>
			</AnimatePresence>

			{/* Coluna direita */}
			<div className="flex flex-col min-h-0">
				<MonacoWrapper
					defaultValue={step.challenge.starterCode}
					onChange={setEditorCode}
					challenge={step.challenge}
				/>
			</div>
		</div>
	);
}
