import { describe, it, expect, vi } from "vitest";

// mock do i18n antes de importar o módulo
vi.mock("../i18n", () => ({
	default: { t: (key: string) => key },
}));

import { handleServiceError } from "../services/serviceErrors";

describe("handleServiceError", () => {
	it("relança com chave i18n quando o erro contém '429'", () => {
		expect(() =>
			handleServiceError(new Error("429 Too Many Requests")),
		).toThrow("error.rateLimit");
	});

	it("relança com chave i18n quando o erro contém 'rate limit'", () => {
		expect(() => handleServiceError(new Error("rate limit exceeded"))).toThrow(
			"error.rateLimit",
		);
	});

	it("relança o erro original quando não é rate limit", () => {
		const original = new Error("network error");
		expect(() => handleServiceError(original)).toThrow("network error");
	});
});
