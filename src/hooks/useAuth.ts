import { useState, useEffect } from "react";
import {
	onAuthStateChanged,
	signInWithPopup,
	GoogleAuthProvider,
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

	const signIn = async (): Promise<void> => {
		const provider = new GoogleAuthProvider();
		await signInWithPopup(auth, provider);
	};

	const signOutUser = async (): Promise<void> => {
		await signOut(auth);
	};

	return { user, loading, signIn, signOut: signOutUser };
}
