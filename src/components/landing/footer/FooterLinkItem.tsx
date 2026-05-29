import { Link } from "@tanstack/react-router";
import type { AuthRedirectTo } from "../../../stores/authStore";
import type { FooterLink } from "./types";

export function FooterLinkItem({
	link,
	interactiveClass,
	onAuthLink,
}: {
	link: FooterLink;
	interactiveClass: string;
	onAuthLink: (to: AuthRedirectTo) => void;
}) {
	if (link.kind === "public") {
		return (
			<Link to={link.to} className={interactiveClass}>
				{link.label}
			</Link>
		);
	}

	if (link.kind === "external") {
		return (
			<a
				href={link.href}
				target="_blank"
				rel="noopener noreferrer"
				className={interactiveClass}
			>
				{link.label}
			</a>
		);
	}

	return (
		<button
			type="button"
			onClick={() => onAuthLink(link.to)}
			className={`${interactiveClass} text-left`}
		>
			{link.label}
		</button>
	);
}
