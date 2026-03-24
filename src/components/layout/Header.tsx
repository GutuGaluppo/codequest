import { Link } from "@tanstack/react-router";
import { useAuth } from "../../hooks/useAuth";

export function Header() {
	const { user, signIn, signOut } = useAuth();

	return (
		<header className="border-b px-6 py-4 flex items-center justify-between">
			<Link
				to="/"
				className="text-amber font-mono font-medium text-lg tracking-tight"
			>
				CodeQuest
			</Link>

			<div className="flex items-center gap-4">
				{user ? (
					<>
						<Link
							to="/profile"
							className="text-sm text-muted hover:text-text transition-colors"
						>
							{user.displayName}
						</Link>
						<button
							onClick={signOut}
							className="text-sm text-muted hover:text-text transition-colors"
						>
							Sair
						</button>
					</>
				) : (
					<button
						onClick={signIn}
						className="text-sm bg-amber text-background px-3 py-1.5 rounded font-medium hover:opacity-90 transition-opacity"
					>
						Entrar com Google
					</button>
				)}
			</div>
		</header>
	);
}
