import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ModelProvider, UserProfile } from "../types/user";
import { firestoreService } from "../services/firestoreService";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";

export default function ProfileForm({
	uid,
	profile,
}: {
	uid: string;
	profile: UserProfile | null;
}) {
	const queryClient = useQueryClient();
	const { reloadUser } = useAuth();

	const { mutate: saveProfile, isPending } = useMutation({
		mutationFn: (data: Partial<UserProfile>) =>
			firestoreService.saveProfile(uid, data),
		onSuccess: async () => {
			await reloadUser();
			queryClient.invalidateQueries({ queryKey: ["user", uid] });
			toast.success("Perfil salvo!");
		},
		onError: (error) => {
			console.error({ error });
			toast.error("Erro ao salvar perfil.");
		},
	});

	const [anthropicKey, setAnthropicKey] = useState(
		profile?.apiKeys?.anthropic ?? "",
	);
	const [openaiKey, setOpenaiKey] = useState(profile?.apiKeys?.openai ?? "");
	const [preferredModel, setPreferredModel] = useState<ModelProvider>(
		profile?.preferredModel ?? "gemini",
	);

	const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
	const [photoFile, setPhotoFile] = useState<File | null>(null);
	const [photoPreview, setPhotoPreview] = useState<string | null>(
		profile?.photoURL ?? null,
	);
	const [uploading, setUploading] = useState(false);

	async function uploadToCloudinary(file: File): Promise<string> {
		const formData = new FormData();
		formData.append("file", file);
		formData.append(
			"upload_preset",
			import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
		);

		const res = await fetch(
			`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
			{ method: "POST", body: formData },
		);
		const data = await res.json();
		return data.secure_url;
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		setPhotoFile(file);
		setPhotoPreview(URL.createObjectURL(file));
	}

	async function handleSubmit(e: React.SubmitEvent) {
		e.preventDefault();
		setUploading(true);
		try {
			let photoURL = profile?.photoURL;

			if (photoFile) {
				photoURL = await uploadToCloudinary(photoFile);
			}

			const auth = getAuth();
			if (auth.currentUser) {
				await updateProfile(auth.currentUser, { displayName, photoURL });
			}

			saveProfile({
				displayName,
				photoURL,
				apiKeys: { anthropic: anthropicKey, openai: openaiKey },
				preferredModel,
			});
		} finally {
			setUploading(false);
		}

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
							Foto de perfil
						</label>
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 rounded-full overflow-hidden border border-border bg-surface flex items-center justify-center shrink-0">
								{photoPreview ? (
									<img
										src={photoPreview}
										alt="avatar"
										className="w-full h-full object-cover"
									/>
								) : (
									<span className="text-lg font-mono font-medium text-muted">
										{displayName?.charAt(0).toUpperCase() ?? "?"}
									</span>
								)}
							</div>
							<label className="cursor-pointer text-sm text-muted hover:text-text transition-colors">
								Alterar foto
								<input
									type="file"
									accept="image/*"
									onChange={handleFileChange}
									className="hidden"
								/>
							</label>
						</div>
					</div>
					<div className="flex flex-col gap-1.5">
						<label className="text-sm font-medium text-text">Nome</label>
						<input
							value={displayName}
							onChange={(e) => setDisplayName(e.target.value)}
							placeholder="Seu nome"
							className="bg-surface border rounded px-4 py-2.5 text-text placeholder:text-muted focus:outline-none focus:border-amber transition-colors text-sm"
						/>
					</div>

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
						{isPending || uploading ? "Salvando..." : "Salvar"}
					</button>
				</form>
			</div>
		</div>
	);
}
