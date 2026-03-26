import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ptBR from "./locales/pt-BR.json";
import en from "./locales/en.json";
import es from "./locales/es.json";
import de from "./locales/de.json";
import el from "./locales/el.json";
import pl from "./locales/pl.json";

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			"pt-BR": { translation: ptBR },
			en: { translation: en },
			es: { translation: es },
			de: { translation: de },
			el: { translation: el },
			pl: { translation: pl },
		},
		fallbackLng: "pt-BR",
		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;
