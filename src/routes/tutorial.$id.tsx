import { createFileRoute } from "@tanstack/react-router";
import { tutorialQueryOptions } from "../queries/tutorialQueries";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/tutorial/$id")({
	loader: async ({ context: { queryClient }, params }) => {
		await queryClient.ensureQueryData(
			tutorialQueryOptions(params.id, "gemini", {}),
		);
	},
	pendingComponent: () => <p>Gerando Tutorial</p>,
	component: TutorialPage,
});

function TutorialPage() {
	const { id } = Route.useParams();
	const { data } = useQuery(tutorialQueryOptions(id, "gemini", {}));

	return <div>{JSON.stringify(data, null, 2)}</div>;
}
