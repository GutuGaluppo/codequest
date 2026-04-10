import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuth, updateProfile } from "firebase/auth";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import { firestoreService } from "../../services/firestoreService";
import type { ModelProvider, UserProfile } from "../../types/user";
import { ImageInput } from "./ImageInput";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileInputs } from "./ProfileInputs";
import { ProfileSelectInput } from "./ProfileSelectInput";

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
		onError: () => {
			toast.error(t("profile.error"));
		},
	});

	const [anthropicKey, setAnthropicKey] = useState("");
	const [openaiKey, setOpenaiKey] = useState("");
	const [preferredModel, setPreferredModel] = useState<ModelProvider>(
		profile?.preferredModel ?? "gemini",
	);

	const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
	const [photoFile, setPhotoFile] = useState<File | null>(null);
	const [photoPreview, setPhotoPreview] = useState<string | null>(
		profile?.photoURL ?? null,
	);
	const [uploading, setUploading] = useState(false);

	async function compressImage(file: File, maxPx = 800): Promise<Blob> {
		return new Promise((resolve) => {
			const img = new Image();
			const url = URL.createObjectURL(file);
			img.onload = () => {
				URL.revokeObjectURL(url);
				const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
				const canvas = document.createElement("canvas");
				canvas.width = Math.round(img.width * scale);
				canvas.height = Math.round(img.height * scale);
				canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
				canvas.toBlob((blob) => resolve(blob ?? file), "image/jpeg", 0.85);
			};
			img.src = url;
		});
	}

	async function uploadToCloudinary(file: File): Promise<string> {
		const compressed = await compressImage(file);
		const formData = new FormData();
		formData.append("file", compressed);
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

		const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
		const MAX_SIZE_MB = 5;

		if (!ALLOWED_TYPES.includes(file.type)) {
			toast.error(t("profile.photoInvalidType"));
			e.target.value = "";
			return;
		}
		if (file.size > MAX_SIZE_MB * 1024 * 1024) {
			toast.error(t("profile.photoTooLarge", { max: MAX_SIZE_MB }));
			e.target.value = "";
			return;
		}

		setPhotoFile(file);
		setPhotoPreview(URL.createObjectURL(file));
	}

	function handlePreferredModelChange(model: ModelProvider) {
		setPreferredModel(model);
	}

	async function saveKey(provider: "anthropic" | "openai", key: string) {
		const token = await getAuth().currentUser?.getIdToken();
		if (!token) return;
		const res = await fetch("/api/save-key", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ provider, key }),
		});
		if (!res.ok) {
			const body = await res.json().catch(() => ({}));
			throw new Error(body.error ?? `Failed to save ${provider} key`);
		}
	}

	async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
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

			if (anthropicKey.trim()) await saveKey("anthropic", anthropicKey.trim());
			if (openaiKey.trim()) await saveKey("openai", openaiKey.trim());

			saveProfile({ displayName, photoURL, preferredModel });
		} finally {
			setUploading(false);
		}
	}

	return (
		<div className="w-full">
			<ProfileHeader />
			<div className="max-w-7xl mx-auto px-6 py-10">
				<form onSubmit={handleSubmit} className="max-w-lg flex flex-col gap-6">
					<ImageInput
						displayName={displayName}
						photoPreview={photoPreview}
						handleFileChange={handleFileChange}
					/>

					<ProfileInputs
						displayName={displayName}
						setDisplayName={setDisplayName}
						anthropicKey={anthropicKey}
						// TODO: Create handlers to avoid passing setters directly to the component
						setAnthropicKey={setAnthropicKey}
						openaiKey={openaiKey}
						setOpenaiKey={setOpenaiKey}
					/>

					<ProfileSelectInput
						preferredModel={preferredModel}
						setPreferredModel={handlePreferredModelChange}
					/>

					<button
						type="submit"
						disabled={isPending}
						className="self-start bg-amber text-background px-5 py-2.5 font-black text-xs uppercase tracking-wide disabled:opacity-50"
					>
						{isPending || uploading
							? t("profile.buttonSaving")
							: t("profile.buttonSave")}
					</button>
				</form>
			</div>
		</div>
	);
}
