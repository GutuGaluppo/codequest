import {
	arrayUnion,
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Tutorial } from "../types/tutorial";
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

	async getAllProgress(uid: string) {
		const ref = collection(db, "users", uid, "progress");
		const snap = await getDocs(ref);
		return snap.docs.map((d) => d.data());
	},

	async saveTutorial(uid: string, tutorial: Tutorial): Promise<void> {
		const ref = doc(db, "users", uid, "tutorials", tutorial.id);
		await setDoc(ref, {
			id: tutorial.id,
			topic: tutorial.topic,
			level: tutorial.level,
			generatedWith: tutorial.generatedWith,
			createdAt: serverTimestamp(),
			stepCount: tutorial.steps?.length ?? 0,
			steps: tutorial.steps,
		});
	},

	async getTutorial(uid: string, tutorialId: string): Promise<Tutorial | null> {
		const ref = doc(db, "users", uid, "tutorials", tutorialId);
		const snap = await getDoc(ref);
		return snap.exists() ? (snap.data() as Tutorial) : null;
	},

	async getUserTutorials(uid: string) {
		const ref = collection(db, "users", uid, "tutorials");
		const q = query(ref, orderBy("createdAt", "desc"));
		const snap = await getDocs(q);
		return snap.docs.map((d) => d.data());
	},

	async markStepComplete(
		tutorialId: string,
		uid: string,
		stepId: string,
	): Promise<void> {
		const ref = doc(db, "users", uid, "progress", tutorialId);
		await setDoc(
			ref,
			{
				tutorialId,
				completedSteps: arrayUnion(stepId),
				lastAccessedStep: 0,
				lastAccessedAt: serverTimestamp(),
			},
			{ merge: true },
		);
	},
};
