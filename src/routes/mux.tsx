import { createFileRoute } from "@tanstack/react-router";
import { Code, Zap, TrendingUp, Search, ChevronRight, Terminal } from "lucide-react";

export const Route = createFileRoute("/mux")({
	component: MuxPage,
});

const features = [
	{
		icon: <Brain />,
		title: "AI Tutor",
		description:
			"An AI that understands your level and adapts in real time. No cookie-cutter explanations.",
	},
	{
		icon: <Terminal />,
		title: "Live Editor",
		description:
			"Write, run, and validate code without leaving the browser. Instant feedback on every keystroke.",
	},
	{
		icon: <TrendingUp />,
		title: "Progressive",
		description:
			"Each challenge builds on the last. Track your progress and master topics step by step.",
	},
];

const steps = [
	{
		title: "Pick a topic",
		description:
			"Type anything — a framework, a concept, an algorithm. CodeQuest generates a tailored challenge in seconds.",
	},
	{
		title: "Write real code",
		description:
			"No multiple choice. You write actual code in the editor, against real test cases.",
	},
	{
		title: "Get smarter feedback",
		description:
			"The AI reviews your solution, explains what you missed, and suggests the next step.",
	},
];

const footerLinks = [
	{
		title: "Product",
		links: ["Challenges", "Dashboard", "Progress", "API Keys"],
	},
	{
		title: "Developers",
		links: ["Docs", "Design System", "Dev Log", "GitHub"],
	},
	{
		title: "Company",
		links: ["About", "Blog", "Privacy", "Terms"],
	},
];

const TECH_STRIP = [
	"JavaScript",
	"TypeScript",
	"React",
	"Node.js",
	"Python",
	"Go",
	"Rust",
	"SQL",
];

function Brain() {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
			<path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
			<path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
			<path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
			<path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
			<path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
			<path d="M19.938 10.5a4 4 0 0 1 .585.396" />
			<path d="M6 18a4 4 0 0 1-1.967-.516" />
			<path d="M19.967 17.484A4 4 0 0 1 18 18" />
		</svg>
	);
}

function CodeSnippetDemo() {
	return (
		<div className="border border-border bg-surface">
			<div className="border-b border-border px-4 py-2.5 flex items-center gap-2">
				<div className="flex gap-1.5">
					<div className="w-3 h-3 rounded-full bg-muted/20" />
					<div className="w-3 h-3 rounded-full bg-muted/20" />
					<div className="w-3 h-3 rounded-full bg-muted/20" />
				</div>
				<span className="text-xs font-mono text-muted ml-1">challenge.ts</span>
			</div>
			<div className="p-5 font-mono text-sm leading-relaxed">
				<div className="text-muted/60">{"// Complete the function below"}</div>
				<div className="mt-2">
					<span className="text-amber">function </span>
					<span className="text-green-400">useCounter</span>
					<span className="text-text">(initial: </span>
					<span className="text-amber">number</span>
					<span className="text-text">) {"{"}</span>
				</div>
				<div className="ml-5 mt-1">
					<span className="text-amber">const </span>
					<span className="text-text">[count, setCount] = </span>
					<span className="text-green-400">useState</span>
					<span className="text-text">(initial);</span>
				</div>
				<div className="ml-5 mt-1 text-muted/40">{"// ✏️ your code here..."}</div>
				<div className="ml-5 mt-1">
					<span className="text-amber">return </span>
					<span className="text-text">{"{ count }"}</span>
					<span className="text-muted">;</span>
				</div>
				<div className="mt-1 text-text">{"}"}</div>
				<div className="mt-4 border-t border-border pt-3 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-amber" />
						<span className="text-xs text-amber font-mono">3 / 5 tests passing</span>
					</div>
					<span className="text-xs text-muted font-mono">React Hooks</span>
				</div>
			</div>
		</div>
	);
}

