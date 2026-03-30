import { useTranslation } from "react-i18next";
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

	return (
		<>
			<div className="flex flex-col gap-1.5">
				<label className="text-xs font-mono uppercase tracking-widest text-muted">
					{t("profile.nameLabel")}
				</label>
				<Input
					value={displayName}
					onChange={(e) => setDisplayName(e.target.value)}
					placeholder={t("profile.namePlaceholder")}
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<label className="text-xs font-mono uppercase tracking-widest text-muted">
					{t("profile.anthropicKeyLabel")}
				</label>
				<Input
					value={anthropicKey}
					type="password"
					onChange={(e) => setAnthropicKey(e.target.value)}
					placeholder={t("profile.anthropicKeyPlaceholder")}
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<label className="text-xs font-mono uppercase tracking-widest text-muted">
					{t("profile.openaiKeyLabel")}
				</label>
				<Input
					value={openaiKey}
					type="password"
					onChange={(e) => setOpenaiKey(e.target.value)}
					placeholder={t("profile.openaiKeyPlaceholder")}
				/>
			</div>
		</>
	);
}
