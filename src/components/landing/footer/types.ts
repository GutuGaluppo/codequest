import type { AuthRedirectTo } from "../../../stores/authStore";

export type FooterPublicLink =
	| "/about"
	| "/api-keys"
	| "/blog"
	| "/challenges"
	| "/design"
	| "/devlog"
	| "/docs"
	| "/privacy"
	| "/progress"
	| "/terms";

export type FooterLink =
	| { label: string; kind: "public"; to: FooterPublicLink }
	| { label: string; kind: "auth"; to: AuthRedirectTo }
	| { label: string; kind: "external"; href: string };

export interface FooterColumnData {
	title: string;
	links: FooterLink[];
}
