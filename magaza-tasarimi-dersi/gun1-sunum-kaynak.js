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

/* ================= MARKA ANAHTARI (anahtar biçimi) ================= */
// I-AM Istanbul Brand Key Analysis Tool'un sadeleştirilmiş çizimi
function brandKey(s, o) {
  o = o || {};
  const hx = o.hx || 8.95, hy = o.hy || 4.35, hr = o.hr || 2.4;   // anahtar başı
  // baş çemberi
  ring(s, hx, hy, hr * 2, { col: HAIR, w: 1.25 });
  // sap: iki yatay çizgi + sol kapak
  const sy1 = hy - 0.6, sy2 = hy + 0.6;
  const meet = hx - Math.sqrt(hr * hr - 0.6 * 0.6);
  const sx = o.sx || 1.15;
  dline(s, sx, sy1, meet, sy1, { col: HAIR, w: 1.25 });
  dline(s, sx, sy2, meet, sy2, { col: HAIR, w: 1.25 });
  dline(s, sx, sy1, sx, sy2, { col: HAIR, w: 1.25 });

  // sap üzerindeki üç bileşen
  const ctxNames = o.context;
  ctxNames.forEach((t, i) => {
    const x = sx + 0.85 + i * 1.75;
    ring(s, x, hy, 1.0, { fill: PAPER, col: INK, w: 1.3 });
    s.addText(t, { x: x - 0.5, y: hy - 0.5, w: 1.0, h: 1.0, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9, bold: true, color: INK, align: "center", valign: "middle",
      lineSpacing: 11 });
  });
  cap(s, sx, hy - 1.02, 4.4, o.ctxLabel, { size: 9, bold: true, col: MUTED, cs: 2 });

  // öz
  ring(s, hx, hy, 1.3, { fill: INK, col: INK, w: 1 });
  s.addText(o.essence, { x: hx - 0.65, y: hy - 0.65, w: 1.3, h: 1.3, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 17, bold: true, color: "FFFFFF", align: "center", valign: "middle" });

  // üst ve alt üçlüler
  const place = (names, cy, fill, col, tcol) => {
    names.forEach((t, i) => {
      const x = hx - 0.95 + i * 0.95;
      ring(s, x, cy, 0.86, { fill: fill, col: col, w: 1.2 });
      s.addText(t, { x: x - 0.43, y: cy - 0.43, w: 0.86, h: 0.86, isTextBox: true, margin: 0,
        fontFace: S, fontSize: 8.5, bold: true, color: tcol, align: "center", valign: "middle",
        lineSpacing: 10 });
    });
  };
  place(o.positioning, hy - 1.18, BACKF, MUTED, BODY);
  place(o.expression, hy + 1.18, ACCT, ACC, ACC);
  cap(s, hx - hr, hy - hr - 0.21, hr * 2, o.posLabel, { size: 9, bold: true, col: MUTED, cs: 2, align: "center" });
  cap(s, hx - hr, hy + hr + 0.04, hr * 2, o.expLabel, { size: 9, bold: true, col: ACC, cs: 2, align: "center" });
}

/* ================= MÜŞTERİ YOLCULUĞU ÇEMBERİ ================= */
// items: [ad, durum]  durum 0 = dışarıda, 1 = aynen alındı, 2 = yeniden tanımlandı
function journeyCircle(s, cx, cy, rx, ry, items, centre, o) {
  o = o || {};
  const nd = items.length, nr = o.nr || 0.6;
  const pts = items.map((it, i) => {
    const a = i * 2 * Math.PI / nd;
    return [cx + rx * Math.sin(a), cy - ry * Math.cos(a), a];
  });
  // merkez
  ring(s, cx, cy, o.cr || 2.0, { col: GRID, w: 1 });
  s.addText(centre, { x: cx - 1.0, y: cy - 0.42, w: 2.0, h: 0.84, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 16, bold: true, color: INK, align: "center", valign: "middle",
    lineSpacing: 20 });

  items.forEach((it, i) => {
    const [x, y, a] = pts[i];
    const st = it[1];
    const col = st === 0 ? DIMW : ACC;
    if (st === 2) ring(s, x, y, nr + 0.18, { col: ACC, w: 1, dash: "dash" });
    ring(s, x, y, nr, { fill: st === 0 ? PAPER : (st === 1 ? ACCT : PAPER), col: col, w: 1.4 });
    s.addText(String(i + 1), { x: x - nr / 2, y: y - nr / 2, w: nr, h: nr, isTextBox: true,
      margin: 0, fontFace: H, fontSize: 15, bold: true, color: col,
      align: "center", valign: "middle" });

    const sn = Math.sin(a), cs2 = Math.cos(a);
    const off = nr / 2 + 0.13;
    const lw2 = o.lw || 1.55;
    if (Math.abs(sn) < 0.3) {                          // tam üst / tam alt
      const up = cs2 > 0;
      s.addText(it[0], { x: x - lw2 / 2, y: up ? y - off - 0.34 : y + off, w: lw2, h: 0.32,
        isTextBox: true, margin: 0, fontFace: H, fontSize: o.fs || 13, bold: true,
        color: st === 0 ? MUTED : INK, align: "center", valign: up ? "bottom" : "top" });
    } else {
      const right = sn > 0;
      s.addText(it[0], { x: right ? x + off : x - off - lw2, y: y - 0.17, w: lw2, h: 0.34,
        isTextBox: true, margin: 0, fontFace: H, fontSize: o.fs || 13, bold: true,
        color: st === 0 ? MUTED : INK, align: right ? "left" : "right", valign: "middle" });
    }
  });
  return pts;
}

/* ================= DİKEY AKIŞ OMURGASI ================= */
// steps: [ad, altbaşlık, [yan etiketler]]
function spine(s, x, y, steps, o) {
  o = o || {};
  const bw = o.bw || 2.9, bh = o.bh || 0.72, gap = o.gap || 0.42;
  steps.forEach((st, i) => {
    const yy = y + i * (bh + gap);
    const hi = o.hi === i;
    zone(s, x, yy, bw, bh, "", hi ? 1 : 0);
    s.addText(st[0], { x: x + 0.16, y: yy + 0.08, w: bw - 0.32, h: 0.32, isTextBox: true,
      margin: 0, fontFace: H, fontSize: 14, bold: true, color: hi ? ACC : INK });
    if (st[1]) s.addText(st[1], { x: x + 0.16, y: yy + 0.4, w: bw - 0.32, h: 0.26,
      isTextBox: true, margin: 0, fontFace: S, fontSize: 9.5, color: hi ? ACC : MUTED });
    if (i < steps.length - 1) arrow(s, x + bw / 2, yy + bh + 0.04, x + bw / 2, yy + bh + gap - 0.04,
      { col: ACC, w: 1.4 });
    // yan etiketler
    if (st[2] && st[2].length) {
      dline(s, x + bw, yy + bh / 2, x + bw + 0.3, yy + bh / 2, { col: HAIR, w: 1 });
      let px = x + bw + 0.38;
      st[2].forEach(t => {
        const w = 0.075 * t.length + 0.3;
        pill(s, px, yy + bh / 2 - 0.17, w, 0.34, t, { fill: ACCT, size: 9.5 });
        px += w + 0.14;
      });
    }
  });
  return y + steps.length * (bh + gap) - gap;
}

/* ============================ KAPAK ============================ */
{
  const s = p.addSlide();
  s.background = { color: INK };
  s.addShape(p.ShapeType.line, { x: M, y: 1.25, w: 11.63, h: 0, line: { color: "3A3A42", width: 1 } });
  s.addText("MAĞAZA TASARIMI PROJE STÜDYOSU · 1. HAFTA", {
    x: M, y: 1.45, w: 11.4, h: 0.3, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 10.5, bold: true, color: ACC, charSpacing: 3.2 });
  s.addText("Bir marka nasıl\nmağazaya dönüşür?", {
    x: M, y: 2.05, w: 11.4, h: 2.15, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 48, bold: true, color: "FFFFFF", lineSpacing: 60 });
  s.addShape(p.ShapeType.line, { x: M, y: 4.5, w: 2.4, h: 0, line: { color: ACC, width: 2 } });
  s.addText("Marka anahtarı · Persona · Müşteri yolculuğu", {
    x: M, y: 4.78, w: 10.2, h: 0.4, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 19, color: DIMW });
  s.addText("Kullanılan modeller: I-AM Istanbul (2018) · Bükülmez vd. (2025)", {
    x: M, y: 6.5, w: 11.4, h: 0.3, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 9.5, color: MUTED });
}

/* ---- altı soru ---- */
{
  const s = slide("YOL HARİTASI", "Bu dersin cevapladığı altı soru");
  text(s, "Bugün ilk dördünü öğreneceğiz. Her soru bir sonrakinin girdisini üretir.",
       { one: true, y: 1.86, h: 0.34, size: 15 });

  const qs = [
    "Bir markanın kimliği nasıl okunur?",
    "Markanın kimliği nasıl çıkarılır?",
    "Persona nasıl anlaşılır?",
    "Müşteri yolculuğu nasıl haritalanır?",
    "Anahtar kelimeler nasıl belirlenir?",
    "Bu kelimeler mekâna nasıl dönüşür?"
  ];
  qs.forEach((q, i) => {
    const y = 2.62 + i * 0.7;
    s.addText(String(i + 1).padStart(2, "0"), { x: M, y: y - 0.06, w: 0.7, h: 0.48, isTextBox: true,
      margin: 0, fontFace: H, fontSize: 26, bold: true, color: ACCT2 });
    s.addText(q, { x: M + 0.85, y: y, w: 8.5, h: 0.4, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 20, bold: true, color: INK });
    dline(s, M + 0.85, y + 0.52, 11.4, y + 0.52, { col: GRID, w: 0.75 });
  });
  cap(s, M, 6.9, 11.0, "Kimlik → kelime → mekân. Bu zincire çeviri zinciri diyoruz.",
      { size: 11.5, face: H, italic: true, col: ACC });
  s.addNotes("Bu slaytı dönem boyunca tekrar açın; öğrenci hangi soruda olduğunu bilsin.");
}

