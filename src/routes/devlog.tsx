import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/devlog")({
	component: DevlogPage,
});

interface EntryMeta {
	date: string;
	commit?: string;
	phaseKey: string;
	tags?: string[];
	key: string;
	hasBugs?: boolean;
	hasDecisions?: boolean;
}

const entries: EntryMeta[] = [
	{ date: "2026-03-23", commit: "1a19314", phaseKey: "foundation", tags: ["setup", "config"], key: "setup" },
	{ date: "2026-03-23", commit: "aad3b2f", phaseKey: "foundation", tags: ["architecture", "ai", "auth"], key: "data_layer", hasDecisions: true },
	{ date: "2026-03-24", commit: "2267355", phaseKey: "foundation", tags: ["routing"], key: "routing" },
	{ date: "2026-03-24", commit: "37b6b95", phaseKey: "foundation", tags: ["data", "firestore"], key: "queries" },
	{ date: "2026-03-24", commit: "fdc3c8b", phaseKey: "foundation", tags: ["design", "config"], key: "tailwind_config", hasDecisions: true },
	{ date: "2026-03-24", commit: "ffac146", phaseKey: "interface", tags: ["components", "editor"], key: "components" },
	{ date: "2026-03-24", commit: "f80d8ce", phaseKey: "interface", tags: ["layout", "refactor"], key: "ui_refactor" },
	{ date: "2026-03-24", commit: "ffac146", phaseKey: "interface", tags: ["animation"], key: "animations" },
	{ date: "2026-03-25", commit: "e8e0661", phaseKey: "features", tags: ["feature", "firestore"], key: "dashboard", hasBugs: true },
	{ date: "2026-03-25", commit: "e95c6dd", phaseKey: "features", tags: ["design", "ux"], key: "left_panel", hasDecisions: true },
	{ date: "2026-03-25", commit: "655d3ad", phaseKey: "auth", tags: ["auth", "feature"], key: "auth", hasBugs: true, hasDecisions: true },
	{ date: "2026-03-25", commit: "222d523", phaseKey: "profile", tags: ["feature", "cloudinary"], key: "cloudinary", hasDecisions: true },
	{ date: "2026-03-25", commit: "708d5e8", phaseKey: "landing", tags: ["refactor", "design"], key: "landing_redesign" },
	{ date: "2026-03-26", commit: "4254631", phaseKey: "editor", tags: ["ai", "feature", "editor"], key: "ai_verify", hasBugs: true, hasDecisions: true },
	{ date: "2026-03-26", commit: "5fa8bf7", phaseKey: "i18n", tags: ["i18n", "feature"], key: "i18n_feature" },
	{ date: "2026-03-26", commit: "e81d90e", phaseKey: "ux", tags: ["ux", "error-handling"], key: "error_screen" },
	{ date: "2026-03-26", commit: "6e895e0", phaseKey: "polish", tags: ["polish", "ux", "fix"], key: "polish" },
	{ date: "2026-03-27", commit: "e9ee9a4", phaseKey: "tests", tags: ["tests"], key: "tests", hasBugs: true, hasDecisions: true },
	{ date: "2026-03-28", phaseKey: "design_system", tags: ["design", "docs"], key: "design_system" },
	{ date: "2026-03-28", phaseKey: "ux", tags: ["ux", "design"], key: "herobadge" },
	{ date: "2026-03-29", commit: "a8d6d34", phaseKey: "redesign", tags: ["design", "layout", "refactor"], key: "mux_layout", hasDecisions: true },
	{ date: "2026-03-29", commit: "d0d1eb3", phaseKey: "polish", tags: ["ai", "fix"], key: "step_count_fix" },
	{ date: "2026-03-29", commit: "4a8fdd2", phaseKey: "ux", tags: ["ux", "feature", "layout"], key: "dynamic_header", hasDecisions: true },
	{ date: "2026-03-29", commit: "acdc49f", phaseKey: "editor", tags: ["editor", "fix", "ux", "error-handling"], key: "tutorial_flow", hasBugs: true },
	{ date: "2026-03-30", commit: "2954684", phaseKey: "features", tags: ["feature", "firestore", "ai"], key: "level_system", hasDecisions: true },
	{ date: "2026-03-30", commit: "94d4b72", phaseKey: "landing", tags: ["refactor", "i18n", "design"], key: "landing_i18n" },
	{ date: "2026-03-30", commit: "21da915", phaseKey: "editor", tags: ["editor", "ux", "feature"], key: "editor_format" },
];

