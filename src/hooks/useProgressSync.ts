import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export function useProgressSync(tutorialId: string, uid: string) {
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!uid) return;
		const ref = doc(db, "users", uid, "progress", tutorialId);
		const unsubscribe = onSnapshot(
			ref,
			() => {
				queryClient.invalidateQueries({
					queryKey: ["progress", tutorialId, uid],
				});
			},
			(error) => {
				console.error("[useProgressSync] onSnapshot error:", error.message);
			},
		);
		return unsubscribe;
	}, [tutorialId, uid, queryClient]);
}