/* ---- bugünün akışı ---- */
{
  const s = slide("BUGÜN", "Sekiz saati nasıl geçireceğiz");

  const steps = [
    ["1. saat", "Proje brifi", "ders akışı ve teslimler"],
    ["2–3. saat", "Bu sunum", "araçları öğreniyoruz"],
    ["4. saat", "Mağaza okuma", "bireysel analiz"],
    ["5–7. saat", "Grup çalışması", "okumaları karşılaştırma"],
    ["8. saat", "Ödev", "üç aday marka"]
  ];
  steps.forEach((st, i) => {
    const y = 2.1 + i * 0.82;
    const hi = i === 2 || i === 3;
    dot(s, M + 0.14, y + 0.26, { d: hi ? 0.28 : 0.18, col: hi ? ACC : DIMW });
    if (i < 4) dline(s, M + 0.14, y + 0.42, M + 0.14, y + 0.82, { col: HAIR, w: 1 });
    s.addText(st[0], { x: M + 0.5, y: y + 0.08, w: 1.5, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11, bold: true, color: hi ? ACC : MUTED });
    s.addText(st[1], { x: M + 2.1, y: y, w: 3.4, h: 0.4, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 19, bold: true, color: hi ? ACC : INK });
    s.addText(st[2], { x: M + 5.6, y: y + 0.08, w: 4.5, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 12, color: MUTED });
  });
  rule(s, M, 6.36, 11.63, "GÜN SONUNDA ELİNİZDE");
  cap(s, M, 6.56, 11.0, "Doldurulmuş bir mağaza okuma kâğıdı, üç anahtar kelime ve haftaya teslim edilecek ödev.",
      { size: 13.5, face: H, col: BODY, h: 0.4 });
  s.addNotes("Saatler kesin değil, sıra kesin. Gruplar için masaları yeniden dizmeye on dakika ayırın.");
}

/* ---- bu araçlar nereden geliyor: akış şeması ---- */
{
  const s = slide("ÇERÇEVE", "Bu araçlar nereden geliyor?");
  text(s, "Aşağıdaki kurgu, altmış dokuz öğrenciyle yürütülmüş on dört haftalık bir mağaza tasarımı stüdyosundan geliyor. Araçlar profesyonel bir deneyim tasarımı ajansıyla birlikte geliştirildi ve sonuçları ölçüldü.",
       { one: true, y: 1.86, h: 0.62, size: 14 });

  zone(s, M, 2.7, 2.6, 0.5, "Proje brifi", 0, 11);
  zone(s, M, 3.3, 2.6, 0.5, "Deneyim atölyesi", 0, 11);
  arrow(s, M + 2.68, 2.95, 3.9, 3.3, { col: ACC, w: 1.3 });
  arrow(s, M + 2.68, 3.55, 3.9, 3.42, { col: ACC, w: 1.3 });

  spine(s, 4.0, 3.1, [
    ["Mağaza tasarımı projesi", "on dört hafta", []],
    ["Vize 1", "analiz ve konsept", ["Marka analizi", "Müşteri profili"]],
    ["Vize 2", "somutlaştırma", ["Çekim", "Eşik", "Ürün", "Organizasyon", "Yönelme"]],
    ["Final", "detay", ["Tüm bileşenler"]]
  ], { bw: 2.9, bh: 0.62, gap: 0.34 });

  cap(s, M, 6.55, 11.63, "Sizin dönem kurgunuz da bu akışı izliyor: önce marka ve müşteri, sonra mekân, en son detay.",
      { size: 13, face: H, italic: true, col: ACC, h: 0.4 });
  src(s, "Bükülmez, Sunar & Kuloğlu (2025), Şekil 2'den uyarlanmıştır.");
  s.addNotes("Yan etiketler, o jüride hangi konunun ölçüldüğünü gösteriyor. Bu slayt dersin haritası.");
}

/* ============================ I · KİMLİK OKUMA ============================ */
opener("I", "Markanın kimliği nasıl okunur?", "Marka bir logo değil, bir vaattir. Vaadi okumak için nereye bakılır?");

{
  const s = slide("I · KİMLİK", "Markanın görünmeyen tarafı");
  text(s, "Bir markanın görünen yüzü küçüktür: adı, logosu, rengi. Bunlar markayı tanıtır ama açıklamaz. Tasarımcının malzemesi alttaki katmandır.",
       { one: true, y: 1.86, h: 0.62, size: 15 });

  nest(s, 2.4, 2.7, 8.5, 3.5, [
    ["GÖRÜNEN — logo, renk, ambalaj"],
    ["DAVRANIŞ — nasıl satıyor, nasıl konuşuyor"],
    ["İNANÇ — neye değer veriyor, kime sesleniyor"],
    ["ÖZ — tek cümleyle ne vaat ediyor"]
  ], { step: 0.55 });

  cap(s, M, 6.5, 11.63, "Yazılamayan bir marka mekâna da çevrilemez.",
      { size: 15, face: H, italic: true, col: ACC, h: 0.45, align: "center" });
  s.addNotes("Küçük markada bu katmanlar sahibinin kafasındadır; öğrenci görüşerek çıkarmak zorunda.");
}

{
  const s = qslide("I · KİMLİK", "Kimlik nereden okunur?");
  text(s, "Kimlik tahminle değil kanıtla çıkarılır. Altı kaynağa bakın; ikisi çelişiyorsa marka hakkında bir şey öğrenmiş olursunuz.",
       { one: true, y: 1.86, h: 0.62, size: 15 });

  const srcs = [
    ["Ürünün kendisi", "malzeme, ölçü, kırılganlık"],
    ["Ambalaj ve etiket", "hangi dille yazılmış"],
    ["Var olan dükkân", "neyi çözmüş, neyi çözememiş"],
    ["Müşteri yorumları", "neyi övüyor, neden şikâyet ediyor"],
    ["Rakipler", "yan yana konduğu üç marka"],
    ["Sahibin anlatısı", "\"biz aslında...\" cümlesi"]
  ];
  const sw = 3.6, sg = 0.42;
  srcs.forEach((it, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = M + col * (sw + sg), y = 2.72 + row * 1.5;
    dline(s, x, y, x + sw, y, { col: ACC, w: 1.25 });
    dot(s, x + 0.16, y + 0.4, { t: String(i + 1), d: 0.3, col: ACC, ts: 10 });
    s.addText(it[0], { x: x + 0.46, y: y + 0.22, w: sw - 0.46, h: 0.34, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 16, bold: true, color: INK });
    s.addText(it[1], { x: x, y: y + 0.66, w: sw, h: 0.4, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11, color: MUTED, lineSpacing: 13.5 });
  });
  cap(s, M, 5.95, 11.63, "En işe yarar soru sahibine sorulur: bu işi yaparken neyi reddediyorsunuz? Bir markayı, yapmadığı şey tarif eder.",
      { size: 14, face: H, italic: true, col: ACC, h: 0.5 });
  img(s, "seçtiğiniz bir yerel markanın ürün ve ambalaj fotoğrafı bu slaytta örnek olarak gösterilebilir.");
  s.addNotes("Altı kaynağı tahtaya yazın; ödevin birinci adımı bunları toplamak.");
}

{
  const s = slide("I · KİMLİK", "Marka sahibine sorulacak sekiz soru");
  text(s, "Bu sorular ödevin ilk adımı. Cevaplar not alınacak ve paftaya girecek.",
       { one: true, y: 1.86, h: 0.34, size: 15 });

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
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * 5.95, y = 2.6 + row * 1.02;
    s.addText(String(i + 1).padStart(2, "0"), { x: x, y: y - 0.02, w: 0.62, h: 0.4, isTextBox: true,
      margin: 0, fontFace: H, fontSize: 22, bold: true, color: ACCT2 });
    s.addText(q, { x: x + 0.72, y: y, w: 4.6, h: 0.42, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 16, color: BODY, lineSpacing: 20 });
    dline(s, x + 0.72, y + 0.66, x + 5.33, y + 0.66, { col: GRID, w: 0.75 });
  });
  cap(s, M, 6.7, 11.63, "Üçüncü soru en çok işe yarayanıdır.",
      { size: 13, face: H, italic: true, col: ACC, h: 0.4 });
  s.addNotes("Öğrenciler bu sekiz soruyu telefonlarına kaydetsin.");
}

/* ============================ II · MARKA ANAHTARI ============================ */
opener("II", "Markanın kimliği nasıl çıkarılır?", "Okuduğunuz kimliği yazıya dökmenin adı marka anahtarıdır.");

{
  const s = slide("II · MARKA ANAHTARI", "Marka anahtarı: on bileşen, tek öz");
  text(s, "Marka anahtarı, bir markayı belirli başlıklar altında tanımlayan bir şablondur. Üç grupta okunur.",
       { one: true, x: M, w: 5.3, y: 1.84, h: 0.62, size: 13.5, ls: 20 });

  brandKey(s, {
    hx: 8.95, hy: 4.2, hr: 2.0, sx: 1.4,
    context: ["REKABET", "HEDEF\nKİTLE", "HEDEFLER"],
    ctxLabel: "BAĞLAM",
    positioning: ["MİSYON", "DEĞERLER", "FAYDALAR"],
    posLabel: "KONUMLANDIRMA",
    expression: ["TON", "GÖRÜNÜM", "KİŞİLİK"],
    expLabel: "İFADE",
    essence: "ÖZ"
  });

  cap(s, M, 6.62, 11.0, "Öz en son yazılır: markanın kendi iddiası değil, müşterinin markayı nasıl anlattığıdır.",
      { size: 12.5, face: H, italic: true, col: ACC, h: 0.3 });
  cap(s, M, 6.94, 8.5, "Kaynak: I-AM Istanbul, Brand Key Analysis Tool (2018).",
      { size: 8.5, col: FAINT, italic: true });
  s.addNotes("Bu diyagram makaledeki Şekil 1a'nın Türkçeleştirilmiş hâli. Öz'ün en son yazıldığını vurgulayın.");
}

