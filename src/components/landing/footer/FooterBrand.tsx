export function FooterBrand({ tagline }: { tagline: string }) {
	return (
		<div>
			<div className="mb-4 text-sm font-mono font-bold text-amber">
				CodeQuest_
			</div>
			<p className="text-xs leading-relaxed text-muted">{tagline}</p>
		</div>
	);
}