const tagColors: Record<string, string> = {
	setup: "border-border text-muted",
	config: "border-border text-muted",
	architecture: "border-amber/40 text-amber",
	ai: "border-amber/40 text-amber",
	auth: "border-blue-500/40 text-blue-400",
	routing: "border-border text-muted",
	data: "border-border text-muted",
	firestore: "border-orange-500/40 text-orange-400",
	design: "border-purple-500/40 text-purple-400",
	layout: "border-purple-500/40 text-purple-400",
	components: "border-border text-muted",
	editor: "border-green/40 text-green",
	animation: "border-purple-500/40 text-purple-400",
	feature: "border-amber/40 text-amber",
	cloudinary: "border-border text-muted",
	refactor: "border-border text-muted",
	"error-handling": "border-red-500/40 text-red-400",
	ux: "border-purple-500/40 text-purple-400",
	polish: "border-green/40 text-green",
	fix: "border-red-500/40 text-red-400",
	tests: "border-blue-500/40 text-blue-400",
	i18n: "border-amber/40 text-amber",
	docs: "border-border text-muted",
};

const phaseColors: Record<string, string> = {
	foundation: "text-muted",
	interface: "text-purple-400",
	features: "text-amber",
	auth: "text-blue-400",
	profile: "text-amber",
	landing: "text-purple-400",
	editor: "text-green",
	i18n: "text-amber",
	ux: "text-purple-400",
	polish: "text-green",
	tests: "text-blue-400",
	design_system: "text-purple-400",
	redesign: "text-amber",
};

function DevlogPage() {
	const { t } = useTranslation();
	const totalBugs = entries.filter((e) => e.hasBugs).reduce((acc, e) => {
		const bugs = t(`devlog.entry.${e.key}.bugs`, { returnObjects: true });
		return acc + (Array.isArray(bugs) ? bugs.length : 0);
	}, 0);

	return (
		<div className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-4">
			<div className="mb-8">
				<h1 className="text-2xl font-mono font-bold text-text">{t("devlog.title")}</h1>
				<p className="text-sm text-muted mt-1">{t("devlog.subtitle")}</p>
				<p className="text-xs font-mono text-muted/50 mt-2">
					{t("devlog.counter", { entries: entries.length, bugs: totalBugs })}
				</p>
			</div>

			<div className="relative flex flex-col gap-0">
				<div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

				{entries.map((entry, i) => {
					const bugs = t(`devlog.entry.${entry.key}.bugs`, { returnObjects: true });
					const decisions = t(`devlog.entry.${entry.key}.decisions`, { returnObjects: true });
					const bugsArr = Array.isArray(bugs) ? (bugs as string[]) : [];
					const decisionsArr = Array.isArray(decisions) ? (decisions as string[]) : [];

					return (
						<div key={i} className="relative pl-8 pb-10">
							<div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-border bg-background" />

							<div className="flex flex-col gap-3">
								<div className="flex flex-wrap items-center gap-2">
									<span className="text-xs font-mono text-muted/60">{entry.date}</span>
									{entry.commit && (
										<span className="text-xs font-mono text-muted/40 border border-border px-1.5 py-0.5 rounded">
											{entry.commit}
										</span>
									)}
									<span className={`text-xs font-mono font-medium ${phaseColors[entry.phaseKey] ?? "text-muted"}`}>
										{t(`devlog.phases.${entry.phaseKey}`)}
									</span>
								</div>

								<h3 className="text-base font-medium text-text">
									{t(`devlog.entry.${entry.key}.title`)}
								</h3>
								<p className="text-sm text-muted leading-relaxed">
									{t(`devlog.entry.${entry.key}.description`)}
								</p>

								{entry.tags && (
									<div className="flex flex-wrap gap-1.5">
										{entry.tags.map((tag) => (
											<span
												key={tag}
												className={`text-xs font-mono border px-2 py-0.5 rounded-full ${tagColors[tag] ?? "border-border text-muted"}`}
											>
												{tag}
											</span>
										))}
									</div>
								)}

								{bugsArr.length > 0 && (
									<div className="flex flex-col gap-1.5 mt-1">
										<p className="text-xs font-mono text-red-400/70 uppercase tracking-wider">
											{t("devlog.bugsLabel")}
										</p>
										<ul className="flex flex-col gap-1">
											{bugsArr.map((bug, j) => (
												<li key={j} className="flex gap-2 text-sm text-muted">
													<span className="text-red-400/60 shrink-0 mt-0.5">✕</span>
													<span>{bug}</span>
												</li>
											))}
										</ul>
									</div>
								)}

								{decisionsArr.length > 0 && (
									<div className="flex flex-col gap-1.5 mt-1">
										<p className="text-xs font-mono text-amber/70 uppercase tracking-wider">
											{t("devlog.decisionsLabel")}
										</p>
										<ul className="flex flex-col gap-1">
											{decisionsArr.map((d, j) => (
												<li key={j} className="flex gap-2 text-sm text-muted">
													<span className="text-amber/60 shrink-0 mt-0.5">→</span>
													<span>{d}</span>
												</li>
											))}
										</ul>
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
