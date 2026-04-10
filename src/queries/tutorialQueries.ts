import { generateTutorial } from "../services/aiService";
import { firestoreService } from "../services/firestoreService";
import type { Level, ModelProvider } from "../types/tutorial";

export const tutorialQueryOptions = (
	topic: string,
	model: ModelProvider,
	level: Level,
	language: string,
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

			const tutorial = await generateTutorial(
				topic,
				model,
				level,
				language,
			);
			if (uid) {
				await firestoreService.saveTutorial(uid, {
					...tutorial,
					id: tutorialId,
					level,
				});
			}
			return { ...tutorial, id: tutorialId, level };
		},

		staleTime: 24 * 60 * 60 * 1000, // 24h — tutoriais são cacheados localmente, mas expiram diariamente
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

export const allProgressQueryOptions = (uid: string) => ({
	queryKey: ["progress", "all", uid],
	queryFn: () => firestoreService.getAllProgress(uid),
	staleTime: 30_000,
});
