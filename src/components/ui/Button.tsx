import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
	primary:
		"bg-amber text-background font-black text-xs uppercase tracking-wide",
	secondary:
		"border border-border text-text font-black text-xs uppercase tracking-wide hover:border-amber hover:text-amber transition-colors",
	ghost:
		"text-muted font-mono text-xs uppercase tracking-widest hover:text-text transition-colors",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: Variant;
}

export function Button({
	variant = "primary",
	className = "",
	...props
}: ButtonProps) {
	return <button className={`${variants[variant]} ${className}`} {...props} />;
}
