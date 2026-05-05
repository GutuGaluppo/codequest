const VALID_MODELS = ["gemini", "claude", "openai", "other"] as const;
const VALID_LEVELS = ["beginner", "intermediate", "advanced"] as const;
const VALID_LANGUAGES = ["en", "pt-BR", "es", "de", "el", "pl"] as const;

type ValidationResult = { ok: true } | { ok: false; message: string };

export function validateGenerateBody(body: unknown): ValidationResult {
	if (!body || typeof body !== "object") {
		return { ok: false, message: "Request body is required" };
	}
	const b = body as Record<string, unknown>;

	if (typeof b.topic !== "string" || b.topic.trim().length === 0) {
		return { ok: false, message: "topic must be a non-empty string" };
	}
	if (b.topic.length > 200) {
		return { ok: false, message: "topic must be 200 characters or fewer" };
	}
	if (!VALID_MODELS.includes(b.model as never)) {
		return { ok: false, message: `model must be one of: ${VALID_MODELS.join(", ")}` };
	}
	if (!VALID_LEVELS.includes(b.level as never)) {
		return { ok: false, message: `level must be one of: ${VALID_LEVELS.join(", ")}` };
	}
	if (!VALID_LANGUAGES.includes(b.language as never)) {
		return { ok: false, message: `language must be one of: ${VALID_LANGUAGES.join(", ")}` };
	}

	return { ok: true };
}

export function validateVerifyBody(body: unknown): ValidationResult {
	if (!body || typeof body !== "object") {
		return { ok: false, message: "Request body is required" };
	}
	const b = body as Record<string, unknown>;

	for (const field of ["prompt", "solution", "userCode", "output"] as const) {
		if (typeof b[field] !== "string") {
			return { ok: false, message: `${field} must be a string` };
		}
	}
	if (!VALID_MODELS.includes(b.model as never)) {
		return { ok: false, message: `model must be one of: ${VALID_MODELS.join(", ")}` };
	}
	if ((b.userCode as string).length > 50_000) {
		return { ok: false, message: "userCode exceeds maximum allowed length" };
	}

	return { ok: true };
}
