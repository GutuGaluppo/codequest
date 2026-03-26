import { useTranslation } from "react-i18next";

export function Toggle({
	mode,
	setMode,
}: {
	mode: "login" | "signup";
	setMode: (mode: "login" | "signup") => void;
}) {
	const { t } = useTranslation();
	return (
		<p className="text-sm text-muted text-center">
			{mode === "login" ? (
				<>
					{t("auth.toggle.noAccount")}
					<button
						onClick={() => setMode("signup")}
						className="text-amber hover:opacity-80 transition-opacity"
					>
						{t("auth.toggle.signupLink")}
					</button>
				</>
			) : (
				<>
					{t("auth.toggle.hasAccount")}
					<button
						onClick={() => setMode("login")}
						className="text-amber hover:opacity-80 transition-opacity"
					>
						{t("auth.toggle.loginLink")}
					</button>
				</>
			)}
		</p>
	);
}
