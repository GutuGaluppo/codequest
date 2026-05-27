import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import { useAuthStore, type AuthRedirectTo } from "../../stores/authStore";
import { GITHUB_REPO_URL } from "../../constants/links";

type FooterPublicLink =
	| "/challenges"
	| "/progress"
	| "/docs"
	| "/design"
	| "/devlog"
	| "/about"
	| "/blog"
	| "/privacy"
	| "/terms";

type FooterLink =
	| { label: string; kind: "public"; to: FooterPublicLink }
	| { label: string; kind: "auth"; to: AuthRedirectTo }
	| { label: string; kind: "external"; href: string };

export function LandingFooter() {
	const { t } = useTranslation();
	const { user } = useAuth();
	const { openDrawer } = useAuthStore();
	const navigate = useNavigate();
	const interactiveClass =
		"text-sm text-muted font-mono transition-colors hover:text-text";

	const columns = [
		{
			title: t("landing.footer.product"),
			links: [
				{ label: "Challenges", kind: "public", to: "/challenges" },
				{ label: "Dashboard", kind: "auth", to: "/dashboard" },
				{ label: "Progress", kind: "public", to: "/progress" },
				{ label: "API Keys", kind: "auth", to: "/api-keys" },
			] satisfies FooterLink[],
		},
		{
			title: t("landing.footer.developers"),
			links: [
				{ label: "Docs", kind: "public", to: "/docs" },
				{ label: "Design System", kind: "public", to: "/design" },
				{ label: "Dev Log", kind: "public", to: "/devlog" },
				{ label: "GitHub", kind: "external", href: GITHUB_REPO_URL },
			] satisfies FooterLink[],
		},
		{
			title: t("landing.footer.company"),
			links: [
				{ label: "About", kind: "public", to: "/about" },
				{ label: "Blog", kind: "public", to: "/blog" },
				{ label: "Privacy", kind: "public", to: "/privacy" },
				{ label: "Terms", kind: "public", to: "/terms" },
			] satisfies FooterLink[],
		},
	];

	function handleAuthLink(to: AuthRedirectTo) {
		if (user) {
			navigate({ to });
			return;
		}

		openDrawer(to);
	}

	function renderLink(link: FooterLink) {
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
				onClick={() => handleAuthLink(link.to)}
				className={`${interactiveClass} text-left`}
			>
				{link.label}
			</button>
		);
	}

	return (
		<footer className="border-t border-border">
			<div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-10">
				<div>
					<div className="text-amber font-mono font-bold mb-4 text-sm">
						CodeQuest_
					</div>
					<p className="text-xs text-muted leading-relaxed">
						{t("landing.footer.tagline")}
					</p>
				</div>
				{columns.map((col) => (
					<div key={col.title}>
						<p className="text-xs font-mono uppercase tracking-widest text-muted mb-4">
							{col.title}
						</p>
						<ul className="flex flex-col gap-2.5">
							{col.links.map((link) => (
								<li key={link.label}>
									{renderLink(link)}
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
			<div className="border-t border-border">
				<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
					<span className="text-xs font-mono text-muted">
						{t("landing.footer.copyright")}
					</span>
					<span className="text-xs font-mono text-muted">
						{t("landing.footer.version")}
					</span>
				</div>
			</div>
		</footer>
	);
}
