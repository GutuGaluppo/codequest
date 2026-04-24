import { useTranslation } from "react-i18next";

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
	const { t } = useTranslation();
	const { name, email, password } = formData;

	const inputClass =
		"w-full bg-surface border rounded px-4 py-2.5 text-text placeholder:text-muted focus:outline-none focus:border-amber transition-colors text-sm";

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			{mode === "signup" && (
				<div className="flex flex-col gap-1.5">
					<label htmlFor="auth-name" className="sr-only">
						{t("auth.form.nameLabel")}
					</label>
					<input
						id="auth-name"
						type="text"
						name="name"
						placeholder={t("auth.form.nameLabel")}
						value={name}
						onChange={handleChange}
						className={inputClass}
						required
					/>
				</div>
			)}
			<div className="flex flex-col gap-1.5">
				<label htmlFor="auth-email" className="sr-only">
					{t("auth.form.emailLabel")}
				</label>
				<input
					id="auth-email"
					type="email"
					name="email"
					placeholder={t("auth.form.emailLabel")}
					value={email}
					onChange={handleChange}
					className={inputClass}
					required
				/>
			</div>
			<div className="flex flex-col gap-1.5">
				<label htmlFor="auth-password" className="sr-only">
					{t("auth.form.passwordLabel")}
				</label>
				<input
					id="auth-password"
					type="password"
					name="password"
					placeholder={t("auth.form.passwordLabel")}
					value={password}
					onChange={handleChange}
					className={inputClass}
					required
				/>
			</div>

			{error && (
				<p role="alert" className="text-sm text-red-400">
					{error}
				</p>
			)}

			<button
				type="submit"
				disabled={loading}
				className="bg-amber text-background px-4 py-2.5 rounded font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
			>
				{loading ? t("auth.form.loading") : mode === "login" ? t("auth.form.loginButton") : t("auth.form.signupButton")}
			</button>
		</form>
	);
}
