import type { ReactNode } from "react";

export interface SitePageStat {
	label: string;
	value: string;
}

export interface SitePageSection {
	title: string;
	description: string;
}

export interface SitePageSidebar {
	title: string;
	description?: string;
	items: string[];
	note?: string;
}

interface SitePageProps {
	eyebrow: string;
	title: string;
	description: string;
	actions?: ReactNode;
	stats?: SitePageStat[];
	sections?: SitePageSection[];
	sidebar?: SitePageSidebar;
	children?: ReactNode;
}

export const primaryActionClass =
	"inline-flex items-center gap-2 bg-amber px-5 py-3 text-xs font-black uppercase tracking-wide text-background";

export const secondaryActionClass =
	"inline-flex items-center gap-2 border border-border px-5 py-3 text-xs font-black uppercase tracking-wide text-text transition-colors hover:border-amber hover:text-amber";

export const subtleActionClass =
	"inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted transition-colors hover:text-text";

export function SitePage({
	eyebrow,
	title,
	description,
	actions,
	stats,
	sections,
	sidebar,
	children,
}: SitePageProps) {
	const showOverview = (sections?.length ?? 0) > 0 || !!sidebar;

	return (
		<div className="w-full">
			<section className="border-b border-border">
				<div className="max-w-7xl mx-auto px-6 py-12">
					<div className="max-w-3xl">
						<span className="text-xs font-mono uppercase tracking-widest text-muted">
							{eyebrow}
						</span>
						<h1 className="mt-2 text-4xl md:text-5xl font-black uppercase leading-none text-text">
							{title}
						</h1>
						<p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-muted">
							{description}
						</p>
						{actions ? (
							<div className="mt-8 flex flex-wrap items-center gap-3">
								{actions}
							</div>
						) : null}
					</div>

					{stats?.length ? (
						<div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
							{stats.map((stat) => (
								<div
									key={stat.label}
									className="border border-border bg-surface/40 p-5"
								>
									<p className="text-2xl font-black uppercase text-text">
										{stat.value}
									</p>
									<p className="mt-2 text-xs font-mono uppercase tracking-widest text-muted">
										{stat.label}
									</p>
								</div>
							))}
						</div>
					) : null}
				</div>
			</section>

			{showOverview ? (
				<section className="border-b border-border">
					<div className="max-w-7xl mx-auto grid grid-cols-1 gap-6 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_320px]">
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							{sections?.map((section) => (
								<div
									key={section.title}
									className="border border-border bg-surface/30 p-5"
								>
									<h2 className="text-xs font-black uppercase tracking-widest text-text">
										{section.title}
									</h2>
									<p className="mt-3 text-sm leading-relaxed text-muted">
										{section.description}
									</p>
								</div>
							))}
						</div>

						{sidebar ? (
							<aside className="h-fit border border-border bg-surface/40 p-6">
								<h2 className="text-xs font-black uppercase tracking-widest text-text">
									{sidebar.title}
								</h2>
								{sidebar.description ? (
									<p className="mt-3 text-sm leading-relaxed text-muted">
										{sidebar.description}
									</p>
								) : null}
								<ul className="mt-5 flex flex-col gap-3">
									{sidebar.items.map((item) => (
										<li
											key={item}
											className="border-l border-amber/40 pl-3 text-sm text-muted"
										>
											{item}
										</li>
									))}
								</ul>
								{sidebar.note ? (
									<p className="mt-5 text-xs font-mono leading-relaxed text-muted">
										{sidebar.note}
									</p>
								) : null}
							</aside>
						) : null}
					</div>
				</section>
			) : null}

			{children ? (
				<section className="border-b border-border">
					<div className="max-w-7xl mx-auto px-6 py-12">{children}</div>
				</section>
			) : null}
		</div>
	);
}
