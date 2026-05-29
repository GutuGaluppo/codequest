import type { TFunction } from "i18next";
import { GITHUB_REPO_URL } from "../../../constants/links";
import type { FooterColumnData } from "./types";

export const footerInteractiveClass =
	"text-sm font-mono text-muted transition-colors hover:text-text";

export function getFooterColumns(t: TFunction): FooterColumnData[] {
	return [
		{
			title: t("landing.footer.product"),
			links: [
				{ label: "Challenges", kind: "public", to: "/challenges" },
				{ label: "Dashboard", kind: "auth", to: "/dashboard" },
				{ label: "Progress", kind: "public", to: "/progress" },
				{ label: "API Keys", kind: "auth", to: "/api-keys" },
			],
		},
		{
			title: t("landing.footer.developers"),
			links: [
				{ label: "Docs", kind: "public", to: "/docs" },
				{ label: "Design System", kind: "public", to: "/design" },
				{ label: "Dev Log", kind: "public", to: "/devlog" },
				{ label: "GitHub", kind: "external", href: GITHUB_REPO_URL },
			],
		},
		{
			title: t("landing.footer.company"),
			links: [
				{ label: "About", kind: "public", to: "/about" },
				{ label: "Blog", kind: "public", to: "/blog" },
				{ label: "Privacy", kind: "public", to: "/privacy" },
				{ label: "Terms", kind: "public", to: "/terms" },
			],
		},
	];
}
