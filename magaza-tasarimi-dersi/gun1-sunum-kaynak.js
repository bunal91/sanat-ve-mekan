const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.layout = "LAYOUT_WIDE";              // 13.33 x 7.5
p.title  = "Marka Anahtarı ve Müşteri Deneyimi Araştırması";

/* ---------------- palette ---------------- */
const INK   = "16161A";
const PAPER = "FCFCFA";
const BODY  = "2B2B31";
const MUTED = "7A7A82";
const FAINT = "A6A6AC";
const ACC   = "8C3A2B";   // deep brick
const ACC2  = "B0705E";   // lighter brick (second step of the same hue)
const ACCT  = "F6EAE6";   // accent tint
const ACCT2 = "EBD7D1";   // accent tint, one step darker
const BACKF = "EFEFEC";
const HAIR  = "C9C9CF";
const GRID  = "EDEDF0";
const DIMW  = "B9B9C0";

const H = "Cambria";
const S = "Calibri";

const M  = 0.85;          // left margin
const R   = 12.48;        // right edge
const CW = 5.50;          // column width
const C2 = 6.98;          // second column x
const FW = 11.63;         // full content width

let n = 0;

/* ================= text helpers ================= */
function label(s, t) {
  s.addText(t, { x: M, y: 0.5, w: 10.5, h: 0.26, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 9, bold: true, color: MUTED, charSpacing: 2.8 });
}
function num(s) {
  n += 1;
  s.addText(String(n), { x: 12.0, y: 6.96, w: 0.48, h: 0.26, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 9, color: FAINT, align: "right" });
}
function img(s, t) {
  s.addText("Görsel önerisi — " + t, { x: M, y: 6.96, w: 10.9, h: 0.3, isTextBox: true,
    margin: 0, fontFace: S, fontSize: 8, color: FAINT, italic: true, lineSpacing: 10 });
}
function src(s, t) {                                  // citation, bottom-left
  s.addText(t, { x: M, y: 6.96, w: 8.5, h: 0.3, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 8.5, color: FAINT, italic: true });
}
function slide(lab, title, titleSize) {
  const s = p.addSlide();
  s.background = { color: PAPER };
  label(s, lab);
  s.addText(title, { x: M, y: 0.84, w: 11.4, h: 0.72, isTextBox: true, margin: 0,
    fontFace: H, fontSize: titleSize || 28, bold: true, color: INK, lineSpacing: 33 });
  s.addShape(p.ShapeType.line, { x: M, y: 1.63, w: 1.5, h: 0, line: { color: ACC, width: 1.75 } });
  num(s);
  return s;
}
// question slide header: the question is the title
function qslide(lab, q) {
  const s = p.addSlide();
  s.background = { color: PAPER };
  label(s, lab);
  s.addText(q, { x: M, y: 0.82, w: 11.4, h: 0.74, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 28, bold: true, color: ACC, lineSpacing: 33 });
  s.addShape(p.ShapeType.line, { x: M, y: 1.63, w: 1.5, h: 0, line: { color: ACC, width: 1.75 } });
  num(s);
  return s;
}
function text(s, t, o) {
  o = o || {};
  const size = o.size || 14, ls = o.ls || 22;
  const y = o.y !== undefined ? o.y : 1.82;
  const h = o.h !== undefined ? o.h : 1.55;
  const w = o.w !== undefined ? o.w : (o.one ? FW : CW);
  if (o.one) {
    s.addText(t, { x: o.x !== undefined ? o.x : M, y: y, w: w, h: h, isTextBox: true, margin: 0,
      fontFace: H, fontSize: size, color: o.col || BODY, lineSpacing: ls });
    return;
  }
  const paras = t.split("\n\n");
  const per = Math.floor((CW * 72 - 4) / (size * 0.52));
  const est = paras.map(q => q.split("\n").reduce((a, l) => a + Math.max(1, Math.ceil(l.length / per)), 0) + 1);
  const tot = est.reduce((a, b) => a + b, 0);
  let acc = 0, cut = paras.length;
  for (let i = 0; i < paras.length; i++) { acc += est[i]; if (acc >= tot / 2) { cut = i + 1; break; } }
  const A = paras.slice(0, cut).join("\n\n"), B = paras.slice(cut).join("\n\n");
  s.addText(A, { x: M, y: y, w: CW, h: h, isTextBox: true, margin: 0,
    fontFace: H, fontSize: size, color: BODY, lineSpacing: ls });
  if (B) s.addText(B, { x: C2, y: y, w: CW, h: h, isTextBox: true, margin: 0,
    fontFace: H, fontSize: size, color: BODY, lineSpacing: ls });
}
// dark section divider carrying the section's guiding question
function opener(nu, title, q) {
  const s = p.addSlide();
  s.background = { color: INK };
  s.addShape(p.ShapeType.line, { x: M, y: 1.35, w: 11.63, h: 0, line: { color: "3A3A42", width: 1 } });
  s.addText(nu, { x: M, y: 1.48, w: 3.4, h: 1.78, isTextBox: true, margin: 0,
    fontFace: H, fontSize: nu.length > 2 ? 78 : 104, bold: true, color: ACC, valign: "middle" });
  s.addText(title, { x: M, y: 3.35, w: 11.4, h: 1.2, isTextBox: true, margin: 0,
    fontFace: H, fontSize: title.length > 34 ? 32 : 38, bold: true, color: "FFFFFF", lineSpacing: 42 });
  s.addShape(p.ShapeType.line, { x: M, y: 4.72, w: 2.2, h: 0, line: { color: ACC, width: 2 } });
  s.addText(q, { x: M, y: 4.95, w: 10.6, h: 1.0, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 19, italic: true, color: DIMW, lineSpacing: 27 });
  n += 1;
  return s;
}
function quote(q, attr) {
  const s = p.addSlide();
  s.background = { color: PAPER };
  s.addText(q, { x: M, y: 1.9, w: 11.4, h: 3.0, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 27, italic: true, color: INK, lineSpacing: 40 });
  s.addShape(p.ShapeType.line, { x: M, y: 5.1, w: 1.8, h: 0, line: { color: ACC, width: 1.75 } });
  s.addText(attr, { x: M, y: 5.3, w: 11.4, h: 0.4, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 13, bold: true, color: ACC });
  num(s);
  return s;
}

/* ================= primitives ================= */
function dline(s, x1, y1, x2, y2, o) {
  o = o || {};
  const x = Math.min(x1, x2), y = Math.min(y1, y2);
  s.addShape(p.ShapeType.line, { x, y, w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
    line: { color: o.col || HAIR, width: o.w || 1, dashType: o.dash || "solid" } });
}
function arrow(s, x1, y1, x2, y2, o) {
  o = o || {};
  const x = Math.min(x1, x2), y = Math.min(y1, y2);
  s.addShape(p.ShapeType.line, { x, y, w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
    flipH: x2 < x1, flipV: y2 < y1,
    line: { color: o.col || ACC, width: o.w || 1.5, dashType: o.dash || "solid",
      endArrowType: "triangle" } });
}
function dot(s, x, y, o) {
  o = o || {};
  const d = o.d || 0.17;
  s.addShape(p.ShapeType.ellipse, { x: x - d / 2, y: y - d / 2, w: d, h: d,
    fill: o.hollow ? { color: PAPER } : { color: o.col || ACC },
    line: { color: o.col || ACC, width: o.lw || 1 } });
  if (o.t) s.addText(o.t, { x: x - d / 2, y: y - d / 2, w: d, h: d, isTextBox: true, margin: 0,
    fontFace: S, fontSize: o.ts || 7.5, bold: true,
    color: o.hollow ? (o.col || ACC) : "FFFFFF", align: "center", valign: "middle" });
}
function ring(s, x, y, d, o) {                       // hollow circle
  o = o || {};
  s.addShape(p.ShapeType.ellipse, { x: x - d / 2, y: y - d / 2, w: d, h: d,
    fill: o.fill ? { color: o.fill } : { type: "none" },
    line: { color: o.col || HAIR, width: o.w || 1, dashType: o.dash || "solid" } });
}
function zone(s, x, y, w, h, t, kind, tsize) {       // 0 outline · 1 accent · 2 back · 3 no border
  const fill = kind === 1 ? { color: ACCT } : kind === 2 ? { color: BACKF } : { type: "none" };
  const col  = kind === 1 ? ACC : kind === 2 ? MUTED : HAIR;
  s.addShape(p.ShapeType.rect, { x, y, w, h, fill: fill,
    line: kind === 3 ? { type: "none" } : { color: col, width: kind === 1 ? 1.25 : 0.75 } });
  if (t) s.addText(t, { x: x + 0.05, y: y, w: w - 0.1, h: h, isTextBox: true, margin: 0,
    fontFace: S, fontSize: tsize || 9, color: kind === 1 ? ACC : BODY,
    align: "center", valign: "middle", lineSpacing: (tsize || 9) + 2.5 });
}
function pill(s, x, y, w, h, t, o) {                 // rounded tag
  o = o || {};
  s.addShape(p.ShapeType.roundRect, { x, y, w, h, rectRadius: h / 2,
    fill: o.fill ? { color: o.fill } : { type: "none" },
    line: { color: o.col || ACC, width: o.w || 1 } });
  s.addText(t, { x: x + 0.06, y: y, w: w - 0.12, h: h, isTextBox: true, margin: 0,
    fontFace: S, fontSize: o.size || 10, bold: o.bold !== false, color: o.tcol || ACC,
    align: "center", valign: "middle" });
}
function cap(s, x, y, w, t, o) {
  o = o || {};
  s.addText(t, { x, y, w, h: o.h || 0.3, isTextBox: true, margin: 0,
    fontFace: o.face || S, fontSize: o.size || 9.5, bold: o.bold || false,
    color: o.col || MUTED, align: o.align || "left", lineSpacing: o.ls || 12,
    italic: o.italic || false, charSpacing: o.cs || 0 });
}
// micro section heading: letterspaced label + hairline to the right
function rule(s, x, y, w, t, o) {
  o = o || {};
  const tw = o.tw || (0.062 * t.length + 0.12);
  s.addText(t, { x, y: y - 0.13, w: tw, h: 0.26, isTextBox: true, margin: 0,
    fontFace: S, fontSize: o.size || 9, bold: true, color: o.col || FAINT, charSpacing: 1.7 });
  if (w > tw + 0.2) dline(s, x + tw + 0.08, y, x + w, y, { col: o.lcol || GRID, w: 0.75 });
}
function legend(s, items, x, y, w, size) {
  let yy = y;
  items.forEach((it, i) => {
    dot(s, x + 0.11, yy + 0.12, { t: String(i + 1), d: 0.24, col: it[2] || ACC });
    s.addText(it[0], { x: x + 0.38, y: yy - 0.03, w: w - 0.38, h: 0.26, isTextBox: true,
      margin: 0, fontFace: S, fontSize: (size || 10.5) + 0.5, bold: true, color: INK });
    if (it[1]) s.addText(it[1], { x: x + 0.38, y: yy + 0.23, w: w - 0.38, h: 0.42, isTextBox: true,
      margin: 0, fontFace: S, fontSize: size || 10, color: MUTED, lineSpacing: 12 });
    yy += it[1] ? 0.74 : 0.4;
  });
}

/* ================= composite graphics ================= */

// radial hub: nodes evenly on a circle, spokes to a labelled centre
// items: [short, sub]  ·  startDeg measured from 12 o'clock, clockwise
function radial(s, cx, cy, rad, items, centre, o) {
  o = o || {};
  const nd = items.length, start = (o.start !== undefined ? o.start : 0);
  const nr = o.nr || 0.62;                    // node diameter
  const lw = o.lw || 1.6;                     // label block width
  const cr = o.cr || 1.24;                    // centre diameter
  items.forEach((it, i) => {
    const a = (start + i * 360 / nd) * Math.PI / 180;
    const x = cx + rad * Math.sin(a), y = cy - rad * Math.cos(a);
    // spoke from centre edge to node edge
    const ex = cx + (cr / 2 + 0.03) * Math.sin(a), ey = cy - (cr / 2 + 0.03) * Math.cos(a);
    const nx = cx + (rad - nr / 2 - 0.03) * Math.sin(a), ny = cy - (rad - nr / 2 - 0.03) * Math.cos(a);
    dline(s, ex, ey, nx, ny, { col: o.spoke || GRID, w: 0.85 });
    ring(s, x, y, nr, { fill: PAPER, col: ACC, w: 1.2 });
    s.addText(String(i + 1), { x: x - nr / 2, y: y - nr / 2, w: nr, h: nr, isTextBox: true,
      margin: 0, fontFace: S, fontSize: 11, bold: true, color: ACC, align: "center", valign: "middle" });
    // outward label
    const ox = cx + (rad + nr / 2 + 0.13) * Math.sin(a);
    const oy = cy - (rad + nr / 2 + 0.13) * Math.cos(a);
    const right = Math.sin(a) > 0.08, left = Math.sin(a) < -0.08;
    const lx = right ? ox : left ? ox - lw : ox - lw / 2;
    const al = right ? "left" : left ? "right" : "center";
    const two = it[0].indexOf("\n") >= 0;
    const mh = two ? 0.44 : 0.3;
    const topC = Math.cos(a) > 0.5 && Math.abs(Math.sin(a)) < 0.5;   // label stacks upward
    const my = topC ? oy - mh - 0.34 : oy - (two ? 0.34 : 0.21);
    const sy = topC ? oy - 0.3 : oy + (two ? 0.12 : 0.1);
    s.addText(it[0], { x: lx, y: my, w: lw, h: mh, isTextBox: true, margin: 0,
      fontFace: H, fontSize: o.fs || 12.5, bold: true, color: INK, align: al,
      valign: topC ? "bottom" : "top", lineSpacing: 15 });
    if (it[1]) s.addText(it[1], { x: lx, y: sy, w: lw, h: 0.32, isTextBox: true,
      margin: 0, fontFace: S, fontSize: 8.5, color: MUTED, align: al, lineSpacing: 10.5 });
  });
  ring(s, cx, cy, cr, { fill: ACCT, col: ACC, w: 1.5 });
  if (centre[1]) {
    s.addText(centre[0], { x: cx - cr / 2, y: cy - 0.36, w: cr, h: 0.34, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 15, bold: true, color: ACC, align: "center", valign: "bottom" });
    s.addText(centre[1], { x: cx - cr / 2 - 0.12, y: cy - 0.01, w: cr + 0.24, h: 0.42,
      isTextBox: true, margin: 0, fontFace: S, fontSize: 8, color: ACC, align: "center", lineSpacing: 10 });
  } else {
    s.addText(centre[0], { x: cx - cr / 2, y: cy - 0.38, w: cr, h: 0.76, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 14, bold: true, color: ACC, align: "center", valign: "middle",
      lineSpacing: 17 });
  }
}

// journey arc: steps along a shallow arc; items: [label, state] state 0 dim · 1 core · 2 added
function arcSteps(s, cx, cy, rx, ry, items, o) {
  o = o || {};
  const nd = items.length;
  const a0 = (o.a0 !== undefined ? o.a0 : -78), a1 = (o.a1 !== undefined ? o.a1 : 78);
  const pts = items.map((it, i) => {
    const a = (a0 + i * (a1 - a0) / (nd - 1)) * Math.PI / 180;
    return [cx + rx * Math.sin(a), cy - ry * Math.cos(a)];
  });
  for (let i = 0; i < nd - 1; i++) {
    const both = items[i][1] !== 0 && items[i + 1][1] !== 0;
    dline(s, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1],
      { col: both ? ACC : DIMW, w: both ? 1.6 : 1, dash: both ? "solid" : "dash" });
  }
  items.forEach((it, i) => {
    const [x, y] = pts[i];
    const st = it[1];
    const d = st === 0 ? 0.24 : 0.36;
    if (st === 2) { ring(s, x, y, d + 0.16, { col: ACC, w: 1, dash: "dash" }); }
    dot(s, x, y, { d: d, col: st === 0 ? DIMW : ACC,
      t: String(i + 1), ts: st === 0 ? 8 : 10.5 });
    const up = i % 2 === 0;
    const ly = up ? y - 0.66 : y + 0.26;
    s.addText(it[0], { x: x - 0.65, y: ly, w: 1.3, h: 0.38, isTextBox: true, margin: 0,
      fontFace: H, fontSize: o.fs || 12.5, bold: true, color: st === 0 ? MUTED : INK,
      align: "center", valign: up ? "bottom" : "top", lineSpacing: 15 });
    if (it[2]) s.addText(it[2], { x: x - 0.78, y: up ? ly - 0.26 : ly + 0.38, w: 1.56, h: 0.26,
      isTextBox: true, margin: 0, fontFace: S, fontSize: 8, color: st === 0 ? FAINT : MUTED,
      align: "center", italic: true });
  });
  return pts;
}

// horizontal bar strip · items: [label, value, note]  one accent, values direct-labelled
function bars(s, x, y, w, items, o) {
  o = o || {};
  const max = o.max || 5, bh = o.bh || 0.3, gap = o.gap || 0.18;
  const lw = o.lw || 2.5;                 // label gutter
  const px = x + lw, pw = w - lw - 0.62;  // plot width, room for value
  // axis ticks
  const ticks = o.ticks || [1, 2, 3, 4, 5];
  ticks.forEach(t => {
    const tx = px + pw * t / max;
    dline(s, tx, y - 0.16, tx, y + items.length * (bh + gap) - gap + 0.06, { col: GRID, w: 0.6 });
    cap(s, tx - 0.2, y - 0.42, 0.4, String(t), { size: 8, col: FAINT, align: "center" });
  });
  items.forEach((it, i) => {
    const by = y + i * (bh + gap);
    s.addText(it[0], { x: x, y: by - 0.02, w: lw - 0.14, h: bh, isTextBox: true, margin: 0,
      fontFace: S, fontSize: o.fs || 11, color: BODY, align: "right", valign: "middle" });
    s.addShape(p.ShapeType.rect, { x: px, y: by, w: pw * it[1] / max, h: bh,
      fill: { color: ACC }, line: { type: "none" } });
    s.addText(it[1].toFixed(2), { x: px + pw * it[1] / max + 0.08, y: by - 0.02, w: 0.56, h: bh,
      isTextBox: true, margin: 0, fontFace: S, fontSize: 10, bold: true, color: ACC, valign: "middle" });
  });
  // baseline
  dline(s, px, y - 0.16, px, y + items.length * (bh + gap) - gap + 0.06, { col: HAIR, w: 1 });
  // reference line
  if (o.ref) {
    const rx = px + pw * o.ref / max;
    const bot = y + items.length * (bh + gap) - gap + 0.1;
    dline(s, rx, y - 0.24, rx, bot, { col: INK, w: 1, dash: "dash" });
    cap(s, rx - 1.3, bot + 0.04, 2.6, o.refLabel || "", { size: 8.5, col: INK, bold: true, align: "center" });
  }
  return y + items.length * (bh + gap);
}

