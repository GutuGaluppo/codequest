export function Header({ mode }: { mode: "login" | "signup" }) {
	return (
		<div className="w-full flex items-center justify-between">
			<h2 className="font-mono font-medium text-amber text-3xl">
				{mode === "login" ? "Log in" : "Sign Up"}
			</h2>
		</div>
	);
}
