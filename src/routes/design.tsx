import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ChevronRight, Zap, Code } from "lucide-react";

export const Route = createFileRoute("/design")({
	component: DesignPage,
});

const colors = [
	{ name: "background", value: "#0d0f14", label: "Background", usage: "bg-background" },
	{ name: "surface", value: "#13161e", label: "Surface", usage: "bg-surface" },
	{ name: "border", value: "#1e2130", label: "Border", usage: "border-border" },
	{ name: "text", value: "#e8eaf0", label: "Text", usage: "text-text" },
	{ name: "muted", value: "#8b93a6", label: "Muted", usage: "text-muted" },
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
	{ label: "4xl", size: "2.25rem / 36px", className: "text-4xl" },
	{ label: "5xl", size: "3rem / 48px", className: "text-5xl" },
	{ label: "7xl", size: "4.5rem / 72px", className: "text-7xl" },
];

function SectionHeader({ label, title }: { label: string; title: string }) {
	return (
		<div className="border-b border-border">
			<div className="max-w-7xl mx-auto px-6 py-8">
				<div className="flex items-center gap-5 mb-2">
					<span className="text-xs font-mono text-muted uppercase tracking-widest whitespace-nowrap">
						{label}
					</span>
					<div className="flex-1 border-t border-border" />
				</div>
				<h2 className="text-2xl font-black uppercase text-text leading-none">{title}</h2>
			</div>
		</div>
	);
}

