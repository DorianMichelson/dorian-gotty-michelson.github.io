/*
 * Liste des langues disponibles sur le site.
 *
 * Pour ajouter une langue (exemple : espagnol) :
 *   1. Copier lang/en.js en lang/es.js
 *   2. Remplacer  I18N.en  par  I18N.es  en haut du fichier, puis traduire les textes
 *   3. Ajouter une ligne ci-dessous : { code: "es", label: "Español" }
 *
 * Les clés absentes d'un fichier de langue s'affichent dans la langue par défaut.
 */
window.SITE_DEFAULT_LANGUAGE = "fr";

window.SITE_LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" }
];
