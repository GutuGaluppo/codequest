import { ChevronRight, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

export function TopicSearchForm({
	topic,
	setTopic,
	handleSubmit,
}: {
	topic: string;
	setTopic: (topic: string) => void;
	handleSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
}) {
	const { t } = useTranslation();

	return (
		<form onSubmit={handleSubmit} className="flex gap-0">
			<div className="relative flex-1">
				<label htmlFor="topic-search" className="sr-only">
					{t("landing.search.placeholder")}
				</label>
				<Search
					size={15}
					className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
				/>
				<input
					id="topic-search"
					type="search"
					value={topic}
					onChange={(e) => setTopic(e.target.value)}
					placeholder={t("landing.search.placeholder")}
					className="w-full bg-surface border border-border pl-10 pr-4 py-3.5 text-text placeholder:text-muted focus:outline-none focus:border-amber transition-colors text-sm font-mono"
				/>
			</div>
			<button
				type="submit"
				className="bg-amber text-background px-6 py-3.5 font-black text-xs uppercase tracking-wide flex items-center gap-2 shrink-0"
			>
				{t("landing.search.button")} <ChevronRight size={14} />
			</button>
		</form>
	);
}
