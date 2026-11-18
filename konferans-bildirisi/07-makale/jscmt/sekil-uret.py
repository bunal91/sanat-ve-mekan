#!/usr/bin/env python3
"""JSCMT makalesinin şekilleri (Fig. 1–6).

Çıktılar (sekiller/):
  Fig_N.png   — Word'e gömülen sürüm (yerleşim boyutunda en az 300 dpi)
  Fig_N.tif   — ayrı dosya olarak yüklenecek bitmap (LZW, 300 dpi)
  Fig_N.eps   — yalnızca çizim şekilleri (Fig. 2, 6): vektör, canlı metin
  panels/     — fotoğraf panelleri etiketsiz ve ayrı (etiketler ayrı katman şartı için)

Çizimler ../hesap.json'dan, fotoğraflar ../../03-gorseller/ klasöründeki tez
görsellerinden gelir. Fotoğraflara yalnızca kırpma ve yeniden ölçekleme uygulanır.

    python3 ../hesap.py && python3 sekil-uret.py
"""
import json
import math
import os

from PIL import Image, ImageDraw, ImageFont
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "..", "03-gorseller")
OUT = os.path.join(HERE, "sekiller")
PAN = os.path.join(OUT, "panels")
os.makedirs(PAN, exist_ok=True)
R = json.load(open(os.path.join(HERE, "..", "hesap.json"), encoding="utf-8"))

INK, INK2, MUTED = "#0b0b0b", "#52514e", "#898781"
GRID, AXIS, SURF = "#e1e0d9", "#c3c2b7", "#ffffff"
BLUE = "#2a78d6"
GREY = "#8f8d86"

SANS = next((f for f in ("Liberation Sans", "Arial", "DejaVu Sans")
             if any(f == x.name for x in font_manager.fontManager.ttflist)), "DejaVu Sans")
plt.rcParams.update({
    "font.family": SANS, "font.size": 8, "axes.edgecolor": AXIS, "axes.linewidth": 0.75,
    "axes.labelcolor": INK2, "axes.labelsize": 8.5, "xtick.color": INK2, "ytick.color": INK2,
    "xtick.labelsize": 8, "ytick.labelsize": 8, "xtick.major.width": 0.75, "ytick.major.width": 0.75,
    "xtick.major.size": 3, "ytick.major.size": 3, "grid.color": GRID, "grid.linewidth": 0.75,
    "grid.linestyle": "-", "axes.axisbelow": True, "figure.facecolor": SURF, "axes.facecolor": SURF,
    "savefig.facecolor": SURF, "legend.frameon": False,
    "mathtext.fontset": "custom", "mathtext.rm": SANS, "mathtext.it": SANS + ":italic",
    "mathtext.bf": SANS + ":bold", "mathtext.default": "regular",
    "ps.fonttype": 42, "pdf.fonttype": 42,
})
CM = 1 / 2.54
DPI_PLOT = 600


def bare(ax):
    for s in ("top", "right"):
        ax.spines[s].set_visible(False)


