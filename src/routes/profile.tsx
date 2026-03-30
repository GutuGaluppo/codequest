import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { userProfileQueryOptions } from "../queries/userQueries";
import ProfileForm from "../components/profile";
import { auth } from "../lib/firebase";

export const Route = createFileRoute("/profile")({
	beforeLoad: () =>
		new Promise<void>((resolve, reject) => {
			const unsub = onAuthStateChanged(auth, (user) => {
				unsub();
				if (!user) reject(redirect({ to: "/" }));
				else resolve();
			});
		}),

	component: ProfilePage,
});

function ProfilePage() {
	const uid = getAuth().currentUser!.uid;
	const { data: profile, isPending } = useQuery(userProfileQueryOptions(uid));

	if (isPending) return <p>Loading...</p>;

	return <ProfileForm uid={uid} profile={profile ?? null} />;
}
