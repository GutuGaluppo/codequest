export function FooterMeta({
	copyright,
	version,
}: {
	copyright: string;
	version: string;
}) {
	return (
		<div className="border-t border-border">
			<div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
				<span className="text-xs font-mono text-muted">{copyright}</span>
				<span className="text-xs font-mono text-muted">{version}</span>
			</div>
		</div>
	);
}
