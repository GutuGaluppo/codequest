import { useTranslation } from "react-i18next";

export function Header({ mode }: { mode: "login" | "signup" }) {
	const { t } = useTranslation();
	return (
		<div className="w-full flex items-center justify-between">
			<h2 className="font-mono font-medium text-amber text-3xl">
				{mode === "login" ? t("auth.modal.loginTitle") : t("auth.modal.signupTitle")}
			</h2>
		</div>
	);
}
