import { CheckCircle } from "lucide-react";
import type { TutorialStep } from "../../types/tutorial";

interface StepNavProps {
	steps: TutorialStep[];
	currentStep: number;
	completedSteps: string[];
}

export function StepNav({ steps, currentStep, completedSteps }: StepNavProps) {
	return (
		<ul className="flex gap-1 overflow-x-auto">
			{steps.map((step) => {
				const isCompleted = completedSteps.includes(step.id);
				const isActive = step.order === currentStep;

				return (
					<li
						key={step.id}
						className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm whitespace-nowrap ${
							isCompleted
								? "text-green"
								: isActive
									? "text-amber border border-amber"
									: "text-muted"
						}`}
					>
						{isCompleted ? (
							<CheckCircle size={14} />
						) : (
							<span className="w-4 h-4 rounded-full border flex items-center justify-center text-xs leading-none">
								{step.order}
							</span>
						)}
						<span>{step.title}</span>
					</li>
				);
			})}
		</ul>
	);
}
