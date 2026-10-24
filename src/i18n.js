import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationAR from "./Locales/ar.json";
import translationEN from "./Locales/en.json";

import ltrCss from "bootstrap/dist/css/bootstrap.min.css?inline";
import rtlCss from "bootstrap/dist/css/bootstrap.rtl.min.css?inline";

const resources = {
  ar: { translation: translationAR },
  en: { translation: translationEN },
};

const setBootstrapCss = (isRtl) => {
  let style = document.getElementById("bootstrap-css");
  if (!style) {
    style = document.createElement("style");
    style.id = "bootstrap-css";
    document.head.prepend(style);
  }
  const css = isRtl ? rtlCss : ltrCss;
  if (style.textContent !== css) style.textContent = css;
};

const updateDocumentDirection = (lng) => {
  const currentLang = lng ? lng.split("-")[0] : "en";
  const isRtl = currentLang === "ar";

  document.documentElement.dir = isRtl ? "rtl" : "ltr";
  document.documentElement.lang = currentLang;
  setBootstrapCss(isRtl);
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: ["ar", "en"],
    nonExplicitSupportedLngs: true,
    fallbackLng: "en",

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },

    interpolation: {
      escapeValue: false,
    },
  });

i18n.on("languageChanged", (lng) => {
  updateDocumentDirection(lng);
});

updateDocumentDirection(i18n.language);

export default i18n;
