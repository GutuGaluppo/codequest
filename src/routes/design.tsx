import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/design")({
	component: DesignPage,
});

const colors = [
	{ name: "background", value: "#0d0f14", label: "Background", usage: "bg-background" },
	{ name: "surface", value: "#13161e", label: "Surface", usage: "bg-surface" },
	{ name: "border", value: "#1e2130", label: "Border", usage: "border-border" },
	{ name: "text", value: "#e8eaf0", label: "Text", usage: "text-text" },
	{ name: "muted", value: "#6b7280", label: "Muted", usage: "text-muted" },
	{ name: "amber", value: "#f5a623", label: "Amber", usage: "text-amber / bg-amber" },
	{ name: "green", value: "#4ade80", label: "Green", usage: "text-green" },
];

const typeScale = [
	{ label: "xs", size: "0.75rem / 12px", className: "text-xs" },
	{ label: "sm", size: "0.875rem / 14px", className: "text-sm" },
	{ label: "base", size: "1rem / 16px", className: "text-base" },
	{ label: "lg", size: "1.125rem / 18px", className: "text-lg" },
	{ label: "xl", size: "1.25rem / 20px", className: "text-xl" },
	{ label: "2xl", size: "1.5rem / 24px", className: "text-2xl" },
	{ label: "3xl", size: "1.875rem / 30px", className: "text-3xl" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<section className="flex flex-col gap-4">
			<h2 className="text-xs font-mono text-muted uppercase tracking-widest border-b border-border pb-2">
				{title}
			</h2>
			{children}
		</section>
	);
}