{
  const s = slide("II · MARKA ANAHTARI", "Her bileşen bir soruya cevap verir");

  const groups = [
    ["BAĞLAM", "dışarıdan gelen", [
      ["Rekabet", "Müşteri bu markayı hangi üç seçenekle yan yana koyuyor?"],
      ["Hedef kitle", "Kime sesleniyor? Yaşla değil, davranışla tarif edin."],
      ["Hedefler", "İki-üç yıl içinde nereye varmak istiyor?"]]],
    ["KONUMLANDIRMA", "markanın kendi tanımı", [
      ["Misyon", "Bu marka neden var?"],
      ["Değerler", "Neye değer veriyor, neyi reddediyor?"],
      ["Faydalar", "Ürün ne işe yarıyor, insanı ne hissettiriyor?"]]],
    ["İFADE", "nasıl göründüğü ve konuştuğu", [
      ["Ton", "Müşteriyle nasıl bir dille konuşuyor?"],
      ["Görünüm", "Malzemesi, rengi, dokusu ne?"],
      ["Kişilik", "Bu marka bir insan olsa nasıl biri olurdu?"]]]
  ];
  let y = 2.0;
  groups.forEach((g, gi) => {
    s.addText(g[0], { x: M, y: y, w: 2.0, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, bold: true, color: ACC, charSpacing: 1.8 });
    s.addText(g[1], { x: M, y: y + 0.28, w: 2.0, h: 0.42, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, color: FAINT, italic: true, lineSpacing: 11.5 });
    dline(s, M, y - 0.1, R, y - 0.1, { col: gi === 0 ? HAIR : GRID, w: gi === 0 ? 1 : 0.6 });
    g[2].forEach((it, i) => {
      const yy = y + i * 0.42;
      s.addText(it[0], { x: 3.1, y: yy, w: 1.9, h: 0.3, isTextBox: true, margin: 0,
        fontFace: H, fontSize: 14, bold: true, color: INK });
      s.addText(it[1], { x: 5.15, y: yy + 0.02, w: 7.33, h: 0.3, isTextBox: true, margin: 0,
        fontFace: S, fontSize: 12, color: BODY });
    });
    y += 1.42;
  });
  dline(s, M, y - 0.1, R, y - 0.1, { col: GRID, w: 0.6 });
  zone(s, M, y + 0.06, FW, 0.62, "", 1);
  s.addText("ÖZ", { x: M + 0.24, y: y + 0.14, w: 0.5, h: 0.28, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 9.5, bold: true, color: ACC, charSpacing: 1.5 });
  s.addText("Müşteri bu markayı başkasına nasıl anlatıyor?", { x: M + 0.9, y: y + 0.1, w: 10.4, h: 0.44,
    isTextBox: true, margin: 0, fontFace: H, fontSize: 15, bold: true, color: ACC });
  s.addNotes("Doldurulamayan başlık, araştırmanın eksik kaldığı yeri gösterir.");
}

{
  const s = slide("II · MARKA ANAHTARI", "Doldurulmuş örnek: küçük bir kahve kavurucusu");
  text(s, "Tek dükkânlı, kendi çekirdeğini kavuran, henüz tasarım dili olmayan bir kahveci.",
       { one: true, y: 1.86, h: 0.34, size: 15 });

  const ex = [
    ["Rekabet", "Zincirler değil, semtteki üç küçük kavurucu."],
    ["Hedef kitle", "Tarif ederek soran, bekleyebilen müşteri."],
    ["Hedefler", "İki yıl içinde kavurmayı gösteren ikinci dükkân."],
    ["Misyon", "İnsanın ne içtiğini bilmesini sağlamak."],
    ["Değerler", "Meraklı, sabırlı; öğretmeyi seviyor."],
    ["Faydalar", "Taze çekirdek; ne aldığını anlama duygusu."],
    ["Ton", "El yazısı etiket, az söz, tarih yazan fiş."],
    ["Görünüm", "Ham metal, açık ahşap, cam kavanoz."],
    ["Kişilik", "Anlatmayı seven ama satmaya çalışmayan usta."]
  ];
  ex.forEach((e, i) => {
    const col = Math.floor(i / 3);
    const x = M + col * 3.95;
    const y = 2.55 + (i % 3) * 0.92;
    s.addText(e[0], { x: x, y: y, w: 3.6, h: 0.28, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, bold: true, color: ACC, charSpacing: 1.4 });
    s.addText(e[1], { x: x, y: y + 0.3, w: 3.6, h: 0.56, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13.5, color: BODY, lineSpacing: 17 });
  });
  dline(s, 4.6, 2.5, 4.6, 5.2, { col: GRID, w: 0.6 });
  dline(s, 8.55, 2.5, 8.55, 5.2, { col: GRID, w: 0.6 });

  zone(s, M, 5.5, FW, 0.85, "", 1);
  s.addText("ÖZ", { x: M + 0.25, y: 5.64, w: 0.6, h: 0.3, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 9.5, bold: true, color: ACC, charSpacing: 1.5 });
  s.addText("“Kahveyi saklamayan, gösteren dükkân.”", { x: M + 1.0, y: 5.6, w: 10.3, h: 0.5,
    isTextBox: true, margin: 0, fontFace: H, fontSize: 20, italic: true, bold: true, color: ACC });
  cap(s, M, 6.55, 11.63, "Bu cümle zaten bir mekân kararıdır: üretim görünür olmalı.",
      { size: 13.5, face: H, col: BODY, h: 0.4 });
  s.addNotes("Öz cümlesinin doğrudan bir mekân kararı ürettiğine dikkat çekin — slaytın bütün amacı bu.");
}

/* ============================ III · PERSONA ============================ */
opener("III", "Persona nasıl anlaşılır?", "Hedef kitle bir istatistik değil; tek bir insanın gününde görünür hâle gelmesidir.");

{
  const s = slide("III · PERSONA", "Persona nedir, neden üç tane?");
  text(s, "Persona, hedef kitleyi tek bir kişide somutlaştırmaktır. Amacı, tasarım kararlarını gerçek bir ihtiyaca bağlamak. Stüdyoda üç persona istenir; biri ana persona olur.",
       { one: true, y: 1.86, h: 0.62, size: 15 });

  const three = [
    ["ANA PERSONA", "Markanın asıl seslendiği kişi.", "mekânı bu kişi belirler"],
    ["İKİNCİ PERSONA", "Aynı ürünü farklı bir nedenle alan kişi.", "esnekliği bu kişi sınar"],
    ["ÜÇÜNCÜ PERSONA", "Refakatçi: çocuk, eş, kurye, tedarikçi.", "eksikleri bu kişi gösterir"]
  ];
  const tw = 3.6, tg = 0.42;
  three.forEach((t, i) => {
    const x = M + i * (tw + tg);
    zone(s, x, 2.68, tw, 1.65, "", i === 0 ? 1 : 0);
    s.addText(t[0], { x: x + 0.22, y: 2.86, w: tw - 0.44, h: 0.28, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, bold: true, color: i === 0 ? ACC : MUTED, charSpacing: 1.6 });
    s.addText(t[1], { x: x + 0.22, y: 3.2, w: tw - 0.44, h: 0.7, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 14, color: i === 0 ? ACC : BODY, lineSpacing: 18 });
    s.addText(t[2], { x: x + 0.22, y: 3.94, w: tw - 0.44, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, color: i === 0 ? ACC : FAINT, italic: true });
  });

  rule(s, M, 4.75, 11.63, "PERSONA NE YAZAR");
  cap(s, M, 4.95, 11.63, "Yaş ve gelir bir mekân kararı üretmez. İşe yarayan persona kişinin ne yaptığını anlatır:",
      { size: 14, face: H, col: BODY, h: 0.4 });
  const good = [
    ["İşten çıkınca uğruyor, on dakikası var", "kalma süresi"],
    ["Ürünü eline almadan karar vermiyor", "dokunma izni"],
    ["Soru sormayı sevmiyor, etiketten okuyor", "bilgi katmanı"],
    ["Yanında çocuk ya da poşetle geliyor", "koridor genişliği"]
  ];
  good.forEach((g, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * 5.95, y = 5.48 + row * 0.5;
    dot(s, x + 0.09, y + 0.15, { d: 0.11, col: ACC });
    s.addText(g[0], { x: x + 0.3, y: y, w: 3.6, h: 0.32, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 12, color: BODY });
    s.addText("→ " + g[1], { x: x + 3.95, y: y + 0.01, w: 1.6, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: ACC, italic: true });
  });
  cap(s, M, 6.6, 11.63, "Kural: bir madde bir tasarım kararını değiştirmiyorsa personaya ait değildir.",
      { size: 13, face: H, italic: true, col: ACC, h: 0.4 });
  s.addNotes("Üçüncü persona vurgusu önemli: refakatçi, mekânda en çok atlanan kullanıcıdır.");
}

