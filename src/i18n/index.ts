import { translations, type TranslationKey } from "./translations";

export type Lang = "pt" | "en";

export const defaultLang: Lang = "pt";

export function useTranslations(lang: Lang) {
  return function t(key: TranslationKey): string {
    return translations[lang][key];
  };
}

export function getLangFromUrl(url: URL): Lang {
  const pathname = url.pathname;
  if (pathname.startsWith("/en/") || pathname === "/en") {
    return "en";
  }
  return "pt";
}

const ptToEnRoutes: Record<string, string> = {
  "/": "/en/",
  "/galeria": "/en/gallery",
};

const enToPtRoutes: Record<string, string> = {
  "/en/": "/",
  "/en": "/",
  "/en/gallery": "/galeria",
};

export function getAlternateUrl(currentPath: string, targetLang: Lang): string {
  if (targetLang === "en") {
    if (ptToEnRoutes[currentPath]) {
      return ptToEnRoutes[currentPath];
    }
    const artworkMatch = currentPath.match(/^\/artwork\/(.+)$/);
    if (artworkMatch) {
      return `/en/art/${artworkMatch[1]}`;
    }
    return `/en${currentPath}`;
  }

  if (enToPtRoutes[currentPath]) {
    return enToPtRoutes[currentPath];
  }
  const artMatch = currentPath.match(/^\/en\/art\/(.+)$/);
  if (artMatch) {
    return `/artwork/${artMatch[1]}`;
  }
  return currentPath.replace(/^\/en/, "") || "/";
}

export function getLocalizedPath(path: string, lang: Lang): string {
  if (lang === "pt") return path;
  if (path === "/") return "/en/";
  if (path === "/galeria") return "/en/gallery";
  const artworkMatch = path.match(/^\/artwork\/(.+)$/);
  if (artworkMatch) return `/en/art/${artworkMatch[1]}`;
  return `/en${path}`;
}
