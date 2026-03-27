import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NotFound } from "../components/NotFound";

// mock do router (useNavigate não funciona fora do contexto TanStack)
vi.mock("@tanstack/react-router", () => ({
	useNavigate: () => vi.fn(),
}));

// mock do i18n para retornar as próprias chaves
vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

describe("NotFound", () => {
	it("renderiza o texto '404'", () => {
		render(<NotFound />);
		expect(
			screen.getByText((_, el) => el?.textContent === "404"),
		).toBeInTheDocument();
	});

	it("renderiza o subtítulo e a mensagem", () => {
		render(<NotFound />);
		expect(screen.getByText("notFound.subtitle")).toBeInTheDocument();
		expect(screen.getByText("notFound.message")).toBeInTheDocument();
	});

	it("renderiza o botão de voltar", () => {
		render(<NotFound />);
		expect(
			screen.getByRole("button", { name: "notFound.buttonBack" }),
		).toBeInTheDocument();
	});
});