{
  const s = qslide("III · PERSONA", "Persona nasıl çıkarılır?");
  text(s, "Persona anket doldurtarak değil, gözlemle çıkar. Üç yöntem var; üçü de bir hafta içinde tek başına uygulanabilir.",
       { one: true, y: 1.86, h: 0.62, size: 15 });

  const mets = [
    ["Hizmet safarisi", "Kendiniz müşteri olursunuz: alışverişi baştan sona yaşar, her adımda ne hissettiğinizi not edersiniz.",
     "yolculuğu kendi üzerinizde yaşarsınız"],
    ["Yerinde gözlem", "Mağazada durup insanları izlersiniz: nereye bakıyor, nerede duraklıyor, neye dokunuyor?",
     "insanların gerçekte ne yaptığını verir"],
    ["Bağlamsal görüşme", "Müşteriyle mekânın içinde konuşursunuz. Sorular yaşanan ana bağlı olduğu için cevaplar somuttur.",
     "davranışın nedenini verir"]
  ];
  const mw = 3.6, mg = 0.42, my = 2.72, mh = 2.75;
  mets.forEach((m, i) => {
    const x = M + i * (mw + mg);
    zone(s, x, my, mw, mh, "", i === 1 ? 1 : 0);
    dot(s, x + 0.46, my + 0.46, { t: String(i + 1), d: 0.34, col: i === 1 ? ACC : INK, ts: 12 });
    s.addText(m[0], { x: x + 0.24, y: my + 0.82, w: mw - 0.48, h: 0.34, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 16.5, bold: true, color: i === 1 ? ACC : INK });
    s.addText(m[1], { x: x + 0.24, y: my + 1.24, w: mw - 0.48, h: 1.0, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11, color: BODY, lineSpacing: 14 });
    dline(s, x + 0.24, my + 2.3, x + mw - 0.24, my + 2.3, { col: i === 1 ? ACC : GRID, w: 0.75 });
    s.addText(m[2], { x: x + 0.24, y: my + 2.37, w: mw - 0.48, h: 0.32, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, bold: true, color: i === 1 ? ACC : MUTED, lineSpacing: 12 });
  });
  cap(s, M, 5.75, 11.63, "Üçü birlikte kullanıldığında birbirini doğrular. Gözlem yazıya ve fotoğrafa dökülmeli; hatırlanan gözlem, gözlem sayılmaz.",
      { size: 13.5, face: H, col: BODY, h: 0.5, ls: 18 });
  src(s, "Stickdorn vd. (2018); Micheaux & Bosio (2019).");
  s.addNotes("İkinci hafta alan ziyaretinde en az iki yöntemi uygulamalarını isteyin.");
}

/* ============================ IV · YOLCULUK ============================ */
opener("IV", "Müşteri yolculuğu nasıl haritalanır?", "Deneyim bir bütün değil, sıralı anlardır. Haritanın işi o anları ayırmaktır.");

{
  const s = slide("IV · YOLCULUK", "Müşteri yolculuğu: sekiz adım");
  journeyCircle(s, 6.665, 4.3, 3.85, 1.58, [
    ["Farkındalık", 0],
    ["Çekim", 1],
    ["Eşik", 1],
    ["Yönelme", 1],
    ["Gezinme", 1],
    ["Etkileşim", 2],
    ["Satın alma", 2],
    ["Ayrılma", 0]
  ], "MÜŞTERİ\nYOLCULUĞU", { nr: 0.6, lw: 1.5, fs: 13, cr: 1.9 });

  cap(s, M, 6.72, 11.0, "Dolu daireler bizim tasarladığımız adımlar. Kesikli halkalı ikisi iç mekân için yeniden tanımlandı; soluk ikisi pazarlamanın işi.",
      { size: 12, face: H, italic: true, col: BODY, h: 0.3 });
  cap(s, M, 7.04, 8.5, "Kaynak: I-AM Istanbul, Customer Journey Mapping Tool (2018).",
      { size: 8.5, col: FAINT, italic: true });
  s.addNotes("Bu diyagram makaledeki Şekil 1b'nin Türkçeleştirilmiş hâli.");
}

{
  const s = slide("IV · YOLCULUK", "İç mimarlığın tasarladığı altı modül");
  text(s, "Farkındalık ve ayrılma çıkarıldı; etkileşim ve satın alma, mağazanın içindeki işlere göre yeniden adlandırıldı. Kalan altı modül dönem boyunca projenizin okunma biçimi.",
       { one: true, y: 1.82, h: 0.62, size: 14 });

  const mods = [
    ["Çekim", "Mağaza sokakta nasıl fark edilir?", "konum · cephe · vitrin"],
    ["Eşik", "İlk izlenim nasıl kurulur?", "karşılama · atmosfer · giriş–çıkış"],
    ["Ürün ve hizmetler", "Ürün nerede teşhir edilir, nerede denenir?", "teşhir · deneme · oturma"],
    ["Organizasyonel ihtiyaçlar", "Mağaza nasıl çalışır?", "kasa · kasa arkası · depo"],
    ["Yönelme", "Müşteri kaybolmadan nasıl dolaşır?", "dolaşım · yönlendirme · görüş hatları"],
    ["Gezinme", "Kategoriler arasında nasıl geçilir?", "kategori · bilgi · dijital deneyim"]
  ];
  let y = 2.82;
  mods.forEach((m, i) => {
    dot(s, M + 0.16, y + 0.24, { t: String(i + 1), d: 0.34, col: ACC, ts: 11 });
    s.addText(m[0], { x: M + 0.56, y: y + 0.04, w: 2.9, h: 0.34, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 15, bold: true, color: INK });
    s.addText(m[1], { x: 4.35, y: y + 0.06, w: 4.2, h: 0.34, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13, italic: true, color: ACC });
    s.addText(m[2], { x: 8.8, y: y + 0.08, w: 3.68, h: 0.32, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11, color: MUTED });
    y += 0.68;
    if (i < 5) dline(s, M + 0.56, y - 0.12, R, y - 0.12, { col: GRID, w: 0.5 });
  });
  cap(s, M + 0.56, 2.54, 2.9, "MODÜL", { size: 8.5, bold: true, col: FAINT, cs: 1.5 });
  cap(s, 4.35, 2.54, 4.2, "SORUSU", { size: 8.5, bold: true, col: FAINT, cs: 1.5 });
  cap(s, 8.8, 2.54, 3.68, "MEKÂNDA KARŞILIĞI", { size: 8.5, bold: true, col: FAINT, cs: 1.5 });
  dline(s, M, 2.78, R, 2.78, { col: HAIR, w: 1 });
  cap(s, M, 6.98, 11.0, "Jüriler bu altı modül üzerinden okunacak.",
      { size: 13, face: H, italic: true, col: ACC, h: 0.4 });
  s.addNotes("Bu slayt vize 2 ve final değerlendirmesinin doğrudan karşılığı.");
}

{
  const s = slide("IV · YOLCULUK", "Deneyim kaça bölünür? Farklı okumalar var");
  text(s, "Literatürde tek bir cevap yok: kimi altıya, kimi yediye, kimi sekize ayırıyor. Önemli olan sayı değil, neyin ayrıldığı.",
       { one: true, y: 1.82, h: 0.62, size: 14 });

  const tracks = [
    ["Wheeler (2017)", "marka deneyiminin bileşenleri", 6,
     ["İmaj ve\nkimlik", "Ürün ve\nhizmet", "İnsan ve\nkültür", "Satış\nsüreçleri", "Fiziksel ve\nsanal mekân", "Farkındalık"], [4]],
    ["Stein & Ramaseshan (2016)", "temas noktası türleri", 7,
     ["Atmosferik", "Teknolojik", "İletişimsel", "Süreç", "Çalışan–\nmüşteri", "Müşteri–\nmüşteri", "Ürünle\netkileşim"], [0, 1, 2]],
    ["I-AM Istanbul (2018)", "müşteri yolculuğu adımları", 8,
     ["Farkındalık", "Çekim", "Eşik", "Yönelme", "Gezinme", "Etkileşim", "Satın alma", "Ayrılma"], [1, 2, 3, 4, 5, 6]],
    ["Bu ders", "iç mekâna uyarlanmış modüller", 6,
     ["Çekim", "Eşik", "Ürün ve\nhizmetler", "Organizasyonel\nihtiyaçlar", "Yönelme", "Gezinme"], [0, 1, 2, 3, 4, 5]]
  ];
  let ty = 2.72;
  tracks.forEach((t, i) => {
    s.addText(t[0], { x: M, y: ty, w: 2.8, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13, bold: true, color: i === 3 ? ACC : INK });
    s.addText(t[1], { x: M, y: ty + 0.28, w: 2.8, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, color: MUTED, italic: true });
    s.addText(String(t[2]), { x: 3.72, y: ty - 0.02, w: 0.42, h: 0.42, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 21, bold: true, color: ACCT2, align: "right" });
    ribbon(s, 4.3, ty + 0.03, 8.18, 0.54, t[3], { hi: t[4], fs: 8, gap: 0.07 });
    ty += 0.92;
    if (i < 3) dline(s, M, ty - 0.14, R, ty - 0.14, { col: GRID, w: 0.5 });
  });
  cap(s, M, 6.5, 11.63, "Koyu parçalar iç mimarlığın tasarladığı bölümler. Dördü de aynı şeyi söylüyor: deneyimin büyük kısmı mekânda geçiyor.",
      { size: 13, face: H, col: BODY, h: 0.45 });
  s.addNotes("'Kaç parça' sorusunun doğru cevabı yok; hangi ayrımın işe yaradığı var.");
}

