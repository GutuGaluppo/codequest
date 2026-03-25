import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useAuthStore } from "../../../stores/authStore";
import { Header } from "./Header";
import { Form } from "./Form";
import { Providers } from "./Providers";
import { Toggle } from "./Toggle";
import { friendlyError } from "./errorMessage";
import { X } from "lucide-react";

export function LoginDrawer() {
	const { drawerOpen, closeDrawer } = useAuthStore();
	const { signInWithEmail, signUpWithEmail } = useAuth();

	const [mode, setMode] = useState<"login" | "signup">("login");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});

	useEffect(() => {
		if (!drawerOpen) {
			setFormData({ name: "", email: "", password: "" });
			setError("");
			setMode("login");
		}
	}, [drawerOpen]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			if (mode === "login") {
				await signInWithEmail(formData.email, formData.password);
			} else {
				await signUpWithEmail(formData.name, formData.email, formData.password);
			}
			closeDrawer();
		} catch (err: unknown) {
			console.log("🚀 ~ err:", err);

			if (err instanceof Error) setError(friendlyError(err.message));
		} finally {
			setLoading(false);
		}
	}

	async function handleProvider(fn: () => Promise<void>) {
		setError("");
		try {
			await fn();
			closeDrawer();
		} catch (err: unknown) {
			console.log("🚀 ~ err:", err);
			if (err instanceof Error) setError(friendlyError(err.message));
		}
	}

	return (
		<AnimatePresence>
			{drawerOpen && (
				<>
					<motion.div
						key="overlay"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={closeDrawer}
						className="fixed inset-0 bg-black/50 z-40"
					/>
					<motion.div
						key="drawer"
						initial={{ x: "100%" }}
						animate={{ x: 0 }}
						exit={{ x: "100%" }}
						transition={{ duration: 0.25, ease: "easeOut" }}
						className="fixed top-0 right-0 h-full w-full max-w-sm bg-background border-l z-50 flex flex-col p-6 gap-6 overflow-y-auto justify-center"
					>
						<button
							onClick={closeDrawer}
							className="absolute top-6 text-muted hover:text-text transition-colors"
						>
							<X size={18} />
						</button>

						<Header mode={mode} />

						<Providers handleProvider={handleProvider} />

						<div className="flex items-center gap-3">
							<hr className="flex-1 border-border" />
							<span className="text-xs text-muted">or</span>
							<hr className="flex-1 border-border" />
						</div>

						<Form
							formData={formData}
							error={error}
							loading={loading}
							mode={mode}
							handleChange={handleChange}
							handleSubmit={handleSubmit}
						/>

						<Toggle mode={mode} setMode={setMode} />
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
