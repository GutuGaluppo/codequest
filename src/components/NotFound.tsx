import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

export function NotFound() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	return (
		<div className="w-full min-h-[80vh] flex items-center justify-center px-6">
			<div className="max-w-[520px] w-full text-center flex flex-col items-center gap-6">

				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
				>
					<p className="text-xs font-mono font-medium text-muted uppercase tracking-widest mb-3">
						{t("notFound.subtitle")}
					</p>
					<h1
						className="font-mono font-black leading-none select-none"
						style={{
							fontSize: "clamp(120px, 22vw, 220px)",
							letterSpacing: "-0.05em",
							color: "var(--color-text, #e5e1d8)",
							textShadow: "-8px 0px 0px rgba(217,119,6,0.35)",
						}}
					>
						{"404".split("").map((char, i) => (
							<span key={i}>{char}</span>
						))}
					</h1>
				</motion.div>

				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.4 }}
					className="text-muted text-base"
				>
					{t("notFound.message")}
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.35, duration: 0.4 }}
				>
					<button
						onClick={() => navigate({ to: "/" })}
						className="bg-amber text-background px-5 py-2.5 rounded font-medium text-sm hover:opacity-90 transition-opacity"
					>
						{t("notFound.buttonBack")}
					</button>
				</motion.div>

			</div>
		</div>
	);
}
