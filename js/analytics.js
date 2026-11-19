/*
 * Statistiques de visite avec Umami (https://umami.is) : anonymes, sans cookie.
 *
 * En plus des pages vues, de la durée des visites, des pays, des appareils et des sites
 * d'origine (fournis par Umami), ce fichier envoie ces événements :
 *   temps-actif        temps réellement passé sur la page (onglet visible, visiteur actif)
 *   section-vue        une section ou un article apparaît à l'écran
 *   defilement         profondeur de défilement atteinte : 25, 50, 75, 100 %
 *   demo-utilisee      première manipulation d'une démo
 *   cv-telecharge      clic sur le lien du CV
 *   clic-contact       clic sur l'email, LinkedIn ou GitHub
 *   formulaire-contact envoi du formulaire
 *   langue             changement de langue
 *   theme              changement de thème
 *
 * Ne pas compter tes propres visites : ouvre une fois le site avec ?stats=off à la fin
 * de l'adresse (ex. https://dorianmichelson.github.io/?stats=off) sur chaque navigateur
 * que tu utilises. ?stats=on réactive le comptage.
 */
(function () {
  const cfg = window.SITE_CONFIG || {};
  const page = document.body.dataset.page || location.pathname;

  /* ---------- Exclure ses propres visites ---------- */
  try {
    const flag = new URLSearchParams(location.search).get("stats");
    if (flag === "off") localStorage.setItem("umami.disabled", "1");
    if (flag === "on") localStorage.removeItem("umami.disabled");
  } catch (e) { /* stockage indisponible */ }

  /* ---------- Envoi des événements ---------- */
  const queue = [];
  function track(name, data) {
    const payload = Object.assign({ page }, data || {});
    if (window.umami && typeof window.umami.track === "function") window.umami.track(name, payload);
    else if (queue.length < 50) queue.push([name, payload]);
  }
  window.siteTrack = track;

  if (!cfg.umamiWebsiteId) return; // statistiques désactivées

  const s = document.createElement("script");
  s.defer = true;
  s.src = "https://cloud.umami.is/script.js";
  s.dataset.websiteId = cfg.umamiWebsiteId;
  if (cfg.statsDomain) s.dataset.domains = cfg.statsDomain;
  s.onload = () => { while (queue.length) { const [n, d] = queue.shift(); track(n, d); } };
  document.head.appendChild(s);

  /* ---------- Temps actif ---------- */
  // On compte une seconde seulement si l'onglet est visible et que le visiteur
  // a bougé, cliqué, tapé ou défilé dans les 30 dernières secondes.
  let activeSeconds = 0, lastActivity = Date.now(), sent = false;
  ["pointermove", "pointerdown", "keydown", "scroll", "touchstart"].forEach((ev) =>
    window.addEventListener(ev, () => { lastActivity = Date.now(); }, { passive: true }));
  setInterval(() => {
    if (document.visibilityState === "visible" && Date.now() - lastActivity < 30000) activeSeconds++;
  }, 1000);

  function bucket(sec) {
    if (sec < 10) return "0-10 s";
    if (sec < 30) return "10-30 s";
    if (sec < 60) return "30-60 s";
    if (sec < 120) return "1-2 min";
    if (sec < 300) return "2-5 min";
    if (sec < 600) return "5-10 min";
    return "10 min et plus";
  }
  function sendTime() {
    if (sent || activeSeconds < 2) return;
    sent = true;
    track("temps-actif", { duree: bucket(activeSeconds), secondes: activeSeconds });
  }
  // Envoyé une seule fois, la première fois que le visiteur quitte ou masque la page
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") sendTime(); });
  window.addEventListener("pagehide", sendTime);

  /* ---------- Sections vues ---------- */
  const seen = new Set();
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !seen.has(e.target.id)) {
        seen.add(e.target.id);
        track("section-vue", { section: e.target.id });
        sectionObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.35 });
  document.querySelectorAll("main section[id], main article[id]").forEach((el) => sectionObs.observe(el));

  /* ---------- Profondeur de défilement ---------- */
  const steps = [25, 50, 75, 100];
  const reached = new Set();
  window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    const pct = (window.scrollY / max) * 100;
    steps.forEach((st) => {
      if (pct >= st - 2 && !reached.has(st)) { reached.add(st); track("defilement", { profondeur: st + " %" }); }
    });
  }, { passive: true });

  /* ---------- Démos ---------- */
  const usedDemos = new Set();
  document.addEventListener("pointerdown", onDemo, true);
  document.addEventListener("input", onDemo, true);
  document.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") onDemo(e); }, true);
  function onDemo(e) {
    const t = e.target instanceof Element ? e.target : null;
    if (!t) return;
    const box = t.closest("[data-demo], .net-figure");
    if (!box) return;
    const name = box.dataset.demo || "reseau-accueil";
    if (usedDemos.has(name)) return;
    usedDemos.add(name);
    track("demo-utilisee", { demo: name });
  }

  /* ---------- Clics utiles ---------- */
  document.addEventListener("click", (e) => {
    const a = e.target instanceof Element ? e.target.closest("a") : null;
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (a.hasAttribute("data-cv-link") || /\.pdf$/i.test(href)) track("cv-telecharge");
    else if (href.startsWith("mailto:")) track("clic-contact", { type: "email" });
    else if (href.includes("linkedin.com")) track("clic-contact", { type: "linkedin" });
    else if (href.includes("github.com")) track("clic-contact", { type: "github" });
  }, true);

  /* ---------- Langue et thème ---------- */
  let firstLang = true;
  document.addEventListener("i18n:change", (e) => {
    if (firstLang) { firstLang = false; return; } // langue de départ : pas un choix du visiteur
    track("langue", { langue: e.detail.lang });
  });
  document.addEventListener("theme:change", (e) => track("theme", { theme: e.detail.theme }));
})();
