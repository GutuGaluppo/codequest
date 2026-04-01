// @refresh reset

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ErrorScreen } from "../components/ErrorScreen";
import { TutorialSkeleton } from "../components/tutorial/TutorialSkeleton";
import { TutorialStepView } from "../components/tutorial/TutorialStep";
import { useAuth } from "../hooks/useAuth";
import { useProgressSync } from "../hooks/useProgressSync";
import i18n from "../i18n";
import {
	progressQueryOptions,
	tutorialQueryOptions,
} from "../queries/tutorialQueries";
import { userProfileQueryOptions } from "../queries/userQueries";
import { firestoreService } from "../services/firestoreService";
import { useEditorStore } from "../stores/editorStore";
import { useTutorialNavStore } from "../stores/tutorialNavStore";
import type { Level } from "../types/tutorial";
import { detectLanguage } from "../utils/detectLanguage";
import { TutorialIntro } from "../components/tutorial/TutorialIntro";

export const Route = createFileRoute("/tutorial/$id")({
	validateSearch: (search: Record<string, unknown>) => ({
		level: (search.level as Level) || "beginner",
	}),
	pendingComponent: () => (
		<p className="text-muted p-8">{i18n.t("tutorial.pending")}</p>
	),
	errorComponent: ({ error, reset }) => (
		<ErrorScreen error={error} reset={reset} />
	),
	component: TutorialPage,
});

function TutorialPage() {
	const { id } = Route.useParams();
	const { level } = Route.useSearch();
	const { user, loading } = useAuth();
	const { currentStep, setCurrentStep } = useEditorStore();
	const queryClient = useQueryClient();
	const { t } = useTranslation();
	const setSteps = useTutorialNavStore((s) => s.setSteps);
	const setCompletedSteps = useTutorialNavStore((s) => s.setCompletedSteps);
	const clear = useTutorialNavStore((s) => s.clear);
	const showIntro = useEditorStore((s) => s.showIntro);
	const setShowIntro = useEditorStore((s) => s.setShowIntro);

	const slug = id.toLowerCase().replace(/\s+/g, "-");
	const tutorialId = `${slug}-${level}`;

	const { data: profile } = useQuery({
		...userProfileQueryOptions(user?.uid ?? ""),
		enabled: !!user,
	});

	const model = profile?.preferredModel ?? "gemini";
	const userKeys = profile?.apiKeys ?? {};

	const {
		data: tutorial,
		isPending: tutorialPending,
		isError,
		error: tutorialError,
	} = useQuery({
		...tutorialQueryOptions(
			id,
			model,
			userKeys,
			level,
			i18n.language,
			user?.uid,
		),
		enabled: !loading,
	});

	const { data: progress } = useQuery({
		...progressQueryOptions(tutorialId, user?.uid ?? ""),
		enabled: !!user,
	});

	if (isError) throw tutorialError;

	useProgressSync(tutorialId, user?.uid ?? "");

	const completedSteps = (progress?.completedSteps as string[]) ?? [];

	// Sync steps and completedSteps to the Header store
	useEffect(() => {
		if (tutorial?.steps) setSteps(tutorial.steps);
	}, [tutorial?.steps, setSteps]);

	useEffect(() => {
		setCompletedSteps(completedSteps);
	}, [completedSteps, setCompletedSteps]);

	// Clear Header store on unmount
	useEffect(() => {
		return () => clear();
	}, [clear]);

	useEffect(() => {
		if (tutorial && user?.uid) {
			queryClient.invalidateQueries({ queryKey: ["tutorials", user.uid] });
		}
	}, [tutorial?.id, user?.uid]);

	const step = tutorial?.steps?.[currentStep];

	const { mutate: completeStep } = useMutation({
		mutationFn: (stepId: string) =>
			firestoreService.markStepComplete(tutorialId, user!.uid, stepId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["progress", tutorialId, user?.uid],
			});
			toast.success(t("tutorial.stepComplete.success"));
			if (currentStep < (tutorial?.steps?.length ?? 1) - 1) {
				setCurrentStep(currentStep + 1);
			}
		},
		onError: () => toast.error(t("tutorial.stepComplete.error")),
	});

	const monacoLanguage = detectLanguage(tutorial?.topic ?? id);

	if (tutorialPending || !tutorial) return <TutorialSkeleton />;
	if (showIntro)
		return (
			<TutorialIntro tutorial={tutorial} onStart={() => setShowIntro(false)} />
		);
	if (!step) return <TutorialSkeleton />;

	return (
		<div className="flex flex-col h-[calc(100vh-60px)] px-6 pb-4">
			<TutorialStepView
				step={step}
				model={model}
				userKeys={userKeys}
				monacoLanguage={monacoLanguage}
				onComplete={() => completeStep(step.id)}
			/>
		</div>
	);
}
