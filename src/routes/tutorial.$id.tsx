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
import { userProfileQueryOptions } from "../queries/userQueries";
import { firestoreService } from "../services/firestoreService";
import { useEditorStore } from "../stores/editorStore";

export const Route = createFileRoute("/tutorial/$id")({
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

	const { data: profile } = useQuery({
		...userProfileQueryOptions(user?.uid ?? ""),
		enabled: !!user,
	});

	const model = profile?.preferredModel ?? "gemini";
	const userKeys = profile?.apiKeys ?? {};

	const { data: tutorial, isPending: tutorialPending } = useQuery(
		tutorialQueryOptions(id, model, userKeys),
	);

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

	if (tutorialPending || !tutorial || !step)
		return (
			<div className="flex items-center justify-center min-h-[70vh]">
				<p className="text-muted font-mono text-sm">Gerando tutorial...</p>
			</div>
		);

	return (
		<div className="flex flex-col gap-3 h-[calc(100vh-5rem)] px-6 pb-4">
			<StepNav
				steps={tutorial.steps}
				currentStep={step.order}
				completedSteps={completedSteps}
				onSelectStep={setCurrentStep}
			/>
			<TutorialStepView step={step} onComplete={() => completeStep(step.id)} />
		</div>
	);
}
