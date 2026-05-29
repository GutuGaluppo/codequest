import type { AuthRedirectTo } from "../../../stores/authStore";
import { FooterLinkItem } from "./FooterLinkItem";
import type { FooterColumnData } from "./types";

export function FooterColumn({
	column,
	interactiveClass,
	onAuthLink,
}: {
	column: FooterColumnData;
	interactiveClass: string;
	onAuthLink: (to: AuthRedirectTo) => void;
}) {
	return (
		<div>
			<p className="mb-4 text-xs font-mono uppercase tracking-widest text-muted">
				{column.title}
			</p>
			<ul className="flex flex-col gap-2.5">
				{column.links.map((link) => (
					<li key={link.label}>
						<FooterLinkItem
							link={link}
							interactiveClass={interactiveClass}
							onAuthLink={onAuthLink}
						/>
					</li>
				))}
			</ul>
		</div>
	);
}
