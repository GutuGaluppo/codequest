import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { UserProfile } from "../types/user";
import { getAuth } from "firebase/auth";

export const firestoreService = {
	async getProfile(uid: string): Promise<UserProfile | null> {
		const ref = doc(db, "users", uid);
		const snap = await getDoc(ref);
		return snap.exists() ? (snap.data() as UserProfile) : null;
	},

	async saveProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
		const ref = doc(db, "users", uid);
		const snap = await getDoc(ref);

		const base = snap.exists()
			? {}
			: {
					uid,
					email: getAuth().currentUser?.email ?? "",
					createdAt: serverTimestamp(),
				};

		await setDoc(ref, { ...base, ...data }, { merge: true });
	},

	async getProgress(tutorialId: string, uid: string) {
		const ref = doc(db, "users", uid, "progress", tutorialId);
		const snap = await getDoc(ref);
		return snap.exists() ? snap.data() : null;
	},
};
