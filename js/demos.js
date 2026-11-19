/* Démonstrations interactives de la page « Comprendre l'IA ». */
(function () {
  const t = (k, v) => window.i18n.t(k, v);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Outils communs ---------- */
  function h(tag, attrs, children) {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v === undefined || v === null || v === false) continue;
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else if (k === "i18n") n.dataset.i18n = v;
      else if (k === "i18nAttr") n.dataset.i18nAttr = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? "" : v);
    }
    (children || []).forEach((c) => c && n.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
    return n;
  }

  function colors() {
    const s = getComputedStyle(document.documentElement);
    const g = (n) => s.getPropertyValue(n).trim();
    return {
      ink: g("--ink"), muted: g("--muted"), line: g("--line"), surface: g("--surface"),
      a: g("--data-a"), b: g("--data-b"), alert: g("--alert"), soft: g("--surface-2")
    };
  }

  function hexToRgb(hex) {
    const m = hex.replace("#", "");
    const n = parseInt(m.length === 3 ? m.split("").map((c) => c + c).join("") : m, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  // Canvas net sur écrans haute densité ; appelle draw(ctx, w, h) à chaque redimensionnement
  function hiDpiCanvas(canvas, draw) {
    const ctx = canvas.getContext("2d");
    const state = { w: 0, h: 0 };
    const redraw = () => {
      if (!state.w) return;
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      ctx.clearRect(0, 0, state.w, state.h);
      draw(ctx, state.w, state.h);
    };
    new ResizeObserver(() => {
      const r = canvas.getBoundingClientRect();
      state.dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.w = r.width; state.h = r.height;
      canvas.width = Math.round(r.width * state.dpr);
      canvas.height = Math.round(r.height * state.dpr);
      redraw();
    }).observe(canvas);
    document.addEventListener("theme:change", redraw);
    document.addEventListener("i18n:change", redraw);
    return redraw;
  }

  function frame(root, name) {
    root.setAttribute("aria-labelledby", "demo-title-" + name);
    root.appendChild(h("div", { class: "demo-head" }, [
      h("p", { class: "demo-title", id: "demo-title-" + name, i18n: `demo.${name}.title` }),
      h("p", { class: "demo-help", i18n: `demo.${name}.help` })
    ]));
  }

  function fmt(n, d) {
    return n.toLocaleString(window.i18n.current || "fr", { minimumFractionDigits: d, maximumFractionDigits: d });
  }

  /* =====================================================================
   * 1. Descente de gradient : ajuster une droite
   * ===================================================================== */
  function gradientDemo(root) {
    frame(root, "gradient");
    const LRS = [0.01, 0.03, 0.1, 0.2, 0.4, 0.6, 0.75, 0.85, 1];
    let data = [], w = 0, b = 0, steps = 0, lrIndex = 4, history = [], timer = null, state = "";

    const canvas = h("canvas", { class: "demo-canvas", role: "img", i18nAttr: "aria-label:demo.gradient.aria" });
    const lrOut = h("output", { class: "mono" });
    const lrInput = h("input", { type: "range", min: 0, max: LRS.length - 1, step: 1, value: lrIndex, id: "gd-lr" });
    const stepsOut = h("output", { class: "mono" });
    const errOut = h("output", { class: "mono" });
    const modelOut = h("output", { class: "mono" });
    const note = h("p", { class: "demo-note", role: "status" });
    const trainBtn = h("button", { type: "button", class: "btn btn-small btn-primary" });
    const stepBtn = h("button", { type: "button", class: "btn btn-small btn-ghost", i18n: "demo.gradient.step" });
    const resetBtn = h("button", { type: "button", class: "btn btn-small btn-ghost", i18n: "demo.gradient.reset" });

    root.appendChild(canvas);
    root.appendChild(h("div", { class: "demo-stats" }, [
      h("span", {}, [h("span", { i18n: "demo.gradient.steps" }), " ", stepsOut]),
      h("span", {}, [h("span", { i18n: "demo.gradient.error" }), " ", errOut]),
      h("span", {}, [h("span", { i18n: "demo.gradient.model" }), " ", modelOut])
    ]));
    root.appendChild(h("div", { class: "demo-controls" }, [
      h("div", { class: "control-range" }, [
        h("label", { for: "gd-lr", i18n: "demo.gradient.lr" }), lrInput, lrOut
      ]),
      h("div", { class: "btn-row" }, [trainBtn, stepBtn, resetBtn])
    ]));
    root.appendChild(note);

    function newData() {
      const slope = (Math.random() * 1.2 - 0.6);
      const inter = 0.5 - slope / 2 + (Math.random() - 0.5) * 0.15;
      data = [];
      for (let i = 0; i < 28; i++) {
        const x = Math.random();
        data.push({ x, y: slope * x + inter + (Math.random() - 0.5) * 0.18 });
      }
      w = -0.8 + Math.random() * 0.3; b = 0.9;
      steps = 0; history = [mse()]; state = "";
    }
    function mse() {
      let s = 0;
      for (const p of data) { const e = w * p.x + b - p.y; s += e * e; }
      return s / data.length;
    }
    function step() {
      let gw = 0, gb = 0;
      for (const p of data) { const e = w * p.x + b - p.y; gw += 2 * e * p.x; gb += 2 * e; }
      const lr = LRS[lrIndex];
      w -= lr * gw / data.length; b -= lr * gb / data.length;
      steps++;
      const err = mse();
      history.push(err);
      if (!isFinite(err) || err > 1e4) { state = "diverged"; stop(); }
      else if (history.length > 5 && Math.abs(history[history.length - 6] - err) < 1e-6) { state = "converged"; stop(); }
    }

    const redraw = hiDpiCanvas(canvas, (ctx, W, H) => {
      const c = colors();
      const pad = { l: 12, r: 12, t: 12, b: 12 };
      const X = (x) => pad.l + x * (W - pad.l - pad.r);
      const Y = (y) => H - pad.b - ((y + 0.25) / 1.5) * (H - pad.t - pad.b);
      // grille
      ctx.strokeStyle = c.line; ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const gx = X(i / 4); ctx.beginPath(); ctx.moveTo(gx, pad.t); ctx.lineTo(gx, H - pad.b); ctx.stroke();
      }
      for (let i = 0; i <= 3; i++) {
        const gy = pad.t + i * (H - pad.t - pad.b) / 3; ctx.beginPath(); ctx.moveTo(pad.l, gy); ctx.lineTo(W - pad.r, gy); ctx.stroke();
      }
      // résidus
      ctx.strokeStyle = c.b; ctx.globalAlpha = 0.45;
      for (const p of data) {
        const py = w * p.x + b;
        if (!isFinite(py)) continue;
        ctx.beginPath(); ctx.moveTo(X(p.x), Y(p.y)); ctx.lineTo(X(p.x), Y(Math.max(-5, Math.min(5, py)))); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      // droite
      ctx.save();
      ctx.beginPath(); ctx.rect(pad.l, pad.t, W - pad.l - pad.r, H - pad.t - pad.b); ctx.clip();
      if (isFinite(w) && isFinite(b)) {
        ctx.strokeStyle = c.b; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(X(0), Y(b)); ctx.lineTo(X(1), Y(w + b)); ctx.stroke();
      }
      ctx.restore();
      // points
      for (const p of data) {
        ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), 4.5, 0, Math.PI * 2);
        ctx.fillStyle = c.a; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = c.surface; ctx.stroke();
      }
      // courbe d'erreur en médaillon
      const iw = Math.min(170, W * 0.36), ih = 64, ix = W - iw - 18, iy = 18;
      ctx.fillStyle = c.surface; ctx.strokeStyle = c.line; ctx.lineWidth = 1;
      ctx.fillRect(ix, iy, iw, ih); ctx.strokeRect(ix + 0.5, iy + 0.5, iw, ih);
      ctx.fillStyle = c.muted; ctx.font = "12px 'IBM Plex Sans', sans-serif";
      ctx.fillText(t("demo.gradient.error"), ix + 8, iy + 16);
      const hs = history.filter(isFinite);
      if (hs.length > 1) {
        const max = Math.max(...hs.slice(0, 50)), n = Math.max(hs.length - 1, 20);
        ctx.strokeStyle = state === "diverged" ? c.alert : c.ink; ctx.lineWidth = 1.5;
        ctx.beginPath();
        hs.forEach((v, i) => {
          const px = ix + 8 + (i / n) * (iw - 16);
          const py = iy + ih - 8 - Math.min(1, v / max) * (ih - 30);
          i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
        });
        ctx.stroke();
      }
    });

    function sync() {
      lrOut.textContent = fmt(LRS[lrIndex], LRS[lrIndex] < 0.1 ? 2 : 2);
      stepsOut.textContent = steps;
      const err = history[history.length - 1];
      errOut.textContent = isFinite(err) && err < 1e4 ? fmt(err, 4) : "∞";
      const ws = isFinite(w) && Math.abs(w) < 1e4 ? fmt(w, 2) : "?";
      const bs = isFinite(b) && Math.abs(b) < 1e4 ? fmt(Math.abs(b), 2) : "?";
      modelOut.textContent = `y = ${ws} × x ${b < 0 ? "−" : "+"} ${bs}`;
      trainBtn.textContent = timer ? t("demo.gradient.stop") : t("demo.gradient.train");
      note.textContent = state ? t("demo.gradient." + state) : "";
      note.dataset.kind = state === "diverged" ? "error" : state ? "success" : "";
      redraw();
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function run() {
      if (state) { const keepLr = lrIndex; newDataKeepPoints(); lrIndex = keepLr; }
      timer = setInterval(() => {
        step();
        if (steps >= 400) { stop(); }
        sync();
      }, reduceMotion ? 120 : 40);
    }
    // Recommencer l'entraînement sur les mêmes points
    function newDataKeepPoints() { w = -0.8 + Math.random() * 0.3; b = 0.9; steps = 0; history = [mse()]; state = ""; }

    trainBtn.addEventListener("click", () => { if (timer) stop(); else run(); sync(); });
    stepBtn.addEventListener("click", () => { stop(); if (state === "diverged") newDataKeepPoints(); step(); sync(); });
    resetBtn.addEventListener("click", () => { stop(); newData(); sync(); });
    lrInput.addEventListener("input", () => { lrIndex = Number(lrInput.value); sync(); });
    document.addEventListener("i18n:change", sync);

    newData();
    sync();
  }

  /* =====================================================================
   * 2. Prédiction du mot suivant
   * ===================================================================== */
  function nextWordDemo(root) {
    frame(root, "nextword");
    let words = [], done = false, temp = 1;

    const text = h("p", { class: "nw-text", "aria-live": "polite" });
    const list = h("ul", { class: "nw-list" });
    const tempInput = h("input", { type: "range", min: 0.2, max: 2, step: 0.1, value: 1, id: "nw-temp" });
    const tempOut = h("output", { class: "mono" });
    const pickBtn = h("button", { type: "button", class: "btn btn-small btn-primary", i18n: "demo.nextword.pick" });
    const restartBtn = h("button", { type: "button", class: "btn btn-small btn-ghost", i18n: "demo.nextword.restart" });
    const status = h("p", { class: "demo-note", role: "status" });

    root.appendChild(h("div", { class: "nw-stage" }, [
      text,
      h("p", { class: "nw-label", i18n: "demo.nextword.candidates" }),
      list
    ]));
    root.appendChild(h("div", { class: "demo-controls" }, [
      h("div", { class: "control-range" }, [h("label", { for: "nw-temp", i18n: "demo.nextword.temperature" }), tempInput, tempOut]),
      h("div", { class: "btn-row" }, [pickBtn, restartBtn])
    ]));
    root.appendChild(status);

    const model = () => t("ia.chatgpt.model");

    function candidates() {
      const m = model();
      const lastWord = words[words.length - 1].toLowerCase();
      let c = m.table[lastWord] || m.fallback;
      if (words.length >= 14) c = [[m.end, 1]];
      const pw = c.map(([w, p]) => [w, Math.pow(p, 1 / temp)]);
      const sum = pw.reduce((s, x) => s + x[1], 0);
      return pw.map(([w, p]) => [w, p / sum]);
    }

    function render() {
      const m = model();
      const joined = words.map((w, i) => (w === m.end ? w : (i ? " " : "") + w)).join("");
      text.textContent = joined;
      if (!done) text.appendChild(h("span", { class: "nw-cursor", "aria-hidden": "true" }));
      list.innerHTML = "";
      pickBtn.disabled = done;
      tempOut.textContent = fmt(temp, 1);
      status.textContent = done ? t("demo.nextword.done") : "";
      if (done) return;
      candidates().forEach(([w, p]) => {
        const label = w === m.end ? `« ${w} » (${t("demo.nextword.endToken")})` : w;
        const pct = Math.round(p * 100);
        list.appendChild(h("li", {}, [
          h("button", { type: "button", class: "nw-choice", onclick: () => choose(w) }, [
            h("span", { class: "nw-word", text: label }),
            h("span", { class: "nw-bar", "aria-hidden": "true" }, [h("span", { style: `width:${Math.max(2, p * 100)}%` })]),
            h("span", { class: "nw-pct mono", text: pct + " %" })
          ])
        ]));
      });
    }

    function choose(w) {
      words.push(w);
      if (w === model().end) done = true;
      render();
    }

    function sample() {
      const c = candidates();
      let r = Math.random();
      for (const [w, p] of c) { r -= p; if (r <= 0) return choose(w); }
      choose(c[c.length - 1][0]);
    }

    function restart() { words = model().start.slice(); done = false; render(); }

    pickBtn.addEventListener("click", sample);
    restartBtn.addEventListener("click", restart);
    tempInput.addEventListener("input", () => { temp = Number(tempInput.value); render(); });
    document.addEventListener("i18n:change", restart);
    restart();
  }

  /* =====================================================================
   * 3. Convolution : filtres 3 x 3
   * ===================================================================== */
  function convDemo(root) {
    frame(root, "conv");
    const N = 32;
    const img = new Float32Array(N * N);
    const KERNELS = {
      edgesV: { k: [-1, 0, 1, -2, 0, 2, -1, 0, 1], signed: true, scale: 0.25 },
      edgesH: { k: [-1, -2, -1, 0, 0, 0, 1, 2, 1], signed: true, scale: 0.25 },
      outline: { k: [-1, -1, -1, -1, 8, -1, -1, -1, -1], signed: true, scale: 0.25 },
      blur: { k: [1, 2, 1, 2, 4, 2, 1, 2, 1].map((v) => v / 16), signed: false, scale: 1 },
      sharpen: { k: [0, -1, 0, -1, 5, -1, 0, -1, 0], signed: false, scale: 1 }
    };
    let current = "edgesV";
    let hover = null;
    let out = new Float32Array(N * N);

    const inCanvas = h("canvas", { class: "pix", role: "img", i18nAttr: "aria-label:demo.conv.aria" });
    const outCanvas = h("canvas", { class: "pix", "aria-hidden": "true" });
    const kernelGrid = h("div", { class: "kernel", "aria-live": "polite" });
    const select = h("select", { id: "conv-filter" });
    const clearBtn = h("button", { type: "button", class: "btn btn-small btn-ghost", i18n: "demo.conv.clear" });
    const sampleBtn = h("button", { type: "button", class: "btn btn-small btn-ghost", i18n: "demo.conv.sample" });

    root.appendChild(h("div", { class: "conv-stage" }, [
      h("figure", { class: "conv-panel" }, [inCanvas, h("figcaption", { i18n: "demo.conv.input" })]),
      h("div", { class: "conv-kernel" }, [kernelGrid, h("p", { class: "kernel-cap", i18n: "demo.conv.kernel" })]),
      h("figure", { class: "conv-panel" }, [outCanvas, h("figcaption", { i18n: "demo.conv.output" })])
    ]));
    root.appendChild(h("div", { class: "demo-controls" }, [
      h("div", { class: "control-select" }, [h("label", { for: "conv-filter", i18n: "demo.conv.filter" }), select]),
      h("div", { class: "btn-row" }, [sampleBtn, clearBtn])
    ]));

    function fillOptions() {
      select.innerHTML = "";
      Object.keys(KERNELS).forEach((key) => select.appendChild(h("option", { value: key, text: t("demo.conv.filters." + key) })));
      select.value = current;
    }

    function sampleImage() {
      img.fill(0);
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        // un carré plein et un cercle
        if (x >= 4 && x < 14 && y >= 6 && y < 16) img[y * N + x] = 1;
        const d = Math.hypot(x - 21.5, y - 20.5);
        if (d < 7.5 && d > 4.5) img[y * N + x] = 1;
        if (y >= 25 && y < 28 && x >= 3 && x < 13) img[y * N + x] = 0.6;
      }
    }

    function convolve() {
      const k = KERNELS[current].k;
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        let s = 0;
        for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
          const xx = Math.min(N - 1, Math.max(0, x + i)), yy = Math.min(N - 1, Math.max(0, y + j));
          s += img[yy * N + xx] * k[(j + 1) * 3 + (i + 1)];
        }
        out[y * N + x] = s;
      }
    }

    function paintGrid(canvas, values, mode, scale) {
      const ctx = canvas.getContext("2d");
      const c = colors();
      const surf = hexToRgb(c.surface), ink = hexToRgb(c.ink), A = hexToRgb(c.a), B = hexToRgb(c.b);
      const data = ctx.createImageData(N, N);
      for (let i = 0; i < N * N; i++) {
        let v = values[i] * scale, col, a;
        if (mode === "signed") { col = v >= 0 ? A : B; a = Math.min(1, Math.abs(v)); }
        else { col = ink; a = Math.max(0, Math.min(1, v)); }
        data.data[i * 4] = surf[0] + (col[0] - surf[0]) * a;
        data.data[i * 4 + 1] = surf[1] + (col[1] - surf[1]) * a;
        data.data[i * 4 + 2] = surf[2] + (col[2] - surf[2]) * a;
        data.data[i * 4 + 3] = 255;
      }
      canvas.width = N; canvas.height = N;
      ctx.putImageData(data, 0, 0);
    }

    function drawHover(canvas) {
      if (!hover) return;
      const ctx = canvas.getContext("2d");
      ctx.strokeStyle = colors().alert; ctx.lineWidth = 0.5;
      ctx.strokeRect(hover.x - 1 + 0.25, hover.y - 1 + 0.25, 2.5, 2.5);
    }

    function render() {
      convolve();
      const K = KERNELS[current];
      paintGrid(inCanvas, img, "gray", 1);
      paintGrid(outCanvas, out, K.signed ? "signed" : "gray", K.scale);
      if (hover) {
        drawHover(inCanvas);
        const ctx = outCanvas.getContext("2d");
        ctx.strokeStyle = colors().alert; ctx.lineWidth = 0.4;
        ctx.strokeRect(hover.x + 0.2, hover.y + 0.2, 0.6, 0.6);
      }
      kernelGrid.innerHTML = "";
      K.k.forEach((v) => {
        const txt = Number.isInteger(v) ? String(v).replace("-", "−") : fmt(v, 2);
        kernelGrid.appendChild(h("span", { class: "k-cell" + (v > 0 ? " pos" : v < 0 ? " neg" : ""), text: txt }));
      });
    }

    // Dessin
    let drawing = false, erase = false;
    function cellFrom(e, canvas) {
      const r = canvas.getBoundingClientRect();
      return { x: Math.floor(((e.clientX - r.left) / r.width) * N), y: Math.floor(((e.clientY - r.top) / r.height) * N) };
    }
    function paint(e) {
      const { x, y } = cellFrom(e, inCanvas);
      for (let j = -1; j <= 0; j++) for (let i = -1; i <= 0; i++) {
        const xx = x + i, yy = y + j;
        if (xx >= 0 && yy >= 0 && xx < N && yy < N) img[yy * N + xx] = erase ? 0 : 1;
      }
      render();
    }
    inCanvas.addEventListener("pointerdown", (e) => {
      drawing = true; erase = e.button === 2;
      inCanvas.setPointerCapture(e.pointerId); paint(e); e.preventDefault();
    });
    inCanvas.addEventListener("pointermove", (e) => { if (drawing) paint(e); });
    inCanvas.addEventListener("pointerup", () => { drawing = false; });
    inCanvas.addEventListener("contextmenu", (e) => e.preventDefault());

    outCanvas.addEventListener("pointermove", (e) => { hover = cellFrom(e, outCanvas); render(); });
    outCanvas.addEventListener("pointerleave", () => { hover = null; render(); });

    select.addEventListener("change", () => { current = select.value; render(); });
    clearBtn.addEventListener("click", () => { img.fill(0); render(); });
    sampleBtn.addEventListener("click", () => { sampleImage(); render(); });
    document.addEventListener("theme:change", render);
    document.addEventListener("i18n:change", () => { fillOptions(); render(); });

    fillOptions();
    sampleImage();
    render();
  }

  /* =====================================================================
   * 4. Détection d'anomalies sur un capteur
   * ===================================================================== */
  function anomalyDemo(root) {
    frame(root, "anomaly");
    const N = 240, WIN = 25;
    let x = [], incidents = [], k = 3, stats = null;

    const canvas = h("canvas", { class: "demo-canvas demo-canvas-wide", role: "img", i18nAttr: "aria-label:demo.anomaly.aria" });
    const kInput = h("input", { type: "range", min: 1.5, max: 5, step: 0.1, value: k, id: "an-k" });
    const kOut = h("output", { class: "mono" });
    const detOut = h("output", { class: "mono" });
    const falseOut = h("output", { class: "mono" });
    const newBtn = h("button", { type: "button", class: "btn btn-small btn-ghost", i18n: "demo.anomaly.newData" });

    root.appendChild(canvas);
    root.appendChild(h("ul", { class: "legend" }, [
      h("li", {}, [h("span", { class: "sw sw-line" }), h("span", { i18n: "demo.anomaly.legendSignal" })]),
      h("li", {}, [h("span", { class: "sw sw-band" }), h("span", { i18n: "demo.anomaly.legendBand" })]),
      h("li", {}, [h("span", { class: "sw sw-incident" }), h("span", { i18n: "demo.anomaly.legendIncident" })]),
      h("li", {}, [h("span", { class: "sw sw-alert" }), h("span", { i18n: "demo.anomaly.legendAlert" })])
    ]));
    root.appendChild(h("div", { class: "demo-stats" }, [
      h("span", {}, [h("span", { i18n: "demo.anomaly.detected" }), " ", detOut]),
      h("span", {}, [h("span", { i18n: "demo.anomaly.falseAlerts" }), " ", falseOut])
    ]));
    root.appendChild(h("div", { class: "demo-controls" }, [
      h("div", { class: "control-range" }, [
        h("label", { for: "an-k", i18n: "demo.anomaly.threshold" }), kInput, kOut
      ]),
      h("div", { class: "btn-row" }, [newBtn])
    ]));

    const gauss = () => {
      let u = 0, v = 0;
      while (!u) u = Math.random(); while (!v) v = Math.random();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    };

    function generate() {
      const phase = Math.random() * 6;
      x = [];
      for (let i = 0; i < N; i++) x.push(Math.sin(i / 16 + phase) * 0.5 + gauss() * 0.12);
      const s = 55 + Math.floor(Math.random() * 50);
      const sign = Math.random() < 0.5 ? 1 : -1;
      for (let i = s; i < s + 3; i++) x[i] += sign * (i === s + 1 ? 1.4 : 0.9);
      const d = 165 + Math.floor(Math.random() * 30), len = 22;
      for (let i = d; i < d + len; i++) x[i] += ((i - d) / len) * 1.9;
      incidents = [[s, s + 3], [d, d + len]];
    }

    function analyze() {
      const mean = [], std = [], alerts = [];
      for (let i = 0; i < N; i++) {
        if (i < WIN) { mean.push(null); std.push(null); continue; }
        let m = 0; for (let j = i - WIN; j < i; j++) m += x[j]; m /= WIN;
        let v = 0; for (let j = i - WIN; j < i; j++) v += (x[j] - m) ** 2; v = Math.sqrt(v / WIN);
        mean.push(m); std.push(v);
        if (Math.abs(x[i] - m) > k * v) alerts.push(i);
      }
      const inIncident = (i) => incidents.findIndex(([a, b]) => i >= a && i < b + 3);
      const hit = new Set();
      let falseCount = 0;
      alerts.forEach((i) => { const n = inIncident(i); if (n >= 0) hit.add(n); else falseCount++; });
      stats = { mean, std, alerts, detected: hit.size, falseCount };
    }

    const redraw = hiDpiCanvas(canvas, (ctx, W, H) => {
      if (!stats) return;
      const c = colors();
      const pad = { l: 8, r: 8, t: 14, b: 14 };
      let lo = Infinity, hi = -Infinity;
      x.forEach((v) => { lo = Math.min(lo, v); hi = Math.max(hi, v); });
      lo -= 0.3; hi += 0.3;
      const X = (i) => pad.l + (i / (N - 1)) * (W - pad.l - pad.r);
      const Y = (v) => pad.t + (1 - (v - lo) / (hi - lo)) * (H - pad.t - pad.b);

      // incidents réels
      ctx.fillStyle = c.b; ctx.globalAlpha = 0.16;
      incidents.forEach(([a, b]) => ctx.fillRect(X(a) - 2, pad.t, X(b) - X(a) + 4, H - pad.t - pad.b));
      ctx.globalAlpha = 1;

      // zone normale
      ctx.fillStyle = c.a; ctx.globalAlpha = 0.13;
      ctx.beginPath();
      let started = false;
      for (let i = WIN; i < N; i++) { const p = Y(stats.mean[i] + k * stats.std[i]); started ? ctx.lineTo(X(i), p) : (ctx.moveTo(X(i), p), started = true); }
      for (let i = N - 1; i >= WIN; i--) ctx.lineTo(X(i), Y(stats.mean[i] - k * stats.std[i]));
      ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1;

      // signal
      ctx.strokeStyle = c.ink; ctx.lineWidth = 1.5; ctx.lineJoin = "round";
      ctx.beginPath();
      x.forEach((v, i) => (i ? ctx.lineTo(X(i), Y(v)) : ctx.moveTo(X(i), Y(v))));
      ctx.stroke();

      // alertes
      stats.alerts.forEach((i) => {
        ctx.beginPath(); ctx.arc(X(i), Y(x[i]), 4.5, 0, Math.PI * 2);
        ctx.fillStyle = c.alert; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = c.surface; ctx.stroke();
      });
    });

    function sync() {
      analyze();
      kOut.textContent = fmt(k, 1) + " " + t("demo.anomaly.unit");
      detOut.textContent = stats.detected + " / " + incidents.length;
      falseOut.textContent = stats.falseCount;
      redraw();
    }

    kInput.addEventListener("input", () => { k = Number(kInput.value); sync(); });
    newBtn.addEventListener("click", () => { generate(); sync(); });
    document.addEventListener("i18n:change", sync);
    generate();
    sync();
  }

  /* ---------- Montage ---------- */
  const DEMOS = { gradient: gradientDemo, nextword: nextWordDemo, conv: convDemo, anomaly: anomalyDemo };
  window.i18n.ready.then(() => {
    document.querySelectorAll("[data-demo]").forEach((root) => {
      const fn = DEMOS[root.dataset.demo];
      if (!fn) return;
      root.setAttribute("role", "group");
      fn(root);
      window.i18n.apply(root);
    });
  });
})();