// two lists linked by lines · left: [t], right: [t], links: [[li, ri], ...]
function chord(s, lx, rx, lw2, rw2, left, right, links, y0, gap, o) {
  o = o || {};
  const lp = left.map((t, i) => y0 + i * gap);
  const rp = right.map((t, i) => y0 + i * gap);
  links.forEach(([a, b]) => {
    dline(s, lx + lw2 + 0.08, lp[a] + 0.16, rx - 0.08, rp[b] + 0.16,
      { col: o.lcol || ACCT2, w: 1 });
  });
  left.forEach((t, i) => {
    zone(s, lx, lp[i], lw2, 0.32, "", 1);
    s.addText(t, { x: lx + 0.08, y: lp[i], w: lw2 - 0.16, h: 0.32, isTextBox: true, margin: 0,
      fontFace: H, fontSize: o.fs || 12, bold: true, color: ACC, align: "center", valign: "middle" });
  });
  right.forEach((t, i) => {
    s.addText(t, { x: rx, y: rp[i], w: rw2, h: 0.32, isTextBox: true, margin: 0,
      fontFace: S, fontSize: o.rfs || 11, color: BODY, valign: "middle" });
    dot(s, rx - 0.14, rp[i] + 0.16, { d: 0.09, col: ACC });
  });
}

// nested frames, outermost first · labels: [t, sub]
function nest(s, x, y, w, h, labels, o) {
  o = o || {};
  const step = o.step || 0.42;
  labels.forEach((l, i) => {
    const inset = i * step;
    const last = i === labels.length - 1;
    s.addShape(p.ShapeType.rect, { x: x + inset, y: y + inset,
      w: w - inset * 2, h: h - inset * 2,
      fill: last ? { color: ACCT } : { type: "none" },
      line: { color: last ? ACC : HAIR, width: last ? 1.4 : 0.85,
        dashType: i === 0 ? "dash" : "solid" } });
    s.addText(l[0], { x: x + inset + 0.12, y: y + inset + 0.07, w: w - inset * 2 - 0.24, h: 0.26,
      isTextBox: true, margin: 0, fontFace: S, fontSize: 9, bold: true,
      color: last ? ACC : MUTED, charSpacing: 1.4 });
  });
}

// step ribbon: n chevron-ish blocks in a row
function ribbon(s, x, y, w, h, items, o) {
  o = o || {};
  const nd = items.length, gap = o.gap || 0.1;
  const bw = (w - gap * (nd - 1)) / nd;
  items.forEach((it, i) => {
    const bx = x + i * (bw + gap);
    const hi = o.hi === undefined ? false : (Array.isArray(o.hi) ? o.hi.includes(i) : o.hi === i);
    s.addShape(p.ShapeType.rect, { x: bx, y, w: bw, h,
      fill: { color: hi ? ACC : ACCT }, line: { type: "none" } });
    s.addText(it, { x: bx + 0.05, y, w: bw - 0.1, h, isTextBox: true, margin: 0,
      fontFace: S, fontSize: o.fs || 10, bold: true, color: hi ? "FFFFFF" : ACC,
      align: "center", valign: "middle", lineSpacing: (o.fs || 10) + 2 });
  });
  return bw;
}

// example row of named cases
function exampleRow(s, items, y, cols) {
  const c = cols || items.length, gap = 0.5;
  const w = (FW - gap * (c - 1)) / c;
  items.forEach((it, i) => {
    const col = i % c, row = Math.floor(i / c);
    const x = M + col * (w + gap), yy = y + row * 1.22;
    s.addText(it[0], { x, y: yy, w, h: 0.42, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13, bold: true, color: ACC, lineSpacing: 16 });
    s.addText(it[1], { x, y: yy + 0.44, w, h: 0.68, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: MUTED, lineSpacing: 13.5 });
  });
}

// key-value rows with a hairline between, no table borders
function rows(s, x, y, cols, data, o) {
  o = o || {};
  const rh = o.rh || 0.5;
  cols.forEach(c => cap(s, x + c[1], y - 0.26, c[2], c[0], { size: 8.5, bold: true, col: FAINT, cs: 1.5 }));
  dline(s, x, y - 0.03, x + o.w, y - 0.03, { col: HAIR, w: 0.9 });
  data.forEach((d, i) => {
    const yy = y + 0.08 + i * rh;
    const hi = o.hi !== undefined && (Array.isArray(o.hi) ? o.hi.includes(i) : o.hi === i);
    cols.forEach((c, j) => {
      s.addText(d[j], { x: x + c[1], y: yy, w: c[2], h: rh - 0.1, isTextBox: true, margin: 0,
        fontFace: c[3] || S, fontSize: c[4] || 11, bold: (c[3] === H && j === 0) || hi,
        color: hi ? ACC : (j === 0 ? INK : BODY), lineSpacing: (c[4] || 11) + 2.5 });
    });
    if (i < data.length - 1) dline(s, x, yy + rh - 0.1, x + o.w, yy + rh - 0.1, { col: GRID, w: 0.5 });
  });
  return y + 0.08 + data.length * rh;
}

/* ============================ KAPAK ============================ */
{
  const s = p.addSlide();
  s.background = { color: INK };
  s.addShape(p.ShapeType.line, { x: M, y: 1.25, w: 11.63, h: 0, line: { color: "3A3A42", width: 1 } });
  s.addText("İÇ MİMARLIK · MAĞAZA TASARIMI PROJE STÜDYOSU · 1. HAFTA", {
    x: M, y: 1.45, w: 11.4, h: 0.3, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 10.5, bold: true, color: ACC, charSpacing: 3.2 });
  s.addText("Bir marka nasıl\nmağazaya dönüşür?", {
    x: M, y: 2.0, w: 11.4, h: 2.15, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 48, bold: true, color: "FFFFFF", lineSpacing: 60 });
  s.addShape(p.ShapeType.line, { x: M, y: 4.4, w: 2.4, h: 0, line: { color: ACC, width: 2 } });
  s.addText("Marka anahtarı analizi, persona ve müşteri yolculuğu haritalama", {
    x: M, y: 4.66, w: 10.2, h: 0.4, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 19, color: DIMW });
  s.addText("Brand Key Analysis  ·  Persona  ·  Customer Journey Mapping", {
    x: M, y: 6.42, w: 11.4, h: 0.3, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 10, color: MUTED, charSpacing: 1.8 });
  s.addText("Anlatılan çerçeve Bükülmez, Sunar & Kuloğlu (2025) ve I-AM Istanbul (2018) modellerine dayanır.", {
    x: M, y: 6.72, w: 11.4, h: 0.3, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 9, color: "5A5A62", italic: true });
}

/* ---- altı soru: sunumun omurgası ---- */
{
  const s = slide("YOL HARİTASI", "Bu sunumun cevapladığı altı soru");
  text(s, "Aşağıdaki altı soru bu dersin bütün dönemi boyunca sırayla cevaplanacak. Bugün ilk dördünü tam, son ikisini ise ilk hâliyle göreceğiz. Her soru bir sonrakinin girdisini üretir; biri boş kalırsa sonraki soru cevaplanamaz.",
       { one: true, y: 1.82, h: 0.72, size: 14 });

  const qs = [
    ["Bir markanın kimliği nasıl okunur?", "gözlem, görüşme, ürün ve rakip analizi"],
    ["Markanın kimliği nasıl çıkarılır?", "marka anahtarı: on bileşen"],
    ["Persona nasıl anlaşılır?", "davranışa dayalı üç persona, biri ana"],
    ["Müşteri yolculuğu nasıl haritalanır?", "sekiz adım, altı mekânsal modül"],
    ["Anahtar kelimeler nasıl belirlenir?", "üç aşamalı eleme ve kelime sınavı"],
    ["Bu kelimeler mekâna nasıl dönüşür?", "çeviri zinciri ve mekânsal ilkeler"]
  ];
  const y0 = 2.78, rh = 0.66;
  qs.forEach((q, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * 5.95, y = y0 + row * 1.24;
    s.addText(String(i + 1).padStart(2, "0"), { x: x, y: y - 0.06, w: 0.62, h: 0.45, isTextBox: true,
      margin: 0, fontFace: H, fontSize: 26, bold: true, color: ACCT2 });
    s.addText(q[0], { x: x + 0.68, y: y, w: 4.65, h: 0.34, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 15.5, bold: true, color: INK });
    s.addText(q[1], { x: x + 0.68, y: y + 0.34, w: 4.65, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: ACC });
    dline(s, x + 0.68, y + 0.72, x + 5.33, y + 0.72, { col: GRID, w: 0.75 });
  });
  cap(s, M, 6.5, 11.4, "Sorular birbirinin girdisidir: kimlik → kelime → mekân. Bu zincirin adı çeviri zinciridir ve dönem boyunca her kritikte sorulacak.",
      { size: 12, face: H, italic: true, col: ACC, h: 0.4 });
  s.addNotes("Bu slaytı dönem boyunca tekrar açın; öğrenci hangi soruda olduğunu bilsin.");
}

/* ---- bugünün akışı ---- */
{
  const s = slide("BUGÜN", "Sekiz saati nasıl geçireceğiz");
  text(s, "Bugünün sekiz saati üç işe ayrılıyor: dersin çerçevesini anlamak, bir markayı mekâna çeviren araçları öğrenmek, sonra bu araçları aynı gün bir mağaza üzerinde denemek.",
       { one: true, y: 1.82, h: 0.6, size: 14 });

  const steps = [
    ["Proje brifi", "ders akışı, teslimler,\ndeğerlendirme", "1. saat"],
    ["Teorik anlatım", "marka anahtarı, persona,\nyolculuk haritası", "2–3. saat"],
    ["Mağaza okuma", "verilen görsel üzerinden\nbireysel analiz", "4. saat"],
    ["Grup tartışması", "aynı mağazayı okuyanların\nfarkları", "5–7. saat"],
    ["Ödevin verilmesi", "üç aday marka ve\naraştırma paftası", "8. saat"]
  ];
  const y0 = 2.9, bh = 1.42;
  const bw = ribbon(s, M, y0, FW, 0.34, steps.map(x => x[2]), { hi: [2, 3], fs: 9.5, gap: 0.14 });
  steps.forEach((st, i) => {
    const x = M + i * (bw + 0.14);
    const hi = i === 2 || i === 3;
    s.addText(st[0], { x: x, y: y0 + 0.5, w: bw, h: 0.34, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 15, bold: true, color: hi ? ACC : INK });
    s.addText(st[1], { x: x, y: y0 + 0.86, w: bw, h: 0.55, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, color: MUTED, lineSpacing: 12.5 });
    if (i < 4) dline(s, x + bw + 0.02, y0 + 0.62, x + bw + 0.12, y0 + 0.62, { col: HAIR, w: 1 });
  });
  cap(s, M, y0 + bh + 0.08, 11.4, "İlk ikisi dinleyerek, son üçü yaparak geçecek.", { size: 10.5, col: FAINT, italic: true });

  rule(s, M, 5.05, 11.63, "GÜN SONUNDA ELİNİZDE OLACAKLAR");
  const outs = [
    ["Doldurulmuş mağaza okuma kâğıdı", "altı başlık ve üç anahtar kelime, her kelimenin kanıtıyla"],
    ["Grup tartışmasının notları", "aynı mekânın farklı okunduğu yerler"],
    ["Haftaya teslim edilecek ödev", "üç aday marka, üç A4 araştırma paftası"]
  ];
  outs.forEach((o, i) => {
    const x = M + i * 3.95;
    dot(s, x + 0.1, 5.48, { d: 0.12, col: ACC });
    s.addText(o[0], { x: x + 0.32, y: 5.33, w: 3.5, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13, bold: true, color: INK });
    s.addText(o[1], { x: x + 0.32, y: 5.66, w: 3.5, h: 0.62, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: MUTED, lineSpacing: 13.5 });
  });
  cap(s, M, 6.45, 11.4, "Öğle arası ve molalar bu akışın içinde; saatler kesin değil, sıra kesindir.",
      { size: 11.5, face: H, italic: true, col: FAINT, h: 0.35 });
  s.addNotes("Gruplar oluşurken masaları yeniden dizmek için on dakika ayırın.");
}

/* ---- çerçeve nereden geliyor ---- */
{
  const s = slide("ÇERÇEVE", "Anlatacağımız araçlar nereden geliyor?");
  text(s, "Bu derste kullanacağımız araçlar bir kitaptan değil, ölçülmüş bir stüdyo deneyiminden geliyor. Bahçeşehir Üniversitesi İç Mimarlık bölümünde, beşinci yarıyıl mağaza tasarımı stüdyosunda (INT 3001) altmış dokuz öğrenciyle yürütülen on dört haftalık bir program, profesyonel deneyim tasarımı ajansı I-AM Istanbul ile birlikte kurgulandı ve sonuçları nicel olarak ölçüldü (Bükülmez vd., 2025).\n\nBizim için önemi şu: hangi aracın öğrenciye ne kazandırdığı ve öğrencilerin hangi konuda zorlandığı tahmin değil, veri. Bu sunumdaki sıralamayı da o veri belirledi.",
       { one: false, y: 1.82, h: 2.45, size: 13.5 });

  rule(s, M, 4.38, 11.63, "O STÜDYONUN KURGUSU");
  const facts = [
    ["69", "öğrenci, 8 yürütücü"],
    ["14", "haftalık program"],
    ["2", "vize + 1 final jürisi"],
    ["3", "persona, biri ana persona"],
    ["8", "adımlı yolculuk modeli"],
    ["21", "ifadeli değerlendirme çerçevesi"]
  ];
  const fw = (FW - 5 * 0.3) / 6;
  facts.forEach((f, i) => {
    const x = M + i * (fw + 0.3);
    s.addText(f[0], { x: x, y: 4.62, w: fw, h: 0.62, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 34, bold: true, color: ACC });
    s.addText(f[1], { x: x, y: 5.26, w: fw, h: 0.55, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, color: MUTED, lineSpacing: 12.5 });
    if (i < 5) dline(s, x + fw + 0.14, 4.67, x + fw + 0.14, 5.67, { col: GRID, w: 0.75 });
  });
  cap(s, M, 6.0, 11.4, "Stüdyo eğitimi, Quartier vd. (2017) perakende tasarım süreç modeline göre üç fazda kuruldu: Analiz ve Konsept · Somutlaştırma · Detay. Bizim on dört haftamız da aynı üç fazı izliyor.",
      { size: 12.5, face: H, col: BODY, h: 0.55, ls: 17 });
  src(s, "Bükülmez, P. S., Sunar, T. & Kuloğlu, N. (2025). Retail Design Competencies. The International Journal of Design Education.");
  s.addNotes("Buradaki sayıları geçin ama 'bu veri' vurgusunu yapın: öğrenci neye göre değerlendirileceğini bilsin.");
}

/* ============================ I · KİMLİK OKUMA ============================ */
opener("I", "Markanın kimliği nasıl okunur?", "Marka bir logo değil bir vaattir. Vaadi okumak için nereye bakılır?");

{
  const s = qslide("I · KİMLİK OKUMA", "Marka, görünenden ibaret değildir");
  text(s, "Bir markanın görünen yüzü küçüktür: adı, logosu, rengi, ambalajı. Bunlar markayı tanıtır ama açıklamaz. Altında, çoğu zaman yazılı bile olmayan bir katman vardır. Tasarımcının malzemesi bu alt katmandır.",
       { one: true, y: 1.82, h: 0.68, size: 14 });

  nest(s, 1.15, 2.72, 4.9, 3.3, [
    ["GÖRÜNEN — logo, renk, ambalaj, isim"],
    ["DAVRANIŞ — nasıl satıyor, nasıl konuşuyor"],
    ["İNANÇ — neye değer veriyor, kime sesleniyor"],
    ["ÖZ — tek cümleyle ne vaat ediyor"]
  ], { step: 0.5 });
  cap(s, 1.15, 6.1, 4.9, "Dışarıdan içeriye doğru okunur; tasarım en içteki katmandan başlar.",
      { size: 10.5, col: MUTED, italic: true, ls: 13, h: 0.4 });

  rule(s, 6.6, 2.85, 5.88, "HER KATMAN NEREDE GÖRÜLÜR");
  const layers = [
    ["Görünen", "Ambalaj, etiket, tabela, sosyal medya hesabı, fiş."],
    ["Davranış", "Ürünü nasıl paketliyor, müşteriyle nasıl konuşuyor, hangi saatte açıyor."],
    ["İnanç", "Neyi yapmayı reddediyor. En çok bu soru ayırt eder."],
    ["Öz", "Sahibinin \"biz aslında şunu yapıyoruz\" diye başlayan cümlesi."]
  ];
  let ly = 3.12;
  layers.forEach((l, i) => {
    dot(s, 6.72, ly + 0.13, { d: 0.12, col: i === 3 ? ACC : DIMW });
    s.addText(l[0], { x: 6.96, y: ly, w: 1.5, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13.5, bold: true, color: i === 3 ? ACC : INK });
    s.addText(l[1], { x: 8.5, y: ly + 0.02, w: 3.98, h: 0.66, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: i === 3 ? ACC : MUTED, lineSpacing: 13.5 });
    ly += 0.76;
    if (i < 3) dline(s, 6.96, ly - 0.1, 12.48, ly - 0.1, { col: GRID, w: 0.5 });
  });
  cap(s, 6.6, 6.1, 5.88, "Yazılamayan bir marka mekâna da çevrilemez.",
      { size: 13, face: H, italic: true, col: ACC, h: 0.4 });
  s.addNotes("Küçük markada bu katmanlar sahibinin kafasındadır; öğrenci görüşerek çıkarmak zorunda.");
}

