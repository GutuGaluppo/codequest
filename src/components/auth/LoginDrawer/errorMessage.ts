import i18n from "../../../i18n";

export function friendlyError(message: string): string {
	const t = i18n.t.bind(i18n);
	if (message.includes("email-already-in-use")) {
		return t("auth.errors.emailExists");
	}
	if (
		message.includes("wrong-password") ||
		message.includes("invalid-credential")
	) {
		return t("auth.errors.invalidCredentials");
	}
	if (message.includes("account-exists-with-different-credential")) {
		return t("auth.errors.accountWithDifferentProvider");
	}
	if (message.includes("user-not-found")) {
		return t("auth.errors.userNotFound");
	}
	if (message.includes("weak-password")) {
		return t("auth.errors.weakPassword");
	}
	if (message.includes("popup-closed-by-user")) return "";
	return t("auth.errors.generic");
}
