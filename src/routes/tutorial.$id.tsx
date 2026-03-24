// @refresh reset

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { StepNav } from "../components/tutorial/StepNav";
import { TutorialStepView } from "../components/tutorial/TutorialStep";
import { useAuth } from "../hooks/useAuth";
import { useProgressSync } from "../hooks/useProgressSync";
import {
	progressQueryOptions,
	tutorialQueryOptions,
} from "../queries/tutorialQueries";
import { firestoreService } from "../services/firestoreService";
import { useEditorStore } from "../stores/editorStore";

export const Route = createFileRoute("/tutorial/$id")({
	loader: async ({ context: { queryClient }, params }) => {
		await queryClient.ensureQueryData(
			tutorialQueryOptions(params.id, "gemini", {}),
		);
	},
	pendingComponent: () => <p>Gerando Tutorial</p>,
	errorComponent: ({ error }) => (
		<div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-center">
			<p className="text-muted">Não foi possível gerar o tutorial.</p>
			<p className="text-sm text-muted font-mono">{String(error)}</p>
		</div>
	),

	component: TutorialPage,
});

function TutorialPage() {
	const { id } = Route.useParams();
	const { user } = useAuth();
	const { currentStep, setCurrentStep } = useEditorStore();
	const queryClient = useQueryClient();

	const { data: tutorial } = useQuery(tutorialQueryOptions(id, "gemini", {}));
	const { data: progress } = useQuery({
		...progressQueryOptions(id, user?.uid ?? ""),
		enabled: !!user,
	});

	useProgressSync(id, user?.uid ?? "");

	const completedSteps = (progress?.completedSteps as string[]) ?? [];
	const step = tutorial?.steps[currentStep];

	const { mutate: completeStep } = useMutation({
		mutationFn: (stepId: string) =>
			firestoreService.markStepComplete(id, user!.uid, stepId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["progress", id, user?.uid] });
			toast.success("Step concluído!");
			if (currentStep < (tutorial?.steps.length ?? 1) - 1) {
				setCurrentStep(currentStep + 1);
			}
		},
		onError: () => toast.error("Erro ao salvar progresso."),
	});

	if (!tutorial || !step) return null;

	return (
		<div className="flex flex-col gap-4">
			<StepNav
				steps={tutorial.steps}
				currentStep={step.order}
				completedSteps={completedSteps}
			/>
			<TutorialStepView step={step} onComplete={() => completeStep(step.id)} />
		</div>
	);
}