function MuxPage() {
	return (
		<div className="w-full">
			{/* ─── HERO ─────────────────────────────────────────────────────────── */}
			<section className="border-b border-border">
				<div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
					{/* Left */}
					<div>
						<div className="inline-flex items-center gap-2 border border-amber/30 text-amber text-xs font-mono px-3 py-1 mb-8 uppercase tracking-widest">
							<span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
							Beta
						</div>
						<h1 className="text-7xl font-black uppercase leading-none tracking-tight text-text mb-6">
							LEARN
							<br />
							ANY
							<br />
							<span className="text-amber">TOPIC.</span>
						</h1>
						<p className="text-lg text-muted mb-8 max-w-md leading-relaxed">
							AI-powered coding challenges. From zero to fluent in any
							programming topic — in minutes.
						</p>
						<div className="flex gap-0">
							<div className="flex-1 border border-border bg-surface flex items-center px-4 py-3.5 gap-3">
								<Search size={15} className="text-muted shrink-0" />
								<span className="text-muted text-sm font-mono">
									Try "React hooks"
								</span>
							</div>
							<button className="bg-amber text-background px-6 py-3.5 font-black text-sm uppercase tracking-wide flex items-center gap-2 shrink-0">
								Start <ChevronRight size={14} />
							</button>
						</div>
						<div className="flex gap-2 mt-3 flex-wrap">
							{["JavaScript", "React", "Python", "Node.js"].map((t) => (
								<span
									key={t}
									className="text-xs text-muted border border-border px-2.5 py-1 font-mono hover:border-amber/40 hover:text-text transition-colors cursor-default"
								>
									{t}
								</span>
							))}
						</div>
					</div>

					{/* Right */}
					<CodeSnippetDemo />
				</div>
			</section>

			{/* ─── TECH STRIP ───────────────────────────────────────────────────── */}
			<section className="border-b border-border overflow-hidden">
				<div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center gap-6">
					<span className="text-xs font-mono text-muted uppercase tracking-widest whitespace-nowrap shrink-0">
						Learn with
					</span>
					<div className="border-l border-border pl-6 flex items-center gap-8 overflow-hidden">
						{TECH_STRIP.map((tech) => (
							<span
								key={tech}
								className="text-sm font-mono text-muted/50 whitespace-nowrap"
							>
								{tech}
							</span>
						))}
					</div>
				</div>
			</section>

			{/* ─── FEATURES ─────────────────────────────────────────────────────── */}
			<section className="border-b border-border">
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
						{features.map((f) => (
							<div key={f.title} className="p-10 flex flex-col gap-5">
								<div className="w-10 h-10 border border-border flex items-center justify-center text-amber">
									{f.icon}
								</div>
								<div>
									<h3 className="font-black uppercase text-xs tracking-widest text-text">
										{f.title}
									</h3>
									<p className="text-sm text-muted mt-2 leading-relaxed">
										{f.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ─── HOW IT WORKS ─────────────────────────────────────────────────── */}
			<section className="border-b border-border">
				<div className="max-w-7xl mx-auto px-6 py-16">
					<div className="flex items-center gap-5 mb-12">
						<span className="text-xs font-mono text-muted uppercase tracking-widest whitespace-nowrap">
							How it works
						</span>
						<div className="flex-1 border-t border-border" />
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 border border-border divide-y md:divide-y-0 md:divide-x divide-border">
						{steps.map((step, i) => (
							<div key={i} className="p-10">
								<div className="text-5xl font-black text-amber/15 mb-6 font-mono leading-none">
									0{i + 1}
								</div>
								<h3 className="font-bold text-text mb-2">{step.title}</h3>
								<p className="text-sm text-muted leading-relaxed">
									{step.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ─── STATS ────────────────────────────────────────────────────────── */}
			<section className="border-b border-border">
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
						{[
							{ value: "50+", label: "Languages & Frameworks" },
							{ value: "< 3s", label: "Challenge generation" },
							{ value: "100%", label: "In-browser, no setup" },
						].map((stat) => (
							<div
								key={stat.label}
								className="px-10 py-12 flex flex-col gap-2"
							>
								<div className="text-4xl font-black text-amber leading-none">
									{stat.value}
								</div>
								<div className="text-xs font-mono text-muted uppercase tracking-widest">
									{stat.label}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ─── EDITOR PREVIEW ───────────────────────────────────────────────── */}
			<section className="border-b border-border">
				<div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
					<div>
						<span className="text-xs font-mono text-muted uppercase tracking-widest">
							The editor
						</span>
						<h2 className="text-4xl font-black uppercase text-text mt-3 mb-4 leading-tight">
							REAL CODE.
							<br />
							<span className="text-amber">REAL FEEDBACK.</span>
						</h2>
						<p className="text-muted leading-relaxed mb-6">
							No drag-and-drop blocks. No fill-in-the-blank. You write code in
							a real editor with syntax highlighting, autocomplete, and live
							test output.
						</p>
						<div className="flex flex-col gap-3">
							{[
								{ icon: <Code size={14} />, text: "Syntax highlighting for 50+ languages" },
								{ icon: <Zap size={14} />, text: "Instant test runner with detailed output" },
								{ icon: <Brain />, text: "AI explains every failing test" },
							].map((item) => (
								<div key={item.text} className="flex items-center gap-3">
									<div className="text-amber shrink-0">{item.icon}</div>
									<span className="text-sm text-muted">{item.text}</span>
								</div>
							))}
						</div>
					</div>
					<div className="border border-border bg-surface">
						<div className="border-b border-border px-4 py-2.5 flex items-center justify-between">
							<div className="flex gap-1.5">
								<div className="w-3 h-3 rounded-full bg-muted/20" />
								<div className="w-3 h-3 rounded-full bg-muted/20" />
								<div className="w-3 h-3 rounded-full bg-muted/20" />
							</div>
							<span className="text-xs font-mono text-muted">Output</span>
						</div>
						<div className="p-5 font-mono text-xs leading-relaxed space-y-2">
							<div className="flex items-center gap-3">
								<span className="text-green-400">✓</span>
								<span className="text-muted">returns initial value</span>
							</div>
							<div className="flex items-center gap-3">
								<span className="text-green-400">✓</span>
								<span className="text-muted">increments count</span>
							</div>
							<div className="flex items-center gap-3">
								<span className="text-green-400">✓</span>
								<span className="text-muted">decrements count</span>
							</div>
							<div className="flex items-center gap-3">
								<span className="text-red-400">✗</span>
								<span className="text-muted">does not go below 0</span>
							</div>
							<div className="flex items-center gap-3">
								<span className="text-red-400">✗</span>
								<span className="text-muted">resets to initial value</span>
							</div>
							<div className="mt-4 border-t border-border pt-4">
								<div className="text-muted/60 mb-2">
									{"// AI suggestion:"}
								</div>
								<div className="text-amber/80 text-xs">
									Add a guard clause: if (count {">"} 0) before calling
									setCount(c ={">"} c - 1)
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ─── FINAL CTA ────────────────────────────────────────────────────── */}
			<section className="bg-amber">
				<div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
					<div>
						<h2 className="text-4xl font-black uppercase text-background leading-tight">
							READY TO CODE?
						</h2>
						<p className="text-background/60 mt-1 text-sm font-mono">
							No credit card. No setup. Just pick a topic.
						</p>
					</div>
					<button className="bg-background text-amber px-8 py-4 font-black uppercase text-sm tracking-wide flex items-center gap-2 shrink-0">
						Get started free <ChevronRight size={16} />
					</button>
				</div>
			</section>

			{/* ─── FOOTER ───────────────────────────────────────────────────────── */}
			<footer className="border-t border-border">
				<div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-10">
					<div>
						<div className="text-amber font-mono font-bold mb-4 text-sm">
							CodeQuest_
						</div>
						<p className="text-xs text-muted leading-relaxed">
							AI-powered coding challenges for developers who want to actually
							learn.
						</p>
					</div>
					{footerLinks.map((col) => (
						<div key={col.title}>
							<h4 className="text-xs font-mono uppercase tracking-widest text-muted mb-4">
								{col.title}
							</h4>
							<ul className="flex flex-col gap-2.5">
								{col.links.map((link) => (
									<li key={link}>
										<span className="text-sm text-muted/60 font-mono cursor-default">
											{link}
										</span>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
				<div className="border-t border-border">
					<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
						<span className="text-xs font-mono text-muted/30">
							© 2026 CodeQuest
						</span>
						<span className="text-xs font-mono text-muted/30">
							v0.1.0 — beta
						</span>
					</div>
				</div>
			</footer>
		</div>
	);
}