function DesignPage() {
	const { t } = useTranslation();

	return (
		<div className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-14">
			<div>
				<h1 className="text-2xl font-mono font-bold text-text">{t("design.title")}</h1>
				<p className="text-sm text-muted mt-1">{t("design.subtitle")}</p>
			</div>

			{/* CORES */}
			<Section title={t("design.sections.colors")}>
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
					{colors.map((c) => (
						<div key={c.name} className="flex flex-col gap-2 border border-border rounded p-3 bg-surface">
							<div className="h-10 w-full rounded" style={{ backgroundColor: c.value }} />
							<div>
								<p className="text-sm font-mono font-medium text-text">{c.label}</p>
								<p className="text-xs font-mono text-muted">{c.value}</p>
								<p className="text-xs text-muted/60 mt-0.5">{c.usage}</p>
							</div>
						</div>
					))}
				</div>
			</Section>

			{/* TIPOGRAFIA */}
			<Section title={t("design.sections.typography")}>
				<div className="flex flex-col gap-6">
					<div>
						<p className="text-xs font-mono text-muted mb-3">{t("design.typography.sansLabel")}</p>
						<div className="flex flex-col gap-3">
							{typeScale.map((ts) => (
								<div key={ts.label} className="flex items-baseline justify-between gap-4 border-b border-border/50 pb-3">
									<span className={`${ts.className} text-text`}>{t("design.typography.sansSample")}</span>
									<span className="text-xs font-mono text-muted shrink-0">{ts.label} · {ts.size}</span>
								</div>
							))}
						</div>
					</div>
					<div>
						<p className="text-xs font-mono text-muted mb-3">{t("design.typography.monoLabel")}</p>
						<div className="flex flex-col gap-3">
							{typeScale.map((ts) => (
								<div key={ts.label} className="flex items-baseline justify-between gap-4 border-b border-border/50 pb-3">
									<span className={`${ts.className} font-mono text-text`}>{t("design.typography.monoSample")}</span>
									<span className="text-xs font-mono text-muted shrink-0">{ts.label} · {ts.size}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</Section>

			{/* FONT WEIGHTS */}
			<Section title={t("design.sections.fontWeights")}>
				<div className="flex flex-wrap gap-6">
					{[
						{ label: "Regular", w: "font-normal" },
						{ label: "Medium", w: "font-medium" },
						{ label: "Semibold", w: "font-semibold" },
						{ label: "Bold", w: "font-bold" },
						{ label: "Black", w: "font-black" },
					].map(({ label, w }) => (
						<div key={label} className="flex flex-col gap-1">
							<span className={`text-xl ${w} text-text`}>Aa</span>
							<span className="text-xs font-mono text-muted">{label}</span>
						</div>
					))}
				</div>
			</Section>

			{/* BOTÕES */}
			<Section title={t("design.sections.buttons")}>
				<div className="flex flex-wrap gap-3">
					<button className="bg-amber text-background px-4 py-2 rounded font-medium text-sm">{t("design.buttons.primary")}</button>
					<button className="border border-border text-text px-4 py-2 rounded font-medium text-sm">{t("design.buttons.secondary")}</button>
					<button className="text-sm text-muted hover:text-text transition-colors">{t("design.buttons.ghost")}</button>
					<button className="bg-amber text-background px-4 py-2 rounded font-medium text-sm opacity-40" disabled>{t("design.buttons.disabled")}</button>
				</div>
			</Section>

			{/* BADGES */}
			<Section title={t("design.sections.badges")}>
				<div className="flex flex-wrap gap-3">
					<span className="border border-amber/40 text-amber text-xs font-mono px-3 py-1 rounded-full">amber</span>
					<span className="border border-green/40 text-green text-xs font-mono px-3 py-1 rounded-full">success</span>
					<span className="border border-border text-muted text-xs font-mono px-3 py-1 rounded-full">neutral</span>
					<span className="border border-red-500/40 text-red-400 text-xs font-mono px-3 py-1 rounded-full">error</span>
				</div>
			</Section>

			{/* INPUTS */}
			<Section title={t("design.sections.inputs")}>
				<div className="flex flex-col gap-3 max-w-sm">
					<input className="bg-surface border border-border text-text text-sm font-mono px-3 py-2 rounded focus:outline-none focus:border-amber/60 w-full" placeholder="Default input" />
					<input className="bg-surface border border-amber/60 text-text text-sm font-mono px-3 py-2 rounded focus:outline-none w-full" placeholder="Focused state" />
					<input className="bg-surface border border-red-500/50 text-text text-sm font-mono px-3 py-2 rounded focus:outline-none w-full" placeholder="Error state" />
				</div>
			</Section>

			{/* CARDS */}
			<Section title={t("design.sections.cards")}>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div className="bg-surface border border-border rounded p-4 flex flex-col gap-2">
						<p className="text-sm font-mono font-medium text-text">{t("design.cards.defaultLabel")}</p>
						<p className="text-xs text-muted">{t("design.cards.defaultSub")}</p>
					</div>
					<div className="bg-surface border border-amber/30 rounded p-4 flex flex-col gap-2">
						<p className="text-sm font-mono font-medium text-amber">{t("design.cards.highlightLabel")}</p>
						<p className="text-xs text-muted">{t("design.cards.highlightSub")}</p>
					</div>
				</div>
			</Section>

			{/* SPACING */}
			<Section title={t("design.sections.spacing")}>
				<div className="flex flex-wrap items-end gap-4">
					{[1, 2, 3, 4, 6, 8, 10, 12, 16, 20].map((n) => (
						<div key={n} className="flex flex-col items-center gap-1">
							<div className="bg-amber/30 border border-amber/40 rounded-sm" style={{ width: `${n * 4}px`, height: "24px" }} />
							<span className="text-xs font-mono text-muted">{n}</span>
							<span className="text-xs font-mono text-muted/50">{n * 4}px</span>
						</div>
					))}
				</div>
			</Section>

			{/* BORDER RADIUS */}
			<Section title={t("design.sections.borderRadius")}>
				<div className="flex flex-wrap items-center gap-6">
					{["rounded-sm", "rounded", "rounded-md", "rounded-lg", "rounded-xl", "rounded-full"].map((cls) => (
						<div key={cls} className="flex flex-col items-center gap-2">
							<div className={`w-12 h-12 bg-surface border border-amber/40 ${cls}`} />
							<span className="text-xs font-mono text-muted">{cls}</span>
						</div>
					))}
				</div>
			</Section>
		</div>
	);
}
