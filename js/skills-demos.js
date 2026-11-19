/* Page « Ce que je sais faire » : dix mini-démonstrations interactives. */
(function () {
  const t = (k, v) => window.i18n.t(k, v);
  const has = (k) => t(k) !== k;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =====================================================================
   * Outils communs
   * ===================================================================== */
  function h(tag, attrs, children) {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v === undefined || v === null || v === false) continue;
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else if (k === "html") n.innerHTML = v;
      else if (k === "i18n") n.dataset.i18n = v;
      else if (k === "i18nAttr") n.dataset.i18nAttr = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? "" : v);
    }
    (children || []).forEach((c) => c != null && c !== false && n.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
    return n;
  }

  function colors() {
    const s = getComputedStyle(document.documentElement);
    const g = (n) => s.getPropertyValue(n).trim();
    return {
      ink: g("--ink"), muted: g("--muted"), line: g("--line"), surface: g("--surface"), soft: g("--surface-2"),
      a: g("--data-a"), b: g("--data-b"), alert: g("--alert"),
      cat: [g("--data-a"), g("--data-b"), g("--cat-3"), g("--cat-4"), g("--cat-5"), g("--cat-6")]
    };
  }

  function canvasBox(canvas, draw) {
    const ctx = canvas.getContext("2d");
    const st = { w: 0, h: 0, dpr: 1 };
    const redraw = () => {
      if (!st.w) return;
      ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
      ctx.clearRect(0, 0, st.w, st.h);
      draw(ctx, st.w, st.h);
    };
    new ResizeObserver(() => {
      const r = canvas.getBoundingClientRect();
      st.dpr = Math.min(window.devicePixelRatio || 1, 2);
      st.w = r.width; st.h = r.height;
      canvas.width = Math.round(r.width * st.dpr);
      canvas.height = Math.round(r.height * st.dpr);
      redraw();
    }).observe(canvas);
    document.addEventListener("theme:change", redraw);
    document.addEventListener("i18n:change", redraw);
    redraw.size = st;
    return redraw;
  }

  const lang = () => window.i18n.current || "fr";
  const fmt = (n, d = 0) => Number(n).toLocaleString(lang(), { minimumFractionDigits: d, maximumFractionDigits: d });
  const pct = (x) => fmt(x * 100, 0) + " %";

  // Générateur pseudo-aléatoire à graine : mêmes données à chaque visite
  function rng(seed) {
    let s = seed >>> 0;
    return () => { s = (s + 0x6D2B79F5) >>> 0; let x = s; x = Math.imul(x ^ (x >>> 15), x | 1); x ^= x + Math.imul(x ^ (x >>> 7), x | 61); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
  }
  function gauss(r) { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

  function range(id, min, max, step, value) {
    return h("input", { type: "range", id, min, max, step, value });
  }
  function rangeRow(id, labelKey, input, out) {
    return h("div", { class: "control-range" }, [h("label", { for: id, i18n: labelKey }), input, out]);
  }
  function stat(labelKey, out) {
    return h("span", {}, [h("span", { i18n: labelKey }), " ", out]);
  }
  function segmented(items, onPick) {
    const wrap = h("div", { class: "segmented sf-seg", role: "group" });
    const btns = items.map((it, i) => {
      const b = h("button", { type: "button", class: "seg", "aria-pressed": i === 0 ? "true" : "false", i18n: it.i18n, text: it.text });
      b.addEventListener("click", () => { btns.forEach((x) => x.setAttribute("aria-pressed", String(x === b))); onPick(it.value, i); });
      wrap.appendChild(b);
      return b;
    });
    return wrap;
  }

  /* =====================================================================
   * Code équivalent affiché sous chaque carte
   * ===================================================================== */
  const CODE = {
    threshold: `from sklearn.metrics import confusion_matrix, precision_score, recall_score

scores = model.predict_proba(X_test)[:, 1]   # risk score per machine
y_pred = (scores >= threshold).astype(int)

print(confusion_matrix(y_test, y_pred))
print("Precision:", precision_score(y_test, y_pred))
print("Recall:", recall_score(y_test, y_pred))`,
    tree: `from sklearn.tree import DecisionTreeClassifier, export_text
from xgboost import XGBClassifier

tree = DecisionTreeClassifier(max_depth=3).fit(X_train, y_train)
print(export_text(tree, feature_names=["pressure", "temperature", "age"]))

xgb = XGBClassifier(n_estimators=300, max_depth=4).fit(X_train, y_train)
print(dict(zip(X_train.columns, xgb.feature_importances_)))`,
    kmeans: `from sklearn.cluster import KMeans

kmeans = KMeans(n_clusters=3, n_init=10, random_state=0)
labels = kmeans.fit_predict(points)
centers = kmeans.cluster_centers_`,
    sentiment: `from transformers import pipeline

classifier = pipeline(
    "sentiment-analysis",
    model="nlptown/bert-base-multilingual-uncased-sentiment",
)
classifier("Le service était rapide et l'équipe très agréable.")`,
    forecast: `from statsmodels.tsa.holtwinters import ExponentialSmoothing

train, test = series[:-12], series[-12:]
model = ExponentialSmoothing(train, trend="add", seasonal="add",
                             seasonal_periods=12).fit()
forecast = model.forecast(12)
mae = (forecast - test).abs().mean()`,
    cleaning: `import pandas as pd

df = pd.read_csv("sensors.csv", dtype={"pressure": str})
df = df.drop_duplicates()
df["pressure"] = pd.to_numeric(df["pressure"].str.replace(",", "."))
df["date"] = pd.to_datetime(df["date"], format="mixed", dayfirst=True)
df["pressure"] = df["pressure"].fillna(df["pressure"].median())
df = df[df["pressure"].between(0, 20)]`,
    sql: `var urgent = await db.Tasks
    .Where(t => t.Priority == Priority.High && t.Status != Status.Done)
    .OrderByDescending(t => t.Days)
    .Select(t => new { t.Title, t.Owner, t.Days })
    .ToListAsync();`,
    dashboard: `import pandas as pd

df = pd.read_csv("interventions.csv")
selection = df[df["site"] == "Lyon"]          # cross-filter

kpis = selection[["interventions", "failures"]].sum()
selection.groupby("month")["failures"].sum().plot.bar()`,
    parallel: `from multiprocessing import Pool

inputs = prepare_inputs()                # sequential part
with Pool(processes=8) as pool:          # parallel part
    results = pool.map(run_model, inputs)`,
    subnet: `import ipaddress

net = ipaddress.ip_interface("192.168.1.42/24").network
print(net.netmask, net.network_address, net.broadcast_address)
print(net.num_addresses - 2, "usable addresses")`
  };

  /* =====================================================================
   * 1. Seuil d'alerte : matrice de confusion
   * ===================================================================== */
  function threshold(root) {
    const r = rng(7);
    const scores = [];
    for (let i = 0; i < 220; i++) scores.push({ s: Math.min(0.99, Math.max(0.01, 0.30 + gauss(r) * 0.12)), y: 0 });
    for (let i = 0; i < 45; i++) scores.push({ s: Math.min(0.99, Math.max(0.01, 0.68 + gauss(r) * 0.13)), y: 1 });
    let th = 0.5;

    const canvas = h("canvas", { class: "sf-canvas", "aria-hidden": "true" });
    const input = range("th-r", 0.05, 0.95, 0.01, th);
    const out = h("output", { class: "mono" });
    const cells = {};
    ["tp", "fn", "fp", "tn"].forEach((k) => {
      cells[k] = h("strong", { class: "mono" });
    });
    const tile = (k, cls) => h("div", { class: "cm-cell " + cls }, [cells[k], h("span", { i18n: "sf.threshold." + k })]);
    const precOut = h("strong", { class: "big-num" });
    const recOut = h("strong", { class: "big-num" });

    root.append(
      h("ul", { class: "legend" }, [
        h("li", {}, [h("span", { class: "sw sw-a" }), h("span", { i18n: "sf.threshold.normal" })]),
        h("li", {}, [h("span", { class: "sw sw-b" }), h("span", { i18n: "sf.threshold.faulty" })])
      ]),
      canvas,
      rangeRow("th-r", "sf.threshold.threshold", input, out),
      h("div", { class: "cm" }, [tile("tp", "good"), tile("fn", "bad"), tile("fp", "bad"), tile("tn", "good")]),
      h("div", { class: "pr" }, [
        h("p", {}, [h("span", { i18n: "sf.threshold.precision" }), " ", precOut, " ", h("span", { class: "muted", i18n: "sf.threshold.precisionHelp" })]),
        h("p", {}, [h("span", { i18n: "sf.threshold.recall" }), " ", recOut, " ", h("span", { class: "muted", i18n: "sf.threshold.recallHelp" })])
      ])
    );

    const BINS = 30;
    const draw = canvasBox(canvas, (ctx, W, H) => {
      const c = colors();
      const pad = { l: 6, r: 6, t: 6, b: 22 };
      const hist = [new Array(BINS).fill(0), new Array(BINS).fill(0)];
      scores.forEach((p) => hist[p.y][Math.min(BINS - 1, Math.floor(p.s * BINS))]++);
      const max = Math.max(...hist[0], ...hist[1]);
      const bw = (W - pad.l - pad.r) / BINS;
      const Y = (v) => (H - pad.b) - (v / max) * (H - pad.t - pad.b);
      [0, 1].forEach((cls) => {
        ctx.fillStyle = cls ? c.b : c.a;
        ctx.globalAlpha = 0.75;
        for (let i = 0; i < BINS; i++) {
          if (!hist[cls][i]) continue;
          ctx.fillRect(pad.l + i * bw + 1, Y(hist[cls][i]), bw - 2, (H - pad.b) - Y(hist[cls][i]));
        }
      });
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.line; ctx.beginPath(); ctx.moveTo(pad.l, H - pad.b + 0.5); ctx.lineTo(W - pad.r, H - pad.b + 0.5); ctx.stroke();
      const x = pad.l + th * (W - pad.l - pad.r);
      ctx.fillStyle = c.alert; ctx.globalAlpha = 0.08; ctx.fillRect(x, pad.t, W - pad.r - x, H - pad.b - pad.t); ctx.globalAlpha = 1;
      ctx.strokeStyle = c.alert; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, H - pad.b); ctx.stroke();
      ctx.fillStyle = c.muted; ctx.font = "12px 'IBM Plex Sans', sans-serif";
      ctx.fillText("0", pad.l, H - 6);
      ctx.textAlign = "right"; ctx.fillText("1", W - pad.r, H - 6);
      ctx.textAlign = "center"; ctx.fillText(t("sf.threshold.score"), W / 2, H - 6); ctx.textAlign = "left";
    });

    function sync() {
      let tp = 0, fn = 0, fp = 0, tn = 0;
      scores.forEach((p) => { const a = p.s >= th; if (p.y) a ? tp++ : fn++; else a ? fp++ : tn++; });
      cells.tp.textContent = tp; cells.fn.textContent = fn; cells.fp.textContent = fp; cells.tn.textContent = tn;
      precOut.textContent = tp + fp ? pct(tp / (tp + fp)) : "–";
      recOut.textContent = pct(tp / (tp + fn));
      out.textContent = fmt(th, 2);
      draw();
    }
    input.addEventListener("input", () => { th = Number(input.value); sync(); });
    document.addEventListener("i18n:change", sync);
    sync();
  }

  /* =====================================================================
   * 2. Arbre de décision expliqué
   * ===================================================================== */
  function tree(root) {
    const v = { p: 6, temp: 70, age: 5 };
    const pIn = range("tr-p", 2, 10, 0.5, v.p), tIn = range("tr-t", 20, 120, 5, v.temp), aIn = range("tr-a", 0, 20, 1, v.age);
    const pOut = h("output", { class: "mono" }), tOut = h("output", { class: "mono" }), aOut = h("output", { class: "mono" });
    const treeBox = h("div", { class: "tree", "aria-live": "polite" });
    const badge = h("p", { class: "risk-badge" });

    root.append(
      h("div", { class: "sf-sliders" }, [
        rangeRow("tr-p", "sf.tree.pressure", pIn, pOut),
        rangeRow("tr-t", "sf.tree.temperature", tIn, tOut),
        rangeRow("tr-a", "sf.tree.age", aIn, aOut)
      ]),
      treeBox, badge
    );

    const T = {
      q: "qAge", test: (x) => x.age > 8,
      yes: { q: "qPressure", test: (x) => x.p > 7, yes: { leaf: "high", p: 0.82 }, no: { q: "qTemp90", test: (x) => x.temp > 90, yes: { leaf: "high", p: 0.64 }, no: { leaf: "medium", p: 0.31 } } },
      no: { q: "qTemp100", test: (x) => x.temp > 100, yes: { leaf: "medium", p: 0.38 }, no: { leaf: "low", p: 0.06 } }
    };

    function renderNode(node, active) {
      if (node.leaf) {
        return h("span", { class: "tnode leaf lvl-" + node.leaf + (active ? " on" : "") }, [t("sf.tree." + node.leaf) + " · " + pct(node.p)]);
      }
      const go = active ? node.test(v) : null;
      const kid = (label, child, on) => h("li", { class: on ? "on" : "off" }, [h("span", { class: "tlabel", text: t("sf.tree." + label) }), renderNode(child, on)]);
      return h("div", { class: "tbranch" }, [
        h("span", { class: "tnode q" + (active ? " on" : ""), text: t("sf.tree." + node.q) }),
        h("ul", {}, [kid("yes", node.yes, go === true), kid("no", node.no, go === false)])
      ]);
    }
    function leafOf(node) { while (!node.leaf) node = node.test(v) ? node.yes : node.no; return node; }

    function sync() {
      pOut.textContent = fmt(v.p, 1) + " bar";
      tOut.textContent = fmt(v.temp) + " °C";
      aOut.textContent = fmt(v.age) + " " + t("sf.tree.years");
      treeBox.innerHTML = "";
      treeBox.appendChild(renderNode(T, true));
      const leaf = leafOf(T);
      badge.className = "risk-badge lvl-" + leaf.leaf;
      badge.textContent = t("sf.tree.risk") + " : " + t("sf.tree." + leaf.leaf) + " (" + pct(leaf.p) + ")";
    }
    pIn.addEventListener("input", () => { v.p = Number(pIn.value); sync(); });
    tIn.addEventListener("input", () => { v.temp = Number(tIn.value); sync(); });
    aIn.addEventListener("input", () => { v.age = Number(aIn.value); sync(); });
    document.addEventListener("i18n:change", sync);
    sync();
  }

  /* =====================================================================
   * 3. k-means
   * ===================================================================== */
  function kmeans(root) {
    let pts = [], cents = [], k = 3, iter = 0, done = false, timer = null;
    const canvas = h("canvas", { class: "sf-canvas sf-canvas-tall", role: "img", "aria-label": "k-means" });
    const kIn = range("km-k", 2, 6, 1, k), kOut = h("output", { class: "mono" });
    const iterOut = h("output", { class: "mono" });
    const note = h("p", { class: "demo-note", role: "status" });
    const runBtn = h("button", { type: "button", class: "btn btn-small btn-primary", i18n: "sf.kmeans.run" });
    const stepBtn = h("button", { type: "button", class: "btn btn-small btn-ghost", i18n: "sf.kmeans.step" });
    const newBtn = h("button", { type: "button", class: "btn btn-small btn-ghost", i18n: "sf.kmeans.newData" });

    root.append(canvas,
      h("div", { class: "demo-stats" }, [stat("sf.kmeans.iter", iterOut)]),
      h("div", { class: "demo-controls" }, [rangeRow("km-k", "sf.kmeans.k", kIn, kOut), h("div", { class: "btn-row" }, [runBtn, stepBtn, newBtn])]),
      note);

    function newData() {
      pts = [];
      const nb = 3 + Math.floor(Math.random() * 2);
      for (let b = 0; b < nb; b++) {
        const cx = 0.15 + Math.random() * 0.7, cy = 0.15 + Math.random() * 0.7;
        for (let i = 0; i < 28; i++) pts.push({ x: cx + gauss(Math.random) * 0.06, y: cy + gauss(Math.random) * 0.06, c: -1 });
      }
      resetCenters();
    }
    function resetCenters() {
      stop();
      cents = [];
      const pool = pts.slice().sort(() => Math.random() - 0.5);
      for (let i = 0; i < k && i < pool.length; i++) cents.push({ x: pool[i].x, y: pool[i].y });
      pts.forEach((p) => { p.c = -1; });
      iter = 0; done = false; sync();
    }
    function nearest(p) {
      let best = 0, bd = Infinity;
      cents.forEach((c, i) => { const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2; if (d < bd) { bd = d; best = i; } });
      return best;
    }
    function step() {
      if (done) return;
      pts.forEach((p) => { p.c = nearest(p); });
      let moved = 0;
      cents = cents.map((c, i) => {
        const mine = pts.filter((p) => p.c === i);
        if (!mine.length) return c;
        const nx = mine.reduce((s, p) => s + p.x, 0) / mine.length, ny = mine.reduce((s, p) => s + p.y, 0) / mine.length;
        moved = Math.max(moved, Math.hypot(nx - c.x, ny - c.y));
        return { x: nx, y: ny };
      });
      iter++;
      if (moved < 1e-4) { done = true; stop(); }
      sync();
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    const draw = canvasBox(canvas, (ctx, W, H) => {
      const c = colors();
      const X = (x) => 8 + x * (W - 16), Y = (y) => 8 + y * (H - 16);
      pts.forEach((p) => {
        ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), 4, 0, Math.PI * 2);
        ctx.fillStyle = p.c < 0 ? c.muted : c.cat[p.c % 6];
        ctx.globalAlpha = p.c < 0 ? 0.55 : 0.9; ctx.fill();
      });
      ctx.globalAlpha = 1;
      cents.forEach((ce, i) => {
        const x = X(ce.x), y = Y(ce.y);
        ctx.beginPath(); ctx.moveTo(x, y - 9); ctx.lineTo(x + 9, y); ctx.lineTo(x, y + 9); ctx.lineTo(x - 9, y); ctx.closePath();
        ctx.fillStyle = c.cat[i % 6]; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = c.surface; ctx.stroke();
        ctx.lineWidth = 1; ctx.strokeStyle = c.ink; ctx.stroke();
      });
    });

    function sync() {
      kOut.textContent = k; iterOut.textContent = iter;
      note.textContent = done ? t("sf.kmeans.done") : "";
      runBtn.disabled = done;
      draw();
    }

    canvas.addEventListener("pointerdown", (e) => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left - 8) / (r.width - 16), y = (e.clientY - r.top - 8) / (r.height - 16);
      for (let i = 0; i < 5; i++) pts.push({ x: x + gauss(Math.random) * 0.02, y: y + gauss(Math.random) * 0.02, c: -1 });
      if (iter) { pts.forEach((p) => { if (p.c < 0) p.c = nearest(p); }); done = false; }
      sync();
    });
    runBtn.addEventListener("click", () => {
      if (timer) return;
      step();
      timer = setInterval(step, reduceMotion ? 900 : 550);
    });
    stepBtn.addEventListener("click", () => { stop(); step(); });
    newBtn.addEventListener("click", newData);
    kIn.addEventListener("input", () => { k = Number(kIn.value); resetCenters(); });
    document.addEventListener("i18n:change", sync);
    newData();
  }

  /* =====================================================================
   * 4. Analyse de sentiment (lexique)
   * ===================================================================== */
  function sentiment(root) {
    const ta = h("textarea", { id: "se-in", rows: 2, class: "sf-input", spellcheck: "false" });
    const exRow = h("div", { class: "chip-row" });
    const view = h("p", { class: "se-view", "aria-hidden": "true" });
    const verdict = h("p", { class: "se-verdict", role: "status" });
    const gauge = h("div", { class: "se-gauge", "aria-hidden": "true" }, [h("span")]);

    root.append(
      h("label", { for: "se-in", class: "field-label", i18n: "sf.sentiment.input" }), ta, exRow, view, gauge, verdict
    );

    function examples() {
      exRow.innerHTML = "";
      t("sf.sentiment.examples").forEach((ex, i) => {
        exRow.appendChild(h("button", { type: "button", class: "chip", text: "« " + ex.slice(0, 28) + "… »", title: ex, onclick: () => { ta.value = ex; analyze(); } }));
      });
    }

    function analyze() {
      const lex = t("sf.sentiment.lexicon");
      const pos = new Set(lex.pos), neg = new Set(lex.neg), negs = new Set(lex.negators);
      const parts = ta.value.split(/([\p{L}]+)/u);
      const words = [];
      let score = 0;
      view.innerHTML = "";
      parts.forEach((part) => {
        if (!/^\p{L}+$/u.test(part)) { view.appendChild(document.createTextNode(part)); return; }
        const w = part.toLowerCase();
        let pol = pos.has(w) ? 1 : neg.has(w) ? -1 : 0;
        const flipped = pol && words.slice(-2).some((x) => negs.has(x)) && !negs.has(w);
        if (flipped) pol = -pol;
        words.push(w);
        score += pol;
        view.appendChild(pol ? h("mark", { class: pol > 0 ? "se-pos" : "se-neg", text: part, title: flipped ? "↺" : "" }) : document.createTextNode(part));
      });
      const label = score > 0 ? "positive" : score < 0 ? "negative" : "neutral";
      verdict.className = "se-verdict se-" + label;
      verdict.textContent = t("sf.sentiment." + label) + " (" + t("sf.sentiment.score") + " " + (score > 0 ? "+" : "") + score + ")";
      const bar = gauge.firstChild;
      const clamped = Math.max(-4, Math.min(4, score)) / 4;
      bar.style.left = clamped < 0 ? (50 + clamped * 50) + "%" : "50%";
      bar.style.width = Math.abs(clamped) * 50 + "%";
      bar.className = score > 0 ? "pos" : score < 0 ? "neg" : "";
    }
    ta.addEventListener("input", analyze);
    function reset() { examples(); ta.value = t("sf.sentiment.examples")[2]; analyze(); }
    document.addEventListener("i18n:change", reset);
    reset();
  }

  /* =====================================================================
   * 5. Prévision de série temporelle
   * ===================================================================== */
  function forecast(root) {
    let series = [], method = "seasonal", fc = [];
    const canvas = h("canvas", { class: "sf-canvas", role: "img", "aria-label": "forecast" });
    const help = h("p", { class: "muted small" });
    const errOut = h("output", { class: "mono" });
    const seg = segmented([
      { value: "mean", i18n: "sf.forecast.mean" }, { value: "trend", i18n: "sf.forecast.trend" }, { value: "seasonal", i18n: "sf.forecast.seasonal" }
    ], (m) => { method = m; sync(); });
    seg.querySelectorAll("button").forEach((b, i) => b.setAttribute("aria-pressed", String(i === 2)));
    const newBtn = h("button", { type: "button", class: "btn btn-small btn-ghost", i18n: "sf.forecast.newData" });

    root.append(
      h("ul", { class: "legend" }, [
        h("li", {}, [h("span", { class: "sw sw-line" }), h("span", { i18n: "sf.forecast.history" })]),
        h("li", {}, [h("span", { class: "sw sw-dash" }), h("span", { i18n: "sf.forecast.actual" })]),
        h("li", {}, [h("span", { class: "sw sw-b" }), h("span", { i18n: "sf.forecast.forecast" })])
      ]),
      canvas,
      h("div", { class: "demo-controls" }, [seg, newBtn]),
      help,
      h("div", { class: "demo-stats" }, [stat("sf.forecast.error", errOut)])
    );

    function newData() {
      const r = Math.random, phase = (r() - 0.5) * 0.4, slope = 0.02 + r() * 0.04;
      series = [];
      for (let m = 0; m < 48; m++) series.push(14.5 - 8.5 * Math.cos(2 * Math.PI * m / 12 + phase) + slope * m + gauss(r) * 0.9);
      sync();
    }
    function linfit(ys) {
      const n = ys.length, mx = (n - 1) / 2, my = ys.reduce((a, b) => a + b, 0) / n;
      let num = 0, den = 0;
      ys.forEach((y, i) => { num += (i - mx) * (y - my); den += (i - mx) ** 2; });
      const a = num / den; return { a, b: my - a * mx };
    }
    function compute() {
      const train = series.slice(0, 36);
      if (method === "mean") { const m = train.reduce((a, b) => a + b, 0) / 36; fc = new Array(12).fill(m); }
      else {
        const { a, b } = linfit(train);
        if (method === "trend") fc = Array.from({ length: 12 }, (_, i) => a * (36 + i) + b);
        else {
          const seas = new Array(12).fill(0);
          train.forEach((y, i) => { seas[i % 12] += (y - (a * i + b)) / 3; });
          fc = Array.from({ length: 12 }, (_, i) => a * (36 + i) + b + seas[(36 + i) % 12]);
        }
      }
    }
    const draw = canvasBox(canvas, (ctx, W, H) => {
      if (!series.length) return;
      const c = colors();
      const all = series.concat(fc);
      const lo = Math.min(...all) - 1, hi = Math.max(...all) + 1;
      const pad = { l: 30, r: 8, t: 8, b: 8 };
      const X = (i) => pad.l + (i / 47) * (W - pad.l - pad.r);
      const Y = (v) => pad.t + (1 - (v - lo) / (hi - lo)) * (H - pad.t - pad.b);
      ctx.fillStyle = c.soft; ctx.fillRect(X(35.5), pad.t, W - pad.r - X(35.5), H - pad.t - pad.b);
      ctx.fillStyle = c.muted; ctx.font = "11px 'IBM Plex Mono', monospace"; ctx.textAlign = "right";
      [Math.ceil(lo / 5) * 5, Math.floor(hi / 5) * 5].forEach((v) => ctx.fillText(v + "°", pad.l - 4, Y(v) + 4));
      ctx.textAlign = "left";
      const line = (arr, start, color, width, dash) => {
        ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash || []); ctx.beginPath();
        arr.forEach((v, i) => (i ? ctx.lineTo(X(start + i), Y(v)) : ctx.moveTo(X(start + i), Y(v))));
        ctx.stroke(); ctx.setLineDash([]);
      };
      line(series.slice(0, 36), 0, c.ink, 1.6);
      line(series.slice(35), 35, c.ink, 1.4, [4, 4]);
      line([series[35]].concat(fc), 35, c.b, 2.6);
    });
    function sync() {
      compute();
      const mae = fc.reduce((s, v, i) => s + Math.abs(v - series[36 + i]), 0) / 12;
      errOut.textContent = fmt(mae, 1) + " °C";
      help.textContent = t("sf.forecast." + method + "Help");
      draw();
    }
    newBtn.addEventListener("click", newData);
    document.addEventListener("i18n:change", sync);
    newData();
  }

  /* =====================================================================
   * 6. Nettoyage de données
   * ===================================================================== */
  function cleaning(root) {
    const RAW = [
      ["V-01", "2026-03-01", "5.2"], ["V-01", "2026-03-01", "5.2"], ["V-02", "02/03/2026", "6,1"],
      ["V-03", "2026-03-02", null], ["V-04", "2026-03-03", "98.0"], ["V-05", "03/03/2026", "5.8"], ["V-06", "2026-03-04", "4.9"]
    ];
    const STEPS = ["dup", "num", "dates", "fill", "outliers"];
    const CODE_LINES = CODE.cleaning.split("\n").filter((l) => l.startsWith("df =") || l.startsWith("df[")).slice(1);
    let rows, applied, lastCode;

    const table = h("table", { class: "data-table" });
    const btnRow = h("div", { class: "btn-row" });
    const btns = {};
    STEPS.forEach((s) => { btns[s] = h("button", { type: "button", class: "btn btn-small btn-ghost", i18n: "sf.cleaning." + s, onclick: () => apply(s) }); btnRow.appendChild(btns[s]); });
    const resetBtn = h("button", { type: "button", class: "btn btn-small btn-ghost", i18n: "sf.cleaning.reset", onclick: reset });
    const remOut = h("output", { class: "mono" });
    const codeLine = h("pre", { class: "code-line" });
    const status = h("p", { class: "demo-note", role: "status" });

    root.append(h("div", { class: "table-wrap" }, [table]), h("div", { class: "demo-stats" }, [stat("sf.cleaning.remaining", remOut)]), btnRow, codeLine, h("div", { class: "btn-row" }, [resetBtn]), status);

    const val = (x) => (x && typeof x === "object" ? x.filled : x);
    const num = (v) => (val(v) == null ? null : parseFloat(String(val(v)).replace(",", ".")));
    function issues(r, i) {
      const out = {};
      if (rows.findIndex((o) => o[0] === r[0] && o[1] === r[1] && val(o[2]) === val(r[2])) !== i) out.row = true;
      if (/\//.test(r[1])) out.date = true;
      const p = val(r[2]);
      if (p == null) out.p = true;
      else if (String(p).includes(",")) out.p = true;
      else if (num(p) > 20) out.p = true;
      return out;
    }
    function count() {
      let n = 0;
      rows.forEach((r, i) => { const x = issues(r, i); n += (x.row ? 1 : 0) + (x.date ? 1 : 0) + (x.p ? 1 : 0); });
      return n;
    }
    function apply(s) {
      if (s === "dup") rows = rows.filter((r, i) => !issues(r, i).row);
      if (s === "num") rows = rows.map((r) => [r[0], r[1], typeof r[2] === "string" ? r[2].replace(",", ".") : r[2]]);
      if (s === "dates") rows = rows.map((r) => [r[0], r[1].replace(/^(\d\d)\/(\d\d)\/(\d{4})$/, "$3-$2-$1"), r[2]]);
      if (s === "fill") {
        const vals = rows.map((r) => num(r[2])).filter((v) => v != null && v <= 20).sort((a, b) => a - b);
        const m = vals.length % 2 ? vals[(vals.length - 1) / 2] : (vals[vals.length / 2 - 1] + vals[vals.length / 2]) / 2;
        rows = rows.map((r) => [r[0], r[1], r[2] == null ? { filled: m.toFixed(1) } : r[2]]);
      }
      if (s === "outliers") rows = rows.filter((r) => { const v = num(r[2]); return v == null || v <= 20; });
      applied.add(s);
      lastCode = CODE_LINES[STEPS.indexOf(s)];
      render();
    }
    function render() {
      table.innerHTML = "";
      table.appendChild(h("thead", {}, [h("tr", {}, ["sensor", "date", "pressure"].map((k) => h("th", { i18n: "sf.cleaning." + k, text: t("sf.cleaning." + k) })))]));
      const tb = h("tbody");
      rows.forEach((r, i) => {
        const filled = r[2] && typeof r[2] === "object";
        const view = [r[0], r[1], filled ? r[2].filled : r[2]];
        const x = issues(r, i);
        tb.appendChild(h("tr", { class: x.row ? "issue-row" : "" }, [
          h("td", { text: view[0] }),
          h("td", { class: x.date ? "issue" : "", text: view[1] }),
          h("td", { class: (x.p ? "issue" : "") + (filled ? " filled" : ""), text: view[2] == null ? "—" : view[2] })
        ]));
      });
      table.appendChild(tb);
      STEPS.forEach((s) => { btns[s].disabled = applied.has(s); });
      const n = count();
      remOut.textContent = n;
      codeLine.textContent = lastCode || "df = pd.read_csv(\"sensors.csv\")";
      status.textContent = n === 0 ? t("sf.cleaning.clean") : "";
      status.dataset.kind = n === 0 ? "success" : "";
    }
    function reset() {
      rows = RAW.map((r) => r.slice()); applied = new Set(); lastCode = ""; render();
    }
    document.addEventListener("i18n:change", render);
    reset();
  }

  /* =====================================================================
   * 7. SQL
   * ===================================================================== */
  function sql(root) {
    const DATA = [
      [1, 0, "Alice", "high", "done", 3], [2, 1, "Karim", "high", "done", 4], [3, 2, "Alice", "high", "doing", 6],
      [4, 3, "Léa", "medium", "doing", 3], [5, 4, "Karim", "low", "todo", 2], [6, 5, "Léa", "high", "todo", 3],
      [7, 6, "Karim", "high", "todo", 2], [8, 7, "Alice", "medium", "todo", 1]
    ].map(([id, ti, owner, pr, st, days]) => ({ id, ti, owner, pr, st, days }));
    let q = 0;

    const qRow = h("div", { class: "chip-row" });
    const pre = h("pre", { class: "sql" });
    const result = h("table", { class: "data-table" });
    const rowsOut = h("p", { class: "muted small" });
    const srcTable = h("table", { class: "data-table small" });
    root.append(qRow, pre, h("p", { class: "field-label", i18n: "sf.sql.result" }), h("div", { class: "table-wrap" }, [result]), rowsOut,
      h("details", { class: "sf-source" }, [h("summary", { i18n: "sf.sql.table" }), h("div", { class: "table-wrap" }, [srcTable])]));

    const KW = /\b(SELECT|FROM|WHERE|AND|ORDER BY|GROUP BY|AS|DESC|COUNT|SUM|ROUND)\b/g;
    function highlight(s) {
      const esc = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return esc.replace(/('[^']*')/g, '<span class="s">$1</span>').replace(KW, '<span class="k">$1</span>');
    }
    function table(el, cols, rows) {
      el.innerHTML = "";
      el.appendChild(h("thead", {}, [h("tr", {}, cols.map((c) => h("th", { class: "mono", text: c })))]));
      el.appendChild(h("tbody", {}, rows.map((r) => h("tr", {}, r.map((v) => h("td", { text: String(v) }))))));
    }
    function run() {
      const C = t("sf.sql.cols"), P = t("sf.sql.priority"), S = t("sf.sql.status"), TI = t("sf.sql.titles");
      const queries = t("sf.sql.queries");
      pre.innerHTML = highlight(queries[q].sql);
      let cols, rows;
      if (q === 0) {
        cols = [C.title, C.owner, C.days];
        rows = DATA.filter((d) => d.pr === "high" && d.st !== "done").sort((a, b) => b.days - a.days).map((d) => [TI[d.ti], d.owner, d.days]);
      } else if (q === 1) {
        const g = {};
        DATA.forEach((d) => { g[d.owner] = g[d.owner] || { n: 0, days: 0 }; g[d.owner].n++; g[d.owner].days += d.days; });
        cols = [C.owner, C.count, C.days];
        rows = Object.entries(g).sort((a, b) => b[1].days - a[1].days).map(([o, v]) => [o, v.n, v.days]);
      } else {
        const g = {};
        DATA.forEach((d) => { g[d.st] = (g[d.st] || 0) + 1; });
        cols = [C.status, C.n, C.pct];
        rows = Object.entries(g).map(([s, n]) => [S[s], n, Math.round(100 * n / DATA.length)]);
      }
      table(result, cols, rows);
      rowsOut.textContent = rows.length + " " + t("sf.sql.rows");
      table(srcTable, [C.id, C.title, C.owner, C.priority, C.status, C.days], DATA.map((d) => [d.id, TI[d.ti], d.owner, P[d.pr], S[d.st], d.days]));
    }
    function buttons() {
      qRow.innerHTML = "";
      t("sf.sql.queries").forEach((qq, i) => {
        const b = h("button", { type: "button", class: "chip", "aria-pressed": String(i === q), text: qq.label });
        b.addEventListener("click", () => { q = i; qRow.querySelectorAll("button").forEach((x, j) => x.setAttribute("aria-pressed", String(j === q))); run(); });
        qRow.appendChild(b);
      });
    }
    document.addEventListener("i18n:change", () => { buttons(); run(); });
    buttons(); run();
  }

  /* =====================================================================
   * 8. Tableau de bord à filtres croisés
   * ===================================================================== */
  function dashboard(root) {
    const SITES = ["Toulouse", "Lyon", "Lille", "Nantes"];
    const INTER = [[18, 22, 19, 25, 21, 17], [12, 15, 11, 14, 16, 13], [9, 8, 12, 10, 7, 9], [14, 13, 16, 12, 15, 18]];
    const FAIL = [[3, 4, 2, 5, 3, 2], [2, 3, 1, 2, 4, 2], [1, 1, 3, 2, 1, 1], [2, 2, 3, 1, 2, 4]];
    let site = null, month = null;

    const kInter = h("strong", { class: "kpi-val mono" }), kFail = h("strong", { class: "kpi-val mono" }), kAvail = h("strong", { class: "kpi-val mono" });
    const sitesBox = h("div", { class: "hbars" }), monthsBox = h("div", { class: "vbars" });
    const filterTxt = h("p", { class: "muted small", "aria-live": "polite" });
    const allBtn = h("button", { type: "button", class: "btn btn-small btn-ghost", i18n: "sf.dashboard.all", onclick: () => { site = month = null; render(); } });

    root.append(
      h("div", { class: "kpis" }, [
        h("div", { class: "kpi" }, [h("span", { i18n: "sf.dashboard.interventions" }), kInter]),
        h("div", { class: "kpi" }, [h("span", { i18n: "sf.dashboard.failures" }), kFail]),
        h("div", { class: "kpi" }, [h("span", { i18n: "sf.dashboard.availability" }), kAvail])
      ]),
      h("div", { class: "dash-charts" }, [
        h("div", {}, [h("p", { class: "field-label", i18n: "sf.dashboard.bySite" }), sitesBox]),
        h("div", {}, [h("p", { class: "field-label", i18n: "sf.dashboard.byMonth" }), monthsBox])
      ]),
      h("div", { class: "demo-controls" }, [filterTxt, allBtn])
    );

    const sum = (M, s, m) => M.reduce((acc, row, i) => acc + row.reduce((a, v, j) => a + ((s == null || s === i) && (m == null || m === j) ? v : 0), 0), 0);
    function render() {
      const months = t("sf.dashboard.months");
      const inter = sum(INTER, site, month), fail = sum(FAIL, site, month);
      const nSites = site == null ? 4 : 1, nMonths = month == null ? 6 : 1;
      const avail = 1 - (fail * 5) / (nSites * 40 * 720 * nMonths);
      kInter.textContent = fmt(inter); kFail.textContent = fmt(fail); kAvail.textContent = fmt(avail * 100, 2) + " %";

      sitesBox.innerHTML = "";
      const sv = SITES.map((_, i) => sum(INTER, i, month)), smax = Math.max(1, ...sv);
      SITES.forEach((name, i) => {
        const b = h("button", { type: "button", class: "hbar" + (site === i ? " on" : "") + (site != null && site !== i ? " dim" : ""), "aria-pressed": String(site === i) }, [
          h("span", { class: "hbar-label", text: name }),
          h("span", { class: "hbar-track" }, [h("span", { class: "hbar-fill", style: `width:${(sv[i] / smax) * 100}%` })]),
          h("span", { class: "mono hbar-val", text: sv[i] })
        ]);
        b.addEventListener("click", () => { site = site === i ? null : i; render(); });
        sitesBox.appendChild(b);
      });

      monthsBox.innerHTML = "";
      const mv = months.map((_, j) => sum(FAIL, site, j)), mmax = Math.max(1, ...mv);
      months.forEach((name, j) => {
        const b = h("button", { type: "button", class: "vbar" + (month === j ? " on" : "") + (month != null && month !== j ? " dim" : ""), "aria-pressed": String(month === j), "aria-label": name + " : " + mv[j] }, [
          h("span", { class: "mono vbar-val", text: mv[j] }),
          h("span", { class: "vbar-track" }, [h("span", { class: "vbar-fill", style: `height:${(mv[j] / mmax) * 100}%` })]),
          h("span", { class: "vbar-label", text: name })
        ]);
        b.addEventListener("click", () => { month = month === j ? null : j; render(); });
        monthsBox.appendChild(b);
      });
      const parts = [site != null ? SITES[site] : null, month != null ? months[month] : null].filter(Boolean);
      filterTxt.textContent = parts.length ? t("sf.dashboard.filter") + " : " + parts.join(", ") : "";
      allBtn.disabled = !parts.length;
    }
    document.addEventListener("i18n:change", render);
    render();
  }

  /* =====================================================================
   * 9. Calcul parallèle et loi d'Amdahl
   * ===================================================================== */
  function parallel(root) {
    const r = rng(42);
    const raw = Array.from({ length: 32 }, () => 0.5 + r());
    let cores = 4, serial = 0.1, sched = null, progress = 1, anim = null;

    const canvas = h("canvas", { class: "sf-canvas", role: "img", "aria-label": "Gantt" });
    const cIn = range("pa-c", 1, 16, 1, cores), cOut = h("output", { class: "mono" });
    const sIn = range("pa-s", 0, 0.5, 0.05, serial), sOut = h("output", { class: "mono" });
    const tOut = h("output", { class: "mono" }), spOut = h("output", { class: "mono" });
    const runBtn = h("button", { type: "button", class: "btn btn-small btn-primary", i18n: "sf.parallel.run" });

    root.append(
      h("ul", { class: "legend" }, [
        h("li", {}, [h("span", { class: "sw sw-b" }), h("span", { i18n: "sf.parallel.serialLabel" })]),
        h("li", {}, [h("span", { class: "sw sw-a" }), h("span", { i18n: "sf.parallel.parallelLabel" })])
      ]),
      canvas,
      h("div", { class: "demo-stats" }, [stat("sf.parallel.time", tOut), stat("sf.parallel.speedup", spOut)]),
      h("div", { class: "sf-sliders" }, [rangeRow("pa-c", "sf.parallel.cores", cIn, cOut), rangeRow("pa-s", "sf.parallel.serial", sIn, sOut)]),
      h("div", { class: "btn-row" }, [runBtn]));

    function schedule() {
      const S = serial * 100, work = 100 - S, tot = raw.reduce((a, b) => a + b, 0);
      const tasks = raw.map((d) => (d / tot) * work).sort((a, b) => b - a);
      const free = new Array(cores).fill(S);
      const bars = [{ core: 0, start: 0, end: S, serial: true }];
      tasks.forEach((d) => {
        let i = 0; free.forEach((f, j) => { if (f < free[i]) i = j; });
        bars.push({ core: i, start: free[i], end: free[i] + d });
        free[i] += d;
      });
      sched = { bars, T: Math.max(...free) };
    }
    const draw = canvasBox(canvas, (ctx, W, H) => {
      if (!sched) return;
      const c = colors();
      const pad = { l: 8, r: 8, t: 6, b: 18 };
      const rowH = Math.min(34, (H - pad.t - pad.b) / cores);
      const X = (v) => pad.l + (v / 100) * (W - pad.l - pad.r);
      const now = progress * sched.T;
      sched.bars.forEach((b) => {
        if (b.start >= now || b.end - b.start <= 0) return;
        const e = Math.min(b.end, now);
        ctx.fillStyle = b.serial ? c.b : c.a;
        ctx.globalAlpha = b.serial ? 0.9 : 0.75;
        ctx.fillRect(X(b.start) + 0.5, pad.t + b.core * rowH + 1, Math.max(1, X(e) - X(b.start) - 1), rowH - 2);
      });
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.alert; ctx.setLineDash([4, 3]); ctx.beginPath();
      ctx.moveTo(X(sched.T), pad.t); ctx.lineTo(X(sched.T), pad.t + cores * rowH); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = c.line; ctx.beginPath(); ctx.moveTo(X(100), pad.t); ctx.lineTo(X(100), H - pad.b); ctx.stroke();
      ctx.fillStyle = c.muted; ctx.font = "11px 'IBM Plex Mono', monospace";
      ctx.fillText("0 s", pad.l, H - 4); ctx.textAlign = "right"; ctx.fillText("100 s", W - pad.r, H - 4); ctx.textAlign = "left";
    });
    function sync() {
      schedule();
      cOut.textContent = cores; sOut.textContent = pct(serial);
      const ideal = 1 / (serial + (1 - serial) / cores);
      tOut.textContent = fmt(sched.T, 1) + " s";
      spOut.textContent = "×" + fmt(100 / sched.T, 1) + " (" + t("sf.parallel.ideal") + " ×" + fmt(ideal, 1) + ")";
      draw();
    }
    runBtn.addEventListener("click", () => {
      cancelAnimationFrame(anim);
      if (reduceMotion) { progress = 1; draw(); return; }
      const t0 = performance.now();
      const tick = (now) => { progress = Math.min(1, (now - t0) / 1400); draw(); if (progress < 1) anim = requestAnimationFrame(tick); };
      anim = requestAnimationFrame(tick);
    });
    cIn.addEventListener("input", () => { cores = Number(cIn.value); progress = 1; sync(); });
    sIn.addEventListener("input", () => { serial = Number(sIn.value); progress = 1; sync(); });
    document.addEventListener("i18n:change", sync);
    sync();
  }

  /* =====================================================================
   * 10. Calculateur de sous-réseau
   * ===================================================================== */
  function subnet(root) {
    let prefix = 24;
    const ipIn = h("input", { type: "text", id: "sn-ip", class: "sf-input mono", value: "192.168.1.42", inputmode: "decimal", autocomplete: "off", spellcheck: "false" });
    const pIn = range("sn-p", 8, 30, 1, prefix), pOut = h("output", { class: "mono" });
    const dl = h("dl", { class: "kv" });
    const bin = h("p", { class: "bin mono", "aria-hidden": "true" });
    const err = h("p", { class: "demo-note", role: "status" });

    root.append(
      h("div", { class: "sf-sliders" }, [
        h("div", { class: "control-range" }, [h("label", { for: "sn-ip", i18n: "sf.subnet.ip" }), ipIn]),
        rangeRow("sn-p", "sf.subnet.prefix", pIn, pOut)
      ]),
      err, dl, h("p", { class: "muted small", i18n: "sf.subnet.binary" }), bin
    );

    const toIp = (n) => [24, 16, 8, 0].map((s) => (n >>> s) & 255).join(".");
    function sync() {
      pOut.textContent = "/" + prefix;
      const m = ipIn.value.trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
      const oct = m ? m.slice(1).map(Number) : null;
      if (!oct || oct.some((o) => o > 255)) {
        err.textContent = t("sf.subnet.invalid"); err.dataset.kind = "error"; ipIn.setAttribute("aria-invalid", "true");
        return;
      }
      err.textContent = ""; ipIn.removeAttribute("aria-invalid");
      const ip = ((oct[0] << 24) | (oct[1] << 16) | (oct[2] << 8) | oct[3]) >>> 0;
      const mask = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0;
      const net = (ip & mask) >>> 0, bc = (net | (~mask >>> 0)) >>> 0;
      const rows = [
        ["mask", toIp(mask)], ["network", toIp(net) + "/" + prefix], ["broadcast", toIp(bc)],
        ["range", toIp(net + 1) + " → " + toIp(bc - 1)], ["hosts", fmt(2 ** (32 - prefix) - 2)]
      ];
      dl.innerHTML = "";
      rows.forEach(([k, v]) => { dl.append(h("dt", { text: t("sf.subnet." + k) }), h("dd", { class: "mono", text: v })); });
      bin.innerHTML = "";
      for (let i = 0; i < 32; i++) {
        if (i && i % 8 === 0) bin.appendChild(document.createTextNode("."));
        bin.appendChild(h("span", { class: i < prefix ? "netbit" : "", text: String((ip >>> (31 - i)) & 1) }));
      }
    }
    ipIn.addEventListener("input", sync);
    pIn.addEventListener("input", () => { prefix = Number(pIn.value); sync(); });
    document.addEventListener("i18n:change", sync);
    sync();
  }

  /* =====================================================================
   * Montage des cartes
   * ===================================================================== */
  const BUILD = { threshold, tree, kmeans, sentiment, forecast, cleaning, sql, dashboard, parallel, subnet };

  function card(name) {
    const art = h("article", { class: "skill-card", id: "sf-" + name, "data-demo": name, "aria-labelledby": "sf-t-" + name }, [
      h("h3", { id: "sf-t-" + name, i18n: `sf.${name}.title` }),
      h("p", { class: "sf-text", i18n: `sf.${name}.text` })
    ]);
    const body = h("div", { class: "sf-widget" });
    art.appendChild(body);
    BUILD[name](body);
    if (CODE[name]) {
      art.appendChild(h("details", { class: "sf-code" }, [
        h("summary", { i18n: name === "sql" ? "sf.codeCs" : "sf.code" }),
        h("pre", {}, [h("code", { text: CODE[name] })])
      ]));
    }
    if (has(`sf.${name}.career`)) {
      art.appendChild(h("p", { class: "sf-career" }, [h("strong", { i18n: "sf.career" }), " ", h("span", { i18n: `sf.${name}.career` })]));
    }
    return art;
  }

  window.i18n.ready.then(() => {
    document.querySelectorAll("[data-sf-group]").forEach((grid) => {
      grid.dataset.sfGroup.split(" ").forEach((name) => { if (BUILD[name]) grid.appendChild(card(name)); });
      window.i18n.apply(grid);
    });
  });
})();
