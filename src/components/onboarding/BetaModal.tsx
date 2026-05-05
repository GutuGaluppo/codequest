import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import { useNavigate } from "@tanstack/react-router";
import { X, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useBetaModalStore } from "../../stores/betaModalStore";
import { useAuth } from "../../hooks/useAuth";
import { userProfileQueryOptions } from "../../queries/userQueries";
import { ApiKeyInputs } from "../profile/ApiKeyInputs";
import { firestoreService } from "../../services/firestoreService";
import type { ModelProvider } from "../../types/tutorial";

export function BetaModal() {
	const { open, pendingNav, closeModal } = useBetaModalStore();
	const { user } = useAuth();
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { data: profile } = useQuery({
		...userProfileQueryOptions(user?.uid ?? ""),
		enabled: !!user?.uid,
	});

	const [preferredModel, setPreferredModel] = useState<ModelProvider>("gemini");
	const [anthropicKey, setAnthropicKey] = useState("");
	const [openaiKey, setOpenaiKey] = useState("");
	const [geminiKey, setGeminiKey] = useState("");
	const [otherKey, setOtherKey] = useState("");
	const [otherModelName, setOtherModelName] = useState("");
	const [otherBaseUrl, setOtherBaseUrl] = useState("");
	const [saving, setSaving] = useState(false);

	function resetState() {
		setAnthropicKey("");
		setOpenaiKey("");
		setGeminiKey("");
		setOtherKey("");
		setOtherModelName("");
		setOtherBaseUrl("");
		setSaving(false);
	}

	function handleClose() {
		resetState();
		closeModal();
	}

	function getKeyForModel(): { provider: "anthropic" | "openai" | "gemini" | "other"; key: string } | null {
		if (preferredModel === "claude" && anthropicKey.trim()) return { provider: "anthropic", key: anthropicKey.trim() };
		if (preferredModel === "openai" && openaiKey.trim()) return { provider: "openai", key: openaiKey.trim() };
		if (preferredModel === "gemini" && geminiKey.trim()) return { provider: "gemini", key: geminiKey.trim() };
		if (preferredModel === "other" && otherKey.trim()) return { provider: "other", key: otherKey.trim() };
		return null;
	}

	async function handleSave() {
		const entry = getKeyForModel();
		if (!entry) return;

		const token = await getAuth().currentUser?.getIdToken();
		if (!token || !user) return;

		setSaving(true);
		try {
			const body: Record<string, string> = { provider: entry.provider, key: entry.key };
			if (entry.provider === "other") {
				body.modelName = otherModelName.trim();
				body.baseUrl = otherBaseUrl.trim();
			}

			const res = await fetch("/api/save-key", {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				body: JSON.stringify(body),
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.error ?? "Failed to save key");
			}

			await firestoreService.saveProfile(user.uid, { preferredModel });
			await queryClient.invalidateQueries({ queryKey: ["user", user.uid] });

			resetState();
			closeModal();

			if (pendingNav) {
				navigate({
					to: "/tutorial/$id",
					params: { id: pendingNav.topic },
					search: { level: pendingNav.level },
				});
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : t("betaModal.errorSaving"));
		} finally {
			setSaving(false);
		}
	}

	const canSave = !!getKeyForModel() &&
		(preferredModel !== "other" || (otherModelName.trim().length > 0 && otherBaseUrl.trim().length > 0));

	return (
		<AnimatePresence>
			{open && (
				<>
					<motion.div
						key="beta-overlay"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={handleClose}
						className="fixed inset-0 bg-black/60 z-40"
					/>
					<motion.div
						key="beta-modal"
						initial={{ opacity: 0, scale: 0.97, y: 8 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.97, y: 8 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
						className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
					>
						<div className="w-full max-w-md bg-background border border-border flex flex-col gap-6 p-6 pointer-events-auto">
							<div className="flex items-start justify-between gap-4">
								<div className="flex items-start gap-3">
									<KeyRound size={18} className="text-amber mt-0.5 shrink-0" />
									<div className="flex flex-col gap-1">
										<div className="flex items-center gap-2">
											<p className="text-xs font-mono font-bold text-amber uppercase tracking-widest">
												{t("betaModal.badge")}
											</p>
										</div>
										<p className="text-sm font-black uppercase tracking-wide text-text">
											{t("betaModal.title")}
										</p>
										<p className="text-xs text-muted leading-relaxed mt-1">
											{t("betaModal.description")}
										</p>
									</div>
								</div>
								<button
									onClick={handleClose}
									className="text-muted hover:text-text transition-colors shrink-0"
									aria-label="Close"
								>
									<X size={16} />
								</button>
							</div>

							<div className="flex flex-col gap-4">
								<ApiKeyInputs
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
							</div>

							<div className="flex items-center gap-3">
								<button
									type="button"
									onClick={handleSave}
									disabled={!canSave || saving}
									className="bg-amber text-background px-5 py-2.5 font-black text-xs uppercase tracking-wide disabled:opacity-50 transition-opacity"
								>
									{saving ? t("betaModal.saving") : t("betaModal.saveButton")}
								</button>
								<button
									type="button"
									onClick={handleClose}
									className="text-xs font-mono text-muted hover:text-text transition-colors"
								>
									{t("betaModal.skipButton")}
								</button>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
