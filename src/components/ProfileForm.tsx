import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ModelProvider, UserProfile } from "../types/user";
import { firestoreService } from "../services/firestoreService";
import { toast } from "sonner";
import { useState } from "react";

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
		<div className="min-h-[80vh] flex justify-center items-center">
			<div className="max-w-lg flex flex-col gap-8">
				<div>
					<h1 className="text-2xl font-mono font-medium text-text">Perfil</h1>
					<p className="text-muted text-sm mt-1">
						Gerencie suas chaves de API e modelo preferido.
					</p>
				</div>

				<form onSubmit={handleSubmit} className="flex flex-col gap-6">
					<div className="flex flex-col gap-1.5">
						<label className="text-sm font-medium text-text">
							Chave Anthropic
						</label>
						<input
							value={anthropicKey}
							type="password"
							onChange={(e) => setAnthropicKey(e.target.value)}
							placeholder="sk-ant-..."
							className="bg-surface border rounded px-4 py-2.5 text-text placeholder:text-muted focus:outline-none focus:border-amber transition-colors font-mono text-sm"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-sm font-medium text-text">
							Chave OpenAI
						</label>
						<input
							value={openaiKey}
							type="password"
							onChange={(e) => setOpenaiKey(e.target.value)}
							placeholder="sk-..."
							className="bg-surface border rounded px-4 py-2.5 text-text placeholder:text-muted focus:outline-none focus:border-amber transition-colors font-mono text-sm"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-sm font-medium text-text">
							Modelo preferido
						</label>
						<select
							value={preferredModel}
							onChange={(e) =>
								setPreferredModel(e.target.value as ModelProvider)
							}
							className="bg-surface border rounded px-4 py-2.5 text-text focus:outline-none focus:border-amber transition-colors"
						>
							<option value="gemini">Gemini (padrão)</option>
							<option value="claude">Claude</option>
							<option value="openai">OpenAI</option>
						</select>
					</div>

					<button
						type="submit"
						disabled={isPending}
						className="self-start bg-amber text-background px-5 py-2.5 rounded font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
					>
						{isPending ? "Salvando..." : "Salvar"}
					</button>
				</form>
			</div>
		</div>
	);
}
