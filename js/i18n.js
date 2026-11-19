/*
 * Traduction du site.
 *   data-i18n="cle.sous.cle"          -> remplace le texte de l'élément
 *   data-i18n-html="cle"              -> remplace son contenu HTML
 *   data-i18n-attr="aria-label:cle"   -> remplace un ou plusieurs attributs (séparés par ;)
 * Les fichiers de langue sont chargés à la demande depuis lang/<code>.js
 * (des fichiers .js plutôt que .json pour que le site marche aussi en ouvrant index.html en local).
 */
(function () {
  const STORAGE_KEY = "site-lang";
  const languages = window.SITE_LANGUAGES || [{ code: "fr", label: "Français" }];
  const fallbackCode = window.SITE_DEFAULT_LANGUAGE || languages[0].code;
  let current = null;

  const store = {
    get() { try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(STORAGE_KEY, v); } catch (e) { /* stockage indisponible */ } }
  };

  function lookup(dict, path) {
    return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), dict);
  }

  function t(key, vars) {
    const all = window.I18N || {};
    let v = lookup(all[current] || {}, key);
    if (v === undefined) v = lookup(all[fallbackCode] || {}, key);
    if (v === undefined) return key;
    if (typeof v === "string" && vars) v = v.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
    return v;
  }

  function loadScript(code) {
    return new Promise((resolve, reject) => {
      if (window.I18N && window.I18N[code]) return resolve();
      const s = document.createElement("script");
      s.src = "lang/" + code + ".js";
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Langue introuvable : " + code));
      document.head.appendChild(s);
    });
  }

  function apply(root) {
    root = root || document;
    root.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    root.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    root.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      el.dataset.i18nAttr.split(";").forEach((pair) => {
        const [attr, key] = pair.split(":").map((s) => s.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });
  }

  function detect() {
    const codes = languages.map((l) => l.code);
    const saved = store.get();
    if (saved && codes.includes(saved)) return saved;
    const prefs = navigator.languages || [navigator.language || ""];
    for (const p of prefs) {
      const short = (p || "").slice(0, 2).toLowerCase();
      if (codes.includes(short)) return short;
    }
    return fallbackCode;
  }

  async function setLanguage(code) {
    if (!languages.some((l) => l.code === code)) code = fallbackCode;
    await loadScript(fallbackCode);
    try { await loadScript(code); } catch (e) { console.warn(e); code = fallbackCode; }
    current = code;
    store.set(code);
    document.documentElement.lang = code;

    const body = document.body;
    if (body.dataset.titleKey) document.title = t(body.dataset.titleKey);
    const desc = document.querySelector('meta[name="description"]');
    if (desc && body.dataset.descriptionKey) desc.setAttribute("content", t(body.dataset.descriptionKey));

    document.querySelectorAll("select[data-lang-select]").forEach((sel) => { sel.value = code; });
    apply(document);
    document.dispatchEvent(new CustomEvent("i18n:change", { detail: { lang: code } }));
  }

  function buildSelectors() {
    document.querySelectorAll("select[data-lang-select]").forEach((sel) => {
      sel.innerHTML = "";
      languages.forEach((l) => {
        const o = document.createElement("option");
        o.value = l.code;
        o.textContent = l.label;
        o.lang = l.code;
        sel.appendChild(o);
      });
      sel.addEventListener("change", () => setLanguage(sel.value));
    });
  }

  const ready = new Promise((resolve) => {
    const start = () => {
      buildSelectors();
      setLanguage(detect())
        .catch((e) => console.error(e))
        .finally(() => {
          document.documentElement.classList.remove("i18n-loading");
          resolve();
        });
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  });

  window.i18n = {
    t,
    apply,
    setLanguage,
    ready,
    languages,
    get current() { return current; }
  };
})();
