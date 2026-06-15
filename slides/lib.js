// lib.js — Tema y helpers compartidos para todos los generadores de slides.
// Tema oscuro tipo terminal/neón.
const pptxgen = require("pptxgenjs");

const C = {
  bg: "0B1B2B", panel: "12293D", panel2: "16314A", code: "081320",
  cyan: "22D3EE", green: "34D399", rose: "FB7185", amber: "FBBF24",
  text: "E8EEF5", muted: "A8B4C4", white: "FFFFFF", line: "284963",
};
const F = { head: "Trebuchet MS", body: "Calibri", mono: "Consolas" };
const M = 0.6;

function bg(s, color = C.bg) { s.background = { color }; }

function header(s, num, kicker, title) {
  s.addShape("roundRect", { x: M, y: 0.5, w: 0.62, h: 0.62, rectRadius: 0.1, fill: { color: C.cyan } });
  s.addText(String(num), { x: M, y: 0.5, w: 0.62, h: 0.62, align: "center", valign: "middle", fontFace: F.mono, fontSize: 22, bold: true, color: C.bg, margin: 0 });
  s.addText(kicker, { x: 1.4, y: 0.53, w: 8.2, h: 0.28, fontFace: F.mono, fontSize: 11, color: C.cyan, margin: 0, charSpacing: 1 });
  s.addText(title, { x: 1.4, y: 0.82, w: 8.2, h: 0.62, fontFace: F.head, fontSize: 25, bold: true, color: C.white, margin: 0 });
}

function content(p, num, kicker, title) { const s = p.addSlide(); bg(s); header(s, num, kicker, title); return s; }

function bullets(s, items, o = {}) {
  const arr = items.map((t) => {
    const obj = typeof t === "object";
    return { text: obj ? t.text : t, options: { bullet: { indent: 16 }, breakLine: true, color: (obj && t.color) || C.text, fontSize: o.fontSize || 16, bold: obj && t.bold, paraSpaceAfter: 10 } };
  });
  s.addText(arr, { x: o.x ?? M, y: o.y ?? 1.8, w: o.w ?? 8.9, h: o.h ?? 3.3, fontFace: F.body, valign: "top" });
}

function codePanel(s, lines, o = {}) {
  const x = o.x ?? M, y = o.y ?? 1.85, w = o.w ?? 8.8, h = o.h ?? 3.0;
  s.addShape("rect", { x, y, w, h, fill: { color: C.code }, line: { color: C.line, width: 1 } });
  const arr = lines.map((l) => { const obj = typeof l === "object"; return { text: obj ? l.text : l, options: { breakLine: true, color: (obj && l.color) || C.green, fontSize: o.fontSize || 13.5 } }; });
  s.addText(arr, { x: x + 0.22, y: y + 0.14, w: w - 0.44, h: h - 0.28, fontFace: F.mono, valign: "top", align: "left" });
}

function card(s, x, y, w, h, accent, titleText, items, o = {}) {
  s.addShape("rect", { x, y, w, h, fill: { color: C.panel }, line: { color: accent, width: 1.25 } });
  s.addShape("rect", { x, y, w: 0.09, h, fill: { color: accent } });
  s.addText(titleText, { x: x + 0.26, y: y + 0.16, w: w - 0.42, h: 0.42, fontFace: F.head, bold: true, fontSize: o.titleSize || 15, color: accent, margin: 0 });
  const arr = items.map((t) => ({ text: typeof t === "object" ? t.text : t, options: { bullet: { indent: 13 }, breakLine: true, color: C.text, fontSize: o.fontSize || 12.5, paraSpaceAfter: 7 } }));
  s.addText(arr, { x: x + 0.26, y: y + 0.64, w: w - 0.5, h: h - 0.8, fontFace: F.body, valign: "top" });
}

function steps(s, labels, y, accent = C.cyan) {
  const n = labels.length, gap = 0.16, totalW = 8.9;
  const bw = (totalW - gap * (n - 1)) / n;
  let x = M;
  labels.forEach((lab) => {
    s.addShape("roundRect", { x, y, w: bw, h: 0.85, rectRadius: 0.07, fill: { color: C.panel }, line: { color: accent, width: 1.25 } });
    s.addText(lab, { x: x + 0.04, y, w: bw - 0.08, h: 0.85, align: "center", valign: "middle", fontFace: F.body, fontSize: 11.5, bold: true, color: C.text, margin: 0 });
    x += bw + gap;
  });
}

function callout(s, big, sub, accent = C.amber, y = 2.1) {
  s.addShape("rect", { x: M, y, w: 8.8, h: 1.7, fill: { color: C.panel }, line: { color: accent, width: 1.5 } });
  s.addShape("rect", { x: M, y, w: 0.1, h: 1.7, fill: { color: accent } });
  s.addText(big, { x: M + 0.35, y: y + 0.22, w: 8.2, h: 0.85, fontFace: F.head, bold: true, fontSize: 24, color: accent, margin: 0 });
  s.addText(sub, { x: M + 0.35, y: y + 1.0, w: 8.2, h: 0.6, fontFace: F.body, fontSize: 15, color: C.text, margin: 0 });
}

function table(s, rows, o = {}) {
  const head = rows[0].map((c) => ({ text: c, options: { fill: { color: C.cyan }, color: C.bg, bold: true, fontSize: o.hs || 12.5, align: "left", valign: "middle" } }));
  const body = rows.slice(1).map((r, ri) => r.map((c) => ({ text: c, options: { fill: { color: ri % 2 ? C.panel : C.panel2 }, color: C.text, fontSize: o.fs || 11.5, align: "left", valign: "middle" } })));
  s.addTable([head, ...body], { x: o.x ?? M, y: o.y ?? 1.8, w: o.w ?? 8.8, colW: o.colW, rowH: o.rowH || 0.38, border: { type: "solid", pt: 1, color: C.line }, fontFace: F.body, margin: 4, valign: "middle" });
}

function titleSlide(p, kicker, title, subtitle, footer) {
  const s = p.addSlide(); bg(s);
  s.addShape("roundRect", { x: 8.55, y: 0.5, w: 0.5, h: 0.5, rectRadius: 0.08, fill: { color: C.cyan } });
  s.addShape("roundRect", { x: 9.1, y: 0.5, w: 0.5, h: 0.5, rectRadius: 0.08, fill: { color: C.rose, transparency: 25 } });
  s.addShape("roundRect", { x: 8.55, y: 1.05, w: 0.5, h: 0.5, rectRadius: 0.08, fill: { color: C.green, transparency: 25 } });
  s.addText(kicker, { x: M, y: 1.55, w: 8, h: 0.4, fontFace: F.mono, fontSize: 15, color: C.cyan, margin: 0, charSpacing: 1 });
  s.addText(title, { x: M, y: 2.0, w: 8.9, h: 1.5, fontFace: F.head, bold: true, fontSize: 38, color: C.white, margin: 0 });
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

module.exports = { pptxgen, C, F, M, bg, header, content, bullets, codePanel, card, steps, callout, table, titleSlide, closing, newDeck };