def pil_font(size):
    for base in ("/usr/share/fonts/truetype/liberation", "/usr/share/fonts/liberation", "/usr/share/fonts/truetype/dejavu"):
        for name in ("LiberationSans-Bold.ttf", "DejaVuSans-Bold.ttf"):
            p = os.path.join(base, name)
            if os.path.exists(p):
                return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def tag(im, letter):
    im = im.copy()
    size = max(22, im.height // 14)
    d = ImageDraw.Draw(im)
    f = pil_font(size)
    t = f"({letter})"
    w, h = d.textbbox((0, 0), t, font=f)[2:]
    pad = size // 3
    d.rectangle([0, 0, w + 2 * pad, h + 2 * pad], fill="white")
    d.text((pad, pad // 2), t, font=f, fill=INK)
    return im


def row(panels, height, gap=14, labels=True):
    sc = [p.resize((round(p.width * height / p.height), height), Image.LANCZOS) for p in panels]
    W = sum(p.width for p in sc) + gap * (len(sc) - 1)
    out = Image.new("RGB", (W, height), "white")
    x = 0
    for i, p in enumerate(sc):
        out.paste(tag(p, "abcdef"[i]) if labels else p, (x, 0))
        x += p.width + gap
    return out


def save_bitmap(im, n, width_cm):
    """Gömme için PNG, ayrı yükleme için TIFF; yerleşim boyutunda dpi hesabı döndürür."""
    im = im.convert("RGB")
    dpi_eff = im.width / (width_cm / 2.54)
    im.save(os.path.join(OUT, f"Fig_{n}.png"), dpi=(300, 300))
    im.save(os.path.join(OUT, f"Fig_{n}.tif"), compression="tiff_lzw", dpi=(300, 300))
    return dpi_eff


def save_plot(fig, n, width_cm):
    fig.savefig(os.path.join(OUT, f"Fig_{n}.eps"), bbox_inches="tight", pad_inches=0.04)
    png = os.path.join(OUT, f"Fig_{n}.png")
    fig.savefig(png, dpi=DPI_PLOT, bbox_inches="tight", pad_inches=0.04)
    plt.close(fig)
    im = Image.open(png).convert("RGB")
    im.save(os.path.join(OUT, f"Fig_{n}.tif"), compression="tiff_lzw", dpi=(DPI_PLOT, DPI_PLOT))
    return im.width / (width_cm / 2.54)


report = {}

# ---------------------------------------------------------------- Fig. 1 · üretim dizisi
strip = Image.open(os.path.join(SRC, "03-uretim-sureci.jpeg")).convert("RGB")
cuts = [(0, 286), (288, 550), (552, 890), (892, strip.width)]
p1 = [strip.crop((a, 0, b, strip.height)) for a, b in cuts]
for i, p in enumerate(p1):
    p.save(os.path.join(PAN, f"Fig_1{'abcd'[i]}.tif"), compression="tiff_lzw", dpi=(300, 300))
row(p1, 392 * 2, labels=False).save(os.path.join(PAN, "Fig_1_unlabelled.tif"), compression="tiff_lzw", dpi=(300, 300))
report[1] = save_bitmap(row(p1, 392 * 2), 1, 18.0)

# ---------------------------------------------------------------- Fig. 2 · σc – S/W
fit = R["fits"]["solids_to_water"]
xs, ys = fit["x"], fit["y"]
fig, ax = plt.subplots(figsize=(10.5 * CM, 8.2 * CM))
line = lambda x: fit["slope"] * x + fit["intercept"]
ax.plot([0, min(xs)], [line(0), line(min(xs))], color=BLUE, linewidth=1.0, linestyle=(0, (4, 3)), alpha=0.75)
ax.plot([max(xs), 0.66], [line(max(xs)), line(0.66)], color=BLUE, linewidth=1.0, linestyle=(0, (4, 3)), alpha=0.75)
ax.plot([min(xs), max(xs)], [line(min(xs)), line(max(xs))], color=BLUE, linewidth=1.5)
ax.plot(xs, ys, "o", ms=7.5, color=BLUE, mec=SURF, mew=1.5, zorder=3)
for k, x, y in zip(["C1", "C2", "C3"], xs, ys):
    ax.annotate(f"{k}  {y:.2f} MPa", (x, y), xytext=(9, -11), textcoords="offset points",
                fontsize=8, color=INK, ha="left", va="center")
ax.text(0.03, 4.72, f"$σ_c$ = {fit['slope']:.2f}·(S/W) + {fit['intercept']:.2f}\n"
                    f"R$^2$ = {fit['r2']:.3f}  (three formulation means)",
        fontsize=8, color=INK, va="top", linespacing=1.5)
ax.set_xlim(0, 0.7); ax.set_ylim(0, 5)
ax.set_xticks([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]); ax.set_yticks([0, 1, 2, 3, 4, 5])
ax.set_xlabel("Solids-to-water ratio of the mixture, S/W (g/g)"); ax.set_ylabel("Mean compressive strength (MPa)")
ax.grid(True); bare(ax)
report[2] = save_plot(fig, 2, 10.5)

# ---------------------------------------------------------------- Fig. 3 · basma fotoğrafı
c = Image.open(os.path.join(SRC, "04-basma-ficilasmis-kup.jpeg")).convert("RGB").crop((20, 440, 563, 930))
c.save(os.path.join(PAN, "Fig_3_original_crop.tif"), compression="tiff_lzw", dpi=(300, 300))
report[3] = save_bitmap(c.resize((c.width * 2, c.height * 2), Image.LANCZOS), 3, 8.0)

# ---------------------------------------------------------------- Fig. 4 · eğilme fotoğrafları
early = Image.open(os.path.join(SRC, "07-egilme-yakin-yiv.jpeg")).convert("RGB").rotate(-90, expand=True)
early = early.crop((0, 60, early.width, 760))
large = Image.open(os.path.join(SRC, "06-egilme-buyuk-sehim.jpg")).convert("RGB").crop((0, 470, 720, 1130))
arch = Image.open(os.path.join(SRC, "08c-kemer.jpg")).convert("RGB")
p4 = [early, large, arch]
for i, p in enumerate(p4):
    p.save(os.path.join(PAN, f"Fig_4{'abc'[i]}.tif"), compression="tiff_lzw", dpi=(300, 300))
row(p4, 900, labels=False).save(os.path.join(PAN, "Fig_4_unlabelled.tif"), compression="tiff_lzw", dpi=(300, 300))
report[4] = save_bitmap(row(p4, 900), 4, 18.0)

# ---------------------------------------------------------------- Fig. 5 · alev fotoğrafı
fl = Image.open(os.path.join(SRC, "10-alev-testi.png")).convert("RGB").crop((0, 96, 245, 384))
fl.save(os.path.join(PAN, "Fig_5_original_crop.tif"), compression="tiff_lzw", dpi=(300, 300))
report[5] = save_bitmap(fl.resize((fl.width * 3, fl.height * 3), Image.LANCZOS), 5, 6.0)

# ---------------------------------------------------------------- Fig. 6 · dayanım–modül haritası
C = R["comparators"]
fig, ax = plt.subplots(figsize=(15 * CM, 10.6 * CM))
ax.set_xscale("log"); ax.set_yscale("log")
XL, YL = (0.5, 110000), (0.03, 60)
ax.set_xlim(*XL); ax.set_ylim(*YL)
fig.canvas.draw()
p0, p1_ = ax.transData.transform((1.0, 1.0)), ax.transData.transform((100.0, 10.0))
iso_angle = math.degrees(math.atan2(p1_[1] - p0[1], p1_[0] - p0[0]))
for U, x_lab in ((0.1, 420.0), (1, 4200.0), (10, 26000.0), (100, 7500.0)):
    xa = [XL[0], XL[1]]
    ax.plot(xa, [math.sqrt(2 * x * U / 1000.0) for x in xa], color=GRID, linewidth=0.9, zorder=1)
    ax.text(x_lab, math.sqrt(2 * x_lab * U / 1000.0) * 1.07, f"{U:g} kJ/m$^3$", fontsize=7, color=MUTED,
            rotation=iso_angle, rotation_mode="anchor", ha="center", va="bottom", zorder=2)
mk = dict(color=GREY, mec=SURF, mew=1.2, linestyle="none", zorder=3)
shapes = {"non-pressed": ("o", 6.5), "cold-pressed": ("^", 7), "heat-pressed": ("s", 6)}
for name, v in C["appels_2019"].items():
    m, s = shapes[v["process"]]
    ax.plot(v["E"], v["sigma"], marker=m, ms=s, **mk)
ax.text(0.62, 0.36, "Mycelium composites,\nnon-pressed", fontsize=7.5, color=INK2, ha="left", va="bottom", linespacing=1.25)
ax.text(19, 0.165, "cold-pressed", fontsize=7.5, color=INK2, ha="left", va="center")
ax.text(52, 1.12, "heat-pressed", fontsize=7.5, color=INK2, ha="center", va="bottom")
b = C["boards"]
p2, mdf = b["Particleboard P2 (EN 312)"], b["MDF, general purpose (EN 622-5)"]
ax.plot(p2["E"], p2["sigma"], marker="D", ms=6.5, **mk)
ax.plot(mdf["E"], mdf["sigma"], marker="D", ms=6.5, **mk)
ax.text(p2["E"] * 0.82, p2["sigma"] * 0.98, "Particleboard P2\n(EN 312 minimum)", fontsize=7.5, color=INK2,
        ha="right", va="center", linespacing=1.25)
ax.text(mdf["E"] * 0.82, mdf["sigma"] * 1.22, "MDF (EN 622-5 minimum)", fontsize=7.5, color=INK2, ha="right", va="bottom")
cc = C["concrete_C20_25"]
ax.plot(cc["Ecm"], cc["fctm_fl"], marker="P", ms=7.5, **mk)
ax.text(cc["Ecm"], cc["fctm_fl"] * 1.32, "Concrete C20/25\n(EN 1992-1-1)", fontsize=7.5, color=INK2,
        ha="center", va="bottom", linespacing=1.25)
fx = R["flexure"]
ax.plot(fx["E"], fx["sigma_f"], marker="o", ms=10, color=BLUE, mec=SURF, mew=1.6, linestyle="none", zorder=4)
ax.annotate("This study (F2)\n2.33 MPa, 192 MPa\n14.1 kJ/m$^3$", (fx["E"], fx["sigma_f"]), xytext=(11, -4),
            textcoords="offset points", fontsize=8, color=INK, fontweight="bold", ha="left", va="top", linespacing=1.3)
ax.set_xlabel("Flexural modulus (MPa)"); ax.set_ylabel("Flexural strength (MPa)")
ax.set_xticks([1, 10, 100, 1000, 10000]); ax.set_xticklabels(["1", "10", "100", "1 000", "10 000"])
ax.set_yticks([0.1, 1, 10]); ax.set_yticklabels(["0.1", "1", "10"])
ax.minorticks_off(); bare(ax)
report[6] = save_plot(fig, 6, 14.5)

print("Gömme boyutundaki etkin çözünürlük (dpi):")
for n, d in sorted(report.items()):
    print(f"  Fig. {n}: {d:.0f} dpi", "" if d >= 300 else "  <-- 300'ün altında")
