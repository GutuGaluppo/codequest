import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { LayoutDashboard } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useEditorStore } from "../../stores/editorStore";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";

function Avatar({ photoURL, displayName }: { photoURL: string | null; displayName: string | null }) {
	const [imgError, setImgError] = useState(false);
	const initial = displayName?.charAt(0).toUpperCase() ?? "?";
	return photoURL && !imgError ? (
		<img src={photoURL} alt={displayName ?? ""} className="w-full h-full object-cover" onError={() => setImgError(true)} />
	) : (
		<span className="text-xs font-mono font-medium text-muted">{initial}</span>
	);
}

export function Header() {
	const { user, signOut } = useAuth();
	const { openDrawer } = useAuthStore();
	const navigate = useNavigate();
	const { reset } = useEditorStore();
	const { t } = useTranslation();

	async function handleSignOut() {
		await signOut();
		reset();
		navigate({ to: "/" });
	}

	return (
		<header className="border-b px-6 py-4 flex items-center justify-between">
			<Link
				to="/"
				className="text-amber font-mono font-medium text-lg tracking-tight"
			>
				{t("header.logo")}
			</Link>

			<div className="flex items-center gap-4">
				<LanguageSwitcher />
				{user ? (
					<>
						<Link
							to="/dashboard"
							className="text-muted hover:text-text transition-colors"
						>
							<LayoutDashboard size={18} />
						</Link>
						<Link
							to="/profile"
							className="w-8 h-8 rounded-full overflow-hidden border border-border hover:border-amber transition-colors flex items-center justify-center bg-surface shrink-0"
						>
							<Avatar photoURL={user.photoURL} displayName={user.displayName} />
						</Link>
						<button
							onClick={handleSignOut}
							className="text-sm text-muted hover:text-text transition-colors"
						>
							{t("header.signOut")}
						</button>
					</>
				) : (
					<button
						onClick={openDrawer}
						className="text-sm bg-amber text-background px-3 py-1.5 rounded font-medium hover:opacity-90 transition-opacity"
					>
						{t("header.logIn")}
					</button>
				)}
			</div>
		</header>
	);
}
