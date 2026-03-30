import { useTranslation } from "react-i18next";

export function ProfileHeader() {
	const { t } = useTranslation();

	return (
		<section className="border-b border-border">
			<div className="max-w-7xl mx-auto px-6 py-10">
				<span className="text-xs font-mono text-muted uppercase tracking-widest">
					{t("profile.subtitle")}
				</span>
				<h1 className="text-4xl font-black uppercase text-text mt-1 leading-none">
					{t("profile.title")}
				</h1>
			</div>
		</section>
	);
}
