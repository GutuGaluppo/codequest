import { useTranslation } from "react-i18next";
import { Input } from "../ui";
import { ApiKeyInputs } from "./ApiKeyInputs";
import type { ApiKeyInputsProps } from "./ApiKeyInputs";

type ProfileInputsProps = {
	displayName: string;
	setDisplayName: (name: string) => void;
} & ApiKeyInputsProps;

export function ProfileInputs({ displayName, setDisplayName, ...keyProps }: ProfileInputsProps) {
	const { t } = useTranslation();

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

			<ApiKeyInputs {...keyProps} />
		</>
	);
}
