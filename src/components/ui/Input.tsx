import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	className?: string;
}

export function Input({ className = "", ...props }: InputProps) {
	return (
		<input
			className={`bg-surface border border-border px-4 py-2.5 text-text placeholder:text-muted focus:outline-none focus:border-amber transition-colors ${className}`}
			{...props}
		/>
	);
}
