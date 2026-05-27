import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getAuth } from "firebase/auth";
import { userProfileQueryOptions } from "../queries/userQueries";
import ProfileForm from "../components/profile";
import { requireAuthenticatedRoute } from "../utils/requireAuthenticatedRoute";

export const Route = createFileRoute("/profile")({
	beforeLoad: () => requireAuthenticatedRoute("/profile"),

	component: ProfilePage,
});

function ProfilePage() {
	const uid = getAuth().currentUser!.uid;
	const { data: profile, isPending } = useQuery(userProfileQueryOptions(uid));

	if (isPending) return <p>Loading...</p>;

	return <ProfileForm uid={uid} profile={profile ?? null} />;
}
