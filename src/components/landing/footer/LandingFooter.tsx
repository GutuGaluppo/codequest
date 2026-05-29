import { FooterBrand } from "./FooterBrand";
import { FooterColumn } from "./FooterColumn";
import { FooterMeta } from "./FooterMeta";
import { useLandingFooter } from "./useLandingFooter";

export function LandingFooter() {
	const { columns, handleAuthLink, interactiveClass, t } = useLandingFooter();

	return (
		<footer className="border-t border-border">
			<div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 py-12 md:grid-cols-4">
				<FooterBrand tagline={t("landing.footer.tagline")} />
				{columns.map((column) => (
					<FooterColumn
						key={column.title}
						column={column}
						interactiveClass={interactiveClass}
						onAuthLink={handleAuthLink}
					/>
				))}
			</div>
			<FooterMeta
				copyright={t("landing.footer.copyright")}
				version={t("landing.footer.version")}
			/>
		</footer>
	);
}
