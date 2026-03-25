interface LoginFormProps {
	formData: { name: string; email: string; password: string };
	error: string;
	loading: boolean;
	mode: "login" | "signup";
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => Promise<void>;
}

export function Form({
	formData,
	error,
	loading,
	mode,
	handleChange,
	handleSubmit,
}: LoginFormProps) {
	const { name, email, password } = formData;

	const inputClass =
		"w-full bg-surface border rounded px-4 py-2.5 text-text placeholder:text-muted focus:outline-none focus:border-amber transition-colors text-sm";

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			{mode === "signup" && (
				<input
					type="text"
					name="name"
					placeholder="Nome"
					value={name}
					onChange={handleChange}
					className={inputClass}
					required
				/>
			)}
			<input
				type="email"
				name="email"
				placeholder="Email"
				value={email}
				onChange={handleChange}
				className={inputClass}
				required
			/>
			<input
				type="password"
				name="password"
				placeholder="Senha"
				value={password}
				onChange={handleChange}
				className={inputClass}
				required
			/>

			{error && <p className="text-sm text-red-400">{error}</p>}

			<button
				type="submit"
				disabled={loading}
				className="bg-amber text-background px-4 py-2.5 rounded font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
			>
				{loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
			</button>
		</form>
	);
}
