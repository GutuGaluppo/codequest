import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorScreen } from "../components/ErrorScreen";

vi.mock("@tanstack/react-router", () => ({
	useNavigate: () => vi.fn(),
}));

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

describe("ErrorScreen", () => {
	it("renderiza o título 'error.title'", () => {
		render(<ErrorScreen />);
		expect(
			screen.getByText((_, el) => el?.textContent === "Ops!"),
		).toBeInTheDocument();
	});

	it("exibe a mensagem técnica quando um Error é passado", () => {
		render(<ErrorScreen error={new Error("algo quebrou")} />);
		expect(screen.getByText("algo quebrou")).toBeInTheDocument();
	});

	it("não exibe mensagem técnica quando o erro não é um Error", () => {
		render(<ErrorScreen error="string error" />);
		expect(screen.queryByText("string error")).not.toBeInTheDocument();
	});

	it("chama reset ao clicar em 'Tentar novamente'", () => {
		const reset = vi.fn();
		render(<ErrorScreen reset={reset} />);
		fireEvent.click(screen.getByRole("button", { name: "error.buttonRetry" }));
		expect(reset).toHaveBeenCalledOnce();
	});

	it("não renderiza o botão retry quando reset não é passado", () => {
		render(<ErrorScreen />);
		expect(
			screen.queryByRole("button", { name: "error.buttonRetry" }),
		).not.toBeInTheDocument();
	});
});