{
  const s = slide("I · KİMLİK OKUMA", "Marka deneyimi altı bileşenden oluşur");
  text(s, "Marka kimliği tasarımı literatüründe kapsamlı bir marka deneyiminin altı bileşeni tanımlanır (Wheeler, 2017). Bu altı bileşen, markanın konumundan satış süreçlerine kadar her şeyi biçimlendirir.",
       { one: true, x: M, w: 4.3, y: 1.86, h: 1.6, size: 13.5, ls: 21 });

  radial(s, 8.85, 4.35, 1.72, [
    ["İmaj ve kimlik", "ad, logo, görsel dil"],
    ["Ürün ve hizmet", "ne satıyor, neyi vaat ediyor"],
    ["Satış süreçleri", "nasıl satıyor, nasıl ödenir"],
    ["Fiziksel ve\nsanal mekânlar", "mağaza, vitrin, web"],
    ["Farkındalık\nstratejisi", "nasıl duyuluyor"],
    ["İnsan ve kültür", "kim çalışıyor, nasıl davranıyor"]
  ], ["MARKA\nDENEYİMİ"], { start: 30, nr: 0.54, lw: 1.42, cr: 1.34, fs: 11.5 });

  rule(s, M, 3.66, 4.3, "BİZİ EN ÇOK İLGİLENDİREN İKİSİ", { col: ACC, lcol: ACCT2 });
  const two = [
    ["Fiziksel ve sanal mekânlar", "Mağaza, vitrin, teşhir, dijital arayüz. Dönem projesinin tamamı bu bileşenin içinde."],
    ["İnsan ve kültür", "Çalışanın davranışı bir mekân kararıdır: danışma noktası mı, serbest dolaşım mı?"]
  ];
  let ty = 3.9;
  two.forEach((t, i) => {
    zone(s, M, ty, 4.3, 1.05, "", 1);
    s.addText(t[0], { x: M + 0.18, y: ty + 0.12, w: 3.94, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13.5, bold: true, color: ACC });
    s.addText(t[1], { x: M + 0.18, y: ty + 0.43, w: 3.94, h: 0.56, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, color: ACC, lineSpacing: 12.5 });
    ty += 1.19;
  });
  cap(s, M, 6.28, 4.3, "Kalan dördü tasarımın konusu değil ama girdisidir.",
      { size: 11, face: H, italic: true, col: MUTED, ls: 14, h: 0.4 });
  src(s, "Wheeler (2017), Bükülmez vd. (2025) içinde aktarıldığı biçimiyle.");
  s.addNotes("Altı bileşen sunumun ilk büyük diyagramı; öğrenci mekânın bütünün bir parçası olduğunu burada görüyor.");
}

{
  const s = qslide("I · KİMLİK OKUMA", "Kimlik nereden okunur? Yedi kanıt kaynağı");
  text(s, "Marka kimliği tahminle değil kanıtla çıkarılır. Yedi kaynak birbirini doğrular ya da çürütür; ikisi çelişiyorsa markanın kendisi hakkında bir şey öğrenmiş olursunuz.",
       { one: true, x: M, w: 4.25, y: 1.86, h: 1.35, size: 13, ls: 20 });

  radial(s, 8.85, 4.35, 1.72, [
    ["Ürünün kendisi", "malzeme, ölçü, kırılganlık"],
    ["Ambalaj ve\netiket", "yazı, dil, bilgi düzeyi"],
    ["Var olan\ndükkân", "varsa: neyi çözmüş, neyi çözememiş"],
    ["Müşteri\nyorumları", "neyi övüyor, neden şikâyet ediyor"],
    ["Rakipler", "yan yana konduğu üç marka"],
    ["Sosyal medya", "kime, nasıl sesleniyor"],
    ["Sahibin\nanlatısı", "\"biz aslında...\" cümlesi"]
  ], ["KİMLİK", "yedi kaynağın\nkesişimi"], { start: 0, nr: 0.52, lw: 1.4, cr: 1.3, fs: 11 });

  rule(s, M, 3.42, 4.25, "GÖRÜŞME REHBERİ — SEKİZ SORU", { col: ACC, lcol: ACCT2 });
  const qq = [
    "Bu işi neden kurdunuz?",
    "Müşteriniz en çok neyi soruyor?",
    "Ne yapmayı reddediyorsunuz?",
    "En çok hangi ürün satıyor, neden?",
    "Müşteri ürünü eline alıyor mu?",
    "Deponuzda en çok ne yer kaplıyor?",
    "Hangi markaya benzetiliyorsunuz?",
    "Beş yıl sonra ne olmak istiyorsunuz?"
  ];
  qq.forEach((q, i) => {
    const y = 3.68 + i * 0.36;
    s.addText(String(i + 1), { x: M, y: y, w: 0.22, h: 0.26, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 8.5, bold: true, color: ACC, align: "right" });
    s.addText(q, { x: M + 0.32, y: y - 0.02, w: 3.93, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 11.5, color: BODY });
  });
  cap(s, M, 6.62, 4.25, "Üçüncü soru en çok işe yarayanıdır: markayı, reddettiği şey tarif eder.",
      { size: 10.5, face: H, italic: true, col: ACC, ls: 13, h: 0.4 });
  s.addNotes("Bu sekiz soruyu öğrenciler telefonlarına kaydetsin; ödevin birinci adımı bu.");
}

/* ============================ II · MARKA ANAHTARI ============================ */
opener("II", "Markanın kimliği nasıl çıkarılır?", "Okunan kimliği yazıya dökmenin adı marka anahtarıdır: on bileşen, tek bir öz.");

{
  const s = slide("II · MARKA ANAHTARI", "Marka anahtarı: on bileşen, tek öz");
  text(s, "Marka anahtarı (Brand Key), bir markanın özünü belirli başlıklar altında tanımlayan çerçevedir. Aşağıdaki hâli mağaza tasarımı stüdyosu için uyarlanmış on bileşenden oluşur.",
       { one: true, y: 1.82, h: 0.62, size: 13.5 });

  const tiers = [
    ["DIŞ GİRDİ", 9.5, [
      ["Rekabet", "alternatif markalar"],
      ["Hedef kitle", "demografi ve davranış"],
      ["Hedefler", "ticari amaçlar"]]],
    ["KENDİ TANIMI", 7.9, [
      ["Misyon", "varlık nedeni"],
      ["Değerler", "temel ilkeler"],
      ["Faydalar", "işlevsel ve duygusal"]]],
    ["İFADE BİÇİMİ", 6.3, [
      ["Kişilik", "marka karakteri"],
      ["Görünüm", "görsel kimlik"],
      ["İletişim dili", "konuşma biçimi"]]]
  ];
  let ty = 2.62;
  tiers.forEach((t, i) => {
    const w = t[1], x0 = M + (FW - w) / 2;
    cap(s, M, ty + 0.2, 1.0, t[0], { size: 8.5, bold: true, col: FAINT, cs: 1.4 });
    const bw2 = (w - 0.4) / 3;
    t[2].forEach((c, j) => {
      const x = x0 + j * (bw2 + 0.2);
      zone(s, x, ty, bw2, 0.66, "", 0);
      s.addText(c[0], { x: x + 0.1, y: ty + 0.07, w: bw2 - 0.2, h: 0.3, isTextBox: true, margin: 0,
        fontFace: H, fontSize: 14, bold: true, color: INK, align: "center" });
      s.addText(c[1], { x: x + 0.1, y: ty + 0.37, w: bw2 - 0.2, h: 0.26, isTextBox: true, margin: 0,
        fontFace: S, fontSize: 9, color: MUTED, align: "center" });
    });
    arrow(s, 6.665, ty + 0.7, 6.665, ty + 0.94, { col: ACC, w: 1.4 });
    ty += 1.02;
  });
  zone(s, M + (FW - 4.6) / 2, ty, 4.6, 0.72, "", 1);
  s.addText("ÖZ", { x: M + (FW - 4.6) / 2, y: ty + 0.06, w: 4.6, h: 0.26, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 9, bold: true, color: ACC, align: "center", charSpacing: 1.6 });
  s.addText("müşteri ve basın bu marka hakkında ne diyor", { x: M + (FW - 4.6) / 2, y: ty + 0.32,
    w: 4.6, h: 0.32, isTextBox: true, margin: 0, fontFace: H, fontSize: 13, bold: true,
    color: ACC, align: "center" });

  cap(s, M, 6.44, 11.63, "Huninin yönü önemlidir: öz yukarıdan aşağı doğru üretilir, aşağıdan yukarı uydurulmaz. Öz, markanın kendi iddiası değil; müşterinin onu nasıl anlattığıdır.",
      { size: 12, face: H, italic: true, col: ACC, h: 0.45, align: "center" });
  src(s, "Kaynak: I-AM Istanbul Brand Key Analysis Tool (2018); Bükülmez vd. (2025), Şekil 1a.");
  s.addNotes("Bu diyagram makaledeki Şekil 1a'nın Türkçeleştirilmiş hâli. Öz'ün en son yazıldığını vurgulayın.");
}

{
  const s = slide("II · MARKA ANAHTARI", "Her bileşen tek bir soruya cevap verir");
  text(s, "Her bileşenin karşılığı bir cümleyle verilebilir. Cevaplar markadan, müşteriden ve rakiplerden toplanan kanıta dayanmalıdır; tahminle doldurulan bir satır sonraki bütün adımları bozar.",
       { one: true, y: 1.82, h: 0.6, size: 13.5 });

  const L = [
    ["Rekabet", "Müşteri bu markayı hangi üç seçenekle yan yana koyuyor?"],
    ["Hedef kitle", "Kime sesleniyor — yaşla değil, davranışla tarif edilebilir mi?"],
    ["Hedefler", "İki-üç yıl içinde ticari olarak nereye varmak istiyor?"],
    ["Misyon", "Bu marka neden var; olmasa ne eksik kalırdı?"],
    ["Değerler", "Neye değer veriyor, neyi yapmayı reddediyor?"]
  ];
  const Rr = [
    ["Faydalar", "Ürün ne işe yarıyor; insanı ne hissettiriyor?"],
    ["Kişilik", "Bu marka bir insan olsa nasıl biri olurdu?"],
    ["Görünüm", "Malzemesi, rengi, dokusu, biçim dili ne?"],
    ["İletişim dili", "Nasıl konuşuyor: yazısı, sesi, sessizliği?"],
    ["Öz", "Müşteri bu markayı başkasına nasıl anlatıyor?"]
  ];
  const draw = (arr, x0) => {
    arr.forEach((it, i) => {
      const y = 2.68 + i * 0.78;
      dot(s, x0 + 0.11, y + 0.14, { d: 0.12, col: i === 4 && arr === Rr ? ACC : DIMW });
      s.addText(it[0], { x: x0 + 0.36, y: y, w: 1.62, h: 0.3, isTextBox: true, margin: 0,
        fontFace: H, fontSize: 13.5, bold: true, color: INK });
      s.addText(it[1], { x: x0 + 2.0, y: y + 0.02, w: CW - 2.0, h: 0.62, isTextBox: true, margin: 0,
        fontFace: S, fontSize: 10.5, color: MUTED, lineSpacing: 13 });
      if (i < 4) dline(s, x0 + 0.36, y + 0.66, x0 + CW, y + 0.66, { col: GRID, w: 0.5 });
    });
  };
  draw(L, M); draw(Rr, C2);
  dline(s, 6.52, 2.62, 6.52, 6.28, { col: HAIR, w: 0.75 });
  cap(s, M, 6.42, 11.63, "Doldurulamayan bir başlık, araştırmanın eksik kaldığı yeri gösterir — boş bırakmak yerine nasıl öğreneceğinizi yazın.",
      { size: 12, face: H, italic: true, col: ACC, h: 0.4 });
  s.addNotes("Bu slayt görüşme sorularının kontrol listesi. Sağ alttaki 'öz' sorusu en kritik olanı.");
}

{
  const s = slide("II · MARKA ANAHTARI", "Bileşen hangi ölçekte iş görür?");
  text(s, "Her bileşen mekânda farklı bir ölçekte karşılık bulur; kimi bütün kurguyu belirler, kimi tek bir detayda görünür. Bileşeni doğru ölçeğe bağlamak, hangi kararın nereden geldiğini açıklayabilmektir.",
       { one: true, y: 1.82, h: 0.6, size: 13.5 });

  const scales = ["KURGU", "CEPHE", "TEŞHİR", "ATMOSFER", "MALZEME", "DETAY"];
  const sw = ribbon(s, M, 2.62, FW, 0.32, scales, { fs: 9, gap: 0.12 });
  const map = [
    [[0, 2], "Hedef kitle · Hedefler", "dolaşım hızı, kalma süresi, oturma ihtiyacı, esneklik"],
    [[1, 1], "Rekabet", "vitrinin sokakta nasıl ayrıştığı, tabelanın tonu"],
    [[2, 2], "Faydalar", "ürüne dokunma izni, deneme alanı, ürün yoğunluğu"],
    [[3, 3], "Kişilik · Değerler", "ışık sıcaklığı, ses düzeyi, malzeme sertliği"],
    [[4, 4], "Görünüm", "yüzey, renk, doku, birleşim detayı"],
    [[5, 5], "İletişim dili", "yazı karakteri, yönlendirme, etiket, ambalaj"]
  ];
  let my = 3.28;
  map.forEach((m, i) => {
    const [a, b] = m[0];
    const xa = M + a * (sw + 0.12) + sw / 2;
    const xb = M + b * (sw + 0.12) + sw / 2;
    dline(s, xa, 2.98, xa, my + 0.14, { col: ACCT2, w: 0.85 });
    if (b !== a) { dline(s, xb, 2.98, xb, my + 0.14, { col: ACCT2, w: 0.85 });
                   dline(s, xa, my + 0.14, xb, my + 0.14, { col: ACC, w: 1.4 }); }
    dot(s, xa, my + 0.14, { d: 0.13, col: ACC });
    if (b !== a) dot(s, xb, my + 0.14, { d: 0.13, col: ACC });
    s.addText(m[1], { x: M, y: my + 0.28, w: 3.3, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13, bold: true, color: INK });
    s.addText(m[2], { x: 4.3, y: my + 0.3, w: 8.18, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11, color: BODY });
    my += 0.55;
    dline(s, M, my + 0.1, R, my + 0.1, { col: GRID, w: 0.5 });
  });
  cap(s, M, 6.65, 11.63, "Kritiklerde sorulacak soru: bu karar hangi bileşenden geliyor?",
      { size: 12, face: H, italic: true, col: ACC, h: 0.35 });
  s.addNotes("Bu şema 'öz' hariç dokuz bileşeni ölçeklere bağlar; öz hepsinin sınavıdır.");
}

{
  const s = slide("II · MARKA ANAHTARI", "Doldurulmuş örnek: küçük bir kahve kavurucusu");
  text(s, "Aşağıdaki örnek, sizin bulacağınız türden bir markadan üretildi: tek dükkânlı, kendi çekirdeğini kavuran, henüz tasarım dili olmayan bir kahveci.",
       { one: true, y: 1.82, h: 0.62, size: 13.5 });

  const ex = [
    ["Rekabet", "Zincir kahveciler değil, semtteki üç küçük kavurucu."],
    ["Hedef kitle", "Kahveyi tarif ederek soran, bekleyebilen müşteri."],
    ["Hedefler", "İki yıl içinde kavurmayı gösterebileceği ikinci dükkân."],
    ["Misyon", "İnsanın ne içtiğini bilmesini sağlamak."],
    ["Değerler", "Meraklı, sabırlı, gösterişsiz; öğretmeyi seviyor."],
    ["Faydalar", "Taze kavrulmuş çekirdek; ne aldığını anlama duygusu."],
    ["Kişilik", "Anlatmayı seven ama satmaya çalışmayan bir usta."],
    ["Görünüm", "Ham metal, açık ahşap, cam kavanoz; boyasız yüzeyler."],
    ["İletişim dili", "El yazısı etiket, tarih ve rakım yazan fiş, az söz."]
  ];
  ex.forEach((e, i) => {
    const col = Math.floor(i / 3);
    const x = M + col * 3.95;
    const y = 2.48 + (i % 3) * 0.82;
    s.addText(e[0], { x: x, y: y, w: 3.6, h: 0.26, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9, bold: true, color: ACC, charSpacing: 1.4 });
    s.addText(e[1], { x: x, y: y + 0.25, w: 3.6, h: 0.52, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 12.5, color: BODY, lineSpacing: 16 });
  });
  dline(s, 4.6, 2.45, 4.6, 4.9, { col: GRID, w: 0.6 });
  dline(s, 8.55, 2.45, 8.55, 4.9, { col: GRID, w: 0.6 });

  zone(s, M, 5.12, FW, 0.8, "", 1);
  s.addText("ÖZ", { x: M + 0.24, y: 5.28, w: 0.6, h: 0.3, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 9.5, bold: true, color: ACC, charSpacing: 1.5 });
  s.addText("“Kahveyi saklamayan, gösteren dükkân.”", { x: M + 0.95, y: 5.22, w: 10.3, h: 0.5,
    isTextBox: true, margin: 0, fontFace: H, fontSize: 19, italic: true, bold: true, color: ACC });
  cap(s, M, 6.12, 11.63, "Bu öz cümlesi zaten bir mekânsal talimattır: üretim görünür olmalı. Kavurma makinesinin yeri artık bir beğeni sorusu değil.",
      { size: 12.5, face: H, col: BODY, h: 0.5, ls: 17 });
  s.addNotes("Öz cümlesinin doğrudan bir mekân kararı ürettiğine dikkat çekin — bu slaytın bütün amacı bu.");
}

