import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const LANGUAGES = [
	{ code: "pt-BR", label: "Português" },
	{ code: "en", label: "English" },
	{ code: "es", label: "Español" },
	{ code: "de", label: "Deutsch" },
	{ code: "el", label: "Ελληνικά" },
	{ code: "pl", label: "Polski" },
];

export function LanguageSwitcher() {
	const { i18n } = useTranslation();
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

	return (
		<div ref={ref} className="relative">
			<button
				onClick={() => setOpen((v) => !v)}
				className="flex items-center gap-1.5 text-muted hover:text-text transition-colors text-sm"
				aria-label="Select language"
			>
				<Globe size={16} />
				<span className="font-mono">{current.code.toUpperCase().slice(0, 2)}</span>
			</button>

			{open && (
				<div className="absolute right-0 top-8 z-50 bg-background border border-border rounded-lg shadow-lg py-1 min-w-[140px]">
					{LANGUAGES.map((lang) => (
						<button
							key={lang.code}
							onClick={() => {
								i18n.changeLanguage(lang.code);
								setOpen(false);
							}}
							className={`w-full text-left px-4 py-2 text-sm hover:bg-surface transition-colors ${
								i18n.language === lang.code ? "text-amber" : "text-text"
							}`}
						>
							{lang.label}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
