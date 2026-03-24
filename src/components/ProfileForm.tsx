import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ModelProvider, UserProfile } from "../types/user";
import { firestoreService } from "../services/firestoreService";
import { toast } from "sonner";
import { useState } from "react";

import { getDatabase, ref, set } from "firebase/database";

const db = getDatabase();
set(ref(db, "test"), {
	status: "ok",
});

export default function ProfileForm({
	uid,
	profile,
}: {
	uid: string;
	profile: UserProfile | null;
}) {
	const queryClient = useQueryClient();

	const { mutate: saveProfile, isPending } = useMutation({
		mutationFn: (data: Partial<UserProfile>) =>
			firestoreService.saveProfile(uid, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user", uid] });
			toast.success("Profile Saved");
		},
		onError: (error) => {
			console.error({ error });
			toast.error("Error on save profile");
		},
	});

	const [anthropicKey, setAnthropicKey] = useState(
		profile?.apiKeys?.anthropic ?? "",
	);
	const [openaiKey, setOpenaiKey] = useState(profile?.apiKeys?.openai ?? "");
	const [preferredModel, setPreferredModel] = useState<ModelProvider>(
		profile?.preferredModel ?? "gemini",
	);

	function handleSubmit(e: React.SubmitEvent) {
		e.preventDefault();
		saveProfile({
			apiKeys: { anthropic: anthropicKey, openai: openaiKey },
			preferredModel,
		});
	}

	return (
		<form onSubmit={handleSubmit}>
			<input
				value={anthropicKey}
				onChange={(e) => setAnthropicKey(e.target.value)}
				placeholder="Chave Anthropic (sk-ant-...)"
			/>
			<input
				value={openaiKey}
				onChange={(e) => setOpenaiKey(e.target.value)}
				placeholder="Chave OpenAI (sk-...)"
			/>
			<select
				value={preferredModel}
				onChange={(e) => setPreferredModel(e.target.value as ModelProvider)}
			>
				<option value="gemini">Gemini (padrão)</option>
				<option value="claude">Claude</option>
				<option value="openai">OpenAI</option>
			</select>
			<button type="submit" disabled={isPending}>
				{isPending ? "Salvando..." : "Salvar"}
			</button>
		</form>
	);
}