{
  const s = slide("IV · YOLCULUK", "Öğrenciler hangi modülde zorlanıyor?");
  text(s, "Aynı çerçevenin uygulandığı stüdyoda otuz proje, dört değerlendirici tarafından bu altı modül üzerinden puanlandı.",
       { one: true, y: 1.82, h: 0.36, size: 14 });

  bars(s, M, 2.9, 7.1, [
    ["Yönelme", 3.46],
    ["Gezinme", 3.41],
    ["Ürün ve hizmetler", 3.26],
    ["Eşik", 3.20],
    ["Çekim", 2.88],
    ["Organizasyonel ihtiyaçlar", 2.84]
  ], { max: 5, bh: 0.36, gap: 0.24, lw: 2.65, ref: 3.17, refLabel: "ortalama 3,17" });
  dline(s, 8.25, 2.6, 8.25, 6.5, { col: HAIR, w: 0.75 });
  rule(s, 8.6, 2.75, 3.88, "BUNDAN NE ÇIKIYOR", { col: ACC, lcol: ACCT2 });
  const ins = [
    "En zayıf iki modül: çekim ve organizasyonel ihtiyaçlar.",
    "Analiz fazı güçlü, mekâna dönüşme fazı zayıf.",
    "En düşük tek başlık: mağaza içi yönlendirme."
  ];
  ins.forEach((t, i) => {
    const y = 3.08 + i * 0.86;
    dot(s, 8.72, y + 0.14, { d: 0.12, col: ACC });
    s.addText(t, { x: 8.94, y: y - 0.02, w: 3.54, h: 0.72, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13, color: BODY, lineSpacing: 17 });
  });
  zone(s, 8.6, 5.7, 3.88, 0.8, "", 1);
  cap(s, 8.8, 5.82, 3.48, "Bu yüzden 7., 8. ve 10. haftalarda vitrin, ergonomi ve ışık atölyeleri var.",
      { size: 11, face: H, col: ACC, ls: 14, h: 0.6 });
  src(s, "Ölçek: 1 = hiç katılmıyorum, 5 = tamamen katılıyorum · Veri: Bükülmez vd. (2025), Tablo 2.");
  s.addNotes("Bu slayt dersin kurgusunu meşrulaştırıyor: atölyeler keyfî değil.");
}

/* ============================ V · ANAHTAR KELİME ============================ */
opener("V", "Anahtar kelimeler nasıl belirlenir?", "Araştırmadan çıkan onlarca sıfattan ayakta kalan üç kelime.");

{
  const s = qslide("V · ANAHTAR KELİME", "Üç aşamalı eleme");
  text(s, "Ham listeniz uzun olsun; eleme sert olsun. Sonunda üç kelime kalmalı.",
       { one: true, y: 1.86, h: 0.34, size: 15 });

  const levels = [
    [10.2, "Markayla ilgili bütün sıfatlar", "20–30 kelime"],
    [7.6,  "Rakiplerin söyleyemeyecekleri", "herkesin söylediği elenir"],
    [5.2,  "Mekânda karşılığı olanlar", "bir ölçüye çevrilebilenler kalır"],
    [4.4,  "ÜÇ ANAHTAR KELİME", "tasarımın her kararını sınar"]
  ];
  let y = 2.58;
  levels.forEach((l, i) => {
    const w = l[0], x = M + (FW - w) / 2;
    const hi = i === 3;
    zone(s, x, y, w, 0.7, "", hi ? 1 : 0);
    s.addText(l[1], { x: x + 0.2, y: y + 0.08, w: w - 0.4, h: 0.32, isTextBox: true, margin: 0,
      fontFace: H, fontSize: hi ? 17 : 15, bold: true, color: hi ? ACC : INK, align: "center" });
    s.addText(l[2], { x: x + 0.2, y: y + 0.4, w: w - 0.4, h: 0.26, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: hi ? ACC : MUTED, align: "center" });
    if (i < 3) arrow(s, 6.665, y + 0.74, 6.665, y + 0.98, { col: ACC, w: 1.4 });
    y += 1.02;
  });

  rule(s, M, 6.25, 11.63, "ELEME SORUSU", { col: ACC, lcol: ACCT2 });
  cap(s, M, 6.45, 11.63, "Bu sıfatın zıttını bilinçli olarak seçen bir marka olabilir mi? Olamıyorsa o sıfat anahtar kelime değildir.",
      { size: 15, face: H, bold: true, col: ACC, h: 0.45 });
  s.addNotes("Öğrenciler bu soruyu birbirine sorsun; kritik süresini çok kısaltır.");
}

{
  const s = slide("V · ANAHTAR KELİME", "İşe yarayan kelime nasıl olur?");
  text(s, "İyi bir anahtar kelimenin bir zıttı vardır ve mekânda neyi değiştirdiği söylenebilir.",
       { one: true, y: 1.86, h: 0.34, size: 15 });

  const pass = [
    ["Ham", "işlenmiş", "yüzey, birleşim, bitiş"],
    ["Yavaş", "hızlı", "dolaşım, kalma süresi"],
    ["Yoğun", "seyrek", "teşhir sıklığı, ürün / m²"],
    ["Gizli", "açık", "görüş hattı, katmanlama"],
    ["Törensel", "gündelik", "kasa, paketleme, veda"],
    ["Sert", "yumuşak", "malzeme, akustik, ışık"]
  ];
  cap(s, M, 2.5, 2.4, "KELİME", { size: 8.5, bold: true, col: FAINT, cs: 1.5 });
  cap(s, 4.0, 2.5, 2.4, "ZITTI", { size: 8.5, bold: true, col: FAINT, cs: 1.5 });
  cap(s, 7.0, 2.5, 5.48, "MEKÂNDA NEYİ DEĞİŞTİRİR", { size: 8.5, bold: true, col: FAINT, cs: 1.5 });
  dline(s, M, 2.72, R, 2.72, { col: HAIR, w: 1 });
  pass.forEach((f, i) => {
    const y = 2.86 + i * 0.6;
    s.addText(f[0], { x: M, y: y, w: 2.4, h: 0.36, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 18, bold: true, color: ACC });
    s.addText("↔  " + f[1], { x: 4.0, y: y + 0.04, w: 2.4, h: 0.32, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 15, color: MUTED });
    s.addText(f[2], { x: 7.0, y: y + 0.05, w: 5.48, h: 0.32, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 12.5, color: BODY });
    if (i < 5) dline(s, M, y + 0.46, R, y + 0.46, { col: GRID, w: 0.5 });
  });
  cap(s, M, 6.6, 11.63, "Kelimeyi seçtikten sonra kanıtını da yazın: markada bu kelimeyi nerede gördünüz?",
      { size: 13, face: H, italic: true, col: ACC, h: 0.4 });
  s.addNotes("Her kelimenin yanında kanıt zorunlu; kelime tek başına değersiz.");
}

/* ============================ VI · KELİMEDEN MEKÂNA ============================ */
opener("VI", "Kelimeler mekâna nasıl dönüşür?", "Bir tasarım kararı, nereden geldiği gösterilebiliyorsa savunulabilir.");

{
  const s = qslide("VI · ÇEVİRİ", "Çeviri zinciri");
  text(s, "Marka ile çizim arasında dört durak var. Bir durak atlanırsa karar dayanaksız kalır.",
       { one: true, y: 1.86, h: 0.34, size: 15 });

  const chain = [
    ["Bileşen", "marka anahtarından bir başlık", "Değerler:\nöğretmeyi seviyor"],
    ["Anahtar kelime", "tek sıfata indir", "Şeffaf"],
    ["Modül", "hangi modülde sınanıyor", "Çekim ·\nÜrün ve hizmetler"],
    ["Mekânsal ilke", "o anı kuran kural", "Üretim satış alanından\ngörülebilmeli"],
    ["Çizilebilir karar", "somut öğe", "Kavurma makinesi\nvitrine bakan nişte"]
  ];
  const cw = 2.15, cg = 0.22, cy = 2.58, ch = 1.32;
  chain.forEach((c, i) => {
    const x = M + i * (cw + cg);
    zone(s, x, cy, cw, ch, "", i === 4 ? 1 : 0);
    dot(s, x + 0.3, cy + 0.3, { t: String(i + 1), d: 0.28, col: i === 4 ? ACC : INK, ts: 10 });
    s.addText(c[0], { x: x + 0.14, y: cy + 0.56, w: cw - 0.28, h: 0.44, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13.5, bold: true, color: i === 4 ? ACC : INK, lineSpacing: 16 });
    s.addText(c[1], { x: x + 0.14, y: cy + 1.0, w: cw - 0.28, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9, color: MUTED, lineSpacing: 11 });
    if (i < 4) arrow(s, x + cw + 0.03, cy + ch / 2, x + cw + cg - 0.03, cy + ch / 2, { col: ACC, w: 1.4 });
  });
  rule(s, M, 4.3, 11.63, "ÖRNEK");
  chain.forEach((c, i) => {
    const x = M + i * (cw + cg);
    s.addText(c[2], { x: x + 0.02, y: 4.52, w: cw - 0.04, h: 0.8, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 12, italic: true, color: i === 4 ? ACC : BODY, lineSpacing: 16 });
  });
  dline(s, M, 5.55, R, 5.55, { col: HAIR, w: 0.75 });
  cap(s, M, 5.75, 11.63, "Aynı zinciri müşteri tarafından da kurun: gözlenen davranış → ihtiyaç → ilke → öğe. İki zincir aynı kararda buluşmuyorsa ya marka ya müşteri yanlış okunmuş.",
      { size: 13.5, face: H, col: BODY, h: 0.6, ls: 18 });
  cap(s, M, 6.55, 11.63, "Konsept jürisinde her öğrenciden en az üç tam zincir isteyeceğiz.",
      { size: 12.5, face: H, italic: true, col: ACC, h: 0.4 });
  s.addNotes("Bu slayt dersin merkezi: öğrencinin bütün dönem kuracağı yapı bu.");
}

