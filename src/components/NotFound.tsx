import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function NotFound() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	return (
		<div className="w-full min-h-[80vh] flex items-center justify-center px-6">
			<div className="max-w-130 w-full text-center flex flex-col items-center gap-6">
				<div>
					<p className="text-xs font-mono font-medium text-muted uppercase tracking-widest mb-3">
						{t("notFound.subtitle")}
					</p>
					<h1
						className="font-mono font-black leading-none select-none"
						style={{
							fontSize: "clamp(120px, 22vw, 220px)",
							letterSpacing: "-0.12em",
							color: "var(--color-text, #e5e1d8)",
							textShadow: "-10px 4px 0px #13161e",
						}}
					>
						{"404".split("").map((char, i) => (
							<span key={i}>{char}</span>
						))}
					</h1>
				</div>

				<p className="text-muted text-base">
					{t("notFound.message")}
				</p>

				<div>
					<button
						onClick={() => navigate({ to: "/" })}
						className="bg-amber text-background px-5 py-2.5 font-black text-xs uppercase tracking-wide"
					>
						{t("notFound.buttonBack")}
					</button>
				</div>
			</div>
		</div>
	);
}
