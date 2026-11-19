/*
 * Démo de la page d'accueil : un petit réseau de neurones (2 -> 12 -> 12 -> 1)
 * entraîné en direct par descente de gradient (optimiseur Adam), en JavaScript pur.
 */
(function () {
  const canvas = document.getElementById("net-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const t = (k) => window.i18n.t(k);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const iterOut = document.querySelector("[data-net-iter]");
  const accOut = document.querySelector("[data-net-acc]");
  const toggleBtn = document.querySelector("[data-net-toggle]");
  const resetBtn = document.querySelector("[data-net-reset]");
  const classBtns = document.querySelectorAll("[data-net-class]");

  /* ---------- Réseau ---------- */
  const SIZES = [2, 12, 12, 1];
  let W, B, mW, vW, mB, vB, adamT;

  function randn() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function initNet() {
    W = []; B = []; mW = []; vW = []; mB = []; vB = []; adamT = 0;
    for (let l = 0; l < SIZES.length - 1; l++) {
      const n = SIZES[l], m = SIZES[l + 1];
      const w = new Float64Array(n * m);
      for (let i = 0; i < w.length; i++) w[i] = randn() * Math.sqrt(1 / n);
      W.push(w); B.push(new Float64Array(m));
      mW.push(new Float64Array(n * m)); vW.push(new Float64Array(n * m));
      mB.push(new Float64Array(m)); vB.push(new Float64Array(m));
    }
  }

  function forward(x0, x1, acts) {
    let a = acts ? acts[0] : new Float64Array(2);
    a[0] = x0; a[1] = x1;
    for (let l = 0; l < W.length; l++) {
      const n = SIZES[l], m = SIZES[l + 1];
      const out = acts ? acts[l + 1] : new Float64Array(m);
      const w = W[l], b = B[l];
      const last = l === W.length - 1;
      for (let j = 0; j < m; j++) {
        let z = b[j];
        for (let i = 0; i < n; i++) z += w[j * n + i] * a[i];
        out[j] = last ? 1 / (1 + Math.exp(-z)) : Math.tanh(z);
      }
      a = out;
    }
    return a[0];
  }

  const acts = SIZES.map((s) => new Float64Array(s));
  const deltas = SIZES.map((s) => new Float64Array(s));

  function trainStep(points) {
    const gW = W.map((w) => new Float64Array(w.length));
    const gB = B.map((b) => new Float64Array(b.length));
    let correct = 0;
    for (const p of points) {
      const y = forward(p.x, p.y, acts);
      if ((y > 0.5 ? 1 : 0) === p.c) correct++;
      const L = W.length;
      deltas[L][0] = y - p.c; // sigmoïde + entropie croisée
      for (let l = L - 1; l >= 0; l--) {
        const n = SIZES[l], m = SIZES[l + 1];
        const aIn = acts[l], dOut = deltas[l + 1], dIn = deltas[l];
        for (let i = 0; i < n; i++) dIn[i] = 0;
        for (let j = 0; j < m; j++) {
          const d = dOut[j];
          gB[l][j] += d;
          for (let i = 0; i < n; i++) {
            gW[l][j * n + i] += d * aIn[i];
            dIn[i] += W[l][j * n + i] * d;
          }
        }
        if (l > 0) for (let i = 0; i < n; i++) dIn[i] *= 1 - aIn[i] * aIn[i];
      }
    }
    const N = points.length || 1, lr = 0.03, b1 = 0.9, b2 = 0.999, eps = 1e-8;
    adamT++;
    const c1 = 1 - Math.pow(b1, adamT), c2 = 1 - Math.pow(b2, adamT);
    const upd = (p, g, m, v) => {
      for (let i = 0; i < p.length; i++) {
        const gi = g[i] / N;
        m[i] = b1 * m[i] + (1 - b1) * gi;
        v[i] = b2 * v[i] + (1 - b2) * gi * gi;
        p[i] -= lr * (m[i] / c1) / (Math.sqrt(v[i] / c2) + eps);
      }
    };
    for (let l = 0; l < W.length; l++) { upd(W[l], gW[l], mW[l], vW[l]); upd(B[l], gB[l], mB[l], vB[l]); }
    return correct / N;
  }

  /* ---------- Données ---------- */
  let points = [];
  let shapeIndex = Math.floor(Math.random() * 3);
  const jitter = (s) => (Math.random() - 0.5) * s;

  function makeData() {
    shapeIndex = (shapeIndex + 1) % 3;
    const pts = [];
    if (shapeIndex === 0) { // cercle
      for (let i = 0; i < 60; i++) {
        const a = Math.random() * Math.PI * 2, r = Math.random() * 0.38;
        pts.push({ x: Math.cos(a) * r, y: Math.sin(a) * r, c: 0 });
        const r2 = 0.6 + Math.random() * 0.3, a2 = Math.random() * Math.PI * 2;
        pts.push({ x: Math.cos(a2) * r2, y: Math.sin(a2) * r2, c: 1 });
      }
    } else if (shapeIndex === 1) { // damier (XOR)
      for (let i = 0; i < 120; i++) {
        let x = Math.random() * 1.8 - 0.9, y = Math.random() * 1.8 - 0.9;
        if (Math.abs(x) < 0.08 || Math.abs(y) < 0.08) { i--; continue; }
        pts.push({ x, y, c: x * y > 0 ? 0 : 1 });
      }
    } else { // deux lunes
      for (let i = 0; i < 60; i++) {
        const a = Math.random() * Math.PI;
        pts.push({ x: Math.cos(a) * 0.6 - 0.25 + jitter(0.15), y: Math.sin(a) * 0.6 - 0.15 + jitter(0.15), c: 0 });
        const b = Math.random() * Math.PI;
        pts.push({ x: Math.cos(b) * 0.6 + 0.25 + jitter(0.15), y: -Math.sin(b) * 0.6 + 0.2 + jitter(0.15), c: 1 });
      }
    }
    return pts;
  }

  /* ---------- Rendu ---------- */
  let width = 0, height = 0, dpr = 1;
  const GRID_W = 64;
  let gridH = 48;
  const off = document.createElement("canvas");
  const offCtx = off.getContext("2d");

  function readColors() {
    const s = getComputedStyle(document.documentElement);
    const hex = (name) => {
      const v = s.getPropertyValue(name).trim();
      const m = v.match(/^#?([0-9a-f]{6})$/i);
      const n = m ? parseInt(m[1], 16) : 0x888888;
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };
    return { a: hex("--data-a"), b: hex("--data-b"), bg: hex("--surface"), ink: s.getPropertyValue("--ink").trim(), surface: s.getPropertyValue("--surface").trim() };
  }
  let colors = readColors();

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width; height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    gridH = Math.max(8, Math.round(GRID_W * height / width));
    off.width = GRID_W; off.height = gridH;
    draw();
  }

  // Coordonnées du modèle : x dans [-1, 1], y proportionnel au format du cadre
  const toModel = (px, py) => {
    const s = Math.min(width, height) / 2;
    return { x: (px - width / 2) / s, y: -(py - height / 2) / s };
  };
  const toPixel = (x, y) => {
    const s = Math.min(width, height) / 2;
    return { px: width / 2 + x * s, py: height / 2 - y * s };
  };

  function draw() {
    if (!width) return;
    const img = offCtx.createImageData(GRID_W, gridH);
    const { a, b, bg } = colors;
    for (let j = 0; j < gridH; j++) {
      for (let i = 0; i < GRID_W; i++) {
        const m = toModel((i + 0.5) * width / GRID_W, (j + 0.5) * height / gridH);
        const p = forward(m.x, m.y);
        const col = p < 0.5 ? a : b;
        const strength = Math.min(1, Math.abs(p - 0.5) * 2) * 0.24;
        const k = (j * GRID_W + i) * 4;
        img.data[k] = bg[0] + (col[0] - bg[0]) * strength;
        img.data[k + 1] = bg[1] + (col[1] - bg[1]) * strength;
        img.data[k + 2] = bg[2] + (col[2] - bg[2]) * strength;
        img.data[k + 3] = 255;
      }
    }
    offCtx.putImageData(img, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const r = width < 400 ? 3.5 : 4.5;
    for (const p of points) {
      const { px, py } = toPixel(p.x, p.y);
      const c = p.c === 0 ? a : b;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = colors.surface;
      ctx.stroke();
    }
  }

  /* ---------- Boucle ---------- */
  let running = !reduceMotion;
  let visible = true;
  let iterations = 0;
  let accuracy = 0;
  let raf = null;
  let last = 0;

  function updateReadout() {
    iterOut.textContent = iterations.toLocaleString(window.i18n.current || "fr");
    accOut.textContent = points.length ? Math.round(accuracy * 100) + " %" : "–";
  }

  function syncToggle() {
    toggleBtn.textContent = running ? t("net.pause") : t("net.play");
    toggleBtn.setAttribute("aria-pressed", String(!running));
  }

  function loop(ts) {
    raf = null;
    if (!running || !visible) return;
    if (ts - last > 30) {
      for (let k = 0; k < 4; k++) accuracy = trainStep(points);
      iterations += 4;
      draw();
      updateReadout();
      last = ts;
    }
    raf = requestAnimationFrame(loop);
  }
  function kick() { if (!raf && running && visible) raf = requestAnimationFrame(loop); }

  function reset() {
    initNet();
    points = makeData();
    iterations = 0;
    accuracy = trainStep(points);
    draw();
    updateReadout();
    kick();
  }

  /* ---------- Interactions ---------- */
  let currentClass = 0;
  classBtns.forEach((btn) => btn.addEventListener("click", () => {
    currentClass = Number(btn.dataset.netClass);
    classBtns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
  }));

  canvas.addEventListener("pointerdown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const m = toModel(e.clientX - rect.left, e.clientY - rect.top);
    for (let k = 0; k < 4; k++) {
      points.push({ x: m.x + (Math.random() - 0.5) * 0.08, y: m.y + (Math.random() - 0.5) * 0.08, c: currentClass });
    }
    if (!running) { for (let k = 0; k < 40; k++) accuracy = trainStep(points); iterations += 40; updateReadout(); }
    draw();
    kick();
  });

  toggleBtn.addEventListener("click", () => {
    running = !running;
    syncToggle();
    kick();
  });
  resetBtn.addEventListener("click", reset);

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    kick();
  }).observe(canvas);

  document.addEventListener("theme:change", () => { colors = readColors(); draw(); });
  document.addEventListener("i18n:change", () => { syncToggle(); updateReadout(); });

  initNet();
  points = makeData();
  if (!running) for (let k = 0; k < 300; k++) { accuracy = trainStep(points); iterations++; }
  window.i18n.ready.then(() => { syncToggle(); updateReadout(); resize(); kick(); });
})();