{
  const s = slide("VI · ÇEVİRİ", "Üç kelime, altı modül");
  text(s, "Her kelime, altı modülün her birinde bir karşılık üretmek zorunda. Boş kalan kesişimler tasarımın henüz cevaplamadığı yerler.",
       { one: true, y: 1.86, h: 0.62, size: 14.5 });

  chord(s, M, 4.85, 1.6, 7.6,
    ["ŞEFFAF", "SABIRLI", "HAM"],
    ["Çekim — kavurma makinesi vitrinden görünür",
     "Eşik — koku eşikte karşılar, kapı ağırdır",
     "Ürün ve hizmetler — açık kavanoz, tartım tezgâhı",
     "Organizasyonel — depo camlı, stok görünür",
     "Yönelme — rota kavurmadan tartıma akar",
     "Gezinme — bekleyene oturma ve tadım noktası"],
    [[0, 0], [0, 2], [0, 3], [1, 1], [1, 4], [1, 5], [2, 1], [2, 2], [2, 4]],
    2.78, 0.64, { fs: 12, rfs: 11.5 });

  cap(s, M, 2.52, 1.6, "KELİME", { size: 8.5, bold: true, col: FAINT, cs: 1.4 });
  cap(s, 4.85, 2.52, 7.6, "MODÜLDEKİ KARŞILIĞI", { size: 8.5, bold: true, col: FAINT, cs: 1.4 });
  dline(s, M, 6.38, R, 6.38, { col: HAIR, w: 0.75 });
  cap(s, M, 6.55, 11.63, "Hiçbir modülde karşılık bulamayan kelime, anahtar kelime değildir.",
      { size: 13, face: H, italic: true, col: ACC, h: 0.4 });
  s.addNotes("Bu matris vize 1 paftasında istenecek; boşluklar kritiğin konusu olacak.");
}

{
  const s = slide("VI · ÇEVİRİ", "Bir marka nasıl mağazaya dönüşür?");
  text(s, "Bugün anlatılan her araç bu akışın bir halkası.",
       { one: true, y: 1.86, h: 0.34, size: 15 });

  const phases = [
    ["ARAŞTIRMA", ["Kimlik okuma", "Marka anahtarı", "Persona"], "3 aday marka · 10 bileşen · 3 persona"],
    ["ÇEVİRİ", ["Yolculuk haritası", "Anahtar kelime", "Mekânsal ilke"], "6 modül · 3 kelime · 3 ilke"],
    ["TASARIM", ["Mekânsal program", "Konsept", "Detay"], "m² dağılımı · 1/100 · 1/50 ve 1/20"]
  ];
  const pw = 3.78, pg = 0.3, py = 2.5;
  phases.forEach((ph, i) => {
    const x = M + i * (pw + pg);
    s.addShape(p.ShapeType.rect, { x: x, y: py, w: pw, h: 0.36,
      fill: { color: i === 2 ? ACC : ACCT }, line: { type: "none" } });
    s.addText(ph[0], { x: x, y: py, w: pw, h: 0.36, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, bold: true, color: i === 2 ? "FFFFFF" : ACC,
      align: "center", valign: "middle", charSpacing: 2 });
    ph[1].forEach((st, j) => {
      const y = py + 0.58 + j * 0.86;
      zone(s, x, y, pw, 0.68, "", 0);
      dot(s, x + 0.34, y + 0.34, { t: String(i * 3 + j + 1), d: 0.3, col: ACC, ts: 10 });
      s.addText(st, { x: x + 0.66, y: y, w: pw - 0.82, h: 0.68, isTextBox: true, margin: 0,
        fontFace: H, fontSize: 14.5, bold: true, color: INK, valign: "middle" });
      if (j < 2) arrow(s, x + pw / 2, y + 0.7, x + pw / 2, y + 0.84, { col: ACC, w: 1.2 });
    });
    if (i < 2) arrow(s, x + pw + 0.04, py + 1.9, x + pw + pg - 0.04, py + 1.9, { col: ACC, w: 1.6 });
    dline(s, x, py + 3.28, x + pw, py + 3.28, { col: ACC, w: 1.25 });
    s.addText(ph[2], { x: x, y: py + 3.4, w: pw, h: 0.4, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: BODY, lineSpacing: 13 });
  });
  cap(s, M, 6.55, 11.63, "Atlanan adım en son çizimde eksik olarak geri döner.",
      { size: 13, face: H, italic: true, col: ACC, h: 0.4 });
  s.addNotes("Dönem boyunca bu slayt referans: öğrenci hangi adımda olduğunu buradan görür.");
}

/* ============================ VII · PROJE VE BEKLENTİLER ============================ */
opener("VII", "Proje ve beklentiler", "Ne tasarlayacaksınız, ne teslim edeceksiniz, jüri neye bakacak?");

{
  const s = slide("VII · PROJE", "Proje tanımı");
  text(s, "Küçük ve yerel bir markanın ilk fiziksel mekânını tasarlayacaksınız. Mekân verili: Mersin Marina'da bir ticari birim. Kabuk değişmez; içi, tavanı, zemini ve vitrini sizin.",
       { one: true, y: 1.86, h: 0.62, size: 15 });

  rule(s, M, 2.78, 5.5, "VERİLENLER");
  const given = [
    ["Mekân", "Mersin Marina'da bir birim"],
    ["Kabuk", "taşıyıcı, cephe hattı, kot verili"],
    ["Alan ziyareti", "2. hafta, hep birlikte"],
    ["Marka", "sizin bulacağınız küçük marka"],
    ["Ölçek", "bireysel proje"]
  ];
  given.forEach((g, i) => {
    const y = 3.06 + i * 0.56;
    s.addText(g[0], { x: M, y: y, w: 1.6, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 14, bold: true, color: INK });
    s.addText(g[1], { x: M + 1.7, y: y + 0.03, w: 3.8, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 12, color: BODY });
    if (i < 4) dline(s, M, y + 0.44, M + 5.5, y + 0.44, { col: GRID, w: 0.5 });
  });

  rule(s, C2, 2.78, 5.5, "MARİNA BİR AVM DEĞİL", { col: ACC, lcol: ACCT2 });
  const cons = [
    "Açık hava: yaya dış mekândan gelir.",
    "Mevsimsellik: yaz ve kış yoğunluğu farklı.",
    "Tuz ve nem: malzeme buna dayanmalı.",
    "Akşam kullanımı: gece cephesi ayrı tasarlanır.",
    "Karma kullanıcı: tekne sahibi, turist, yerli.",
    "Görünürlük: cephe uzaktan ve yandan okunur."
  ];
  cons.forEach((c, i) => {
    const y = 3.06 + i * 0.5;
    dot(s, C2 + 0.09, y + 0.15, { d: 0.11, col: ACC });
    s.addText(c, { x: C2 + 0.32, y: y, w: 5.18, h: 0.32, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 12, color: BODY });
  });
  dline(s, 6.52, 2.74, 6.52, 6.1, { col: HAIR, w: 0.75 });
  cap(s, M, 6.3, 11.63, "Alanın m²'si, kat sayısı ve tavan yüksekliği 2. hafta ölçülerek verilecek.",
      { size: 13, face: H, italic: true, col: MUTED, h: 0.4 });
  img(s, "Mersin Marina'dan cephe ve yaya akışı fotoğrafı bu slayta konabilir.");
  s.addNotes("Altı kısıt dersin ayırt edici yeri: kapalı AVM mağazası kurgusu burada işlemez.");
}

{
  const s = slide("VII · PROJE", "Çözmek zorunda olduğunuz alanlar");
  text(s, "Mekân ne kadar büyük olursa olsun bu işlevlerin hepsi çözülmüş olacak. Nerede olacakları size ait.",
       { one: true, y: 1.86, h: 0.36, size: 15 });

  const groups = [
    ["ÖN ALAN", "müşterinin gördüğü", ["Vitrin ve cephe", "Giriş ve eşik", "Teşhir", "Deneme", "Oturma ve bekleme"], 1],
    ["KESİŞİM", "ikisinin buluştuğu", ["Kasa ve paketleme", "Kasa arkası yönetim"], 1],
    ["ARKA ALAN", "işletmenin çalıştığı", ["Mal kabul", "Depo", "Personel ve WC", "Servis rotası"], 2]
  ];
  let gy = 2.6;
  groups.forEach((g, gi) => {
    s.addText(g[0], { x: M, y: gy, w: 1.9, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, bold: true, color: g[3] === 1 ? ACC : MUTED, charSpacing: 1.8 });
    s.addText(g[1], { x: M, y: gy + 0.28, w: 1.9, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, color: FAINT, italic: true });
    dline(s, M, gy - 0.12, R, gy - 0.12, { col: gi === 0 ? HAIR : GRID, w: gi === 0 ? 1 : 0.6 });
    const nc = g[2].length, cwid = 9.5 / nc;
    g[2].forEach((it, j) => {
      const x = 2.98 + j * cwid;
      dot(s, x + 0.08, gy + 0.2, { d: 0.11, col: g[3] === 1 ? ACC : DIMW });
      s.addText(it, { x: x + 0.26, y: gy + 0.05, w: cwid - 0.3, h: 0.5, isTextBox: true, margin: 0,
        fontFace: S, fontSize: 11.5, color: BODY, lineSpacing: 14 });
    });
    gy += 1.1;
  });
  dline(s, M, gy - 0.12, R, gy - 0.12, { col: GRID, w: 0.6 });

  zone(s, M, gy + 0.14, FW, 1.05, "", 1);
  s.addText("DUYUSAL VURGU — BU DERSİN AYIRT EDİCİ TALEBİ", { x: M + 0.25, y: gy + 0.28, w: 11.1, h: 0.26,
    isTextBox: true, margin: 0, fontFace: S, fontSize: 9, bold: true, color: ACC, charSpacing: 1.6 });
  s.addText("Beş duyunun her biri için en az bir bilinçli karar verecek ve üç “imza an” tanımlayacaksınız: müşterinin hatırlayacağı üç mekânsal moment. Deponun m²'si de gerekçeli olacak.",
    { x: M + 0.25, y: gy + 0.56, w: 11.1, h: 0.56, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13.5, color: ACC, lineSpacing: 17 });
  s.addNotes("Depo gerekçesi en çok atlanan konu — ölçümlerde en zayıf modül organizasyonel ihtiyaçlar çıktı.");
}