/* ============================ III · PERSONA ============================ */
opener("III", "Persona nasıl anlaşılır?", "Hedef kitle bir istatistik değil; tek bir insanın gününde görünür hâle gelmesidir.");

{
  const s = qslide("III · PERSONA", "Persona nedir, neden üç tane?");
  text(s, "Persona, hedef kitleyi tek bir kurgusal kişide somutlaştırma aracıdır. Amacı empati kurmayı kolaylaştırmak ve tasarımcının kararlarını bir kişinin gerçek ihtiyacına bağlamaktır (Kim vd., 2002). Müşteri yolculuğundan toplanan veriyle geliştirilen persona, tasarım eğitiminde yaratıcılık ile hedef kitle anlayışı arasında köprü kurar (Micheaux & Bosio, 2019).\n\nBu yüzden stüdyoda tek persona değil üç persona istenir: biri ana persona olarak seçilir, diğer ikisi tasarımın sınırlarını yoklamak için elde tutulur. Tek personayla çalışan öğrenci mekânı bir kişiye göre daraltır; üç personayla çalışan öğrenci mekânın esnekliğini görür.",
       { one: false, y: 1.82, h: 2.16, size: 13.5 });

  rule(s, M, 4.05, 11.63, "ÜÇ PERSONA NASIL SEÇİLİR");
  const three = [
    ["ANA PERSONA", "Markanın asıl seslendiği kişi. Tasarımın bütün kararları önce buna göre alınır.",
     "mekânı bu kişi belirler"],
    ["İKİNCİ PERSONA", "Aynı ürünü farklı bir nedenle alan kişi. Mekânın ikinci bir kullanım biçimini üretir.",
     "esnekliği bu kişi sınar"],
    ["ÜÇÜNCÜ PERSONA", "Refakatçi ya da zorunlu ziyaretçi: çocuk, eş, kurye, tedarikçi. Çoğu öğrencinin atladığı kişi.",
     "eksikleri bu kişi gösterir"]
  ];
  const tw = 3.6, tg = 0.42;
  three.forEach((t, i) => {
    const x = M + i * (tw + tg);
    zone(s, x, 4.32, tw, 1.85, "", i === 0 ? 1 : 0);
    s.addText(t[0], { x: x + 0.22, y: 4.48, w: tw - 0.44, h: 0.28, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, bold: true, color: i === 0 ? ACC : MUTED, charSpacing: 1.6 });
    s.addText(t[1], { x: x + 0.22, y: 4.82, w: tw - 0.44, h: 0.9, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 12.5, color: i === 0 ? ACC : BODY, lineSpacing: 16 });
    s.addText(t[2], { x: x + 0.22, y: 5.8, w: tw - 0.44, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, color: i === 0 ? ACC : FAINT, italic: true });
  });
  cap(s, M, 6.35, 11.63, "Personalar yolculuk haritasından toplanan veriyle geliştirilir; hayal edilerek değil.",
      { size: 12, face: H, italic: true, col: ACC, h: 0.4 });
  src(s, "Kim vd. (2002); Micheaux & Bosio (2019); Bükülmez vd. (2025).");
  s.addNotes("Üçüncü persona vurgusu önemli: refakatçi, mekânda en çok atlanan kullanıcıdır.");
}

{
  const s = slide("III · PERSONA", "İşe yarayan persona, işe yaramayan persona");
  text(s, "En sık yapılan hata, personayı demografik bir künyeye indirgemektir. Yaş ve gelir bir mekân kararı üretmez. İşe yarayan persona, kişinin ne yaptığını anlatır.",
       { one: true, y: 1.82, h: 0.62, size: 13.5 });

  const bad = ["28 yaşında", "Üniversite mezunu", "Orta-üst gelir grubu", "Sosyal medyayı aktif kullanıyor", "Kaliteye önem veriyor"];
  const good = [["İşten çıkınca uğruyor, on dakikası var", "kalma süresi · hızlı rota"],
                ["Ürünü eline almadan karar vermiyor", "açık teşhir · dokunma izni"],
                ["Soru sormayı sevmiyor, etiketten okuyor", "bilgi katmanı · yönlendirme"],
                ["Yanında çocuk ya da poşetle geliyor", "koridor genişliği · bırakma yeri"],
                ["Aynı ürünü ikinci kez almaya geliyor", "tekrar rotası · hızlı kasa"]];

  rule(s, M, 2.6, 5.5, "İŞE YARAMAYAN", { col: MUTED });
  bad.forEach((b, i) => {
    const y = 2.86 + i * 0.44;
    s.addText("×", { x: M, y: y, w: 0.22, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 12, color: DIMW });
    s.addText(b, { x: M + 0.28, y: y, w: 5.2, h: 0.32, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11.5, color: FAINT });
  });
  cap(s, M, 5.2, 5.5, "Hiçbiri bir rafın yüksekliğini ya da bir koridorun genişliğini değiştirmez.",
      { size: 11, col: MUTED, italic: true, ls: 14, h: 0.55 });

  rule(s, C2, 2.6, 5.5, "İŞE YARAYAN", { col: ACC, lcol: ACCT2 });
  good.forEach((g, i) => {
    const y = 2.86 + i * 0.44;
    dot(s, C2 + 0.08, y + 0.15, { d: 0.1, col: ACC });
    s.addText(g[0], { x: C2 + 0.28, y: y - 0.02, w: 3.35, h: 0.32, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11.5, color: BODY });
    s.addText(g[1], { x: C2 + 3.66, y: y, w: 1.84, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 8.5, color: ACC, italic: true });
  });
  cap(s, C2, 5.2, 5.5, "Her biri bir mekânsal karara çevrilebilir: süre, erişim, bilgi, alan, tekrar.",
      { size: 11, col: ACC, italic: true, ls: 14, h: 0.55 });
  dline(s, 6.52, 2.55, 6.52, 5.75, { col: HAIR, w: 0.75 });

  zone(s, M, 5.95, FW, 0.66, "", 1);
  s.addText("KURAL:  Bir persona maddesi bir tasarım kararını değiştirmiyorsa, o madde personaya ait değildir.",
    { x: M + 0.25, y: 6.05, w: 11.1, h: 0.46, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 14, bold: true, color: ACC });
  s.addNotes("Bu kuralı öğrenciler birbirine uygulasın; stok fotoğraflı künyeleri baştan engeller.");
}

{
  const s = qslide("III · PERSONA", "Persona nasıl çıkarılır? Üç gözlem yöntemi");
  text(s, "Persona anket doldurtarak çıkmaz; gözlemle çıkar. Hizmet tasarımı pratiğinde bu iş için üç yöntem kullanılır (Stickdorn vd., 2018). Üçü de bir öğrencinin tek başına, bir hafta içinde uygulayabileceği yöntemlerdir.",
       { one: true, y: 1.82, h: 0.62, size: 13.5 });

  const mets = [
    ["Hizmet safarisi", "service safari",
     "Kendiniz müşteri gibi davranırsınız: mağazaya gidip alışverişi baştan sona yaşar, her adımda ne hissettiğinizi not edersiniz.",
     "yolculuğun tamamını\nkendi üzerinizde yaşarsınız"],
    ["Yerinde gözlem", "mobile ethnography",
     "Mağazada durup insanları izlersiniz: nereye baktıklarını, nerede duraksadıklarını, neye dokunduklarını kaydedersiniz.",
     "insanların gerçekte\nne yaptığını verir"],
    ["Bağlamsal görüşme", "contextual interview",
     "Müşteriyle ya da marka sahibiyle mekânın içinde konuşursunuz; sorular yaşanan ana bağlı olduğu için cevaplar somuttur.",
     "davranışın nedenini\nverir"]
  ];
  const mw = 3.6, mg = 0.42, my = 2.6, mh = 2.75;
  mets.forEach((m, i) => {
    const x = M + i * (mw + mg);
    zone(s, x, my, mw, mh, "", i === 1 ? 1 : 0);
    dot(s, x + 0.44, my + 0.44, { t: String(i + 1), d: 0.32, col: i === 1 ? ACC : INK, ts: 11 });
    s.addText(m[0], { x: x + 0.22, y: my + 0.76, w: mw - 0.44, h: 0.32, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 15.5, bold: true, color: i === 1 ? ACC : INK });
    s.addText(m[1], { x: x + 0.22, y: my + 1.08, w: mw - 0.44, h: 0.24, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 8.5, color: FAINT, italic: true });
    s.addText(m[2], { x: x + 0.22, y: my + 1.4, w: mw - 0.44, h: 0.92, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: BODY, lineSpacing: 13.5 });
    dline(s, x + 0.22, my + 2.34, x + mw - 0.22, my + 2.34, { col: i === 1 ? ACC : GRID, w: 0.75 });
    s.addText(m[3], { x: x + 0.22, y: my + 2.4, w: mw - 0.44, h: 0.32, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, bold: true, color: i === 1 ? ACC : MUTED, lineSpacing: 11.5 });
  });
  cap(s, M, 5.58, 11.63, "Üçü birlikte kullanıldığında birbirini doğrular. Biri eksikse persona tahmine dayanır.",
      { size: 12.5, face: H, col: BODY, h: 0.4 });
  cap(s, M, 6.0, 11.63, "Her gözlemin çıktısı yazıya ve fotoğrafa dökülmeli; hatırlanan gözlem, gözlem sayılmaz.",
      { size: 12, face: H, italic: true, col: ACC, h: 0.4 });
  src(s, "Stickdorn, Hormess, Lawrence & Schneider (2018).");
  s.addNotes("İkinci hafta alan ziyaretinde en az iki yöntemi uygulamalarını isteyin.");
}

{
  const s = slide("III · PERSONA", "Persona kartı: doldurulacak alanlar");
  text(s, "Aşağıdaki kart, ödevde ve vize paftasında doldurulacak persona şablonudur. Sol taraf kişiyi, sağ taraf o kişinin mekândan ne istediğini yazar. Sağ taraf boşsa persona tamamlanmamıştır.",
       { one: true, y: 1.82, h: 0.6, size: 13.5 });

  zone(s, M, 2.55, 5.5, 3.6, "", 0);
  rule(s, M + 0.24, 2.85, 5.02, "KİM", { col: MUTED });
  const who = [
    ["Adı ve tek cümlesi", "\"Deniz, işten çıkınca on dakikası olan biri.\""],
    ["Gününde bu markaya\nyer açtığı an", "hangi saat, hangi sıklıkta, kiminle"],
    ["Bu markayı seçme nedeni", "ürünün hangi özelliği için geliyor"],
    ["Rahatsız olduğu şey", "beklemek, sorulmak, kalabalık, belirsizlik"]
  ];
  let wy = 3.1;
  who.forEach((w, i) => {
    const two2 = w[0].includes("\n");
    s.addText(w[0], { x: M + 0.24, y: wy, w: 5.02, h: two2 ? 0.42 : 0.28, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 12.5, bold: true, color: INK, lineSpacing: 15 });
    s.addText(w[1], { x: M + 0.24, y: wy + (two2 ? 0.44 : 0.3), w: 5.02, h: 0.3,
      isTextBox: true, margin: 0, fontFace: S, fontSize: 10, color: MUTED, italic: true });
    wy += 0.74;
    if (i < 3) dline(s, M + 0.24, wy - 0.12, M + 5.26, wy - 0.12, { col: GRID, w: 0.5 });
  });

  zone(s, C2, 2.55, 5.5, 3.6, "", 1);
  rule(s, C2 + 0.24, 2.85, 5.02, "MEKÂNDAN NE İSTİYOR", { col: ACC, lcol: ACCT2 });
  const want = [
    ["Kalma süresi", "üç dakika mı, yarım saat mi"],
    ["Ürünle ilişkisi", "dokunuyor, deniyor, sadece bakıyor"],
    ["Bilgi ihtiyacı", "soruyor, okuyor, kendi buluyor"],
    ["Mahremiyet ihtiyacı", "görülmek istiyor mu, istemiyor mu"]
  ];
  let ay = 3.1;
  want.forEach((w, i) => {
    dot(s, C2 + 0.32, ay + 0.15, { d: 0.11, col: ACC });
    s.addText(w[0], { x: C2 + 0.52, y: ay, w: 2.0, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 12.5, bold: true, color: ACC });
    s.addText(w[1], { x: C2 + 2.56, y: ay + 0.02, w: 2.7, h: 0.5, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, color: ACC, lineSpacing: 12.5 });
    ay += 0.74;
    if (i < 3) dline(s, C2 + 0.52, ay - 0.12, C2 + 5.26, ay - 0.12, { col: ACCT2, w: 0.5 });
  });
  arrow(s, 6.4, 4.35, 6.9, 4.35, { col: ACC, w: 1.5 });

  cap(s, M, 6.3, 11.63, "Sol taraftaki her madde sağ tarafta bir karşılık üretmek zorundadır. Karşılığı olmayan madde kartın dışına çıkar.",
      { size: 12.5, face: H, italic: true, col: ACC, h: 0.4 });
  s.addNotes("Ödev paftasındaki kullanıcı bölümü bu kartın kısaltılmış hâli.");
}

/* ============================ IV · YOLCULUK HARİTASI ============================ */
opener("IV", "Müşteri yolculuğu nasıl haritalanır?", "Deneyim bir bütün değil, sıralı anlardır. Haritanın işi o anları ayırmaktır.");

{
  const s = slide("IV · YOLCULUK", "Temas noktası ve yolculuk haritası");
  text(s, "Müşteri, bir ürünün, hizmetin ya da markanın herhangi bir yönüyle etkileşime geçtiği her yerde bir deneyim yaşar; bu etkileşim birden çok kanalda ve farklı zamanlarda gerçekleşir (Van de Sand vd., 2020). Müşteri ile markanın herhangi bir yönü arasındaki kritik karşılaşma anlarına temas noktası (touchpoint) denir.\n\nMüşteri yolculuğu haritası (CJM) ise bu anlardan kurulu bir hikâye panosudur (Zomerdijk & Voss, 2010). Her aşamada haritanın işi, markanın hedef kitlesinde uyandırmak istediği akılcı, duygusal ve davranışsal tepkileri hangi ilke ve nitelikle kuracağını belirlemektir.",
       { one: false, y: 1.82, h: 2.1, size: 13.5 });

  rule(s, M, 4.25, 11.63, "HARİTA NE İŞE YARAR");
  const uses = [
    ["Empati kurdurur", "Tasarım düşüncesi açısından harita, müşteriyle empati kurmayı ve deneyimi iyileştirmeyi sağlar (Chasanidou vd., 2015)."],
    ["Fırsat gösterir", "Yenilik yapılabilecek yerleri ve hizmetin iyileştirilmesi gereken noktaları ortaya çıkarır (Johnston & Kong, 2011)."],
    ["Marka ile yolculuğu\nhizalar", "Marka mesajı ile müşteri yolculuğunu hizalamak, deneyimin baştan sona tutarlı kalmasını sağlar (Petermans vd., 2013)."]
  ];
  const uw = 3.6, ug = 0.42;
  uses.forEach((u, i) => {
    const x = M + i * (uw + ug);
    dline(s, x, 4.5, x + uw, 4.5, { col: ACC, w: 1.25 });
    s.addText(u[0], { x: x, y: 4.6, w: uw, h: 0.56, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 14.5, bold: true, color: INK, lineSpacing: 18 });
    s.addText(u[1], { x: x, y: 5.2, w: uw, h: 1.15, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: BODY, lineSpacing: 13.5 });
  });
  cap(s, M, 6.42, 11.63, "Harita yalnızca işletmelerin değil; tasarım ve danışmanlık ofislerinin de günlük aracıdır (Stickdorn vd., 2018).",
      { size: 11.5, face: H, italic: true, col: MUTED, h: 0.4 });
  s.addNotes("Bu slayt haritanın 'neden' kısmı; hemen ardından kaç parçaya bölündüğü geliyor.");
}

{
  const s = qslide("IV · YOLCULUK", "Deneyim kaça bölünür? Dört farklı okuma");
  text(s, "Literatürde deneyimin kaç parçaya bölüneceği konusunda tek bir cevap yok: kimi altıya, kimi yediye, kimi sekize ayırıyor. Bölmelerin sayısı değil, neyi ayırdıkları önemlidir. Aşağıda dördü yan yana duruyor.",
       { one: true, y: 1.82, h: 0.66, size: 13.5 });

  const tracks = [
    ["Wheeler (2017)", "marka deneyiminin bileşenleri", 6,
     ["İmaj ve\nkimlik", "Ürün ve\nhizmet", "İnsan ve\nkültür", "Satış\nsüreçleri", "Fiziksel ve\nsanal mekân", "Farkındalık\nstratejisi"], [4]],
    ["Stein & Ramaseshan (2016)", "temas noktası öğeleri", 7,
     ["Atmosferik", "Teknolojik", "İletişimsel", "Süreçle\nilgili", "Çalışan–\nmüşteri", "Müşteri–\nmüşteri", "Ürünle\netkileşim"], [0, 1, 2]],
    ["I-AM Istanbul (2018)", "müşteri yolculuğu adımları", 8,
     ["Farkındalık", "Çekim", "Eşik", "Yönelme", "Gezinme", "Etkileşim", "Satın alma", "Ayrılma"], [1, 2, 3, 4, 5, 6]],
    ["Bükülmez vd. (2025)", "iç mekâna uyarlanmış modüller", 6,
     ["Çekim", "Eşik", "Ürün ve\nhizmetler", "Organizasyonel\nihtiyaçlar", "Yönelme", "Gezinme"], [0, 1, 2, 3, 4, 5]]
  ];
  let ty = 2.7;
  tracks.forEach((t, i) => {
    s.addText(t[0], { x: M, y: ty, w: 2.7, h: 0.28, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 12.5, bold: true, color: INK });
    s.addText(t[1], { x: M, y: ty + 0.26, w: 2.7, h: 0.28, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9, color: MUTED, italic: true });
    s.addText(String(t[2]), { x: 3.62, y: ty - 0.02, w: 0.4, h: 0.4, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 20, bold: true, color: ACCT2, align: "right" });
    ribbon(s, 4.22, ty + 0.02, 8.26, 0.52, t[3], { hi: t[4], fs: 8, gap: 0.07 });
    ty += 0.86;
    if (i < 3) dline(s, M, ty - 0.14, R, ty - 0.14, { col: GRID, w: 0.5 });
  });
  cap(s, M, 6.08, 11.63, "Koyu renkli parçalar iç mimarlığın doğrudan tasarladığı bölümler. Dört okuma da aynı şeyi söylüyor: deneyimin büyük kısmı mekânda geçer.",
      { size: 12, face: H, col: BODY, h: 0.4 });
  cap(s, M, 6.48, 11.63, "Bizim dönem boyunca kullanacağımız model en alttaki: altı modül.",
      { size: 12.5, face: H, italic: true, bold: true, col: ACC, h: 0.4 });
  src(s, "Karşılaştırma: Bükülmez vd. (2025), “Brand Key Analysis and Customer Journey Mapping” bölümü.");
  s.addNotes("Bu slayt makalenin ilgili bölümünün özeti. 'Kaç parça' sorusunun cevabı yok, hangi ayrımın işe yaradığı var.");
}

