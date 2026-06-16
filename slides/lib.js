// lib.js — Tema y helpers compartidos para todos los generadores de slides.
// Tema oscuro tipo terminal/neón. Diseño v2: sombras suaves, esquinas redondeadas,
// paneles de código con "chrome" de terminal, pasos con flechas de flujo.
const pptxgen = require("pptxgenjs");

const C = {
  bg: "0A1622", panel: "13283C", panel2: "0F2133", code: "060F1A",
  cyan: "22D3EE", green: "34D399", rose: "FB7185", amber: "FBBF24",
  text: "EAF1F8", muted: "9FB0C2", white: "FFFFFF", line: "264862",
};
const F = { head: "Trebuchet MS", body: "Calibri", mono: "Consolas" };
const M = 0.6;

// Sombra suave reutilizable (da profundidad a tarjetas y paneles).
const SH = { type: "outer", color: "000000", blur: 7, offset: 3, angle: 90, opacity: 0.5 };
// Sombra más sutil para piezas pequeñas (pasos, badges).
const SHsm = { type: "outer", color: "000000", blur: 4, offset: 2, angle: 90, opacity: 0.4 };

function bg(s, color = C.bg) { s.background = { color }; }

function header(s, num, kicker, title) {
  s.addShape("roundRect", { x: M, y: 0.5, w: 0.62, h: 0.62, rectRadius: 0.1, fill: { color: C.cyan }, shadow: { ...SHsm } });
  s.addText(String(num), { x: M, y: 0.5, w: 0.62, h: 0.62, align: "center", valign: "middle", fontFace: F.mono, fontSize: 22, bold: true, color: C.bg, margin: 0 });
  s.addText(kicker, { x: 1.4, y: 0.53, w: 8.2, h: 0.28, fontFace: F.mono, fontSize: 11, color: C.cyan, margin: 0, charSpacing: 1 });
  s.addText(title, { x: 1.4, y: 0.82, w: 8.2, h: 0.62, fontFace: F.head, fontSize: 25, bold: true, color: C.white, margin: 0 });
  // Subrayado de acento bajo el título.
  s.addShape("rect", { x: 1.42, y: 1.44, w: 1.1, h: 0.035, fill: { color: C.cyan } });
}

function content(p, num, kicker, title) { const s = p.addSlide(); bg(s); header(s, num, kicker, title); return s; }

function bullets(s, items, o = {}) {
  const arr = items.map((t) => {
    const obj = typeof t === "object";
    return { text: obj ? t.text : t, options: { bullet: { indent: 16 }, breakLine: true, color: (obj && t.color) || C.text, fontSize: o.fontSize || 16, bold: obj && t.bold, paraSpaceAfter: 10 } };
  });
  s.addText(arr, { x: o.x ?? M, y: o.y ?? 1.8, w: o.w ?? 8.9, h: o.h ?? 3.3, fontFace: F.body, valign: "top" });
}

// Panel de código con barra de título tipo ventana de terminal (3 puntos + título opcional).
function codePanel(s, lines, o = {}) {
  const x = o.x ?? M, y = o.y ?? 1.85, w = o.w ?? 8.8, h = o.h ?? 3.0;
  s.addShape("roundRect", { x, y, w, h, rectRadius: 0.035, fill: { color: C.code }, line: { color: C.line, width: 1 }, shadow: { ...SH } });
  // Barra de título de la "ventana".
  s.addShape("rect", { x: x + 0.02, y: y + 0.04, w: w - 0.04, h: 0.3, fill: { color: C.panel } });
  s.addShape("ellipse", { x: x + 0.18, y: y + 0.12, w: 0.13, h: 0.13, fill: { color: C.rose } });
  s.addShape("ellipse", { x: x + 0.37, y: y + 0.12, w: 0.13, h: 0.13, fill: { color: C.amber } });
  s.addShape("ellipse", { x: x + 0.56, y: y + 0.12, w: 0.13, h: 0.13, fill: { color: C.green } });
  if (o.title) s.addText(o.title, { x: x + 0.8, y: y + 0.04, w: w - 1.0, h: 0.3, fontFace: F.mono, fontSize: 10, color: C.muted, valign: "middle", margin: 0 });
  const arr = lines.map((l) => { const obj = typeof l === "object"; return { text: obj ? l.text : l, options: { breakLine: true, color: (obj && l.color) || C.green, fontSize: o.fontSize || 13.5 } }; });
  s.addText(arr, { x: x + 0.24, y: y + 0.46, w: w - 0.46, h: h - 0.6, fontFace: F.mono, valign: "top", align: "left" });
}

// Tarjeta con barra de acento a la izquierda, título y divisor. Esquinas redondeadas + sombra.
function card(s, x, y, w, h, accent, titleText, items, o = {}) {
  s.addShape("roundRect", { x, y, w, h, rectRadius: 0.05, fill: { color: C.panel }, line: { color: accent, width: 1.25 }, shadow: { ...SH } });
  s.addShape("rect", { x: x + 0.015, y: y + 0.08, w: 0.08, h: h - 0.16, fill: { color: accent } });
  s.addText(titleText, { x: x + 0.28, y: y + 0.15, w: w - 0.44, h: 0.42, fontFace: F.head, bold: true, fontSize: o.titleSize || 15, color: accent, margin: 0, charSpacing: 0.5 });
  s.addShape("rect", { x: x + 0.28, y: y + 0.58, w: w - 0.56, h: 0.018, fill: { color: C.line } });
  const arr = items.map((t) => ({ text: typeof t === "object" ? t.text : t, options: { bullet: { indent: 13 }, breakLine: true, color: C.text, fontSize: o.fontSize || 12.5, paraSpaceAfter: 7 } }));
  s.addText(arr, { x: x + 0.28, y: y + 0.7, w: w - 0.52, h: h - 0.86, fontFace: F.body, valign: "top" });
}

