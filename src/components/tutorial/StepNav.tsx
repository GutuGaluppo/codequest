import { CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import type { TutorialStep } from "../../types/tutorial";

interface StepNavProps {
	steps: TutorialStep[];
	currentStep: number;
	completedSteps: string[];
	onSelectStep: (stepIndex: number) => void;
}

export function StepNav({ steps, currentStep, completedSteps, onSelectStep }: StepNavProps) {
	return (
		<ul className="flex gap-1">
			{steps.map((step) => {
				const isCompleted = completedSteps.includes(step.id);
				const isActive = step.order === currentStep;

				return (
					<motion.li
						key={step.id}
						initial={false}
						animate={{ width: 32 }}
						whileHover={{ width: "auto" }}
						transition={{ duration: 0.2 }}
						onClick={() => (isCompleted || isActive) && onSelectStep(step.order - 1)}
						className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm whitespace-nowrap overflow-hidden ${
							isCompleted
								? "text-green cursor-pointer"
								: isActive
									? "text-amber border border-amber"
									: "text-muted"
						}`}
					>
						{isCompleted ? (
							<CheckCircle size={14} className="shrink-0" />
						) : (
							<span className="w-4 h-4 rounded-full border flex items-center justify-center text-xs leading-none shrink-0">
								{step.order}
							</span>
						)}
						<span>{step.title}</span>
					</motion.li>
				);
			})}
		</ul>
	);
}
