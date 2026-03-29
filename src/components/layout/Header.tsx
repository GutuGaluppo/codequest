import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { LayoutDashboard, LogOutIcon } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useEditorStore } from "../../stores/editorStore";
import { useTutorialNavStore } from "../../stores/tutorialNavStore";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { HeroBadge } from "../landing/HeroBadge";
import { StepNav } from "../tutorial/StepNav";

function Avatar({
	photoURL,
	displayName,
}: {
	photoURL: string | null;
	displayName: string | null;
}) {
	const [imgError, setImgError] = useState(false);
	const initial = displayName?.charAt(0).toUpperCase() ?? "?";
	return photoURL && !imgError ? (
		<img
			src={photoURL}
			alt={displayName ?? ""}
			className="w-full h-full object-cover"
			onError={() => setImgError(true)}
		/>
	) : (
		<span className="text-xs font-mono font-medium text-muted">{initial}</span>
	);
}

export function Header() {
	const { user, signOut } = useAuth();
	const { openDrawer } = useAuthStore();
	const navigate = useNavigate();
	const { reset, currentStep, setCurrentStep } = useEditorStore();
	const { steps, completedSteps } = useTutorialNavStore();
	const { t } = useTranslation();

	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const isTutorial = pathname.startsWith("/tutorial/");
	const isDashboard = pathname === "/dashboard";

	async function handleSignOut() {
		await signOut();
		reset();
		navigate({ to: "/" });
	}

	return (
		<header className="fixed z-50 w-full bg-background border-b px-6 py-3.5 flex items-center justify-between gap-4">
			{/* ─── LEFT: logo + badge (or CQ on tutorial) ─────────────────────── */}
			<div className="flex items-center gap-3 shrink-0">
				<Link
					to="/"
					className="text-amber font-mono font-black text-sm uppercase tracking-widest"
				>
					{isTutorial ? "CQ" : t("header.logo")}
				</Link>
				{!isTutorial && <HeroBadge />}
			</div>

			{/* ─── CENTER: StepNav on tutorial ─────────────────────────────────── */}
			{isTutorial && steps.length > 0 && (
				<div className="flex-1 overflow-hidden">
					<StepNav
						steps={steps}
						currentStep={currentStep}
						completedSteps={completedSteps}
						onSelectStep={setCurrentStep}
					/>
				</div>
			)}

			{/* ─── RIGHT: user actions ─────────────────────────────────────────── */}
			<div className="flex items-center gap-5 shrink-0">
				<LanguageSwitcher />
				{user ? (
					<>
						{!isDashboard && (
							<Link
								to="/dashboard"
								className="text-muted hover:text-text transition-colors"
							>
								<LayoutDashboard size={20} />
							</Link>
						)}
						<Link
							to="/profile"
							className="w-8 h-8 overflow-hidden border border-border hover:border-amber transition-colors flex items-center justify-center bg-surface shrink-0"
						>
							<Avatar photoURL={user.photoURL} displayName={user.displayName} />
						</Link>
						<button
							onClick={handleSignOut}
							className="text-xs font-mono uppercase tracking-widest text-muted hover:text-text transition-colors"
						>
							<LogOutIcon size={20} />
						</button>
					</>
				) : (
					<button
						onClick={openDrawer}
						className="text-xs font-black uppercase tracking-wide bg-amber text-background px-4 py-2"
					>
						{t("header.logIn")}
					</button>
				)}
			</div>
		</header>
	);
}