{
  const s = slide("IV · YOLCULUK", "Temas noktalarının yedi türü");
  text(s, "Perakende deneyimi üzerine yapılan ölçümlerde temas noktaları yedi öğe altında toplanıyor (Stein & Ramaseshan, 2016). Üçü doğrudan tasarımın kurduğu şeylerdir; dördü tasarımın barındırmak zorunda olduğu şeyler.",
       { one: true, y: 1.82, h: 0.62, size: 13.5 });

  const tp = [
    ["Atmosferik", "ışık, ses, koku, malzeme, sıcaklık", 1],
    ["İletişimsel", "tabela, etiket, yönlendirme, fiyat", 1],
    ["Teknolojik", "ekran, uygulama, kiosk, ödeme", 1],
    ["Ürünle etkileşim", "dokunma, deneme, tartma, koklama", 0],
    ["Çalışan–müşteri", "karşılama, danışma, birebir ilgi", 0],
    ["Müşteri–müşteri", "kalabalık, mahremiyet, başkasının bakışı", 0],
    ["Süreçle ilgili", "sıra, bekleme, kasa, iade akışı", 0]
  ];
  rule(s, M, 2.62, 5.5, "TASARIMCININ KURDUĞU", { col: ACC, lcol: ACCT2 });
  rule(s, C2, 2.62, 5.5, "TASARIMIN BARINDIRDIĞI", { col: MUTED });
  let a = 0, b = 0;
  tp.forEach(t => {
    if (t[2]) {
      const y = 2.92 + a * 0.98;
      zone(s, M, y, 5.5, 0.82, "", 1);
      s.addText(t[0], { x: M + 0.22, y: y + 0.12, w: 5.06, h: 0.3, isTextBox: true, margin: 0,
        fontFace: H, fontSize: 14.5, bold: true, color: ACC });
      s.addText(t[1], { x: M + 0.22, y: y + 0.44, w: 5.06, h: 0.3, isTextBox: true, margin: 0,
        fontFace: S, fontSize: 10.5, color: ACC });
      a++;
    } else {
      const y = 2.92 + b * 0.74;
      s.addText(t[0], { x: C2 + 0.24, y: y, w: 2.3, h: 0.3, isTextBox: true, margin: 0,
        fontFace: H, fontSize: 13.5, bold: true, color: INK });
      s.addText(t[1], { x: C2 + 2.6, y: y + 0.02, w: 2.9, h: 0.6, isTextBox: true, margin: 0,
        fontFace: S, fontSize: 10, color: MUTED, lineSpacing: 12.5 });
      dot(s, C2 + 0.08, y + 0.15, { d: 0.1, col: DIMW });
      if (b < 3) dline(s, C2 + 0.24, y + 0.62, C2 + 5.5, y + 0.62, { col: GRID, w: 0.5 });
      b++;
    }
  });
  dline(s, 6.52, 2.58, 6.52, 5.9, { col: HAIR, w: 0.75 });
  cap(s, M, 6.1, 11.63, "Ölçümler atmosferik temas noktalarının marka sadakatine en güçlü katkıyı yaptığını gösteriyor. Müşteri–müşteri teması ise en çok atlanan başlık: kalabalık ve mahremiyet bir tasarım konusudur.",
      { size: 12, face: H, col: BODY, h: 0.55, ls: 16 });
  src(s, "Stein & Ramaseshan (2016), Journal of Retailing and Consumer Services, 30, 8–19.");
  s.addNotes("Sağ kolondaki dördü de mekân gerektirir; 'tasarlamıyorum' demek onları yok saymak değil.");
}

{
  const s = slide("IV · YOLCULUK", "Sekiz adımlı yolculuk ve iç mekâna uyarlanması");
  text(s, "Aşağıdaki sekiz adımlı model, deneyim tasarımı ajansı I-AM Istanbul tarafından perakende iç mekân tasarımının kendine özgü sorunları için geliştirildi. İç mekân tasarımı için uyarlanırken iki adım çıkarıldı, iki yeni modül eklendi.",
       { one: true, y: 1.82, h: 0.68, size: 13.5 });

  arcSteps(s, 6.665, 4.6, 5.5, 0.95, [
    ["Farkındalık", 0, "çıkarıldı"],
    ["Çekim", 1, ""],
    ["Eşik", 1, ""],
    ["Yönelme", 1, ""],
    ["Gezinme", 1, ""],
    ["Etkileşim", 2, "yeniden tanımlandı"],
    ["Satın alma", 2, "yeniden tanımlandı"],
    ["Ayrılma", 0, "çıkarıldı"]
  ], { a0: -83, a1: 83, fs: 11.5 });

  rule(s, M, 5.62, 11.63, "UYARLAMA NEDEN GEREKTİ");
  const w3 = 3.6, g3 = 0.42;
  const notes = [
    ["Çıkarılanlar", "Farkındalık (pazarlama, marka savunuculuğu, etkinlik) ve ayrılma (geri bildirim, sadakat) adımları mekânın değil, çok kanallı pazarlamanın işi."],
    ["Eklenenler", "Etkileşim ve satın alma adımları, mağazanın içindeki eylemlere göre yeniden tanımlandı: ürün ve hizmetler, organizasyonel ihtiyaçlar."],
    ["Sonuç", "İç mekâna dair altı modül: çekim, eşik, ürün ve hizmetler, organizasyonel ihtiyaçlar, yönelme, gezinme."]
  ];
  notes.forEach((nt, i) => {
    const x = M + i * (w3 + g3);
    s.addText(nt[0], { x: x, y: 5.86, w: w3, h: 0.28, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, bold: true, color: i === 2 ? ACC : MUTED, charSpacing: 1.5 });
    s.addText(nt[1], { x: x, y: 6.16, w: w3, h: 0.78, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: i === 2 ? ACC : BODY, lineSpacing: 13.5 });
  });
  s.addNotes("Kesikli halkalı iki nokta yeniden tanımlanan modüller; soluk olanlar çıkarılanlar.");
}

{
  const s = slide("IV · YOLCULUK", "Altı modül ne soruyor?");
  text(s, "Dönem boyunca projeniz bu altı modül üzerinden okunacak.",
       { one: true, y: 1.82, h: 0.32, size: 13.5 });

  const mods = [
    ["Çekim", "Mağaza sokakta nasıl fark edilir ve içeri nasıl çağırır?",
     "konum, cephe, vitrin, tabela · marka kimliğini yansıtan ve benzerlerinden ayrışan vitrin"],
    ["Eşik", "Müşteri içeri girerken ilk izlenimi nasıl kurulur?",
     "giriş–çıkış ilişkisi, iç atmosfer: renk, malzeme, doku, mobilya · duyusal ihtiyaçlar"],
    ["Ürün ve hizmetler", "Ürün nasıl teşhir edilir, nerede denenir, nerede dinlenilir?",
     "teşhir ölçüsü ve malzemesi, deneme, oturma ve bekleme noktalarının yeri ve alanı"],
    ["Organizasyonel ihtiyaçlar", "Mağaza nasıl çalışır; kasa, yönetim ve depo nerede olmalı?",
     "kasa konumu ve alanı, kasa arkası yönetim, depo m² ve yerleşimi · ergonomi"],
    ["Yönelme", "Müşteri kaybolmadan nasıl dolaşır?",
     "dolaşımın müşteriye ve servise uygunluğu, yönlendirme öğeleri, yapı mevzuatı"],
    ["Gezinme", "Ürün kategorileri arasında nasıl geçilir; fiziksel ve dijital deneyim nerede?",
     "kategoriler arası geçiş, fiziksel ve dijital deneyim alanları · çok kanallılık"]
  ];
  let y = 2.42;
  mods.forEach((m, i) => {
    dot(s, M + 0.14, y + 0.2, { t: String(i + 1), d: 0.3, col: ACC, ts: 10 });
    s.addText(m[0], { x: M + 0.5, y: y + 0.02, w: 2.7, h: 0.32, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 14, bold: true, color: INK, lineSpacing: 16 });
    s.addText(m[1], { x: 4.0, y: y + 0.02, w: 4.3, h: 0.5, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 12, italic: true, color: ACC, lineSpacing: 15 });
    s.addText(m[2], { x: 8.52, y: y + 0.04, w: 3.96, h: 0.6, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, color: MUTED, lineSpacing: 12 });
    y += 0.72;
    if (i < 5) dline(s, M + 0.5, y - 0.1, R, y - 0.1, { col: GRID, w: 0.5 });
  });

  cap(s, 4.0, 2.16, 4.3, "MODÜLÜN SORUSU", { size: 8.5, bold: true, col: FAINT, cs: 1.5 });
  cap(s, 8.52, 2.16, 3.96, "MEKÂNDA KARŞILIĞI", { size: 8.5, bold: true, col: FAINT, cs: 1.5 });
  cap(s, M + 0.5, 2.16, 2.7, "MODÜL", { size: 8.5, bold: true, col: FAINT, cs: 1.5 });
  src(s, "Modül tanımları: Bükülmez vd. (2025), Tablo 1 ve I-AM Istanbul CJM modeli.");
  s.addNotes("Bu slayt vize 2 ve final değerlendirmesinin doğrudan karşılığı; öğrenci neye bakılacağını buradan öğreniyor.");
}

/* ---- ölçülmüş sonuçlar: veri grafiği ---- */
{
  const s = slide("IV · YOLCULUK", "Öğrenciler hangi modülde zorlanıyor?");
  text(s, "Aynı stüdyoda otuz proje, dört değerlendirici tarafından altı modül üzerinden yeniden puanlandı (1–5 ölçek). Sonuç, hangi konuda ek çalışma gerektiğini tahmine bırakmıyor.",
       { one: true, y: 1.82, h: 0.6, size: 13.5 });

  rule(s, M, 2.7, 6.9, "SOMUTLAŞTIRMA VE DETAY FAZINDA MODÜL ORTALAMALARI");
  bars(s, M, 3.2, 6.9, [
    ["Yönelme", 3.46],
    ["Gezinme", 3.41],
    ["Ürün ve hizmetler", 3.26],
    ["Eşik", 3.20],
    ["Çekim", 2.88],
    ["Organizasyonel ihtiyaçlar", 2.84]
  ], { max: 5, bh: 0.32, gap: 0.2, lw: 2.55, ref: 3.17, refLabel: "faz ortalaması 3,17" });
  cap(s, M, 6.62, 6.9, "Ölçek: 1 = hiç katılmıyorum, 5 = tamamen katılıyorum. n = 30 proje, 4 değerlendirici.",
      { size: 9, col: FAINT, italic: true });

  rule(s, 8.1, 2.7, 4.38, "BUNDAN NE ÇIKARIYORUZ");
  const ins = [
    ["En zayıf iki modül", "Çekim ve organizasyonel ihtiyaçlar. Biri perakende ve pazarlama bilgisi, diğeri insan ölçüsü ve ergonomi istiyor."],
    ["Analiz fazı daha güçlü", "Analiz ve konsept fazı ortalaması 3,60; somutlaştırma ve detay fazı 3,17. Fikir kuruluyor, mekâna dönüşmüyor."],
    ["En düşük tek ifade", "“Mağaza içi yönlendirme öğeleri etkili kullanılmış” — ortalama 2,49. Wayfinding ayrı bir başlık olarak çalışılacak."]
  ];
  let iy = 2.95;
  ins.forEach((it, i) => {
    dot(s, 8.22, iy + 0.13, { d: 0.12, col: ACC });
    s.addText(it[0], { x: 8.44, y: iy, w: 4.04, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13, bold: true, color: INK });
    s.addText(it[1], { x: 8.44, y: iy + 0.3, w: 4.04, h: 0.66, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: BODY, lineSpacing: 13.5 });
    iy += 1.02;
  });
  zone(s, 8.1, 6.14, 4.38, 0.64, "", 1);
  cap(s, 8.3, 6.2, 3.98, "Bu yüzden 7., 8. ve 10. haftalarda vitrin, ergonomi ve malzeme–ışık atölyeleri yapılacak.",
      { size: 10.5, face: H, col: ACC, ls: 13, h: 0.56 });
  dline(s, 7.75, 2.7, 7.75, 6.8, { col: HAIR, w: 0.75 });
  src(s, "Veri: Bükülmez vd. (2025), Tablo 2 ve Tablo 3.");
  s.addNotes("Bu slayt dersin kurgusunu meşrulaştırıyor: atölyeler keyfî değil, ölçülmüş zayıflığa cevap.");
}

/* ============================ V · ANAHTAR KELİMELER ============================ */
opener("V", "Anahtar kelimeler nasıl belirlenir?", "Araştırmanın onlarca sıfatından ayakta kalan üç kelime, tasarımın bütün kararlarını sınar.");

{
  const s = qslide("V · ANAHTAR KELİME", "Üç aşamalı eleme");
  text(s, "Anahtar kelime, markayı tarif eden onlarca sıfatın içinden ayakta kalanıdır. Seçim rastgele değil; üç elemeden geçer. Sonunda elde üç kelime kalmalıdır — daha fazlası tasarımı dağıtır, daha azı yönlendirmez.",
       { one: true, y: 1.82, h: 0.62, size: 13.5 });

  const levels = [
    [10.4, "Markayla ilgili bütün sıfatlar", "araştırmadan çıkan ham liste · 20–30 kelime", "1"],
    [7.9,  "Rakiplerin söyleyemeyecekleri", "herkesin söylediği sıfatlar elenir", "2"],
    [5.4,  "Mekânda karşılığı olanlar", "bir ölçüye, malzemeye, ilişkiye çevrilebilenler kalır", "3"],
    [4.4,  "ÜÇ ANAHTAR KELİME", "tasarımın her kararını sınayan üç sıfat", ""]
  ];
  let y = 2.6;
  levels.forEach((l, i) => {
    const w = l[0], x = M + (FW - w) / 2;
    const hi = i === 3;
    zone(s, x, y, w, 0.66, "", hi ? 1 : 0);
    s.addText(l[1], { x: x + 0.2, y: y + 0.07, w: w - 0.4, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: hi ? 16 : 14, bold: true, color: hi ? ACC : INK, align: "center" });
    s.addText(l[2], { x: x + 0.2, y: y + 0.37, w: w - 0.4, h: 0.26, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, color: hi ? ACC : MUTED, align: "center" });
    if (l[3]) {
      dot(s, x - 0.34, y + 0.33, { t: l[3], d: 0.26, col: ACC, ts: 9 });
      arrow(s, 6.665, y + 0.7, 6.665, y + 0.96, { col: ACC, w: 1.4 });
    }
    y += 1.0;
  });
  const elim = [
    ["1 → 2", "Rakibin da söyleyebileceği her sıfat çıkar."],
    ["2 → 3", "Bir ölçüye çevrilemeyen her sıfat çıkar."],
    ["3 → üç", "Kalanlardan birbirini tekrar edenler birleşir."]
  ];
  elim.forEach((e, i) => {
    const x = M + i * 3.95;
    s.addText(e[0], { x: x, y: 6.1, w: 0.85, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, bold: true, color: ACC, charSpacing: 0.8 });
    s.addText(e[1], { x: x + 0.9, y: 6.1, w: 2.95, h: 0.56, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: BODY, lineSpacing: 13 });
  });
  s.addNotes("Huninin genişlikleri kasıtlı: ham listenin uzun olması iyidir, eleme sert olmalıdır.");
}

