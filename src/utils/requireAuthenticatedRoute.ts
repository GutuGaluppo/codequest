import { redirect } from "@tanstack/react-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAuthStore, type AuthRedirectTo } from "../stores/authStore";

export function requireAuthenticatedRoute(redirectTo: AuthRedirectTo) {
	return new Promise<void>((resolve, reject) => {
		const unsub = onAuthStateChanged(auth, (user) => {
			unsub();

			if (user) {
				resolve();
				return;
			}

			useAuthStore.getState().openDrawer(redirectTo);
			reject(redirect({ to: "/" }));
		});
	});
}
