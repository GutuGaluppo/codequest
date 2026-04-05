import { CheckCircle } from "lucide-react";
import type { TutorialStep } from "../../types/tutorial";

interface StepNavProps {
	steps: TutorialStep[];
	currentStep: number;
	completedSteps: string[];
	onSelectStep: (stepIndex: number) => void;
}

export function StepNav({
	steps,
	currentStep,
	completedSteps,
	onSelectStep,
}: StepNavProps) {
	return (
		<ul className="flex gap-1">
			{steps.map((step) => {
				const isCompleted = completedSteps.includes(step.id);
				const isActive = step.order - 1 === currentStep;

				return (
						<li
						key={step.id}
						onClick={() =>
							(isCompleted || isActive) && onSelectStep(step.order - 1)
						}
						className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm whitespace-nowrap overflow-hidden transition-opacity ${
							isCompleted
								? "text-green cursor-pointer hover:opacity-70"
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
						{isActive && <span>{step.title}</span>}
					</li>
				);
			})}
		</ul>
	);
}
