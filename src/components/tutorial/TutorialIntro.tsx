import type { Tutorial } from "../../types/tutorial";

export function TutorialIntro({
	tutorial,
	onStart,
}: {
	tutorial: Tutorial;
	onStart: () => void;
}) {
	const { topic, level, introduction } = tutorial;

	return (
		<div className="max-w-2xl mx-auto px-6 py-12 flex flex-col gap-8">
			<div className="flex flex-col gap-3">
				<div className="flex items-center gap-3">
					<span className="text-xs font-mono text-amber border border-amber/30 px-2 py-0.5">
						{level.toUpperCase()}
					</span>
				</div>
				<h1 className="text-3xl font-black uppercase tracking-widest text-text">
					{topic}
				</h1>
			</div>

			{introduction ? (
				<>
					<section className="flex flex-col gap-2">
						<p className="text-xs font-mono uppercase tracking-widest text-muted">Overview</p>
						<p className="text-sm text-text leading-relaxed">{introduction.overview}</p>
					</section>

					<section className="flex flex-col gap-2">
						<p className="text-xs font-mono uppercase tracking-widest text-muted">Real-world usage</p>
						<p className="text-sm text-text leading-relaxed">{introduction.realWorldUse}</p>
					</section>

					<div className="grid grid-cols-2 gap-4">
						<section className="border border-border p-4 flex flex-col gap-3">
							<p className="text-xs font-mono uppercase tracking-widest text-muted">Pros</p>
							<ul className="flex flex-col gap-1.5">
								{introduction.pros.map((pro, i) => (
									<li key={i} className="flex gap-2 text-sm text-text">
										<span className="text-amber/60 shrink-0">→</span>
										<span>{pro}</span>
									</li>
								))}
							</ul>
						</section>

						<section className="border border-border p-4 flex flex-col gap-3">
							<p className="text-xs font-mono uppercase tracking-widest text-muted">Cons</p>
							<ul className="flex flex-col gap-1.5">
								{introduction.cons.map((con, i) => (
									<li key={i} className="flex gap-2 text-sm text-text">
										<span className="text-red-400/60 shrink-0">✕</span>
										<span>{con}</span>
									</li>
								))}
							</ul>
						</section>
					</div>

					{introduction.prerequisites.length > 0 && (
						<section className="flex flex-col gap-2">
							<p className="text-xs font-mono uppercase tracking-widest text-muted">Prerequisites</p>
							<ul className="flex flex-col gap-1.5">
								{introduction.prerequisites.map((prereq, i) => (
									<li key={i} className="flex gap-2 text-sm text-text">
										<span className="text-muted shrink-0">·</span>
										<span>{prereq}</span>
									</li>
								))}
							</ul>
						</section>
					)}
				</>
			) : (
				<p className="text-sm text-muted">No introduction available for this tutorial.</p>
			)}

			<button
				onClick={onStart}
				className="self-start text-xs font-black uppercase tracking-wide border border-amber text-amber px-6 py-2.5 hover:bg-amber hover:text-background transition-colors"
			>
				Start Tutorial →
			</button>
		</div>
	);
}