{
  const s = slide("VII · TESLİMLER", "Üç jüri, üç paket");
  text(s, "Her jüride ne getireceğiniz baştan belli. Sağ kolon o jüride hangi konunun ölçüldüğünü gösteriyor.",
       { one: true, y: 1.86, h: 0.36, size: 15 });

  const del = [
    ["VİZE 1", "6. hafta", "%25", ["Marka anahtarı ve üç persona",
      "Yolculuk haritası ve üç anahtar kelime", "Mekânsal program ve 1/100 plan"],
      ["Marka analizi", "Müşteri profili"]],
    ["VİZE 2", "11. hafta", "%25", ["1/50 tam set: plan, kesit, cephe",
      "Tavan ve aydınlatma planı, malzeme paneli", "Arka ofis, kasa, yönlendirme şeması"],
      ["Çekim", "Eşik", "Ürün", "Organizasyon", "Yönelme"]],
    ["FİNAL", "ayrı hafta", "%30", ["1/50 tam set + 1/20 kısmi plan ve kesit",
      "1/10–1/5 teşhir detayı, maket", "İç mekân görselleri ve gece cephesi"],
      ["Tüm modüller"]]
  ];
  cap(s, 8.1, 2.24, 4.38, "JÜRİDE ÖLÇÜLEN", { size: 8.5, bold: true, col: FAINT, cs: 1.5 });
  let y = 2.5;
  del.forEach((d, i) => {
    const hi = i === 2;
    s.addShape(p.ShapeType.rect, { x: M, y: y, w: 1.75, h: 0.34,
      fill: { color: hi ? ACC : ACCT }, line: { type: "none" } });
    s.addText(d[0], { x: M, y: y, w: 1.75, h: 0.34, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, bold: true, color: hi ? "FFFFFF" : ACC,
      align: "center", valign: "middle", charSpacing: 1.6 });
    s.addText(d[1], { x: M, y: y + 0.4, w: 1.75, h: 0.28, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: MUTED, align: "center" });
    s.addText(d[2], { x: M, y: y + 0.68, w: 1.75, h: 0.34, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 17, bold: true, color: hi ? ACC : INK, align: "center" });
    d[3].forEach((it, j) => {
      const yy = y + 0.04 + j * 0.42;
      dot(s, 2.95, yy + 0.15, { d: 0.1, col: hi ? ACC : DIMW });
      s.addText(it, { x: 3.15, y: yy, w: 4.6, h: 0.32, isTextBox: true, margin: 0,
        fontFace: S, fontSize: 11.5, color: BODY });
    });
    let px = 8.1;
    d[4].forEach(t => {
      const w = 0.072 * t.length + 0.28;
      pill(s, px, y + 0.4, w, 0.32, t, { fill: ACCT, size: 9.5 });
      px += w + 0.12;
    });
    y += 1.5;
    if (i < 2) dline(s, M, y - 0.22, R, y - 0.22, { col: GRID, w: 0.5 });
  });
  dline(s, 7.75, 2.44, 7.75, 6.5, { col: HAIR, w: 0.75 });
  cap(s, M, 6.82, 11.0, "Ayrıca 3. haftada araştırma sunumu (%10) ve yarıyıl boyunca stüdyo performansı (%10). Jüriye katılım ve sözlü sunum zorunlu.",
      { size: 12.5, face: H, italic: true, col: ACC, h: 0.4 });
  s.addNotes("Teslim paketleri yazılı brifte ayrıntılı; burada sadece hatırlatıyoruz.");
}

{
  const s = slide("VII · DEĞERLENDİRME", "Jüri neye bakıyor?");
  text(s, "Her jüride sekiz boyut puanlanır. Ağırlıklar jüriye göre değişir: önce fikir, sonra mekân, en son detay ölçülür.",
       { one: true, y: 1.86, h: 0.62, size: 15 });

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
  cap(s, M, 2.62, 5.2, "BOYUT", { size: 8.5, bold: true, col: FAINT, cs: 1.5 });
  ["VİZE 1", "VİZE 2", "FİNAL"].forEach((t, j) => {
    cap(s, 6.5 + j * 1.5, 2.62, 1.3, t, { size: 8.5, bold: true, col: FAINT, cs: 1.5, align: "center" });
  });
  dline(s, M, 2.86, 11.0, 2.86, { col: HAIR, w: 1 });
  dims.forEach((d, i) => {
    const y = 3.0 + i * 0.44;
    s.addText(d[0], { x: M, y: y, w: 5.3, h: 0.32, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 12.5, color: BODY });
    for (let j = 1; j <= 3; j++) {
      s.addText(d[j], { x: 6.5 + (j - 1) * 1.5, y: y, w: 1.3, h: 0.32, isTextBox: true, margin: 0,
        fontFace: S, fontSize: 12.5, bold: d[j] !== "—", color: d[j] === "—" ? FAINT : ACC, align: "center" });
    }
    if (i < 7) dline(s, M, y + 0.36, 11.0, y + 0.36, { col: GRID, w: 0.4 });
  });
  cap(s, M, 6.62, 11.63, "Vize 1'de teknik çizim kalitesi değil, analizin derinliği ölçülür.",
      { size: 13, face: H, italic: true, col: ACC, h: 0.4 });
  s.addNotes("Dönem notu: araştırma sunumu %10, vize 1 %25, vize 2 %25, final %30, süreç %10.");
}

/* ============================ VIII · BUGÜN VE ÖDEV ============================ */
opener("VIII", "Bugün ve bu hafta", "Öğrendiklerimizi bugün bir mağaza üzerinde deneyeceğiz.");

{
  const s = slide("VIII · BUGÜN", "Birinci çalışma: bir mağazayı okumak");
  text(s, "Her birinize bir mağaza görseli verilecek. Markayı tanımıyorsunuz; yalnızca gördüğünüzden hareket edeceksiniz.",
       { one: true, y: 1.86, h: 0.62, size: 15 });

  const six = [
    ["Marka", "Bu mekân nasıl bir markayı anlatıyor?"],
    ["Kullanıcı", "Burada kim rahat eder?"],
    ["Ürün", "Ne satılıyor, nasıl sunuluyor?"],
    ["Davranış", "Müşteri burada ne yapıyor?"],
    ["Duyular", "Hangi duyulara sesleniyor?"],
    ["Atmosfer", "Nasıl bir his kuruyor?"]
  ];
  const sw = 3.6, sg = 0.42;
  six.forEach((it, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = M + col * (sw + sg), y = 2.7 + row * 1.35;
    dline(s, x, y, x + sw, y, { col: ACC, w: 1.25 });
    dot(s, x + 0.16, y + 0.38, { t: String(i + 1), d: 0.3, col: ACC, ts: 10 });
    s.addText(it[0], { x: x + 0.46, y: y + 0.2, w: sw - 0.46, h: 0.34, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 17, bold: true, color: INK });
    s.addText(it[1], { x: x, y: y + 0.66, w: sw, h: 0.4, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11.5, color: MUTED, lineSpacing: 14 });
  });

  zone(s, M, 5.6, FW, 0.78, "", 1);
  s.addText("ÇIKTI", { x: M + 0.25, y: 5.72, w: 0.8, h: 0.28, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 9.5, bold: true, color: ACC, charSpacing: 1.5 });
  s.addText("Üç anahtar kelime ve her kelimenin yanında görselde onu gösteren kanıt.",
    { x: M + 1.15, y: 5.72, w: 10.2, h: 0.5, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 16, bold: true, color: ACC });
  cap(s, M, 6.55, 11.63, "45 dakika · bireysel · kâğıt dağıtılacak",
      { size: 12.5, face: H, italic: true, col: MUTED, h: 0.4 });
  img(s, "dört mağaza görseli bu slaytın ardına tam sayfa olarak eklenebilir.");
  s.addNotes("Kanıt zorunluluğunu vurgulayın: kâğıtta bunun için ayrı bir alan var.");
}

{
  const s = slide("VIII · BUGÜN", "İkinci çalışma: aynı mağaza, farklı okumalar");
  text(s, "Aynı görseli okuyanlar bir grup olacak. Kelimeler tutmayacak — bu bir hata değil, çalışmanın asıl konusu.",
       { one: true, y: 1.86, h: 0.4, size: 15 });

  const tasks = [
    ["Ortak olanı bulun", "Grubun çoğunun yazdığı kelimeler, mekânın net söylediği şeydir.", "güçlü sinyaller"],
    ["Ayrışanı tartışın", "Tek kişinin gördüğü şey ya derin bir okuma ya bir yanlış anlama.", "mekânın belirsiz kaldığı yer"],
    ["Eksiği adlandırın", "Kimsenin yazmadığı ama mekânda olması gereken bir şey var mı?", "tasarım fırsatı"]
  ];
  const tw = 3.6, tg = 0.42, ty = 2.7, th = 2.2;
  tasks.forEach((t, i) => {
    const x = M + i * (tw + tg);
    zone(s, x, ty, tw, th, "", i === 2 ? 1 : 0);
    dot(s, x + 0.44, ty + 0.44, { t: String(i + 1), d: 0.34, col: i === 2 ? ACC : INK, ts: 12 });
    s.addText(t[0], { x: x + 0.24, y: ty + 0.8, w: tw - 0.48, h: 0.34, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 16.5, bold: true, color: i === 2 ? ACC : INK });
    s.addText(t[1], { x: x + 0.24, y: ty + 1.2, w: tw - 0.48, h: 0.6, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11.5, color: BODY, lineSpacing: 14.5 });
    dline(s, x + 0.24, ty + 1.86, x + tw - 0.24, ty + 1.86, { col: i === 2 ? ACC : GRID, w: 0.75 });
    s.addText(t[2], { x: x + 0.24, y: ty + 1.92, w: tw - 0.48, h: 0.26, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, bold: true, color: i === 2 ? ACC : MUTED });
  });
  rule(s, M, 5.34, 11.63, "GRUP ÇIKTISI");
  cap(s, M, 5.54, 11.63, "Tek bir A3 sayfa: ortak kelimeler, ayrışan kelimeler ve grubun ortak cümlesi — “Bu mağaza şunu söylüyor ama şunu söyleyemiyor.”",
      { size: 14, face: H, col: BODY, h: 0.6, ls: 19 });
  cap(s, M, 6.4, 11.63, "60 dakika çalışma + 30 dakika sunum · 4–5 kişilik gruplar · uzlaşma beklenmiyor",
      { size: 12.5, face: H, italic: true, col: ACC, h: 0.4 });
  s.addNotes("Uzlaşma istemeyin. Anlaşmazlık mekânın belirsiz kaldığı yeri gösteriyor.");
}