{
  const s = slide("V · ANAHTAR KELİME", "Kelime sınavı");
  text(s, "Öğrenci paftalarında en sık görülen anahtar kelimeler, hiçbir markayı diğerinden ayırmayan kelimelerdir. Bir sıfatın anahtar kelime sayılabilmesi için tek bir sınav vardır.",
       { one: true, y: 1.82, h: 0.62, size: 13.5 });

  rule(s, M, 2.6, 5.5, "SINAVDA KALANLAR", { col: MUTED });
  const fail = [
    ["Kaliteli", "hiçbir marka kalitesiz olmak istemez"],
    ["Modern", "hangi modernlik: tarih mi, tavır mı?"],
    ["Özel", "kime göre, neye göre özel?"],
    ["Şık", "bir ölçüye çevrilemez"],
    ["Müşteri odaklı", "bir mekân kararı üretmez"],
    ["Samimi", "ölçüsü yok; herkes iddia eder"]
  ];
  fail.forEach((f, i) => {
    const y = 2.9 + i * 0.5;
    s.addText(f[0], { x: M, y: y, w: 1.9, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 14, color: FAINT, strike: true });
    s.addText(f[1], { x: M + 1.95, y: y + 0.03, w: 3.55, h: 0.35, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, color: FAINT });
  });

  rule(s, C2, 2.6, 5.5, "SINAVI GEÇENLER", { col: ACC, lcol: ACCT2 });
  const pass = [
    ["Ham", "işlenmiş", "yüzey, birleşim, bitiş"],
    ["Yavaş", "hızlı", "dolaşım, kalma süresi"],
    ["Yoğun", "seyrek", "teşhir sıklığı, ürün/m²"],
    ["Gizli", "açık", "görüş hattı, katman"],
    ["Törensel", "gündelik", "kasa, paketleme, veda"],
    ["Sert", "yumuşak", "malzeme, akustik, ışık"]
  ];
  pass.forEach((f, i) => {
    const y = 2.9 + i * 0.5;
    s.addText(f[0], { x: C2, y: y, w: 1.25, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 14, bold: true, color: ACC });
    s.addText("↔ " + f[1], { x: C2 + 1.3, y: y + 0.03, w: 1.5, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, color: MUTED, italic: true });
    s.addText(f[2], { x: C2 + 2.9, y: y + 0.03, w: 2.6, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, color: ACC });
  });
  cap(s, C2 + 1.3, 2.66, 1.5, "ZITTI", { size: 8, bold: true, col: FAINT, cs: 1.3 });
  cap(s, C2 + 2.9, 2.66, 2.6, "MEKÂNDA NEYİ DEĞİŞTİRİR", { size: 8, bold: true, col: FAINT, cs: 1.3 });
  dline(s, 6.52, 2.56, 6.52, 5.9, { col: HAIR, w: 0.75 });

  zone(s, M, 6.02, FW, 0.7, "", 1);
  s.addText("SINAV:  Bu sıfatın zıttını bilinçli olarak seçen bir marka olabilir mi?   Olamıyorsa, o sıfat anahtar kelime değildir.",
    { x: M + 0.25, y: 6.14, w: 11.1, h: 0.46, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 14, bold: true, color: ACC });
  s.addNotes("Öğrenciler bu sınavı birbirine uygulasın; kritik süresini çok kısaltır.");
}

/* ============================ VI · KELİMEDEN MEKÂNA ============================ */
opener("VI", "Kelimeler mekâna nasıl dönüşür?", "Bir tasarım kararının savunulabilmesi, nereden geldiğinin gösterilebilmesine bağlıdır.");

{
  const s = qslide("VI · ÇEVİRİ", "Çeviri zinciri: beş halka");
  text(s, "Aşağıdaki zincir, marka anahtarındaki bir bileşenin hangi basamaklardan geçerek çizilebilir bir karara dönüştüğünü gösterir. Bir halka atlandığında karar dayanaksız kalır.",
       { one: true, y: 1.82, h: 0.62, size: 13.5 });

  const chain = [
    ["Bileşen", "marka anahtarından\nbir başlık", "Değerler:\nöğretmeyi seviyor"],
    ["Anahtar kelime", "tek sıfata\nindirge", "Şeffaf"],
    ["Yolculuk anı", "bu kelime hangi\nmodülde sınanıyor", "Çekim +\nÜrün ve hizmetler"],
    ["Mekânsal ilke", "o anı kuran\ngenel kural", "Üretim satış alanından\ngörülebilir olmalı"],
    ["Mekânsal öğe", "çizilebilir\nkarar", "Kavurma makinesi vitrine\nbakan camlı nişte"]
  ];
  const cw = 2.15, cg = 0.22, cy = 2.62, ch = 1.42;
  chain.forEach((c, i) => {
    const x = M + i * (cw + cg);
    zone(s, x, cy, cw, ch, "", i === 4 ? 1 : 0);
    dot(s, x + 0.28, cy + 0.28, { t: String(i + 1), d: 0.26, col: i === 4 ? ACC : INK, ts: 9 });
    s.addText(c[0], { x: x + 0.14, y: cy + 0.52, w: cw - 0.28, h: 0.5, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13.5, bold: true, color: i === 4 ? ACC : INK, lineSpacing: 16 });
    s.addText(c[1], { x: x + 0.14, y: cy + 1.0, w: cw - 0.28, h: 0.38, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9, color: MUTED, lineSpacing: 11 });
    if (i < 4) arrow(s, x + cw + 0.03, cy + ch / 2, x + cw + cg - 0.03, cy + ch / 2, { col: ACC, w: 1.4 });
  });
  rule(s, M, 4.42, 11.63, "AYNI ZİNCİR, ÖRNEKLE");
  chain.forEach((c, i) => {
    const x = M + i * (cw + cg);
    s.addText(c[2], { x: x + 0.02, y: 4.62, w: cw - 0.04, h: 0.8, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 11.5, italic: true, color: i === 4 ? ACC : BODY, lineSpacing: 15 });
  });

  dline(s, M, 5.6, R, 5.6, { col: HAIR, w: 0.75 });
  cap(s, M, 5.78, 11.63, "Aynı zincir müşteri tarafından da kurulur: gözlenen davranış → o davranışın yarattığı ihtiyaç → mekânsal ilke → öğe. İki zincir aynı kararda buluşmuyorsa, ya marka ya müşteri yanlış okunmuştur.",
      { size: 12.5, face: H, col: BODY, h: 0.6, ls: 17 });
  cap(s, M, 6.48, 11.63, "Konsept jürisinde her öğrenciden en az üç tam zincir istenecek.",
      { size: 12, face: H, italic: true, col: ACC, h: 0.4 });
  s.addNotes("Bu slayt dersin merkezi: öğrencinin bütün dönem boyunca kuracağı yapı bu.");
}

{
  const s = slide("VI · ÇEVİRİ", "Üç kelime, altı modül: karşılık matrisi");
  text(s, "Üç anahtar kelime, altı modülün her birinde bir karşılık üretmek zorundadır. Aşağıdaki bağlantılar kahve markası örneğinden; boş kalan kesişimler tasarımın henüz cevaplamadığı yerlerdir.",
       { one: true, y: 1.82, h: 0.62, size: 13.5 });

  chord(s, M, 4.85, 1.6, 7.6,
    ["ŞEFFAF", "SABIRLI", "HAM"],
    ["Çekim — kavurma makinesi vitrinden görünür",
     "Eşik — koku eşikte karşılar, kapı ağırdır",
     "Ürün ve hizmetler — açık kavanoz, tartım tezgâhı",
     "Organizasyonel — depo camlı, stok görünür",
     "Yönelme — rota kavurmadan tartıma akar",
     "Gezinme — bekleyene oturma ve tadım noktası"],
    [[0, 0], [0, 2], [0, 3], [1, 1], [1, 4], [1, 5], [2, 1], [2, 2], [2, 4]],
    2.7, 0.62, { fs: 12, rfs: 11 });

  cap(s, M, 2.44, 1.6, "ANAHTAR KELİME", { size: 8.5, bold: true, col: FAINT, cs: 1.4 });
  cap(s, 4.85, 2.44, 7.6, "MODÜLDEKİ KARŞILIĞI", { size: 8.5, bold: true, col: FAINT, cs: 1.4 });

  dline(s, M, 6.24, R, 6.24, { col: HAIR, w: 0.75 });
  cap(s, M, 6.4, 11.63, "Bir kelime hiçbir modülde karşılık bulamıyorsa anahtar kelime değildir; bir modül hiçbir kelimeden karşılık almıyorsa o modül tasarlanmamıştır.",
      { size: 12.5, face: H, italic: true, col: ACC, h: 0.45 });
  s.addNotes("Bu matris vize 1 paftasında istenecek; boşluklar kritiğin konusu olacak.");
}

/* ============================ VII · MARKA → MAĞAZA ============================ */
opener("VII", "Bir marka nasıl mağazaya dönüşür?", "Bütün araçlar tek bir akışın parçası. İşte o akışın tamamı.");

{
  const s = slide("VII · BÜTÜN SÜREÇ", "Bir marka nasıl mağazaya dönüşür?", 27);
  text(s, "Bugüne kadar anlatılan her araç bu akışın bir halkasıdır. Üstteki şerit ne yapıldığını, alttaki satır çıktının ne olduğunu gösterir.",
       { one: true, y: 1.82, h: 0.62, size: 13.5 });

  const phases = [
    ["ARAŞTIRMA", ["Kimlik okuma", "Marka anahtarı", "Persona"], "3 aday marka · 8 bileşen · 3 persona"],
    ["ÇEVİRİ", ["Yolculuk haritası", "Anahtar kelime", "Mekânsal ilke"], "6 modül · 3 kelime · 3 ilke"],
    ["TASARIM", ["Mekânsal program", "Konsept", "Detay"], "m² dağılımı · 1/100 · 1/50 ve 1/20"]
  ];
  const pw = 3.78, pg = 0.3, py = 2.5;
  phases.forEach((ph, i) => {
    const x = M + i * (pw + pg);
    // phase band
    s.addShape(p.ShapeType.rect, { x: x, y: py, w: pw, h: 0.34,
      fill: { color: i === 2 ? ACC : ACCT }, line: { type: "none" } });
    s.addText(ph[0], { x: x, y: py, w: pw, h: 0.34, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, bold: true, color: i === 2 ? "FFFFFF" : ACC,
      align: "center", valign: "middle", charSpacing: 2 });
    // three steps stacked
    ph[1].forEach((st, j) => {
      const y = py + 0.54 + j * 0.86;
      zone(s, x, y, pw, 0.68, "", 0);
      dot(s, x + 0.32, y + 0.34, { t: String(i * 3 + j + 1), d: 0.28, col: ACC, ts: 9.5 });
      s.addText(st, { x: x + 0.62, y: y, w: pw - 0.78, h: 0.68, isTextBox: true, margin: 0,
        fontFace: H, fontSize: 14, bold: true, color: INK, valign: "middle" });
      if (j < 2) arrow(s, x + pw / 2, y + 0.7, x + pw / 2, y + 0.84, { col: ACC, w: 1.2 });
    });
    if (i < 2) arrow(s, x + pw + 0.04, py + 1.85, x + pw + pg - 0.04, py + 1.85, { col: ACC, w: 1.6 });
    // output
    dline(s, x, py + 3.2, x + pw, py + 3.2, { col: ACC, w: 1.25 });
    s.addText("ÇIKTI", { x: x, y: py + 3.28, w: pw, h: 0.24, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 8, bold: true, color: FAINT, charSpacing: 1.5 });
    s.addText(ph[2], { x: x, y: py + 3.52, w: pw, h: 0.4, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: BODY, lineSpacing: 13 });
  });
  cap(s, M, 6.48, 11.63, "Dokuz adımın hiçbiri atlanamaz. Her adımın çıktısı bir sonrakinin girdisidir; atlanan adım en son çizimde eksik olarak geri döner.",
      { size: 12.5, face: H, italic: true, col: ACC, h: 0.45 });
  s.addNotes("Dönem boyunca bu slayt referans: öğrenci hangi adımda olduğunu buradan görür.");
}

{
  const s = slide("VII · BÜTÜN SÜREÇ", "Üç faz, on dört hafta");
  text(s, "Stüdyo, perakende tasarım süreç modeline göre üç fazda kurgulanır (Quartier vd., 2017). Bizim on dört haftamız da bu üç fazı izliyor; her fazın sonunda bir jüri var.",
       { one: true, y: 1.82, h: 0.62, size: 13.5 });

  const ph = [
    ["1", "ANALİZ VE KONSEPT TASARIMI", "1–6. hafta", "VİZE 1 · 6. hafta",
     "Alan, marka, persona ve müşteri deneyiminin kapsamlı analizi; diyagram, haritalama, mekânsal program, anahtar kelime, matris, hikâye panosu, senaryo, fotomontaj ve kolaj. Senaryonun ilk mekânsal çözümlere dönüşmesi ve 1/100 teknik çizimle sunulması."],
    ["2", "SOMUTLAŞTIRMA TASARIMI", "7–11. hafta", "VİZE 2 · 11. hafta",
     "Konseptin bütünlüklü ve rafine bir tasarıma çevrilmesi. Vize 1 çizimlerinin geliştirilmesi, 1/50 teknik çizimler ve 3B görselleştirmeler; strüktür, malzeme ve aydınlatma çözümlerinin tanımlanması."],
    ["3", "DETAY TASARIMI", "12–14. hafta", "FİNAL · ayrı hafta",
     "Tamamlanmış işin bütün olarak değerlendirilmesi. 1/50 plan, kesit, tavan planı ve cephe görünüşleri; seçilen bir bölgeden 1/20 kısmi plan ve kesit. Dönem boyunca gösterilen gelişim de değerlendirmeye girer."]
  ];
  let y = 2.5;
  ph.forEach((f, i) => {
    dot(s, M + 0.2, y + 0.24, { t: f[0], d: 0.4, col: ACC, ts: 13 });
    s.addText(f[1], { x: M + 0.62, y: y, w: 4.1, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 14.5, bold: true, color: INK });
    s.addText(f[2], { x: M + 0.62, y: y + 0.3, w: 4.1, h: 0.26, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, color: MUTED });
    pill(s, M + 0.62, y + 0.62, 2.0, 0.26, f[3], { fill: ACCT, size: 8.5 });
    s.addText(f[4], { x: 6.05, y: y + 0.02, w: 6.43, h: 1.1, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: BODY, lineSpacing: 13.5 });
    y += 1.34;
    if (i < 2) dline(s, M, y - 0.22, R, y - 0.22, { col: GRID, w: 0.5 });
  });
  cap(s, M, 6.58, 11.63, "Birinci fazın kalitesi diğer ikisini belirler: ölçümler, analiz fazında güçlü olan projelerin detay fazında da güçlü kaldığını gösteriyor.",
      { size: 12, face: H, italic: true, col: ACC, h: 0.4 });
  src(s, "Quartier vd. (2017) süreç modeli; faz içerikleri Bükülmez vd. (2025), Tablo 1.");
  s.addNotes("Final ayrı bir haftada; öğrenci takvimi buradan not alsın.");
}

/* ============================ VIII · PROJE BRİFİ ============================ */
opener("VIII", "Proje brifi ve beklentiler", "Ne tasarlayacaksınız, ne teslim edeceksiniz, jüri neye bakacak?");

{
  const s = slide("VIII · BRİF", "Proje tanımı");
  text(s, "Küçük ve yerel bir markanın ilk fiziksel mekânını tasarlayacaksınız. Mekân verilidir: Mersin Marina'da bir ticari birim. Kabuk — taşıyıcı, cephe hattı, kot — değiştirilemez; iç bölünme, tavan, zemin, cephe dolgusu ve vitrin sizindir.",
       { one: true, y: 1.82, h: 0.95, size: 14 });

  rule(s, M, 2.9, 5.5, "VERİLENLER");
  const given = [
    ["Mekân", "Mersin Marina'da bir ticari birim"],
    ["Kabuk", "taşıyıcı, cephe hattı ve kot verili"],
    ["Alan ziyareti", "2. hafta, hep birlikte"],
    ["Marka", "sizin bulacağınız küçük, yerel marka"],
    ["Ölçek", "bireysel proje"]
  ];
  let gy = 3.2;
  given.forEach((g, i) => {
    s.addText(g[0], { x: M, y: gy, w: 1.5, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13, bold: true, color: INK });
    s.addText(g[1], { x: M + 1.55, y: gy + 0.02, w: 3.95, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11, color: BODY });
    gy += 0.5;
    if (i < 4) dline(s, M, gy - 0.1, M + 5.5, gy - 0.1, { col: GRID, w: 0.5 });
  });

  rule(s, C2, 2.9, 5.5, "MARİNA BİR AVM DEĞİLDİR — ALTI KISIT", { col: ACC, lcol: ACCT2 });
  const cons = [
    "Açık hava: yaya dış mekândan gelir, hava şartlarına açıktır.",
    "Mevsimsellik: yaz ve kış yoğunluğu birbirine benzemez.",
    "Deniz ve tuz: malzeme seçimi korozyona dayanmak zorunda.",
    "Akşam kullanımı: gece cephesi ve aydınlatma ayrı tasarlanır.",
    "Karma kullanıcı: tekne sahibi, turist, yerel halk bir arada.",
    "Görünürlük: cephe uzaktan ve yandan okunmak durumunda."
  ];
  cons.forEach((c, i) => {
    const y = 3.2 + i * 0.47;
    dot(s, C2 + 0.09, y + 0.14, { t: String(i + 1), d: 0.23, col: ACC, ts: 8 });
    s.addText(c, { x: C2 + 0.34, y: y - 0.01, w: 5.16, h: 0.4, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: BODY, lineSpacing: 13 });
  });
  dline(s, 6.52, 2.86, 6.52, 6.05, { col: HAIR, w: 0.75 });
  cap(s, M, 6.22, 11.63, "Alanın kesin m²'si, kat sayısı, tavan yüksekliği ve cephe uzunluğu 2. hafta alan ziyaretinde ölçülerek verilecek.",
      { size: 12, face: H, italic: true, col: MUTED, h: 0.4 });
  img(s, "Mersin Marina'dan cephe ve yaya akışı fotoğrafı — bu slaydın altına şerit hâlinde konabilir.");
  s.addNotes("Altı kısıt dersin ayırt edici yeri: kapalı AVM mağazası kurgusu burada işlemez.");
}

