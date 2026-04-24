import { useTranslation } from "react-i18next";
import { modelKeyLinks } from "../../utils/modelKeyLinks";
import { Input } from "../ui";

export function ProfileInputs({
	displayName,
	anthropicKey,
	openaiKey,
	setDisplayName,
	setAnthropicKey,
	setOpenaiKey,
}: {
	displayName: string;
	anthropicKey: string;
	openaiKey: string;
	setDisplayName: (name: string) => void;
	setAnthropicKey: (key: string) => void;
	setOpenaiKey: (key: string) => void;
}) {
	const { t } = useTranslation();
	const keyButtonClass =
		"self-start text-xs font-mono text-muted border border-border px-2 py-1 hover:border-amber/50 hover:text-text transition-colors";

	return (
		<>
			<div className="flex flex-col gap-1.5">
				<label
					htmlFor="profile-display-name"
					className="text-xs font-mono uppercase tracking-widest text-muted"
				>
					{t("profile.nameLabel")}
				</label>
				<Input
					id="profile-display-name"
					value={displayName}
					onChange={(e) => setDisplayName(e.target.value)}
					placeholder={t("profile.namePlaceholder")}
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<div className="flex items-center justify-between gap-3">
					<label
						htmlFor="profile-anthropic-key"
						className="text-xs font-mono uppercase tracking-widest text-muted"
					>
						{t("profile.anthropicKeyLabel")}
					</label>
					<a
						href={modelKeyLinks.claude}
						target="_blank"
						rel="noopener noreferrer"
						className={keyButtonClass}
					>
						{t("profile.anthropicKeyCta")}
					</a>
				</div>
				<Input
					id="profile-anthropic-key"
					value={anthropicKey}
					type="password"
					onChange={(e) => setAnthropicKey(e.target.value)}
					placeholder={t("profile.anthropicKeyPlaceholder")}
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<div className="flex items-center justify-between gap-3">
					<label
						htmlFor="profile-openai-key"
						className="text-xs font-mono uppercase tracking-widest text-muted"
					>
						{t("profile.openaiKeyLabel")}
					</label>
					<a
						href={modelKeyLinks.openai}
						target="_blank"
						rel="noopener noreferrer"
						className={keyButtonClass}
					>
						{t("profile.openaiKeyCta")}
					</a>
				</div>
				<Input
					id="profile-openai-key"
					value={openaiKey}
					type="password"
					onChange={(e) => setOpenaiKey(e.target.value)}
					placeholder={t("profile.openaiKeyPlaceholder")}
				/>
			</div>
		</>
	);
}
