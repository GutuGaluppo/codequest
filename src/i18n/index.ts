import i18n from "i18next";
import { initReactI18next } from "react-i18next";

type TranslationMessages = Record<string, unknown>;
type TranslationModule = { default: TranslationMessages };
type SupportedLanguage = "pt-BR" | "en" | "es" | "de" | "el" | "pl";

const FALLBACK_LANGUAGE: SupportedLanguage = "pt-BR";

const localeLoaders: Record<SupportedLanguage, () => Promise<TranslationModule>> = {
	"pt-BR": () => import("./locales/pt-BR.json"),
	en: () => import("./locales/en.json"),
	es: () => import("./locales/es.json"),
	de: () => import("./locales/de.json"),
	el: () => import("./locales/el.json"),
	pl: () => import("./locales/pl.json"),
};

const supportedLanguages = Object.keys(localeLoaders) as SupportedLanguage[];

let initPromise: Promise<typeof i18n> | null = null;

function syncDocumentLanguage(language: string): void {
	if (typeof document === "undefined") return;
	document.documentElement.lang = language;
}

function resolveLanguage(language?: string | null): SupportedLanguage {
	if (!language) return FALLBACK_LANGUAGE;

	const normalized = language.toLowerCase();

	if (normalized === "pt" || normalized.startsWith("pt-")) {
		return "pt-BR";
	}

	for (const candidate of supportedLanguages) {
		const lowerCandidate = candidate.toLowerCase();
		if (
			normalized === lowerCandidate ||
			normalized.startsWith(`${lowerCandidate}-`) ||
			(candidate !== "pt-BR" && normalized.startsWith(lowerCandidate))
		) {
			return candidate;
		}
	}

	return FALLBACK_LANGUAGE;
}

function getInitialLanguage(): SupportedLanguage {
	if (typeof window === "undefined") return FALLBACK_LANGUAGE;

	const storedLanguage = window.localStorage.getItem("i18nextLng");
	if (storedLanguage) return resolveLanguage(storedLanguage);

	for (const browserLanguage of window.navigator.languages ?? [window.navigator.language]) {
		return resolveLanguage(browserLanguage);
	}

	return FALLBACK_LANGUAGE;
}

async function loadTranslation(language: SupportedLanguage): Promise<TranslationMessages> {
	const module = await localeLoaders[language]();
	return module.default;
}

async function ensureResourceBundle(language: SupportedLanguage): Promise<void> {
	if (i18n.hasResourceBundle(language, "translation")) return;

	i18n.addResourceBundle(
		language,
		"translation",
		await loadTranslation(language),
		true,
		true,
	);
}

export async function initI18n(): Promise<typeof i18n> {
	if (i18n.isInitialized) return i18n;
	if (initPromise) return initPromise;

	initPromise = (async () => {
		const initialLanguage = getInitialLanguage();
		const fallbackTranslation = await loadTranslation(FALLBACK_LANGUAGE);
		const initialTranslation =
			initialLanguage === FALLBACK_LANGUAGE
				? fallbackTranslation
				: await loadTranslation(initialLanguage);

		await i18n.use(initReactI18next).init({
			resources: {
				[FALLBACK_LANGUAGE]: { translation: fallbackTranslation },
				...(initialLanguage === FALLBACK_LANGUAGE
					? {}
					: { [initialLanguage]: { translation: initialTranslation } }),
			},
			lng: initialLanguage,
			fallbackLng: FALLBACK_LANGUAGE,
			supportedLngs: supportedLanguages,
			load: "currentOnly",
			interpolation: {
				escapeValue: false,
			},
		});

		syncDocumentLanguage(initialLanguage);
		i18n.on("languageChanged", syncDocumentLanguage);

		return i18n;
	})();

	return initPromise;
}

export async function setAppLanguage(language: string): Promise<void> {
	const resolvedLanguage = resolveLanguage(language);

	await initI18n();
	await ensureResourceBundle(resolvedLanguage);
	await i18n.changeLanguage(resolvedLanguage);

	if (typeof window !== "undefined") {
		window.localStorage.setItem("i18nextLng", resolvedLanguage);
	}
}

export default i18n;
