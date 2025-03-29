import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization"; // Import from expo-localization
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import translation files (flat JSON files in locales folder)
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import ar from "./locales/ar.json";
import de from "./locales/de.json";
import es from "./locales/es.json";
import zh from "./locales/zh.json";
import pl from "./locales/pl.json";

// Language resources
const resources = {
  en: { translation: en },
  fr: { translation: fr },
  ar: { translation: ar },
  de: { translation: de },
  es: { translation: es },
  zh: { translation: zh },
  pl: { translation: pl },
};

// Language detector plugin
const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: async (callback) => {
    try {
      // Try to get the saved language from AsyncStorage
      const savedLanguage = await AsyncStorage.getItem("appLanguage");
      if (savedLanguage) {
        callback(savedLanguage);
        return;
      }

      // Fallback to device language, handling regional variants
      const deviceLanguage = Localization.locale;
      let detectedLanguage = deviceLanguage.split("-")[0]; // Get primary language (e.g., "en" from "en-US")

      // Map to supported languages or fallback to English
      const supportedLanguages = Object.keys(resources);
      if (!supportedLanguages.includes(detectedLanguage)) {
        detectedLanguage = "en"; // Default to English if not supported
      }
      callback(detectedLanguage);
    } catch (error) {
      console.error("Error detecting language:", error);
      callback("en"); // Fallback to English on error
    }
  },
  init: () => {},
  cacheUserLanguage: async (language) => {
    try {
      await AsyncStorage.setItem("appLanguage", language);
    } catch (error) {
      console.error("Error caching language:", error);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en", // Default fallback language
    compatibilityJSON: "v3", // Ensure compatibility with older JSON formats if needed
    interpolation: {
      escapeValue: false, // Not needed for React Native
    },
    initImmediate: false, // Allow async initialization for language detection
    react: {
      useSuspense: false, // Disable suspense to handle loading manually if needed
    },
  })
  .then(() => {
    console.log("i18n initialized successfully with language:", i18n.language);
  })
  .catch((error) => {
    console.error("i18n initialization failed:", error);
  });

export default i18n;