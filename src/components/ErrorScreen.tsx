import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

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
				<div>
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
				</div>

				<div className="flex flex-col gap-2">
					<p className="text-muted text-base">{t("error.message")}</p>
					{message && (
						<p className="text-xs font-mono text-muted border border-border px-3 py-2 bg-surface/30">
							{message}
						</p>
					)}
				</div>

				<div className="flex items-center gap-3">
					<button
						onClick={() => navigate({ to: "/" })}
						className="border border-border text-text px-5 py-2.5 font-black text-xs uppercase tracking-wide hover:border-amber hover:text-amber transition-colors"
					>
						{t("error.buttonBack")}
					</button>
					{reset && (
						<button
							onClick={reset}
							className="bg-amber text-background px-5 py-2.5 font-black text-xs uppercase tracking-wide"
						>
							{t("error.buttonRetry")}
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
