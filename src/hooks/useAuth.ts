import { useState, useEffect } from "react";
import {
	onAuthStateChanged,
	signInWithPopup,
	GoogleAuthProvider,
	GithubAuthProvider,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
	signOut,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../lib/firebase";

export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
			setUser(firebaseUser);
			setLoading(false);
		});

		return unsubscribe;
	}, []);

	const signInWithGoogle = async (): Promise<void> => {
		await signInWithPopup(auth, new GoogleAuthProvider());
	};

	const signInWithGitHub = async (): Promise<void> => {
		await signInWithPopup(auth, new GithubAuthProvider());
	};

	const signInWithEmail = async (
		email: string,
		password: string,
	): Promise<void> => {
		await signInWithEmailAndPassword(auth, email, password);
	};

	const signUpWithEmail = async (
		name: string,
		email: string,
		password: string,
	): Promise<void> => {
		const { user } = await createUserWithEmailAndPassword(
			auth,
			email,
			password,
		);
		await updateProfile(user, { displayName: name });
	};

	const signOutUser = async (): Promise<void> => {
		await signOut(auth);
	};

	const reloadUser = async (): Promise<void> => {
		await auth.currentUser?.reload();
		setUser(auth.currentUser);
	};

	return {
		user,
		loading,
		signInWithGoogle,
		signInWithGitHub,
		signInWithEmail,
		signUpWithEmail,
		signOut: signOutUser,
		reloadUser,
	};
}