{
  const s = slide("VIII · BRİF", "Tasarlamak zorunda olduğunuz alanlar");
  text(s, "Aşağıdaki liste bağlayıcıdır. Mekânın büyüklüğü ne olursa olsun bu işlevlerin hepsi çözülmüş olmak zorundadır. Nerede olacakları size, hepsinin bulunması bize aittir.",
       { one: true, y: 1.82, h: 0.6, size: 14 });

  const groups = [
    ["ÖN ALAN — müşterinin gördüğü", ["Vitrin ve cephe", "Giriş ve eşik (dekompresyon)", "Teşhir alanları", "Etkileşim ve deneme", "Deneme kabini (ürün gerektiriyorsa)", "Oturma ve bekleme"], 1, 3],
    ["KESİŞİM", ["Kasa ve paketleme", "Kasa arkası yönetim"], 1, 3],
    ["ARKA ALAN — işletmenin çalıştığı", ["Mal kabul", "Depo (m² gerekçeli)", "Personel alanı ve WC", "Servis rotası"], 2, 4]
  ];
  let gy = 2.52;
  groups.forEach((g, i) => {
    rule(s, M, gy, 11.63, g[0], { col: g[2] === 1 ? ACC : MUTED, lcol: g[2] === 1 ? ACCT2 : GRID });
    g[1].forEach((it, j) => {
      const nc = g[3], cwid = FW / nc;
      const col = j % nc;
      const x = M + col * cwid;
      const y = gy + 0.22 + Math.floor(j / nc) * 0.42;
      dot(s, x + 0.09, y + 0.15, { d: 0.11, col: g[2] === 1 ? ACC : DIMW });
      s.addText(it, { x: x + 0.3, y: y, w: cwid - 0.38, h: 0.32, isTextBox: true, margin: 0,
        fontFace: S, fontSize: 11, color: BODY });
    });
    gy += 0.22 + Math.ceil(g[1].length / g[3]) * 0.42 + 0.3;
  });

  zone(s, M, 5.6, FW, 1.14, "", 1);
  s.addText("DUYUSAL VURGU — BU DERSİN AYIRT EDİCİ TALEBİ", { x: M + 0.25, y: 5.72, w: 11.1, h: 0.26,
    isTextBox: true, margin: 0, fontFace: S, fontSize: 9, bold: true, color: ACC, charSpacing: 1.6 });
  s.addText("Beş duyunun her biri için en az bir bilinçli karar vermeniz ve bunu Duyu × Yolculuk Matrisi'nde göstermeniz bekleniyor. Ayrıca üç “imza an” tanımlayacaksınız. Depo m²’si de gerekçeli olmak zorunda: ürünün ölçüsü, stok devir hızı ve mevsimsellik üzerinden hesaplanır.",
    { x: M + 0.25, y: 5.98, w: 11.1, h: 0.68, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 12.5, color: ACC, lineSpacing: 16 });
  s.addNotes("Depo gerekçesi en çok atlanan konu — ölçümlerde 'organizasyonel ihtiyaçlar' en zayıf modül çıktı.");
}

{
  const s = slide("VIII · TESLİMLER", "Üç teslim, üç paket");
  text(s, "Her jüride ne getireceğiniz baştan belli. Aşağıdaki paketler asgari koşuldur; eksik teslim jüriye giremez.",
       { one: true, y: 1.82, h: 0.5, size: 14 });

  const del = [
    ["VİZE 1 · 6. HAFTA", "%25", "Analiz ve Konsept", [
      "Marka anahtarı (8 başlık) + kanıt",
      "3 persona, biri ana persona",
      "Müşteri yolculuğu haritası — 6 modül",
      "3 anahtar kelime + karşılık matrisi",
      "Mekân analizi ve mekânsal program",
      "Konsept panosu, senaryo, kolaj",
      "1/100 plan (zoning) ve 1 kesit"
    ]],
    ["VİZE 2 · 11. HAFTA", "%25", "Somutlaştırma", [
      "Revize konsept",
      "1/50 tam set: plan, min. 2 kesit, cephe",
      "1/50 tavan ve aydınlatma planı",
      "Arka ofis ve kasa çözümü",
      "Yönlendirme şeması",
      "Fiziksel malzeme paneli",
      "Min. 3 iç mekân 3B görseli"
    ]],
    ["FİNAL · AYRI HAFTA", "%30", "Detay", [
      "Analiz–konsept özeti, matris, imza anlar",
      "1/50 plan, min. 2 kesit, cephe, tavan planı",
      "1/20 kısmi plan ve kesit",
      "Min. 1 adet 1/10–1/5 teşhir detayı",
      "Malzeme paneli ve lejant",
      "Min. 5 iç mekân + 1 gece cephesi görseli",
      "Fiziksel maket, erişilebilirlik notu"
    ]]
  ];
  const dw = 3.6, dg = 0.42, dy = 2.45;
  del.forEach((d, i) => {
    const x = M + i * (dw + dg);
    s.addShape(p.ShapeType.rect, { x: x, y: dy, w: dw, h: 0.36,
      fill: { color: i === 2 ? ACC : ACCT }, line: { type: "none" } });
    s.addText(d[0], { x: x + 0.16, y: dy, w: dw - 0.9, h: 0.36, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, bold: true, color: i === 2 ? "FFFFFF" : ACC,
      valign: "middle", charSpacing: 1.4 });
    s.addText(d[1], { x: x + dw - 0.78, y: dy, w: 0.62, h: 0.36, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13, bold: true, color: i === 2 ? "FFFFFF" : ACC,
      align: "right", valign: "middle" });
    s.addText(d[2], { x: x, y: dy + 0.44, w: dw, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 15, bold: true, color: INK });
    d[3].forEach((it, j) => {
      const y = dy + 0.84 + j * 0.46;
      dot(s, x + 0.08, y + 0.14, { d: 0.1, col: i === 2 ? ACC : DIMW });
      s.addText(it, { x: x + 0.28, y: y - 0.02, w: dw - 0.28, h: 0.44, isTextBox: true, margin: 0,
        fontFace: S, fontSize: 10, color: BODY, lineSpacing: 12.5 });
    });
  });
  cap(s, M, 6.42, 11.63, "Ayrıca 3. haftada araştırma sunumu (%10) ve yarıyıl boyunca stüdyo süreç performansı (%10) değerlendirilir. Jüriye katılım ve sözlü sunum zorunludur.",
      { size: 12, face: H, italic: true, col: ACC, h: 0.45 });
  s.addNotes("Teslim paketleri yazılı brifte de var; burada sadece hatırlatıyoruz.");
}

{
  const s = slide("VIII · DEĞERLENDİRME", "Jüri neyi ölçüyor? Yirmi bir ifade");
  text(s, "Aşağıdaki ifadeler, aynı çerçevenin uygulandığı stüdyoda projelerin yeniden puanlanmasında kullanıldı. Her ifade 1–5 arası puanlanır. Sizin projeniz de bu ifadelerle okunacak.",
       { one: true, y: 1.82, h: 0.56, size: 13 });

  const grp = [
    ["MARKA ANALİZİ", "vize 1", [
      "Markanın hedefleri projede doğru belirlenmiş.",
      "Analiz edilen marka kimliği proje alanının kimliğiyle uyumlu.",
      "Geliştirilen konsept, seçilen markanın kimliğiyle örtüşüyor."]],
    ["PERSONA", "vize 1", [
      "Markanın ana hedefi ile projenin personası uyumlu.",
      "Mağaza tasarımı personanın duyusal ve işlevsel ihtiyaçlarına cevap veriyor."]],
    ["ÇEKİM", "vize 2", [
      "Vitrin tasarımı marka kimliğini yansıtıyor.",
      "Vitrin tasarımı benzerlerinden ayrışıyor.",
      "Vitrin tasarımı kullanıcı için ilgi çekici.",
      "Mağazanın atmosferi (renk, malzeme, doku, mobilya) marka kimliğiyle örtüşüyor."]],
    ["EŞİK", "vize 2", [
      "Giriş–çıkış alanları kullanıcının duyusal ihtiyaçlarını karşılıyor.",
      "Kullanıcı giriş ve çıkış alanları birbirini destekliyor."]],
    ["ÜRÜN VE HİZMETLER", "vize 2", [
      "Mağaza içi yönlendirme öğeleri etkili kullanılmış.",
      "Ürün yerleşimi ve teşhiri (ölçü, malzeme, detay) işlevsel gereklere cevap veriyor.",
      "Dinlenme ve bekleme noktaları (yeri, kapladığı alan) işlevsel gereklere cevap veriyor."]],
    ["ORGANİZASYONEL İHTİYAÇLAR", "vize 2", [
      "Kasa alanı (yeri, kapladığı alan) işlevsel gereklere cevap veriyor.",
      "Kasa arkası yönetim alanı mekânsal gereklere cevap veriyor.",
      "Depo alanı, ürün ve hizmetler düşünüldüğünde mekânsal gereklere (m², yerleşim) cevap veriyor."]],
    ["YÖNELME", "vize 2", [
      "Mağazadaki dolaşım servis için uygun.",
      "Mağazadaki dolaşım kullanıcılar için uygun."]],
    ["GEZİNME", "vize 2", [
      "Tasarımda konsepte göre dijital deneyim alanları oluşturulmuş.",
      "Tasarımda konsepte göre fiziksel deneyim alanları oluşturulmuş."]]
  ];
  const cols = [[0, 1, 2], [3, 4, 5], [6, 7]];
  const colX = [M, 4.78, 8.71];
  const colW = [3.62, 3.62, 3.77];
  let ni = 0;
  cols.forEach((ids, ci) => {
    const x = colX[ci], w = colW[ci];
    let cy = 2.42;
    ids.forEach(gi => {
      const g = grp[gi];
      s.addText(g[0], { x: x, y: cy, w: w - 0.8, h: 0.24, isTextBox: true, margin: 0,
        fontFace: S, fontSize: 8.5, bold: true, color: ACC, charSpacing: 1.3 });
      s.addText(g[1], { x: x + w - 0.8, y: cy, w: 0.8, h: 0.24, isTextBox: true, margin: 0,
        fontFace: S, fontSize: 8, color: FAINT, align: "right", italic: true });
      dline(s, x, cy + 0.23, x + w, cy + 0.23, { col: ACCT2, w: 0.85 });
      cy += 0.32;
      g[2].forEach(st => {
        ni++;
        s.addText(String(ni), { x: x, y: cy + 0.01, w: 0.26, h: 0.22, isTextBox: true, margin: 0,
          fontFace: S, fontSize: 8, bold: true, color: ACC });
        s.addText(st, { x: x + 0.3, y: cy - 0.02, w: w - 0.3, h: 0.34, isTextBox: true, margin: 0,
          fontFace: S, fontSize: 9, color: BODY, lineSpacing: 11 });
        cy += 0.37;
      });
      cy += 0.2;
    });
    if (ci === 2) {
      zone(s, x, cy + 0.14, w, 1.5, "", 1);
      cap(s, x + 0.2, cy + 0.3, w - 0.4, "Bu ifadeler kritiklerde soru olarak da kullanılacak. Kendi projenize yirmi birini tek tek sorun: “katılmıyorum” dediğiniz her ifade, o hafta çalışılacak konudur.",
          { size: 10.5, face: H, col: ACC, ls: 14, h: 1.2 });
    }
  });
  src(s, "Bükülmez vd. (2025), Tablo 1: CJM Değerlendirme Çerçevesi — Türkçeye çevrilmiş ve bu dersin teslimlerine uyarlanmış hâli.");
  s.addNotes("21 ifade kritiklerde doğrudan kullanılabilir; öğrenci kendi projesine bu soruları sorabilir.");
}

