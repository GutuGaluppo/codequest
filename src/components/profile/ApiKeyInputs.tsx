import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle } from "lucide-react";
import { Input } from "../ui";
import { modelKeyLinks } from "../../utils/modelKeyLinks";
import type { ModelProvider } from "../../types/tutorial";
import type { UserProfile } from "../../types/user";

const PROVIDER_FOR_MODEL: Record<ModelProvider, keyof NonNullable<UserProfile["configuredKeys"]>> = {
	claude: "anthropic",
	openai: "openai",
	gemini: "gemini",
	other: "other",
};

const MODEL_LABELS: Record<ModelProvider, string> = {
	claude: "Claude",
	openai: "GPT-4o",
	gemini: "Gemini",
	other: "Custom Model",
};

export type ApiKeyInputsProps = {
	preferredModel: ModelProvider;
	onModelChange: (m: ModelProvider) => void;
	configuredKeys?: UserProfile["configuredKeys"];
	otherModel?: UserProfile["otherModel"];
	anthropicKey: string;
	setAnthropicKey: (k: string) => void;
	openaiKey: string;
	setOpenaiKey: (k: string) => void;
	geminiKey: string;
	setGeminiKey: (k: string) => void;
	otherKey: string;
	setOtherKey: (k: string) => void;
	otherModelName: string;
	setOtherModelName: (n: string) => void;
	otherBaseUrl: string;
	setOtherBaseUrl: (u: string) => void;
};

export function ApiKeyInputs({
	preferredModel,
	onModelChange,
	configuredKeys,
	otherModel,
	anthropicKey,
	setAnthropicKey,
	openaiKey,
	setOpenaiKey,
	geminiKey,
	setGeminiKey,
	otherKey,
	setOtherKey,
	otherModelName,
	setOtherModelName,
	otherBaseUrl,
	setOtherBaseUrl,
}: ApiKeyInputsProps) {
	const { t } = useTranslation();
	const [isChanging, setIsChanging] = useState(false);

	const provider = PROVIDER_FOR_MODEL[preferredModel];
	const isConfigured = !!configuredKeys?.[provider];

	useEffect(() => {
		if (isConfigured) setIsChanging(false);
	}, [isConfigured]);

	const keyButtonClass =
		"self-start text-xs font-mono text-muted border border-border px-2 py-1 hover:border-amber/50 hover:text-text transition-colors";

	const configuredLabel =
		preferredModel === "other" && otherModel?.name
			? otherModel.name
			: MODEL_LABELS[preferredModel];

	if (isConfigured && !isChanging) {
		return (
			<div className="flex flex-col gap-3">
				<label className="text-xs font-mono uppercase tracking-widest text-muted">
					{t("profile.modelLabel")}
				</label>
				<div className="flex items-center justify-between gap-3 border border-border px-4 py-3">
					<div className="flex items-center gap-2">
						<CheckCircle size={14} className="text-green shrink-0" />
						<span className="text-xs font-mono text-text">
							{t("profile.configuredModel", { model: configuredLabel })}
						</span>
					</div>
					<button
						type="button"
						onClick={() => setIsChanging(true)}
						className="text-xs font-mono text-amber hover:underline"
					>
						{t("profile.changeModelButton")}
					</button>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="flex flex-col gap-1.5">
				<label className="text-xs font-mono uppercase tracking-widest text-muted">
					{t("profile.modelLabel")}
				</label>
				<select
					value={preferredModel}
					onChange={(e) => onModelChange(e.target.value as ModelProvider)}
					className="bg-surface border border-border px-4 py-2.5 text-text focus:outline-none focus:border-amber transition-colors"
				>
					<option value="gemini">{t("profile.modelOptionGemini")}</option>
					<option value="claude">{t("profile.modelOptionClaude")}</option>
					<option value="openai">{t("profile.modelOptionOpenai")}</option>
					<option value="other">{t("profile.modelOptionOther")}</option>
				</select>
			</div>

			{preferredModel === "claude" && (
				<div className="flex flex-col gap-1.5">
					<div className="flex items-center justify-between gap-3">
						<label htmlFor="api-anthropic-key" className="text-xs font-mono uppercase tracking-widest text-muted">
							{t("profile.anthropicKeyLabel")}
						</label>
						<a href={modelKeyLinks.claude} target="_blank" rel="noopener noreferrer" className={keyButtonClass}>
							{t("profile.anthropicKeyCta")}
						</a>
					</div>
					<Input
						id="api-anthropic-key"
						value={anthropicKey}
						type="password"
						onChange={(e) => setAnthropicKey(e.target.value)}
						placeholder={t("profile.anthropicKeyPlaceholder")}
					/>
				</div>
			)}

			{preferredModel === "openai" && (
				<div className="flex flex-col gap-1.5">
					<div className="flex items-center justify-between gap-3">
						<label htmlFor="api-openai-key" className="text-xs font-mono uppercase tracking-widest text-muted">
							{t("profile.openaiKeyLabel")}
						</label>
						<a href={modelKeyLinks.openai} target="_blank" rel="noopener noreferrer" className={keyButtonClass}>
							{t("profile.openaiKeyCta")}
						</a>
					</div>
					<Input
						id="api-openai-key"
						value={openaiKey}
						type="password"
						onChange={(e) => setOpenaiKey(e.target.value)}
						placeholder={t("profile.openaiKeyPlaceholder")}
					/>
				</div>
			)}

			{preferredModel === "gemini" && (
				<div className="flex flex-col gap-1.5">
					<div className="flex items-center justify-between gap-3">
						<label htmlFor="api-gemini-key" className="text-xs font-mono uppercase tracking-widest text-muted">
							{t("profile.geminiKeyLabel")}
						</label>
						<a href={modelKeyLinks.gemini} target="_blank" rel="noopener noreferrer" className={keyButtonClass}>
							{t("profile.geminiKeyCta")}
						</a>
					</div>
					<Input
						id="api-gemini-key"
						value={geminiKey}
						type="password"
						onChange={(e) => setGeminiKey(e.target.value)}
						placeholder={t("profile.geminiKeyPlaceholder")}
					/>
				</div>
			)}

			{preferredModel === "other" && (
				<>
					<div className="flex flex-col gap-1.5">
						<label htmlFor="api-other-model-name" className="text-xs font-mono uppercase tracking-widest text-muted">
							{t("profile.otherModelNameLabel")}
						</label>
						<Input
							id="api-other-model-name"
							value={otherModelName}
							onChange={(e) => setOtherModelName(e.target.value)}
							placeholder={t("profile.otherModelNamePlaceholder")}
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<label htmlFor="api-other-base-url" className="text-xs font-mono uppercase tracking-widest text-muted">
							{t("profile.otherBaseUrlLabel")}
						</label>
						<Input
							id="api-other-base-url"
							value={otherBaseUrl}
							onChange={(e) => setOtherBaseUrl(e.target.value)}
							placeholder={t("profile.otherBaseUrlPlaceholder")}
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<label htmlFor="api-other-key" className="text-xs font-mono uppercase tracking-widest text-muted">
							{t("profile.otherKeyLabel")}
						</label>
						<Input
							id="api-other-key"
							value={otherKey}
							type="password"
							onChange={(e) => setOtherKey(e.target.value)}
							placeholder={t("profile.otherKeyPlaceholder")}
						/>
					</div>
				</>
			)}
		</>
	);
}
