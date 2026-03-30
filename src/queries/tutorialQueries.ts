import { generateTutorial } from "../services/aiService";
import { firestoreService } from "../services/firestoreService";
import type { Level, ModelProvider, UserApiKeys } from "../types/tutorial";

export const tutorialQueryOptions = (
	topic: string,
	model: ModelProvider,
	userKeys: UserApiKeys,
	level: Level,
	uid?: string,
) => {
	const slug = topic.toLowerCase().replace(/\s+/g, "-");
	const tutorialId = `${slug}-${level}`;

	return {
		queryKey: ["tutorial", tutorialId],
		queryFn: async () => {
			if (uid) {
				const saved = await firestoreService.getTutorial(uid, tutorialId);
				if (saved) return saved;
			}

			const tutorial = await generateTutorial(topic, model, userKeys, level);
			if (uid) {
				await firestoreService.saveTutorial(uid, {
					...tutorial,
					id: tutorialId,
					level,
				});
			}
			return { ...tutorial, id: tutorialId, level };
		},

		staleTime: Infinity,
		retry: false,
	};
};

export const userTutorialsQueryOptions = (uid: string) => ({
	queryKey: ["tutorials", uid],
	queryFn: () => firestoreService.getUserTutorials(uid),
	staleTime: 30_000,
	enabled: !!uid,
});

export const progressQueryOptions = (tutorialId: string, uid: string) => ({
	queryKey: ["progress", tutorialId, uid],
	queryFn: () => firestoreService.getProgress(tutorialId, uid),
	staleTime: 30_000,
});
