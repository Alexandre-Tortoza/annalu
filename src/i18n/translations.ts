export const translations = {
  pt: {
    "nav.home": "Inicio",
    "nav.gallery": "Galeria",
    "hero.title": "Arte que conta historias",
    "hero.subtitle":
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.",
    "gallery.title": "Galeria",
    "gallery.description":
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Explore todas as obras da colecao.",
    "gallery.count": "obras",
    "section.latest": "Ultimas Obras",
    "section.about": "Sobre a Artista",
    "section.about.text":
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    "footer.copyright": "© 2024 AnnaLu. Todos os direitos reservados.",
    "aria.toggleTheme": "Alternar tema",
    "aria.languagePicker": "Selecionar idioma",
    "aria.openMenu": "Abrir menu",
    "artwork.technique": "Tecnica",
    "artwork.dimensions": "Dimensoes",
    "artwork.year": "Ano",
    "artwork.previous": "Anterior",
    "artwork.next": "Proxima",
    "editorial.quote":
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.",
  },
  en: {
    "nav.home": "Home",
    "nav.gallery": "Gallery",
    "hero.title": "Art that tells stories",
    "hero.subtitle":
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.",
    "gallery.title": "Gallery",
    "gallery.description":
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Explore all artworks in the collection.",
    "gallery.count": "artworks",
    "section.latest": "Latest Works",
    "section.about": "About the Artist",
    "section.about.text":
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    "footer.copyright": "© 2024 AnnaLu. All rights reserved.",
    "aria.toggleTheme": "Toggle theme",
    "aria.languagePicker": "Select language",
    "aria.openMenu": "Open menu",
    "artwork.technique": "Technique",
    "artwork.dimensions": "Dimensions",
    "artwork.year": "Year",
    "artwork.previous": "Previous",
    "artwork.next": "Next",
    "editorial.quote":
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["pt"];
