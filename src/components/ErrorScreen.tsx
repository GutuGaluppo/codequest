import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

interface ErrorScreenProps {
	error?: Error | unknown;
	reset?: () => void;
}

export function ErrorScreen({ error, reset }: ErrorScreenProps) {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const message = error instanceof Error ? error.message : null;

	return (
		<div className="w-full min-h-[80vh] flex items-center justify-center px-6">
			<div className="max-w-132 w-full text-center flex flex-col items-center gap-6">
				{/* Título estilo colorlib — letras gigantes com text-shadow */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
				>
					<p className="text-xs font-mono font-medium text-muted uppercase tracking-widest mb-3">
						{t("error.subtitle")}
					</p>
					<h1
						className="font-mono font-black leading-none select-none"
						style={{
							fontSize: "clamp(100px, 20vw, 200px)",
							letterSpacing: "-0.12em",
							color: "var(--color-text, #e5e1d8)",
							textShadow: "-8px 0px 0px #13161e",
						}}
					>
						{"Ops!".split("").map((char, i) => (
							<span key={i}>{char}</span>
						))}
					</h1>
				</motion.div>

				{/* Mensagem */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.4 }}
					className="flex flex-col gap-2"
				>
					<p className="text-muted text-base">{t("error.message")}</p>
					{message && (
						<p className="text-xs font-mono text-muted/60 border border-border rounded px-3 py-2 bg-surface/30">
							{message}
						</p>
					)}
				</motion.div>

				{/* Botões */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.35, duration: 0.4 }}
					className="flex items-center gap-3"
				>
					<button
						onClick={() => navigate({ to: "/" })}
						className="border border-border text-text px-5 py-2.5 rounded font-medium text-sm hover:border-amber hover:text-amber transition-colors"
					>
						{t("error.buttonBack")}
					</button>
					{reset && (
						<button
							onClick={reset}
							className="bg-amber text-background px-5 py-2.5 rounded font-medium text-sm hover:opacity-90 transition-opacity"
						>
							{t("error.buttonRetry")}
						</button>
					)}
				</motion.div>
			</div>
		</div>
	);
}
