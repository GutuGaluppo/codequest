import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuth, updateProfile } from "firebase/auth";
import { Camera } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import { firestoreService } from "../../services/firestoreService";
import type { ModelProvider, UserProfile } from "../../types/user";
import { AvatarCropper } from "./AvatarCropper";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileInputs } from "./ProfileInputs";

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
	const cloudinaryCloudName =
		import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim() ?? "";
	const cloudinaryUploadPreset =
		import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim() ?? "";

	const { mutateAsync: saveProfile, isPending } = useMutation({
		mutationFn: (data: Partial<UserProfile>) =>
			firestoreService.saveProfile(uid, data),
		onSuccess: async () => {
			await reloadUser();
			queryClient.invalidateQueries({ queryKey: ["user", uid] });
			toast.success(t("profile.success"));
		},
	});

	const [preferredModel, setPreferredModel] = useState<ModelProvider>(
		profile?.preferredModel ?? "gemini",
	);
	const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
	const [anthropicKey, setAnthropicKey] = useState("");
	const [openaiKey, setOpenaiKey] = useState("");
	const [geminiKey, setGeminiKey] = useState("");
	const [otherKey, setOtherKey] = useState("");
	const [otherModelName, setOtherModelName] = useState(
		profile?.otherModel?.name ?? "",
	);
	const [otherBaseUrl, setOtherBaseUrl] = useState(
		profile?.otherModel?.baseUrl ?? "",
	);
	const [savedPhotoUrl, setSavedPhotoUrl] = useState<string | null>(
		profile?.photoURL ?? null,
	);
	const [uploading, setUploading] = useState(false);
	const [cropperOpen, setCropperOpen] = useState(false);

	useEffect(() => {
		setSavedPhotoUrl(profile?.photoURL ?? null);
	}, [profile?.photoURL]);

	useEffect(() => {
		setPreferredModel(profile?.preferredModel ?? "gemini");
	}, [profile?.preferredModel]);

	useEffect(() => {
		setDisplayName(profile?.displayName ?? "");
	}, [profile?.displayName]);

	useEffect(() => {
		setOtherModelName(profile?.otherModel?.name ?? "");
		setOtherBaseUrl(profile?.otherModel?.baseUrl ?? "");
	}, [profile?.otherModel?.name, profile?.otherModel?.baseUrl]);

	async function uploadToCloudinary(file: Blob): Promise<string> {
		if (!cloudinaryCloudName || !cloudinaryUploadPreset) {
			throw new Error(t("profile.photoUploadNotConfigured"));
		}

		const formData = new FormData();
		formData.append("file", file, "avatar.png");
		formData.append("upload_preset", cloudinaryUploadPreset);

		const res = await fetch(
			`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
			{ method: "POST", body: formData },
		);

		const data = await res.json().catch(() => null);
		if (!res.ok) {
			const cloudinaryMessage =
				typeof data?.error?.message === "string" ? data.error.message : null;
			throw new Error(
				cloudinaryMessage
					? t("profile.photoUploadFailedWithReason", {
							reason: cloudinaryMessage,
						})
					: t("profile.photoUploadFailed"),
			);
		}

		if (typeof data?.secure_url !== "string" || data.secure_url.length === 0) {
			throw new Error(t("profile.photoUploadFailed"));
		}

		return data.secure_url;
	}

	async function saveKey(
		provider: "anthropic" | "openai" | "gemini" | "other",
		key: string,
		extra?: { modelName: string; baseUrl: string },
	) {
		const token = await getAuth().currentUser?.getIdToken();
		if (!token) return;
		const res = await fetch("/api/save-key", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ provider, key, ...extra }),
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
			const photoURL = savedPhotoUrl ?? profile?.photoURL;

			const auth = getAuth();
			if (auth.currentUser) {
				await updateProfile(auth.currentUser, { displayName, photoURL });
			}

			if (anthropicKey.trim()) await saveKey("anthropic", anthropicKey.trim());
			if (openaiKey.trim()) await saveKey("openai", openaiKey.trim());
			if (geminiKey.trim()) await saveKey("gemini", geminiKey.trim());
			if (otherKey.trim()) {
				await saveKey("other", otherKey.trim(), {
					modelName: otherModelName.trim(),
					baseUrl: otherBaseUrl.trim(),
				});
			}

			const profileData: Partial<UserProfile> = {
				displayName,
				photoURL,
				preferredModel,
			};
			if (preferredModel === "other" && otherModelName && otherBaseUrl) {
				profileData.otherModel = {
					name: otherModelName.trim(),
					baseUrl: otherBaseUrl.trim(),
				};
			}

			try {
				await saveProfile(profileData);
			} catch {
				toast.error(t("profile.error"));
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error(t("profile.error"));
			}
		} finally {
			setUploading(false);
		}
	}

	return (
		<div className="w-full">
			<ProfileHeader />
			<AvatarCropper
				open={cropperOpen}
				canUpload={!!cloudinaryCloudName && !!cloudinaryUploadPreset}
				disabled={isPending || uploading}
				displayName={displayName}
				currentPreview={savedPhotoUrl}
				onClose={() => setCropperOpen(false)}
				onSave={async ({ blob }) => {
					setUploading(true);
					try {
						const photoURL = await uploadToCloudinary(blob);
						const auth = getAuth();
						if (auth.currentUser) {
							await updateProfile(auth.currentUser, { photoURL });
						}

						try {
							await saveProfile({ photoURL });
						} catch {
							toast.error(t("profile.error"));
							throw new Error("profile-save-failed");
						}

						setSavedPhotoUrl(photoURL);
					} catch (error) {
						if (
							error instanceof Error &&
							error.message !== "profile-save-failed"
						) {
							toast.error(error.message);
						} else if (!(error instanceof Error)) {
							toast.error(t("profile.error"));
						}
						throw error;
					} finally {
						setUploading(false);
					}
				}}
			/>
			<div className="px-6 py-10">
				<div className="mx-auto flex min-h-[calc(100vh-17rem)] max-w-5xl items-center justify-center">
					<form
						onSubmit={handleSubmit}
						className="flex w-full max-w-xl flex-col gap-6 border border-border bg-surface/40 p-6 sm:p-8"
					>
						<div className="flex justify-center">
							<button
								type="button"
								onClick={() => setCropperOpen(true)}
								aria-label={t("profile.photoEditButton")}
								title={t("profile.photoEditButton")}
								className="group relative h-24 w-24 shrink-0 rounded-full border border-border bg-surface"
							>
								{savedPhotoUrl ? (
									<img
										src={savedPhotoUrl}
										alt={t("profile.photoPreviewLabel")}
										className="h-full w-full object-cover"
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center text-2xl font-mono text-muted">
										{displayName?.charAt(0).toUpperCase() ?? "?"}
									</div>
								)}
								<span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-amber text-background shadow-sm transition-transform group-hover:scale-105">
									<Camera size={15} strokeWidth={2.25} />
								</span>
							</button>
						</div>

						<ProfileInputs
							displayName={displayName}
							setDisplayName={setDisplayName}
							preferredModel={preferredModel}
							onModelChange={setPreferredModel}
							configuredKeys={profile?.configuredKeys}
							otherModel={profile?.otherModel}
							anthropicKey={anthropicKey}
							setAnthropicKey={setAnthropicKey}
							openaiKey={openaiKey}
							setOpenaiKey={setOpenaiKey}
							geminiKey={geminiKey}
							setGeminiKey={setGeminiKey}
							otherKey={otherKey}
							setOtherKey={setOtherKey}
							otherModelName={otherModelName}
							setOtherModelName={setOtherModelName}
							otherBaseUrl={otherBaseUrl}
							setOtherBaseUrl={setOtherBaseUrl}
						/>

						<button
							type="submit"
							disabled={isPending || uploading}
							className="self-start bg-amber text-background px-5 py-2.5 font-black text-xs uppercase tracking-wide disabled:opacity-50"
						>
							{isPending || uploading
								? t("profile.buttonSaving")
								: t("profile.buttonSave")}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