{
  const s = slide("VIII · DEĞERLENDİRME", "Hangi modül hangi yetkinliği istiyor?");
  text(s, "Modüller farklı bilgi alanları gerektirir. Aşağıdaki bağlantılar, hangi modülde zorlanıyorsanız hangi alanda çalışmanız gerektiğini gösteriyor (Quartier vd., 2020 yetkinlik çerçevesi).",
       { one: true, y: 1.82, h: 0.62, size: 13.5 });

  chord(s, M, 5.15, 2.9, 7.3,
    ["Marka analizi", "Persona", "Çekim", "Eşik · Ürün · Organizasyon · Yönelme", "Gezinme"],
    ["Markalaşma — marka ve marka iletişimi bilgisi",
     "Sosyo-kültürel bilimler — psikoloji, sosyoloji, felsefe",
     "Araştırma — hedef kitle, tüketici davranışı, yolculuk analizi, trend okuma",
     "Pazarlama ve strateji — perakende pazarlaması, mağaza içi operasyon, koku pazarlaması",
     "Tasarım ve tasarım eylemi — mobilya ve yapı teknolojileri, teknik çizim, CAD/3B, mevzuat, insan ölçüsü ve ergonomi",
     "Çok kanallılık ve dijital — dijital gelişmeler ve dijital çözümlerin işleyişi"],
    [[0, 0], [0, 1], [1, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
    2.72, 0.66, { fs: 9.5, rfs: 10.5 });

  cap(s, M, 2.46, 2.9, "MODÜL", { size: 8.5, bold: true, col: FAINT, cs: 1.4 });
  cap(s, 5.15, 2.46, 7.3, "GEREKTİRDİĞİ YETKİNLİK ALANI", { size: 8.5, bold: true, col: FAINT, cs: 1.4 });
  dline(s, M, 6.46, R, 6.46, { col: HAIR, w: 0.75 });
  cap(s, M, 6.6, 11.63, "Dört modül aynı yetkinliği paylaşıyor: tasarım ve tasarım eylemi. Projenin ağırlık merkezi orada.",
      { size: 12, face: H, italic: true, col: ACC, h: 0.35 });
  s.addNotes("Bu slayt öğrenciye nereye çalışacağını söylüyor: modül zayıfsa hangi bilgi alanı eksik.");
}

{
  const s = slide("VIII · DEĞERLENDİRME", "Ağırlıklar ve sekiz boyut");
  text(s, "Not, beş kalemden ve her jüride sekiz boyuttan oluşur. Boyutların ağırlığı jüriye göre değişir: analiz fazında marka ve konsept, sonrasında mekânsal çözüm ve teknik ağırlık kazanır.",
       { one: true, y: 1.82, h: 0.6, size: 13.5 });

  rule(s, M, 2.62, 11.63, "DÖNEM NOTUNUN DAĞILIMI");
  const grade = [["Araştırma sunumu\n3. hafta", 10], ["Vize 1\n6. hafta", 25],
                 ["Vize 2\n11. hafta", 25], ["Final\nayrı hafta", 30], ["Süreç\nperformansı", 10]];
  let gx = M;
  grade.forEach((g, i) => {
    const w = FW * g[1] / 100;
    s.addShape(p.ShapeType.rect, { x: gx, y: 2.86, w: w - 0.04, h: 0.44,
      fill: { color: i === 3 ? ACC : ACCT }, line: { type: "none" } });
    s.addText("%" + g[1], { x: gx, y: 2.86, w: w - 0.04, h: 0.44, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 14, bold: true, color: i === 3 ? "FFFFFF" : ACC,
      align: "center", valign: "middle" });
    s.addText(g[0], { x: gx, y: 3.36, w: w - 0.04, h: 0.5, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, color: MUTED, align: "center", lineSpacing: 11.5 });
    gx += w;
  });

  rule(s, M, 4.1, 11.63, "HER JÜRİDE PUANLANAN SEKİZ BOYUT");
  const dims = [
    ["Marka ve kullanıcı analizi", "%30", "%10", "%10"],
    ["Konsept gücü ve tutarlılığı", "%30", "%15", "%15"],
    ["Mekânsal kurgu ve program", "%20", "%20", "%15"],
    ["Çekim ve eşik", "%5", "%15", "%10"],
    ["Organizasyonel çözüm", "—", "%15", "%15"],
    ["Atmosfer ve duyusal katman", "%5", "%15", "%15"],
    ["Teknik çözüm ve detay", "—", "%5", "%15"],
    ["Sunum ve anlatım", "%10", "%5", "%5"]
  ];
  cap(s, M, 4.32, 5.2, "BOYUT", { size: 8.5, bold: true, col: FAINT, cs: 1.4 });
  ["VİZE 1", "VİZE 2", "FİNAL"].forEach((t, j) => {
    cap(s, 6.6 + j * 1.35, 4.32, 1.2, t, { size: 8.5, bold: true, col: FAINT, cs: 1.4, align: "center" });
  });
  dline(s, M, 4.56, 10.6, 4.56, { col: HAIR, w: 0.9 });
  dims.forEach((d, i) => {
    const y = 4.64 + i * 0.28;
    s.addText(d[0], { x: M, y: y, w: 5.5, h: 0.26, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: BODY });
    for (let j = 1; j <= 3; j++) {
      s.addText(d[j], { x: 6.6 + (j - 1) * 1.35, y: y, w: 1.2, h: 0.26, isTextBox: true, margin: 0,
        fontFace: S, fontSize: 10.5, bold: d[j] !== "—", color: d[j] === "—" ? FAINT : ACC, align: "center" });
    }
    if (i < 7) dline(s, M, y + 0.26, 10.6, y + 0.26, { col: GRID, w: 0.4 });
  });
  zone(s, 10.95, 4.6, 1.53, 2.2, "", 1);
  cap(s, 11.1, 4.78, 1.25, "Ağırlık kayması tesadüf değil: fikir önce, mekân sonra, detay en son ölçülür.",
      { size: 10, face: H, col: ACC, ls: 13, h: 1.5 });
  s.addNotes("Öğrenciye söyleyin: vize 1'de teknik çizim kalitesi değil analiz derinliği ölçülüyor.");
}

/* ============================ IX · BUGÜN VE ÖDEV ============================ */
opener("IX", "Bugün ve bu hafta", "Öğrendiğimiz araçları aynı gün içinde bir mağaza üzerinde deneyeceğiz.");

{
  const s = slide("IX · BUGÜN", "Birinci çalışma: bir mağazayı okumak");
  text(s, "Her birinize bir mağaza görseli verilecek: onu altı başlık altında okuyup üç anahtar kelime çıkaracaksınız. Markayı tanımıyorsunuz, yalnızca gördüğünüzden hareket edeceksiniz.",
       { one: true, y: 1.82, h: 0.66, size: 14 });

  const six = [
    ["Marka", "Bu mekân hangi markayı anlatıyor? Nasıl bir tavrı var?"],
    ["Kullanıcı", "Burada kim rahat eder, kim etmez?"],
    ["Ürün", "Ne satılıyor; ürün nasıl korunuyor, nasıl sunuluyor?"],
    ["Davranış", "Müşteri burada ne yapıyor: bakıyor, dokunuyor, bekliyor?"],
    ["Duyular", "Hangi duyulara sesleniyor; hangileri sessiz bırakılmış?"],
    ["Atmosfer", "Işık, renk, malzeme, yoğunluk nasıl bir his kuruyor?"]
  ];
  const sw = 3.6, sg = 0.42, sy = 2.68, sh = 1.05;
  six.forEach((it, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = M + col * (sw + sg), y = sy + row * (sh + 0.3);
    dline(s, x, y, x + sw, y, { col: ACC, w: 1.25 });
    dot(s, x + 0.16, y + 0.32, { t: String(i + 1), d: 0.28, col: ACC, ts: 9.5 });
    s.addText(it[0], { x: x + 0.44, y: y + 0.16, w: sw - 0.44, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 15, bold: true, color: INK });
    s.addText(it[1], { x: x + 0.44, y: y + 0.5, w: sw - 0.5, h: 0.5, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: MUTED, lineSpacing: 13 });
  });

  zone(s, M, 5.42, FW, 0.78, "", 1);
  s.addText("ÇIKTI", { x: M + 0.25, y: 5.54, w: 0.8, h: 0.28, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 9.5, bold: true, color: ACC, charSpacing: 1.5 });
  s.addText("Üç anahtar kelime — ve her kelimenin yanında görselde onu gösteren kanıt.",
    { x: M + 1.15, y: 5.55, w: 10.2, h: 0.5, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 15, bold: true, color: ACC });
  cap(s, M, 6.32, 11.63, "Süre: 45 dakika · bireysel · kâğıt dağıtılacak. Kelime tek başına değersiz, kanıtla birlikte değerli.",
      { size: 12, face: H, italic: true, col: MUTED, h: 0.4 });
  img(s, "dört mağaza görseli bu slaytın ardına tam sayfa olarak eklenebilir.");
  s.addNotes("Kanıt zorunluluğunu vurgulayın; kâğıtta bunun için ayrı bir alan var.");
}

{
  const s = slide("IX · BUGÜN", "İkinci çalışma: aynı mağaza, farklı okumalar");
  text(s, "Aynı görseli okuyanlar bir grup olacak. Kelimelerin tutmadığını göreceksiniz — bu bir hata değil, çalışmanın asıl konusu. Aynı mekânın farklı okunması, hangi mesajın net verildiğini gösterir.",
       { one: true, y: 1.82, h: 0.66, size: 14 });

  const tasks = [
    ["Ortak olanı bulun", "Grubun çoğunun yazdığı kelimeler mekânın net söylediği şeydir.",
     "markanın güçlü sinyalleri"],
    ["Ayrışanı tartışın", "Yalnız bir kişinin gördüğü şey ya derin bir okuma ya da bir yanlış anlamadır; hangisi olduğuna kanıta bakarak karar verin.",
     "mekânın belirsiz kaldığı yer"],
    ["Eksiği adlandırın", "Hiç kimsenin yazmadığı ama mekânda olması gereken bir şey var mı?",
     "tasarım fırsatı burada"]
  ];
  const tw = 3.6, tg = 0.42, ty = 2.68, th = 2.3;
  tasks.forEach((t, i) => {
    const x = M + i * (tw + tg);
    zone(s, x, ty, tw, th, "", i === 2 ? 1 : 0);
    dot(s, x + 0.42, ty + 0.42, { t: String(i + 1), d: 0.32, col: i === 2 ? ACC : INK, ts: 11 });
    s.addText(t[0], { x: x + 0.22, y: ty + 0.74, w: tw - 0.44, h: 0.32, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 15.5, bold: true, color: i === 2 ? ACC : INK });
    s.addText(t[1], { x: x + 0.22, y: ty + 1.1, w: tw - 0.44, h: 0.82, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: BODY, lineSpacing: 13.5 });
    dline(s, x + 0.22, ty + 1.94, x + tw - 0.22, ty + 1.94, { col: i === 2 ? ACC : GRID, w: 0.75 });
    s.addText(t[2], { x: x + 0.22, y: ty + 2.0, w: tw - 0.44, h: 0.26, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, bold: true, color: i === 2 ? ACC : MUTED });
  });
  rule(s, M, 5.32, 11.63, "GRUP ÇIKTISI");
  cap(s, M, 5.52, 11.63, "Tek bir A3 sayfa: ortak kelimeler, ayrışan kelimeler ve grubun ortak cümlesi — “Bu mağaza şunu söylüyor ama şunu söyleyemiyor.” Her grup beş dakikada anlatacak.",
      { size: 13, face: H, col: BODY, h: 0.7, ls: 18 });
  cap(s, M, 6.35, 11.63, "Süre: 60 dakika çalışma + 30 dakika sunum · 4–5 kişilik gruplar · Uzlaşma beklenmiyor: anlaşmazlığın kendisi veridir.",
      { size: 11.5, face: H, italic: true, col: ACC, h: 0.4 });
  s.addNotes("Uzlaşma istemeyin. Anlaşmazlık mekânın belirsiz kaldığı yeri gösteriyor.");
}

{
  const s = slide("IX · ÖDEV", "Haftaya: üç aday marka");
  text(s, "Önümüzdeki hafta için üç aday marka bulup her biri için bir araştırma paftası hazırlayacaksınız. Üçünü de araştıracaksınız; hangisiyle devam edeceğinize kritikte birlikte karar vereceğiz.",
       { one: true, y: 1.82, h: 0.62, size: 14 });

  rule(s, M, 2.8, 5.5, "MARKA NASIL OLMALI", { col: ACC, lcol: ACCT2 });
  const yes = [
    "Küçük ve yerel — tercihen tek dükkânlı ya da hiç dükkânı olmayan",
    "Yerleşik bir tasarım dili olmayan; mağazası varsa da kimliksiz",
    "Ürünü somut ve elle tutulur — depolama ve teşhir sorunu olan",
    "Ulaşabileceğiniz bir sahibi ya da çalışanı olan",
    "Hakkında konuşulacak bir hikâyesi bulunan"
  ];
  yes.forEach((t, i) => {
    const y = 3.12 + i * 0.58;
    dot(s, M + 0.09, y + 0.15, { d: 0.11, col: ACC });
    s.addText(t, { x: M + 0.32, y: y, w: 5.18, h: 0.5, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11.5, color: BODY, lineSpacing: 14.5 });
  });

  rule(s, C2, 2.8, 5.5, "MARKA NASIL OLMAMALI", { col: MUTED });
  const no = [
    "Tasarım dili zaten belirlenmiş büyük markalar",
    "Yalnızca hizmet satan, ürünü olmayan işler",
    "Hakkında yalnızca internetten bilgi bulabileceğiniz markalar",
    "Kendi hayalinizde kurduğunuz, var olmayan markalar",
    "Geçen dönem başka bir derste çalıştığınız markalar"
  ];
  no.forEach((t, i) => {
    const y = 3.12 + i * 0.58;
    s.addText("—", { x: C2, y: y, w: 0.28, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 12, color: FAINT });
    s.addText(t, { x: C2 + 0.32, y: y, w: 5.18, h: 0.5, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11.5, color: FAINT, lineSpacing: 14.5 });
  });
  dline(s, 6.52, 2.76, 6.52, 6.1, { col: HAIR, w: 0.75 });
  cap(s, M, 6.25, 11.63, "En iyi adaylar çoğu zaman tanıdığınız birinin işidir: bir üretici, bir atölye, bir aile dükkânı. Mersin ve Çukurova'ya özgü kategorileri düşünün.",
      { size: 12.5, face: H, italic: true, col: ACC, h: 0.4 });
  s.addNotes("Narenciye, baharat, deniz malzemesi, tekstil atölyesi, zeytinyağı, sabun gibi yerel kategorileri örnekleyin.");
}

{
  const s = slide("IX · ÖDEV", "Araştırma paftasının yedi bölümü");
  text(s, "Her marka için A4 dikey bir pafta hazırlayacaksınız. İlk dördü araştırma, son üçü araştırmanın mekâna çevrilmesi. Son üç bölüm doldurulmadan pafta tamamlanmış sayılmaz.",
       { one: true, y: 1.82, h: 0.6, size: 14 });

  const parts = [
    ["Marka künyesi", "adı, yeri, kuruluş, sahibi, nasıl satıyor", 0],
    ["Ürün", "ne satılıyor, kaç çeşit, ölçüleri, kırılgan mı", 0],
    ["Ürünle ilişki ve depolama", "müşteri ürünle ne yapıyor, stok nasıl duruyor", 0],
    ["Kullanıcı", "kim geliyor, ne yapıyor, neden rahatsız oluyor", 0],
    ["Marka dili ve anahtar kelimeler", "üç kelime ve her birinin kanıtı", 1],
    ["Mekânsal karşılık", "her kelimenin karşılığı bir ilke ve bir öğe", 1],
    ["Uygunluk değerlendirmesi", "bu marka proje için neden uygun", 1]
  ];
  let y = 2.68;
  parts.forEach((pt, i) => {
    dot(s, M + 0.16, y + 0.2, { t: String(i + 1), d: 0.32, col: pt[2] ? ACC : INK, ts: 10 });
    s.addText(pt[0], { x: M + 0.56, y: y + 0.02, w: 4.1, h: 0.32, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 14.5, bold: true, color: pt[2] ? ACC : INK });
    s.addText(pt[1], { x: 5.4, y: y + 0.06, w: 5.2, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11, color: pt[2] ? ACC : MUTED });
    y += 0.54;
    if (i < 6) dline(s, M + 0.56, y - 0.1, 10.7, y - 0.1, { col: GRID, w: 0.5 });
  });
  dline(s, 11.0, 2.7, 11.0, 4.78, { col: HAIR, w: 1 });
  cap(s, 11.14, 3.42, 1.34, "ARAŞTIRMA", { size: 8.5, bold: true, col: MUTED, cs: 1.3 });
  dline(s, 11.0, 4.86, 11.0, 6.36, { col: ACC, w: 1.4 });
  cap(s, 11.14, 5.42, 1.34, "ÇEVİRİ", { size: 8.5, bold: true, col: ACC, cs: 1.3 });

  zone(s, M, 6.16, 10.0, 0.62, "", 1);
  s.addText("Teslim: üç pafta, A4 dikey, çıktı. Fotoğraf ve el çizimi serbest; kopyala-yapıştır marka metni kabul edilmez.",
    { x: M + 0.24, y: 6.25, w: 9.5, h: 0.45, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 12.5, bold: true, color: ACC });
  s.addNotes("Paftanın boş şablonu ders sonunda dağıtılacak.");
}

{
  const s = slide("IX · SONRAKİ HAFTALAR", "Önümüzdeki üç hafta");
  text(s, "Bugün öğrendiğiniz araçlar önümüzdeki haftalarda sırayla kullanılacak. Her hafta bir öncekinin üstüne biniyor; bir hafta eksik kalırsa sonraki hafta boşa gidiyor.",
       { one: true, y: 1.82, h: 0.56, size: 14 });

  const wk = [
    ["2. HAFTA", "Alan ziyareti ve marka seçimi",
     "Mersin Marina'daki proje alanını yerinde göreceğiz; ölçüler verilecek. Aynı gün üç adaydan biri seçilecek ve deneyim araştırmasına başlanacak.",
     "yanınızda: üç pafta"],
    ["3. HAFTA", "Marka anahtarı, persona, araştırma sunumu",
     "Seçilen marka için sekiz başlıklı marka anahtarı doldurulacak; üç persona ve yolculuk haritası çıkarılacak. Araştırma sunumu yapılacak (%10).",
     "yanınızda: görüşme ve gözlem notları"],
    ["4. HAFTA", "Anahtar kelime, matris ve ilk mekânsal karşılıklar",
     "Üç anahtar kelime kesinleşecek; altı modülün her biri için karşılık matrisi kurulacak. Mekânsal program ve zoning çalışılacak.",
     "yanınızda: çeviri zinciri"]
  ];
  const ww = 3.6, wg = 0.42, wy = 2.62, wh = 2.72;
  wk.forEach((w, i) => {
    const x = M + i * (ww + wg);
    zone(s, x, wy, ww, wh, "", i === 0 ? 1 : 0);
    s.addText(w[0], { x: x + 0.22, y: wy + 0.2, w: ww - 0.44, h: 0.28, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, bold: true, color: i === 0 ? ACC : MUTED, charSpacing: 1.8 });
    s.addText(w[1], { x: x + 0.22, y: wy + 0.52, w: ww - 0.44, h: 0.82, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 15, bold: true, color: i === 0 ? ACC : INK, lineSpacing: 19 });
    s.addText(w[2], { x: x + 0.22, y: wy + 1.4, w: ww - 0.44, h: 0.95, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: BODY, lineSpacing: 13.5 });
    dline(s, x + 0.22, wy + 2.34, x + ww - 0.22, wy + 2.34, { col: i === 0 ? ACC : GRID, w: 0.75 });
    s.addText(w[3], { x: x + 0.22, y: wy + 2.4, w: ww - 0.44, h: 0.26, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, bold: true, color: i === 0 ? ACC : MUTED });
    if (i < 2) arrow(s, x + ww + 0.08, wy + wh / 2, x + ww + wg - 0.08, wy + wh / 2, { col: HAIR, w: 1.25 });
  });
  cap(s, M, 5.58, 11.63, "Dördüncü haftanın sonunda elinizde savunulabilir bir konsept olacak: üç kelime, altı modülde karşılıkları ve bunları doğuran araştırma.",
      { size: 13, face: H, col: BODY, h: 0.5, ls: 18 });
  cap(s, M, 6.3, 11.63, "Araştırma, tasarımın öncesinde yapılan bir ödev değil; tasarımın kendisinin başladığı yerdir.",
      { size: 13, face: H, italic: true, col: ACC, h: 0.4 });
  s.addNotes("Kapanış cümlesi bu: araştırma tasarımın kendisidir.");
}

/* ---- kaynakça ---- */
{
  const s = slide("KAYNAKÇA", "Okuma listesi");
  text(s, "Aşağıdaki kaynaklar sunumda geçen kavramların dayandığı çalışmalardır. İlk dördü bu haftanın ödevini yaparken doğrudan işinize yarayacak.",
       { one: true, y: 1.78, h: 0.64, size: 13 });

  const refs = [
    "Bükülmez, P. S., Sunar, T. & Kuloğlu, N. (2025). Retail Design Competencies: A Framework for Integrating Brand Key Analysis and Customer Journey Mapping. The International Journal of Design Education.",
    "Stickdorn, M., Hormess, M., Lawrence, A. & Schneider, J. (2018). This Is Service Design Doing. O'Reilly.",
    "Wheeler, A. (2017). Designing Brand Identity (5. baskı). Wiley.",
    "Micheaux, A. & Bosio, B. (2019). Customer Journey Mapping as a New Way to Teach Data-Driven Marketing. Journal of Marketing Education, 41(2), 127–140.",
    "Stein, A. & Ramaseshan, B. (2016). Towards the Identification of Customer Experience Touch Point Elements. Journal of Retailing and Consumer Services, 30, 8–19.",
    "Lemon, K. N. & Verhoef, P. C. (2016). Understanding Customer Experience Throughout the Customer Journey. Journal of Marketing, 80(6), 69–96.",
    "Zomerdijk, L. G. & Voss, C. A. (2010). Service Design for Experience-Centric Services. Journal of Service Research, 13(1), 67–82.",
    "Quartier, K., Claes, S. & Vanrie, J. (2020). A Comprehensive Competence Framework for (Future) Retail Design and Retail Design Education. Eindhoven: Design Research Society.",
    "Petermans, A., Janssens, W. & Van Cleempoel, K. (2013). A Holistic Framework for Conceptualizing Customer Experiences in Retail Environments. International Journal of Design, 7(2), 1–18.",
    "Chasanidou, D., Gasparini, A. & Lee, E. (2015). Design Thinking Methods and Tools for Innovation. HCI International.",
    "Kotler, P. (1973). Atmospherics as a Marketing Tool. Journal of Retailing, 49(4), 48–64.",
    "Kahneman, D. & Fredrickson, B. L. (1993). When More Pain Is Preferred to Less: Adding a Better End. Psychological Science, 4(6), 401–405."
  ];
  refs.forEach((r, i) => {
    const x = i < 6 ? M : C2;
    const yy = 2.54 + (i % 6) * 0.72;
    dline(s, x, yy, x + 0.16, yy, { col: ACC, w: 1 });
    s.addText(r, { x: x, y: yy + 0.07, w: CW, h: 0.64, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, color: BODY, lineSpacing: 12 });
  });
  dline(s, 6.52, 2.48, 6.52, 6.8, { col: GRID, w: 0.6 });
  cap(s, M, 6.9, 10.4, "Tam künyeler ve ek okumalar ders klasöründeki kaynakça belgesinde.",
      { size: 9.5, col: FAINT, italic: true });
}

/* ---- kapanış ---- */
{
  const s = p.addSlide();
  s.background = { color: INK };
  s.addShape(p.ShapeType.line, { x: M, y: 1.35, w: 11.63, h: 0, line: { color: "3A3A42", width: 1 } });
  s.addText("Bir mağazayı tasarlamadan önce\niki şeyi bilmek gerekir:\nmarka ne söylüyor, müşteri ne yapıyor.", {
    x: M, y: 2.1, w: 11.4, h: 2.5, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 30, italic: true, color: "FFFFFF", lineSpacing: 46 });
  s.addShape(p.ShapeType.line, { x: M, y: 4.95, w: 2.4, h: 0, line: { color: ACC, width: 2 } });
  s.addText("Bugünün çalışması: mağaza okuma kâğıdı", {
    x: M, y: 5.2, w: 11.4, h: 0.36, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 13, color: DIMW });
  s.addText("Haftaya: üç aday marka, üç A4 araştırma paftası", {
    x: M, y: 5.52, w: 11.4, h: 0.36, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 13, color: DIMW });
}

p.writeFile({ fileName: "Gun1-Marka-Anahtari-ve-Musteri-Deneyimi.pptx" })
 .then(f => console.log("yazildi:", f, "| slayt:", n));
