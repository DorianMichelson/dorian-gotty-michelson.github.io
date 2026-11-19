/* Comportements communs : thème, menu mobile, contenus de la page À propos, formulaire de contact. */
(function () {
  const cfg = window.SITE_CONFIG || {};
  const t = (k, v) => window.i18n.t(k, v);

  function el(tag, attrs, children) {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === "text") n.textContent = attrs[k];
      else if (k === "class") n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    (children || []).forEach((c) => c && n.appendChild(c));
    return n;
  }

  /* ---------- Thème ---------- */
  function syncThemeButton() {
    const dark = window.siteTheme.get() === "dark";
    document.querySelectorAll("[data-theme-toggle]").forEach((b) => {
      b.setAttribute("aria-pressed", String(dark));
      const label = dark ? t("nav.themeLight") : t("nav.themeDark");
      b.setAttribute("title", label);
      const span = b.querySelector("[data-theme-label]");
      if (span) span.textContent = label;
    });
  }
  document.querySelectorAll("[data-theme-toggle]").forEach((b) => {
    b.addEventListener("click", () => {
      window.siteTheme.set(window.siteTheme.get() === "dark" ? "light" : "dark");
      syncThemeButton();
    });
  });

  /* ---------- Menu mobile ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const header = document.querySelector(".site-header");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      header.classList.toggle("nav-open", !open);
    });
    document.querySelectorAll(".nav-list a").forEach((a) => a.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      header.classList.remove("nav-open");
    }));
  }

  /* Lien actif */
  const page = document.body.dataset.page;
  document.querySelectorAll("[data-nav]").forEach((a) => {
    if (a.dataset.nav === page) a.setAttribute("aria-current", "page");
  });

  document.querySelectorAll("[data-year]").forEach((n) => { n.textContent = new Date().getFullYear(); });

  /* ---------- Rendus de la page À propos ---------- */
  const renderers = {
    experience(root, items) {
      items.forEach((it) => {
        root.appendChild(el("li", { class: "tl-item" }, [
          el("p", { class: "tl-period", text: it.period }),
          el("div", { class: "tl-body" }, [
            el("h3", { class: "tl-org", text: it.org }),
            el("p", { class: "tl-role", text: it.role }),
            el("p", { class: "tl-text", text: it.text })
          ])
        ]));
      });
    },
    projects(root, items) {
      items.forEach((it) => {
        const tags = el("ul", { class: "tags" });
        (it.tags || []).forEach((tg) => tags.appendChild(el("li", { text: tg })));
        const link = it.link ? el("a", { class: "text-link", href: it.link.href, text: it.link.label }) : null;
        root.appendChild(el("article", { class: "project" }, [
          el("p", { class: "project-context", text: it.context }),
          el("h3", { text: it.title }),
          el("p", { class: "project-text", text: it.text }),
          tags,
          link
        ]));
      });
    },
    skills(root, groups) {
      groups.forEach((g) => {
        const ul = el("ul");
        g.items.forEach((s) => ul.appendChild(el("li", { text: s })));
        root.appendChild(el("div", { class: "skill-group" }, [el("h3", { text: g.name }), ul]));
      });
    },
    education(root, items) {
      items.forEach((it) => {
        root.appendChild(el("li", {}, [
          el("span", { class: "pl-main", text: it.school }),
          el("span", { class: "pl-sub", text: it.degree }),
          el("span", { class: "pl-meta", text: it.period })
        ]));
      });
    },
    languages(root, items) {
      items.forEach((it) => {
        root.appendChild(el("li", { class: "pl-row" }, [
          el("span", { class: "pl-main", text: it.name }),
          el("span", { class: "pl-meta", text: it.level })
        ]));
      });
    },
    passions(root, items) {
      items.forEach((it) => {
        root.appendChild(el("div", { class: "passion" }, [
          el("h3", { text: it.title }),
          el("p", { text: it.text })
        ]));
      });
    }
  };

  function renderAll() {
    document.querySelectorAll("[data-render]").forEach((root) => {
      const key = root.dataset.render;
      const data = t(key);
      root.innerHTML = "";
      if (Array.isArray(data) && renderers[key]) renderers[key](root, data);
    });
  }

  /* ---------- Liens de contact ---------- */
  function setupContactLinks() {
    document.querySelectorAll("[data-cv-link]").forEach((a) => {
      if (cfg.cv) a.href = cfg.cv; else a.hidden = true;
    });
    document.querySelectorAll("[data-contact]").forEach((li) => {
      const type = li.dataset.contact;
      const a = li.querySelector("[data-contact-link]");
      const value = cfg[type];
      if (!value) { li.hidden = true; return; }
      if (type === "email") { a.href = "mailto:" + value; a.textContent = value; }
      else if (type === "cv") { a.href = value; a.textContent = value.split("/").pop(); }
      else { a.href = value; a.textContent = value.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""); }
    });
  }

  /* ---------- Formulaire ---------- */
  function setupForm() {
    const form = document.querySelector("[data-contact-form]");
    if (!form) return;
    const status = form.querySelector("[data-form-status]");
    const btn = form.querySelector("button[type=submit]");

    const setStatus = (msg, kind) => {
      status.textContent = msg;
      status.dataset.kind = kind || "";
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      if (data.get("_gotcha")) return; // robot
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const message = String(data.get("message") || "").trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      form.querySelectorAll("input, textarea").forEach((f) => f.removeAttribute("aria-invalid"));
      if (!name || !emailOk || !message) {
        if (!name) form.elements.name.setAttribute("aria-invalid", "true");
        if (!emailOk) form.elements.email.setAttribute("aria-invalid", "true");
        if (!message) form.elements.message.setAttribute("aria-invalid", "true");
        setStatus(t("contact.invalid"), "error");
        form.querySelector("[aria-invalid=true]").focus();
        return;
      }

      if (!cfg.formEndpoint) {
        const subject = encodeURIComponent("Contact : " + name);
        const body = encodeURIComponent(message + "\n\n" + name + " (" + email + ")");
        window.location.href = "mailto:" + cfg.email + "?subject=" + subject + "&body=" + body;
        setStatus(t("contact.mailto"), "info");
        return;
      }

      btn.disabled = true;
      setStatus(t("contact.sending"), "info");
      try {
        const res = await fetch(cfg.formEndpoint, {
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message, _subject: "Contact depuis le site : " + name })
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        form.reset();
        setStatus(t("contact.sent"), "success");
      } catch (err) {
        console.error(err);
        setStatus(t("contact.error"), "error");
      } finally {
        btn.disabled = false;
      }
    });
  }

  /* ---------- Sommaire de la page IA : article en cours ---------- */
  function setupToc() {
    const links = Array.from(document.querySelectorAll(".toc-list a"));
    if (!links.length) return;
    const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const visible = new Set();
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
      const first = links.find((a) => visible.has(a.getAttribute("href").slice(1)));
      links.forEach((a) => a.classList.toggle("is-active", a === first));
    }, { rootMargin: "-20% 0px -55% 0px" });
    byId.forEach((a, id) => { const s = document.getElementById(id); if (s) obs.observe(s); });
  }

  setupContactLinks();
  setupForm();
  setupToc();

  window.i18n.ready.then(() => {
    renderAll();
    syncThemeButton();
    if (location.hash) {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) target.scrollIntoView();
    }
  });
  document.addEventListener("i18n:change", () => {
    renderAll();
    syncThemeButton();
    const status = document.querySelector("[data-form-status]");
    if (status) { status.textContent = ""; status.dataset.kind = ""; }
  });
})();
