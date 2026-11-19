/* Thème clair / sombre. Chargé dans <head> pour éviter un flash de la mauvaise couleur. */
(function () {
  const KEY = "site-theme";
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* stockage indisponible */ }
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved === "dark" || saved === "light" ? saved : (prefersDark ? "dark" : "light");
  document.documentElement.dataset.theme = theme;

  window.siteTheme = {
    get() { return document.documentElement.dataset.theme; },
    set(t) {
      document.documentElement.dataset.theme = t;
      try { localStorage.setItem(KEY, t); } catch (e) { /* stockage indisponible */ }
      document.dispatchEvent(new CustomEvent("theme:change", { detail: { theme: t } }));
    }
  };
})();