// Pasos en fila con flechas de flujo entre ellos (›). Esquinas redondeadas + sombra.
function steps(s, labels, y, accent = C.cyan) {
  const n = labels.length, gap = 0.18, totalW = 8.9;
  const bw = (totalW - gap * (n - 1)) / n;
  let x = M;
  labels.forEach((lab, i) => {
    s.addShape("roundRect", { x, y, w: bw, h: 0.9, rectRadius: 0.08, fill: { color: C.panel }, line: { color: accent, width: 1.25 }, shadow: { ...SHsm } });
    s.addShape("rect", { x: x + 0.12, y: y + 0.16, w: bw - 0.24, h: 0.03, fill: { color: accent } });
    s.addText(lab, { x: x + 0.04, y: y + 0.12, w: bw - 0.08, h: 0.78, align: "center", valign: "middle", fontFace: F.body, fontSize: 11.5, bold: true, color: C.text, margin: 0 });
    if (i < n - 1) s.addText("›", { x: x + bw - 0.04, y, w: gap + 0.08, h: 0.9, align: "center", valign: "middle", fontFace: F.head, fontSize: 18, bold: true, color: accent, margin: 0 });
    x += bw + gap;
  });
}

function callout(s, big, sub, accent = C.amber, y = 2.1) {
  s.addShape("roundRect", { x: M, y, w: 8.8, h: 1.7, rectRadius: 0.05, fill: { color: C.panel }, line: { color: accent, width: 1.5 }, shadow: { ...SH } });
  s.addShape("rect", { x: M + 0.015, y: y + 0.08, w: 0.1, h: 1.54, fill: { color: accent } });
  s.addText(big, { x: M + 0.38, y: y + 0.22, w: 8.2, h: 0.85, fontFace: F.head, bold: true, fontSize: 24, color: accent, margin: 0 });
  s.addText(sub, { x: M + 0.38, y: y + 1.0, w: 8.2, h: 0.6, fontFace: F.body, fontSize: 15, color: C.text, margin: 0 });
}

// Tabla con encabezado de acento, filas alternas y más aire.
function table(s, rows, o = {}) {
  const accent = o.accent || C.cyan;
  const head = rows[0].map((c) => ({ text: c, options: { fill: { color: accent }, color: C.bg, bold: true, fontSize: o.hs || 12.5, align: "left", valign: "middle" } }));
  const body = rows.slice(1).map((r, ri) => r.map((c) => ({ text: c, options: { fill: { color: ri % 2 ? C.panel : C.panel2 }, color: C.text, fontSize: o.fs || 11.5, align: "left", valign: "middle" } })));
  s.addTable([head, ...body], { x: o.x ?? M, y: o.y ?? 1.8, w: o.w ?? 8.8, colW: o.colW, rowH: o.rowH || 0.4, border: { type: "solid", pt: 1, color: C.line }, fontFace: F.body, margin: 6, valign: "middle" });
}

function titleSlide(p, kicker, title, subtitle, footer) {
  const s = p.addSlide(); bg(s);
  s.addShape("roundRect", { x: 8.55, y: 0.5, w: 0.5, h: 0.5, rectRadius: 0.08, fill: { color: C.cyan }, shadow: { ...SHsm } });
  s.addShape("roundRect", { x: 9.1, y: 0.5, w: 0.5, h: 0.5, rectRadius: 0.08, fill: { color: C.rose, transparency: 25 } });
  s.addShape("roundRect", { x: 8.55, y: 1.05, w: 0.5, h: 0.5, rectRadius: 0.08, fill: { color: C.green, transparency: 25 } });
  s.addText(kicker, { x: M, y: 1.55, w: 8, h: 0.4, fontFace: F.mono, fontSize: 15, color: C.cyan, margin: 0, charSpacing: 1 });
  s.addText(title, { x: M, y: 2.0, w: 8.9, h: 1.5, fontFace: F.head, bold: true, fontSize: 38, color: C.white, margin: 0 });
  s.addShape("rect", { x: M + 0.02, y: 3.45, w: 1.4, h: 0.04, fill: { color: C.cyan } });
  s.addText(subtitle, { x: M, y: 3.6, w: 8.9, h: 0.6, fontFace: F.body, fontSize: 17, color: C.muted, margin: 0 });
  s.addShape("rect", { x: M, y: 4.75, w: 8.8, h: 0.012, fill: { color: C.line } });
  s.addText(footer, { x: M, y: 4.9, w: 8.9, h: 0.4, fontFace: F.mono, fontSize: 12, color: C.muted, margin: 0 });
  return s;
}

function closing(p, finLabel, big, sub) {
  const s = p.addSlide(); bg(s);
  s.addText(finLabel, { x: M, y: 1.9, w: 8, h: 0.4, fontFace: F.mono, fontSize: 14, color: C.cyan, margin: 0 });
  s.addText(big, { x: M, y: 2.3, w: 8.9, h: 1.4, fontFace: F.head, bold: true, fontSize: 30, color: C.white, margin: 0 });
  s.addText(sub, { x: M, y: 3.7, w: 8.9, h: 0.8, fontFace: F.body, fontSize: 16, color: C.muted, margin: 0 });
  return s;
}

function newDeck(title) { const p = new pptxgen(); p.layout = "LAYOUT_16x9"; p.author = "Daniel Eduardo Gonzalez Ramirez"; p.title = title; return p; }

module.exports = { pptxgen, C, F, M, SH, SHsm, bg, header, content, bullets, codePanel, card, steps, callout, table, titleSlide, closing, newDeck };
