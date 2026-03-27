import { describe, it, expect, vi } from "vitest";

vi.mock("../i18n", () => ({ default: { t: (key: string) => key } }));

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
	initReactI18next: { type: "3rdParty", init: vi.fn() },
}));

import { friendlyError } from "../components/auth/LoginDrawer/errorMessage";

describe("friendlyError", () => {
	it("retorna mensagem de email existente", () => {
		expect(friendlyError("auth/email-already-in-use")).toContain("email");
	});

	it("retorna mensagem de credenciais inválidas", () => {
		expect(friendlyError("auth/wrong-password")).toBeTruthy();
	});

	it("retorna mensagem genérica para código desconhecido", () => {
		expect(friendlyError("auth/unknown-error")).toBeTruthy();
	});

	it("retorna string não vazia para qualquer input", () => {
		expect(friendlyError("")).toBeTruthy();
		expect(friendlyError("qualquer-coisa")).toBeTruthy();
	});
});
