import i18n from "../i18n";

export function handleServiceError(error: unknown): never {
	const msg = String(error);
	if (
		msg.includes("429") ||
		msg.toLowerCase().includes("rate limit") ||
		msg.toLowerCase().includes("quota")
	) {
		throw new Error(i18n.t("error.rateLimit"));
	}
	throw error;
}
