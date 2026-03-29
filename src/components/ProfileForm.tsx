import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ModelProvider, UserProfile } from "../types/user";
import { firestoreService } from "../services/firestoreService";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { useTranslation } from "react-i18next";

export default function ProfileForm({
	uid,
	profile,
}: {
	uid: string;
	profile: UserProfile | null;
}) {
	const queryClient = useQueryClient();
	const { reloadUser } = useAuth();
	const { t } = useTranslation();

	const { mutate: saveProfile, isPending } = useMutation({
		mutationFn: (data: Partial<UserProfile>) =>
			firestoreService.saveProfile(uid, data),
		onSuccess: async () => {
			await reloadUser();
			queryClient.invalidateQueries({ queryKey: ["user", uid] });
			toast.success(t("profile.success"));
		},
		onError: (error) => {
			console.error({ error });
			toast.error(t("profile.error"));
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
		<div className="w-full">
			<section className="border-b border-border">
				<div className="max-w-7xl mx-auto px-6 py-10">
					<span className="text-xs font-mono text-muted uppercase tracking-widest">
						{t("profile.subtitle")}
					</span>
					<h1 className="text-4xl font-black uppercase text-text mt-1 leading-none">
						{t("profile.title")}
					</h1>
				</div>
			</section>

			<div className="max-w-7xl mx-auto px-6 py-10">
				<form onSubmit={handleSubmit} className="max-w-lg flex flex-col gap-6">
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-mono uppercase tracking-widest text-muted">
							{t("profile.photoLabel")}
						</label>
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 overflow-hidden border border-border bg-surface flex items-center justify-center shrink-0">
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
							<label className="cursor-pointer text-xs font-mono text-muted hover:text-text transition-colors uppercase tracking-widest">
								{t("profile.photoChangeLabel")}
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
						<label className="text-xs font-mono uppercase tracking-widest text-muted">
							{t("profile.nameLabel")}
						</label>
						<input
							value={displayName}
							onChange={(e) => setDisplayName(e.target.value)}
							placeholder={t("profile.namePlaceholder")}
							className="bg-surface border border-border px-4 py-2.5 text-text placeholder:text-muted focus:outline-none focus:border-amber transition-colors text-sm"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-mono uppercase tracking-widest text-muted">
							{t("profile.anthropicKeyLabel")}
						</label>
						<input
							value={anthropicKey}
							type="password"
							onChange={(e) => setAnthropicKey(e.target.value)}
							placeholder={t("profile.anthropicKeyPlaceholder")}
							className="bg-surface border border-border px-4 py-2.5 text-text placeholder:text-muted focus:outline-none focus:border-amber transition-colors font-mono text-sm"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-mono uppercase tracking-widest text-muted">
							{t("profile.openaiKeyLabel")}
						</label>
						<input
							value={openaiKey}
							type="password"
							onChange={(e) => setOpenaiKey(e.target.value)}
							placeholder={t("profile.openaiKeyPlaceholder")}
							className="bg-surface border border-border px-4 py-2.5 text-text placeholder:text-muted focus:outline-none focus:border-amber transition-colors font-mono text-sm"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-mono uppercase tracking-widest text-muted">
							{t("profile.modelLabel")}
						</label>
						<select
							value={preferredModel}
							onChange={(e) =>
								setPreferredModel(e.target.value as ModelProvider)
							}
							className="bg-surface border border-border px-4 py-2.5 text-text focus:outline-none focus:border-amber transition-colors"
						>
							<option value="gemini">{t("profile.modelOptionGemini")}</option>
							<option value="claude">{t("profile.modelOptionClaude")}</option>
							<option value="openai">{t("profile.modelOptionOpenai")}</option>
						</select>
					</div>

					<button
						type="submit"
						disabled={isPending}
						className="self-start bg-amber text-background px-5 py-2.5 font-black text-xs uppercase tracking-wide disabled:opacity-50"
					>
						{isPending || uploading ? t("profile.buttonSaving") : t("profile.buttonSave")}
					</button>
				</form>
			</div>
		</div>
	);
}