{
  const s = slide("VIII · ÖDEV", "Haftaya: üç aday marka");
  text(s, "Üç aday marka bulup her biri için bir A4 pafta hazırlayacaksınız. Hangisiyle devam edeceğinize kritikte birlikte karar vereceğiz.",
       { one: true, y: 1.86, h: 0.62, size: 15 });

  rule(s, M, 2.8, 5.5, "MARKA NASIL OLMALI", { col: ACC, lcol: ACCT2 });
  const yes = [
    "Küçük ve yerel, tercihen tek dükkânlı",
    "Yerleşik bir tasarım dili olmayan",
    "Ürünü somut, depolama ve teşhir sorunu olan",
    "Ulaşabileceğiniz bir sahibi olan",
    "Hakkında konuşulacak bir hikâyesi bulunan"
  ];
  yes.forEach((t, i) => {
    const y = 3.1 + i * 0.58;
    dot(s, M + 0.09, y + 0.15, { d: 0.11, col: ACC });
    s.addText(t, { x: M + 0.32, y: y, w: 5.18, h: 0.5, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 12.5, color: BODY, lineSpacing: 15 });
  });

  rule(s, C2, 2.8, 5.5, "PAFTANIN YEDİ BÖLÜMÜ");
  const parts = [
    ["Marka künyesi", 0], ["Ürün", 0], ["Ürünle ilişki ve depolama", 0], ["Kullanıcı", 0],
    ["Marka dili ve anahtar kelimeler", 1], ["Mekânsal karşılık", 1], ["Uygunluk değerlendirmesi", 1]
  ];
  parts.forEach((pt, i) => {
    const y = 3.1 + i * 0.44;
    dot(s, C2 + 0.12, y + 0.16, { t: String(i + 1), d: 0.26, col: pt[1] ? ACC : DIMW, ts: 8.5 });
    s.addText(pt[0], { x: C2 + 0.4, y: y, w: 5.1, h: 0.32, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 12.5, bold: pt[1] === 1, color: pt[1] ? ACC : BODY });
  });
  cap(s, C2, 6.18, 5.5, "Son üç bölüm doldurulmadan pafta tamamlanmış sayılmaz.",
      { size: 11, face: H, italic: true, col: ACC, h: 0.4 });
  dline(s, 6.52, 2.76, 6.52, 6.1, { col: HAIR, w: 0.75 });
  cap(s, M, 6.18, 5.5, "En iyi adaylar çoğu zaman tanıdığınız birinin işidir.",
      { size: 11, face: H, italic: true, col: ACC, h: 0.4 });
  cap(s, M, 6.78, 11.0, "Teslim: üç pafta, A4 dikey, çıktı. Boş şablon ders sonunda dağıtılacak.",
      { size: 12.5, face: H, col: BODY, h: 0.4 });
  s.addNotes("Mersin ve Çukurova'ya özgü kategorileri örnekleyin: narenciye, baharat, zeytinyağı, sabun, tekstil atölyesi.");
}

{
  const s = slide("VIII · SONRAKİ HAFTALAR", "Önümüzdeki üç hafta");

  const wk = [
    ["2. HAFTA", "Alan ziyareti ve marka seçimi",
     "Proje alanını yerinde göreceğiz, ölçüler verilecek. Aynı gün üç adaydan biri seçilecek.",
     "yanınızda: üç pafta"],
    ["3. HAFTA", "Marka anahtarı ve persona",
     "Seçilen marka için anahtar doldurulacak, üç persona ve yolculuk haritası çıkarılacak. Araştırma sunumu.",
     "yanınızda: görüşme ve gözlem notları"],
    ["4. HAFTA", "Anahtar kelime ve ilk mekânsal karşılıklar",
     "Üç kelime kesinleşecek, altı modül için karşılık matrisi kurulacak. Mekânsal program.",
     "yanınızda: çeviri zinciri"]
  ];
  const ww = 3.6, wg = 0.42, wy = 2.1, wh = 2.85;
  wk.forEach((w, i) => {
    const x = M + i * (ww + wg);
    zone(s, x, wy, ww, wh, "", i === 0 ? 1 : 0);
    s.addText(w[0], { x: x + 0.24, y: wy + 0.22, w: ww - 0.48, h: 0.28, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, bold: true, color: i === 0 ? ACC : MUTED, charSpacing: 1.8 });
    s.addText(w[1], { x: x + 0.24, y: wy + 0.56, w: ww - 0.48, h: 0.86, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 16, bold: true, color: i === 0 ? ACC : INK, lineSpacing: 20 });
    s.addText(w[2], { x: x + 0.24, y: wy + 1.5, w: ww - 0.48, h: 0.92, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11, color: BODY, lineSpacing: 14 });
    dline(s, x + 0.24, wy + 2.44, x + ww - 0.24, wy + 2.44, { col: i === 0 ? ACC : GRID, w: 0.75 });
    s.addText(w[3], { x: x + 0.24, y: wy + 2.5, w: ww - 0.48, h: 0.28, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, bold: true, color: i === 0 ? ACC : MUTED });
    if (i < 2) arrow(s, x + ww + 0.08, wy + wh / 2, x + ww + wg - 0.08, wy + wh / 2, { col: HAIR, w: 1.25 });
  });
  cap(s, M, 5.32, 11.63, "Dördüncü haftanın sonunda elinizde savunulabilir bir konsept olacak: üç kelime, altı modülde karşılıkları ve bunları doğuran araştırma.",
      { size: 14, face: H, col: BODY, h: 0.6, ls: 19 });
  cap(s, M, 6.2, 11.63, "Araştırma, tasarımdan önce yapılan bir ödev değil; tasarımın başladığı yerdir.",
      { size: 15, face: H, italic: true, col: ACC, h: 0.45 });
  s.addNotes("Kapanış cümlesi bu: araştırma tasarımın kendisidir.");
}

/* ---- kaynakça ---- */
{
  const s = slide("KAYNAKÇA", "Okuma listesi");
  text(s, "İlk üçü ödevi yaparken doğrudan işinize yarayacak.",
       { one: true, y: 1.86, h: 0.34, size: 14 });

  const refs = [
    "Bükülmez, P. S., Sunar, T. & Kuloğlu, N. (2025). Retail Design Competencies: A Framework for Integrating Brand Key Analysis and Customer Journey Mapping. The International Journal of Design Education.",
    "Stickdorn, M., Hormess, M., Lawrence, A. & Schneider, J. (2018). This Is Service Design Doing. O'Reilly.",
    "Wheeler, A. (2017). Designing Brand Identity (5. baskı). Wiley.",
    "Micheaux, A. & Bosio, B. (2019). Customer Journey Mapping as a New Way to Teach Data-Driven Marketing. Journal of Marketing Education, 41(2), 127–140.",
    "Stein, A. & Ramaseshan, B. (2016). Towards the Identification of Customer Experience Touch Point Elements. Journal of Retailing and Consumer Services, 30, 8–19.",
    "Lemon, K. N. & Verhoef, P. C. (2016). Understanding Customer Experience Throughout the Customer Journey. Journal of Marketing, 80(6), 69–96.",
    "Quartier, K., Claes, S. & Vanrie, J. (2020). A Comprehensive Competence Framework for (Future) Retail Design and Retail Design Education. Design Research Society.",
    "Petermans, A., Janssens, W. & Van Cleempoel, K. (2013). A Holistic Framework for Conceptualizing Customer Experiences in Retail Environments. International Journal of Design, 7(2), 1–18.",
    "Zomerdijk, L. G. & Voss, C. A. (2010). Service Design for Experience-Centric Services. Journal of Service Research, 13(1), 67–82.",
    "Kotler, P. (1973). Atmospherics as a Marketing Tool. Journal of Retailing, 49(4), 48–64."
  ];
  refs.forEach((r, i) => {
    const x = i < 5 ? M : C2;
    const yy = 2.5 + (i % 5) * 0.86;
    dline(s, x, yy, x + 0.16, yy, { col: ACC, w: 1 });
    s.addText(r, { x: x, y: yy + 0.08, w: CW, h: 0.76, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, color: BODY, lineSpacing: 12.5 });
  });
  dline(s, 6.52, 2.44, 6.52, 6.7, { col: GRID, w: 0.6 });
  cap(s, M, 6.86, 10.4, "Şekil 1a ve 1b'nin özgün hâli: I-AM Istanbul (2018), Bükülmez vd. (2025) içinde.",
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
  s.addText("Bugün: mağaza okuma kâğıdı", {
    x: M, y: 5.2, w: 11.4, h: 0.36, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 13, color: DIMW });
  s.addText("Haftaya: üç aday marka, üç A4 pafta", {
    x: M, y: 5.52, w: 11.4, h: 0.36, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 13, color: DIMW });
}

p.writeFile({ fileName: "Gun1-Marka-Anahtari-ve-Musteri-Deneyimi.pptx" })
 .then(f => console.log("yazildi:", f, "| slayt:", n));
