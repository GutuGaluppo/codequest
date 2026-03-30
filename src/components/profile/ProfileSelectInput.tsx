import { useTranslation } from "react-i18next";
import type { ModelProvider } from "../../types/user";

export function ProfileSelectInput({
	preferredModel,
	setPreferredModel,
}: {
	preferredModel: ModelProvider;
	setPreferredModel: (model: ModelProvider) => void;
}) {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col gap-1.5">
			<label className="text-xs font-mono uppercase tracking-widest text-muted">
				{t("profile.modelLabel")}
			</label>
			<select
				value={preferredModel}
				onChange={(e) => setPreferredModel(e.target.value as ModelProvider)}
				className="bg-surface border border-border px-4 py-2.5 text-text focus:outline-none focus:border-amber transition-colors"
			>
				<option value="gemini">{t("profile.modelOptionGemini")}</option>
				<option value="claude">{t("profile.modelOptionClaude")}</option>
				<option value="openai">{t("profile.modelOptionOpenai")}</option>
			</select>
		</div>
	);
}
