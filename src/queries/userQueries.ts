import { firestoreService } from "../services/firestoreService";

export const userProfileQueryOptions = (uid: string) => ({
	queryKey: ["user", uid],
	queryFn: () => firestoreService.getProfile(uid),
	staleTime: 5 * 60 * 1000,
	gcTime: 10 * 60 * 1000,
});
