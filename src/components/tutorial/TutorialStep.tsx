import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type {
	ModelProvider,
	TutorialStep,
} from "../../types/tutorial";
import { MonacoWrapper } from "../editor/MonacoWrapper";
import { ChallengeBlock } from "./ChallengeBlock";
import { ConceptBlock } from "./ConceptBlock";
import { useEditorStore } from "../../stores/editorStore";

interface TutorialStepProps {
	step: TutorialStep;
	model: ModelProvider;
	monacoLanguage?: string;
	completedCode?: Record<string, string>;
	onComplete: () => void;
}

export function TutorialStepView({
	step,
	model,
	monacoLanguage,
	completedCode,
	onComplete,
}: TutorialStepProps) {
	const { setEditorCode, feedback, setFeedback, setOutput } = useEditorStore();
	const { t } = useTranslation();

	// Reset editor state whenever the step changes
	useEffect(() => {
		setFeedback(null);
		setOutput("");
	}, [step.id, setFeedback, setOutput]);

	const canAdvance = feedback?.status === "correct";

	function handleNext() {
		setFeedback(null);
		setOutput("");
		onComplete();
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-0 flex-1 min-h-0 border overflow-hidden">
			{/* Left column — instructions */}
			<AnimatePresence mode="wait">
				<motion.div
					key={step.id}
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -20 }}
					transition={{ duration: 0.2 }}
					className="flex flex-col gap-5 p-6 overflow-y-auto border-r bg-amber-50"
				>
					<h2 className="text-xl font-mono font-medium text-background">
						{step.title}
					</h2>
					<ConceptBlock concept={step.concept} />
					<span className="text-xs font-mono font-medium text-stone-400 uppercase tracking-widest">
						{t("tutorial.step.exampleLabel")}
					</span>
					<pre className="bg-white/80 border p-4 text-sm font-mono text-background overflow-x-auto shrink-0">
						{step.codeExample}
					</pre>
					<hr className="border-stone-200" />
					<ChallengeBlock challenge={step.challenge} />
					<motion.button
						onClick={handleNext}
						disabled={!canAdvance}
						whileTap={canAdvance ? { scale: 0.95 } : {}}
						whileHover={canAdvance ? { scale: 1.02 } : {}}
						className={`self-start px-5 py-2.5 font-black text-xs uppercase tracking-wide mt-auto transition-opacity ${
							canAdvance
								? "bg-green text-background"
								: "bg-green/30 text-background/50 cursor-not-allowed"
						}`}
					>
						{t("tutorial.step.nextButton")}
					</motion.button>
				</motion.div>
			</AnimatePresence>

			{/* Right column — Monaco (key forces remount on step change) */}
			<div key={step.id} className="flex flex-col min-h-0">
				<MonacoWrapper
					defaultValue={completedCode?.[step.id] ?? step.challenge.starterCode}
					onChange={setEditorCode}
					challenge={step.challenge}
					model={model}
					monacoLanguage={monacoLanguage}
				/>
			</div>
		</div>
	);
}
