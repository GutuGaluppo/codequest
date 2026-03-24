import { generateTutorial } from "../services/aiService";
import { firestoreService } from "../services/firestoreService";
import type { ModelProvider, UserApiKeys } from "../types/tutorial";

export const tutorialQueryOptions = (
	topic: string,
	model: ModelProvider,
	userKeys: UserApiKeys,
) => ({
	queryKey: ["tutorial", topic, model],
	queryFn: () => generateTutorial(topic, model, userKeys),
	staleTime: Infinity,
	retry: false,
});

export const progressQueryOptions = (tutorialId: string, uid: string) => ({
	queryKey: ["progress", tutorialId, uid],
	queryFn: () => firestoreService.getProgress(tutorialId, uid),
	staleTime: 30_000,
});