function DesignPage() {
	const { t } = useTranslation();

	return (
		<div className="w-full">
			{/* ─── PAGE HEADER ────────────────────────────────────────────────── */}
			<section className="border-b border-border">
				<div className="max-w-7xl mx-auto px-6 py-10">
					<span className="text-xs font-mono text-muted uppercase tracking-widest">
						{t("design.subtitle")}
					</span>
					<h1 className="text-4xl font-black uppercase text-text mt-1 leading-none">
						{t("design.title")}
					</h1>
				</div>
			</section>

			{/* ─── PRINCIPLES ─────────────────────────────────────────────────── */}
			<section className="border-b border-border">
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
						{[
							{ n: "01", title: "Sharp edges", body: "No border-radius on interactive elements. Buttons, inputs, and cards use flat rectangular forms." },
							{ n: "02", title: "Border dividers", body: "Sections and grids are separated by borders, not shadows or background color shifts." },
							{ n: "03", title: "Uppercase labels", body: "Section titles, button text, and metadata use font-black uppercase with tracking-widest." },
						].map((p) => (
							<div key={p.n} className="p-10">
								<div className="text-4xl font-black text-amber/15 font-mono mb-4 leading-none">{p.n}</div>
								<h3 className="font-black uppercase text-xs tracking-widest text-text mb-2">{p.title}</h3>
								<p className="text-sm text-muted leading-relaxed">{p.body}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ─── COLORS ─────────────────────────────────────────────────────── */}
			<SectionHeader label={t("design.sections.colors")} title="Color Tokens" />
			<section className="border-b border-border">
				<div className="max-w-7xl mx-auto px-6 py-10">
					<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-0 border border-border divide-x divide-border">
						{colors.map((c) => (
							<div key={c.name} className="flex flex-col">
								<div className="h-16" style={{ backgroundColor: c.value }} />
								<div className="p-3 border-t border-border">
									<p className="text-xs font-black uppercase tracking-widest text-text">{c.label}</p>
									<p className="text-xs font-mono text-muted mt-0.5">{c.value}</p>
									<p className="text-xs text-muted/50 font-mono mt-0.5">{c.usage}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ─── TYPOGRAPHY ─────────────────────────────────────────────────── */}
			<SectionHeader label={t("design.sections.typography")} title="Type Scale" />
			<section className="border-b border-border">
				<div className="max-w-7xl mx-auto px-6 py-10">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
						<div>
							<p className="text-xs font-mono text-muted mb-4 uppercase tracking-widest">
								{t("design.typography.sansLabel")} — Inter
							</p>
							<div className="flex flex-col border border-border divide-y divide-border">
								{typeScale.map((ts) => (
									<div key={ts.label} className="flex items-baseline justify-between gap-4 px-4 py-3">
										<span className={`${ts.className} text-text truncate`}>
											{t("design.typography.sansSample")}
										</span>
										<span className="text-xs font-mono text-muted shrink-0">
											{ts.label} · {ts.size}
										</span>
									</div>
								))}
							</div>
						</div>
						<div>
							<p className="text-xs font-mono text-muted mb-4 uppercase tracking-widest">
								{t("design.typography.monoLabel")} — JetBrains Mono
							</p>
							<div className="flex flex-col border border-border divide-y divide-border">
								{typeScale.map((ts) => (
									<div key={ts.label} className="flex items-baseline justify-between gap-4 px-4 py-3">
										<span className={`${ts.className} font-mono text-text truncate`}>
											{t("design.typography.monoSample")}
										</span>
										<span className="text-xs font-mono text-muted shrink-0">
											{ts.label} · {ts.size}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ─── FONT WEIGHTS ───────────────────────────────────────────────── */}
			<SectionHeader label={t("design.sections.fontWeights")} title="Font Weights" />
			<section className="border-b border-border">
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-border border-b border-border">
						{[
							{ label: "Regular", w: "font-normal" },
							{ label: "Medium", w: "font-medium" },
							{ label: "Semibold", w: "font-semibold" },
							{ label: "Bold", w: "font-bold" },
							{ label: "Black", w: "font-black" },
						].map(({ label, w }) => (
							<div key={label} className="p-8 flex flex-col gap-2">
								<span className={`text-3xl ${w} text-text`}>Aa</span>
								<span className="text-xs font-mono text-muted uppercase tracking-widest">{label}</span>
							</div>
						))}
					</div>
					<div className="px-6 py-6 bg-surface/30">
						<p className="text-xs font-mono text-muted uppercase tracking-widest mb-3">
							Heading pattern
						</p>
						<div className="flex flex-col gap-2">
							<p className="text-xs font-mono text-muted/60">
								{"// Section headings: font-black + uppercase + tracking-widest"}
							</p>
							<h3 className="text-2xl font-black uppercase tracking-widest text-text">
								Section Title
							</h3>
							<p className="text-xs font-mono text-muted/60 mt-2">
								{"// Labels & metadata: font-mono + uppercase + tracking-widest"}
							</p>
							<span className="text-xs font-mono text-muted uppercase tracking-widest">
								subsection label
							</span>
						</div>
					</div>
				</div>
			</section>

			{/* ─── BUTTONS ────────────────────────────────────────────────────── */}
			<SectionHeader label={t("design.sections.buttons")} title="Buttons" />
			<section className="border-b border-border">
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
						<div className="p-10 flex flex-col gap-6">
							<div>
								<p className="text-xs font-mono text-muted uppercase tracking-widest mb-4">Variants</p>
								<div className="flex flex-wrap gap-3">
									<button className="bg-amber text-background px-5 py-2.5 font-black text-xs uppercase tracking-wide">
										{t("design.buttons.primary")}
									</button>
									<button className="border border-border text-text px-5 py-2.5 font-black text-xs uppercase tracking-wide hover:border-amber hover:text-amber transition-colors">
										{t("design.buttons.secondary")}
									</button>
									<button className="text-xs font-mono text-muted uppercase tracking-widest hover:text-text transition-colors">
										{t("design.buttons.ghost")}
									</button>
									<button className="bg-amber text-background px-5 py-2.5 font-black text-xs uppercase tracking-wide opacity-40" disabled>
										{t("design.buttons.disabled")}
									</button>
								</div>
							</div>
							<div>
								<p className="text-xs font-mono text-muted uppercase tracking-widest mb-4">With icon</p>
								<div className="flex flex-wrap gap-3">
									<button className="bg-amber text-background px-5 py-2.5 font-black text-xs uppercase tracking-wide flex items-center gap-2">
										Get started <ChevronRight size={12} />
									</button>
									<button className="border border-border text-text px-5 py-2.5 font-black text-xs uppercase tracking-wide flex items-center gap-2 hover:border-amber hover:text-amber transition-colors">
										<Zap size={12} /> Configure
									</button>
								</div>
							</div>
						</div>
						<div className="p-10 bg-surface/20">
							<p className="text-xs font-mono text-muted uppercase tracking-widest mb-4">On amber bg</p>
							<div className="bg-amber p-6 flex flex-wrap gap-3">
								<button className="bg-background text-amber px-5 py-2.5 font-black text-xs uppercase tracking-wide">
									Inverse primary
								</button>
								<button className="border border-background/20 text-background px-5 py-2.5 font-black text-xs uppercase tracking-wide">
									Inverse secondary
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ─── BADGES ─────────────────────────────────────────────────────── */}
			<SectionHeader label={t("design.sections.badges")} title="Badges" />
			<section className="border-b border-border">
				<div className="max-w-7xl mx-auto px-6 py-10 flex flex-wrap gap-4">
					<span className="border border-amber/40 text-amber text-xs font-mono px-3 py-1 uppercase tracking-widest">amber</span>
					<span className="border border-green/40 text-green text-xs font-mono px-3 py-1 uppercase tracking-widest">success</span>
					<span className="border border-border text-muted text-xs font-mono px-3 py-1 uppercase tracking-widest">neutral</span>
					<span className="border border-red-500/40 text-red-400 text-xs font-mono px-3 py-1 uppercase tracking-widest">error</span>
					<div className="flex items-center gap-2 border border-amber/30 text-amber text-xs font-mono px-3 py-1">
						<span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
						<span className="uppercase tracking-widest">live</span>
					</div>
				</div>
			</section>

			{/* ─── INPUTS ─────────────────────────────────────────────────────── */}
			<SectionHeader label={t("design.sections.inputs")} title="Inputs" />
			<section className="border-b border-border">
				<div className="max-w-7xl mx-auto px-6 py-10">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
						<div className="flex flex-col gap-3">
							<p className="text-xs font-mono text-muted uppercase tracking-widest">States</p>
							<input className="bg-surface border border-border text-text text-sm font-mono px-3 py-2.5 focus:outline-none focus:border-amber w-full transition-colors" placeholder="Default input" />
							<input className="bg-surface border border-amber text-text text-sm font-mono px-3 py-2.5 focus:outline-none w-full" placeholder="Focused state" />
							<input className="bg-surface border border-red-500/60 text-text text-sm font-mono px-3 py-2.5 focus:outline-none w-full" placeholder="Error state" />
							<input className="bg-surface border border-border text-muted text-sm font-mono px-3 py-2.5 focus:outline-none w-full opacity-50 cursor-not-allowed" placeholder="Disabled" disabled />
						</div>
						<div className="flex flex-col gap-3">
							<p className="text-xs font-mono text-muted uppercase tracking-widest">Search pattern</p>
							<div className="flex gap-0">
								<div className="relative flex-1">
									<Code size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
									<input className="w-full bg-surface border border-border pl-9 pr-4 py-2.5 text-text placeholder:text-muted focus:outline-none focus:border-amber transition-colors text-sm font-mono" placeholder='Try "React hooks"' />
								</div>
								<button className="bg-amber text-background px-4 py-2.5 font-black text-xs uppercase tracking-wide">
									Go
								</button>
							</div>
							<p className="text-xs font-mono text-muted uppercase tracking-widest mt-2">Select</p>
							<select className="bg-surface border border-border px-3 py-2.5 text-text focus:outline-none focus:border-amber transition-colors text-sm">
								<option>Option one</option>
								<option>Option two</option>
							</select>
						</div>
					</div>
				</div>
			</section>

			{/* ─── CARDS / GRID PATTERNS ──────────────────────────────────────── */}
			<SectionHeader label={t("design.sections.cards")} title="Cards & Grid Patterns" />
			<section className="border-b border-border">
				<div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-10">
					<div>
						<p className="text-xs font-mono text-muted uppercase tracking-widest mb-4">Flat card (border-only)</p>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<div className="border border-border p-5 flex flex-col gap-3 hover:border-amber/40 transition-colors">
								<div className="w-8 h-8 border border-border flex items-center justify-center text-amber">
									<Zap size={14} />
								</div>
								<div>
									<p className="text-xs font-black uppercase tracking-widest text-text">{t("design.cards.defaultLabel")}</p>
									<p className="text-xs text-muted mt-1">{t("design.cards.defaultSub")}</p>
								</div>
							</div>
							<div className="border border-amber/30 p-5 flex flex-col gap-3">
								<div className="w-8 h-8 border border-amber/30 flex items-center justify-center text-amber">
									<Zap size={14} />
								</div>
								<div>
									<p className="text-xs font-black uppercase tracking-widest text-amber">{t("design.cards.highlightLabel")}</p>
									<p className="text-xs text-muted mt-1">{t("design.cards.highlightSub")}</p>
								</div>
							</div>
							<div className="border border-border p-5 flex flex-col gap-3 opacity-50">
								<div className="w-8 h-8 border border-border flex items-center justify-center text-muted">
									<Zap size={14} />
								</div>
								<div>
									<p className="text-xs font-black uppercase tracking-widest text-muted">Muted card</p>
									<p className="text-xs text-muted/60 mt-1">Reduced opacity variant.</p>
								</div>
							</div>
						</div>
					</div>

					<div>
						<p className="text-xs font-mono text-muted uppercase tracking-widest mb-4">Divide grid (no gap)</p>
						<div className="border border-border grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
							{["Feature A", "Feature B", "Feature C"].map((label, i) => (
								<div key={label} className="p-8">
									<div className="text-3xl font-black text-amber/15 font-mono mb-3 leading-none">0{i + 1}</div>
									<p className="text-xs font-black uppercase tracking-widest text-text">{label}</p>
									<p className="text-xs text-muted mt-1">Description text sits here.</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* ─── SPACING ────────────────────────────────────────────────────── */}
			<SectionHeader label={t("design.sections.spacing")} title="Spacing Scale" />
			<section className="border-b border-border">
				<div className="max-w-7xl mx-auto px-6 py-10">
					<div className="flex flex-wrap items-end gap-6">
						{[1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24].map((n) => (
							<div key={n} className="flex flex-col items-center gap-2">
								<div
									className="bg-amber/20 border border-amber/30"
									style={{ width: `${n * 4}px`, height: "28px" }}
								/>
								<span className="text-xs font-mono text-muted">{n}</span>
								<span className="text-xs font-mono text-muted/40">{n * 4}px</span>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ─── LAYOUT CONTAINERS ──────────────────────────────────────────── */}
			<SectionHeader label="layout" title="Containers & Sections" />
			<section className="border-b border-border">
				<div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-6">
					<div className="flex flex-col gap-3">
						<p className="text-xs font-mono text-muted uppercase tracking-widest">Page section pattern</p>
						<div className="font-mono text-xs bg-surface border border-border p-4 space-y-1">
							<div className="text-muted/60">{"// Full-width section with inner container"}</div>
							<div>
								<span className="text-amber">{"<section"}</span>
								<span className="text-green-400">{" className"}</span>
								<span className="text-text">{"="}</span>
								<span className="text-text">{'"border-b border-border"'}</span>
								<span className="text-amber">{">"}</span>
							</div>
							<div className="ml-4">
								<span className="text-amber">{"<div"}</span>
								<span className="text-green-400">{" className"}</span>
								<span className="text-text">{"="}</span>
								<span className="text-text">{'"max-w-7xl mx-auto px-6 py-16"'}</span>
								<span className="text-amber">{">"}</span>
							</div>
							<div className="ml-8 text-muted/60">{"// content"}</div>
							<div className="ml-4 text-amber">{"</div>"}</div>
							<div className="text-amber">{"</section>"}</div>
						</div>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						{[
							{ label: "max-w-7xl", desc: "Page sections, full-width layouts" },
							{ label: "max-w-2xl", desc: "Forms, focused content" },
							{ label: "max-w-lg", desc: "Narrow single-column forms" },
						].map((c) => (
							<div key={c.label} className="border border-border p-4">
								<p className="text-xs font-mono font-bold text-amber">{c.label}</p>
								<p className="text-xs text-muted mt-1">{c.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
