export function Toggle({
	mode,
	setMode,
}: {
	mode: "login" | "signup";
	setMode: (mode: "login" | "signup") => void;
}) {
	return (
		<p className="text-sm text-muted text-center">
			{mode === "login" ? (
				<>
					Não tem conta?{" "}
					<button
						onClick={() => setMode("signup")}
						className="text-amber hover:opacity-80 transition-opacity"
					>
						Cadastrar
					</button>
				</>
			) : (
				<>
					Já tem conta?{" "}
					<button
						onClick={() => setMode("login")}
						className="text-amber hover:opacity-80 transition-opacity"
					>
						Entrar
					</button>
				</>
			)}
		</p>
	);
}
