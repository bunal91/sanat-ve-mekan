#!/usr/bin/env python3
"""Makale şekillerini üretir (sekiller/Fig1…Fig8).

Çizimler hesap.json'dan (bkz. hesap.py), fotoğraflar ../03-gorseller/
klasöründeki tez görsellerinden gelir. Gerekenler: Pillow, numpy, matplotlib.

    python3 hesap.py && python3 sekil-uret.py
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
SRC = os.path.join(HERE, "..", "03-gorseller")
OUT = os.path.join(HERE, "sekiller")
os.makedirs(OUT, exist_ok=True)
R = json.load(open(os.path.join(HERE, "hesap.json"), encoding="utf-8"))

# ---------------------------------------------------------------- görsel dil
INK, INK2, MUTED = "#0b0b0b", "#52514e", "#898781"
GRID, AXIS, SURF = "#e1e0d9", "#c3c2b7", "#ffffff"
BLUE, ORANGE, AQUA = "#2a78d6", "#eb6834", "#1baf7a"   # kategorik 1–3 (doğrulandı)
GREY = "#8f8d86"                                        # geri plan serisi

SANS = next((f for f in ("Liberation Sans", "Arial", "DejaVu Sans")
             if any(f == x.name for x in font_manager.fontManager.ttflist)), "DejaVu Sans")
plt.rcParams.update({
    "font.family": SANS, "font.size": 8, "axes.edgecolor": AXIS, "axes.linewidth": 0.75,
    "axes.labelcolor": INK2, "axes.labelsize": 8.5, "xtick.color": INK2, "ytick.color": INK2,
    "xtick.labelsize": 8, "ytick.labelsize": 8, "xtick.major.width": 0.75, "ytick.major.width": 0.75,
    "xtick.major.size": 3, "ytick.major.size": 3, "grid.color": GRID, "grid.linewidth": 0.75,
    "grid.linestyle": "-", "axes.axisbelow": True, "figure.facecolor": SURF, "axes.facecolor": SURF,
    "savefig.facecolor": SURF, "pdf.fonttype": 42, "legend.frameon": False,
    "mathtext.fontset": "custom", "mathtext.rm": SANS, "mathtext.it": SANS + ":italic",
    "mathtext.bf": SANS + ":bold", "mathtext.default": "regular",
})
CM = 1 / 2.54


def bare(ax, left=True):
    for s in ("top", "right"):
        ax.spines[s].set_visible(False)
    if not left:
        ax.spines["left"].set_visible(False)


def pil_font(size, bold=True):
    for name in (("LiberationSans-Bold.ttf" if bold else "LiberationSans-Regular.ttf"),
                 ("DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf")):
        for base in ("/usr/share/fonts/truetype/liberation", "/usr/share/fonts/truetype/dejavu",
                     "/usr/share/fonts/liberation", "/usr/share/fonts"):
            p = os.path.join(base, name)
            if os.path.exists(p):
                return ImageFont.truetype(p, size)
    try:
        return ImageFont.truetype(font_manager.findfont(SANS), size)
    except Exception:
        return ImageFont.load_default()


def tag(im, letter, size=None):
    """Panelin sol üstüne (a), (b)… etiketi."""
    size = size or max(22, im.height // 14)
    d = ImageDraw.Draw(im)
    f = pil_font(size)
    t = f"({letter})"
    w, h = d.textbbox((0, 0), t, font=f)[2:]
    pad = size // 3
    d.rectangle([0, 0, w + 2 * pad, h + 2 * pad], fill="white")
    d.text((pad, pad // 2), t, font=f, fill=INK)
    return im


def row(panels, height, gap=14):
    """Panelleri eşit yükseklikte yan yana dizer."""
    sc = [p.resize((round(p.width * height / p.height), height), Image.LANCZOS) for p in panels]
    W = sum(p.width for p in sc) + gap * (len(sc) - 1)
    out = Image.new("RGB", (W, height), "white")
    x = 0
    for i, p in enumerate(sc):
        out.paste(tag(p, "abcdef"[i]), (x, 0))
        x += p.width + gap
    return out


# ------------------------------------------------------------ Fig 1 · üretim
strip = Image.open(os.path.join(SRC, "03-uretim-sureci.jpeg")).convert("RGB")
cuts = [(0, 286), (288, 550), (552, 890), (892, strip.width)]
row([strip.crop((a, 0, b, strip.height)) for a, b in cuts], 392 * 2).save(
    os.path.join(OUT, "Fig1_production_sequence.png"), dpi=(300, 300))

# ------------------------------------------------------ Fig 2 · deneme parçaları
Image.open(os.path.join(SRC, "01-prototip-cesitlemeleri.jpeg")).convert("RGB").save(
    os.path.join(OUT, "Fig2_trial_pieces.png"), dpi=(300, 300))

# ---------------------------------------------------------- Fig 3 · bileşim
F = R["formulations"]
order = ["C1", "C2", "C3", "F1", "F2"]
ypos = {"C1": 5.3, "C2": 4.3, "C3": 3.3, "F1": 1.7, "F2": 0.7}
fig, (ax, bx) = plt.subplots(1, 2, figsize=(16 * CM, 7.2 * CM), gridspec_kw=dict(width_ratios=[2.25, 1], wspace=0.10))
parts = [("shell_dry_pct", "Eggshell powder", BLUE), ("agar_dry_pct", "Agar", ORANGE),
         ("glycerol_dry_pct", "Glycerol", AQUA)]
for k in order:
    left = 0.0
    for key, _, col in parts:
        v = F[k][key]
        ax.barh(ypos[k], v, left=left, height=0.56, color=col, edgecolor=SURF, linewidth=1.5)
        if key != "glycerol_dry_pct":
            ax.text(left + v / 2, ypos[k], f"{v:.1f}", ha="center", va="center", color="white", fontsize=8)
        else:
            ax.text(101.5, ypos[k], f"{v:.1f}", ha="left", va="center", color=INK, fontsize=8)
        left += v
ax.text(101.5, 6.05, "Glycerol", ha="left", va="center", color=INK2, fontsize=7.5)
ax.set_xlim(0, 113); ax.set_ylim(0.1, 6.35)
ax.set_xticks([0, 20, 40, 60, 80, 100])
ax.set_yticks([ypos[k] for k in order]); ax.set_yticklabels(order, color=INK, fontsize=8.5)
ax.set_xlabel("Share of non-volatile mass (%)")
ax.tick_params(axis="y", length=0); bare(ax, left=False)
ax.xaxis.grid(True); ax.spines["bottom"].set_bounds(0, 100)
ax.text(0, 2.5, "Flexure series", fontsize=7.5, color=INK2, va="center")
ax.text(0, 6.05, "Compression series", fontsize=7.5, color=INK2, va="center")
ax.legend(handles=[plt.Rectangle((0, 0), 1, 1, color=c) for _, _, c in parts],
          labels=[n for _, n, _ in parts], loc="lower left", bbox_to_anchor=(0.0, 1.01), ncol=3,
          handlelength=1.0, handleheight=0.9, columnspacing=1.4, fontsize=8, borderaxespad=0)
ax.set_title("(a)", loc="right", fontsize=8.5, color=INK, fontweight="bold", pad=6)
for k in order:
    v = F[k]["solids_to_water"]
    bx.hlines(ypos[k], 0, v, color=GREY, linewidth=2.2)
    bx.plot(v, ypos[k], "o", ms=7, color=GREY, mec=SURF, mew=1.5, zorder=3)
    bx.text(v + 0.035, ypos[k], f"{v:.2f}", ha="left", va="center", color=INK, fontsize=8)
bx.set_xlim(0, 0.95); bx.set_ylim(0.1, 6.35); bx.set_yticks([])
bx.set_xticks([0, 0.2, 0.4, 0.6, 0.8]); bx.set_xlabel("Solids-to-water ratio as mixed")
bare(bx, left=False); bx.xaxis.grid(True)
bx.axvline(0, color=AXIS, linewidth=0.75)
bx.set_title("(b)", loc="right", fontsize=8.5, color=INK, fontweight="bold", pad=6)
fig.savefig(os.path.join(OUT, "Fig3_formulations.png"), dpi=300, bbox_inches="tight", pad_inches=0.04)
plt.close(fig)

# ------------------------------------------------- Fig 4 · basma – katı:su oranı
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
                    f"R² = {fit['r2']:.3f}  (three formulation means)",
        fontsize=8, color=INK, va="top", linespacing=1.5)
ax.set_xlim(0, 0.7); ax.set_ylim(0, 5)
ax.set_xticks([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]); ax.set_yticks([0, 1, 2, 3, 4, 5])
ax.set_xlabel("Solids-to-water ratio as mixed, S/W"); ax.set_ylabel("Mean compressive strength (MPa)")
ax.grid(True); bare(ax)
fig.savefig(os.path.join(OUT, "Fig4_strength_vs_solids_water.png"), dpi=300, bbox_inches="tight", pad_inches=0.04)
plt.close(fig)

# -------------------------------------------------------- Fig 5 · basma fotoğrafı
c = Image.open(os.path.join(SRC, "04-basma-ficilasmis-kup.jpeg")).convert("RGB")
c = c.crop((20, 440, 563, 930))
c.resize((c.width * 2, c.height * 2), Image.LANCZOS).save(
    os.path.join(OUT, "Fig5_compression_barrelled_cube.png"), dpi=(300, 300))

# ------------------------------------------------------- Fig 6 · eğilme fotoğrafları
early = Image.open(os.path.join(SRC, "07-egilme-yakin-yiv.jpeg")).convert("RGB").rotate(-90, expand=True)
early = early.crop((0, 60, early.width, 760))
large = Image.open(os.path.join(SRC, "06-egilme-buyuk-sehim.jpg")).convert("RGB").crop((0, 470, 720, 1130))
arch = Image.open(os.path.join(SRC, "08c-kemer.jpg")).convert("RGB")
row([early, large, arch], 900).save(os.path.join(OUT, "Fig6_flexure.png"), dpi=(300, 300))

# ----------------------------------------------------------- Fig 7 · alev fotoğrafı
fl = Image.open(os.path.join(SRC, "10-alev-testi.png")).convert("RGB").crop((0, 96, 245, 384))   # çakmak gövdesindeki marka yazısı dışarıda
fl.resize((fl.width * 3, fl.height * 3), Image.LANCZOS).save(
    os.path.join(OUT, "Fig7_small_flame_exposure.png"), dpi=(300, 300))

# -------------------------------------------- Fig 8 · eğilme dayanımı – modül haritası
C = R["comparators"]
fig, ax = plt.subplots(figsize=(15 * CM, 10.6 * CM))
ax.set_xscale("log"); ax.set_yscale("log")
XL, YL = (0.5, 110000), (0.03, 60)
ax.set_xlim(*XL); ax.set_ylim(*YL)
fig.canvas.draw()
p0, p1 = ax.transData.transform((1.0, 1.0)), ax.transData.transform((100.0, 10.0))
iso_angle = math.degrees(math.atan2(p1[1] - p0[1], p1[0] - p0[0]))      # eğim 1/2 (log–log)
for U, x_lab in ((0.1, 420.0), (1, 4200.0), (10, 26000.0), (100, 7500.0)):   # σ²/2E, kJ/m³
    xa = [XL[0], XL[1]]
    ax.plot(xa, [math.sqrt(2 * x * U / 1000.0) for x in xa], color=GRID, linewidth=0.9, zorder=1)
    ax.text(x_lab, math.sqrt(2 * x_lab * U / 1000.0) * 1.07, f"{U:g} kJ/m³", fontsize=7, color=MUTED,
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
ax.annotate("This study (F2)\n2.33 MPa, 192 MPa\n14.1 kJ/m³", (fx["E"], fx["sigma_f"]), xytext=(11, -4),
            textcoords="offset points", fontsize=8, color=INK, fontweight="bold", ha="left", va="top", linespacing=1.3)
ax.set_xlabel("Flexural modulus (MPa)"); ax.set_ylabel("Flexural strength (MPa)")
ax.set_xticks([1, 10, 100, 1000, 10000]); ax.set_xticklabels(["1", "10", "100", "1 000", "10 000"])
ax.set_yticks([0.1, 1, 10]); ax.set_yticklabels(["0.1", "1", "10"])
ax.minorticks_off(); bare(ax)
fig.savefig(os.path.join(OUT, "Fig8_strength_modulus_map.png"), dpi=300, bbox_inches="tight", pad_inches=0.04)
plt.close(fig)

for f in sorted(os.listdir(OUT)):
    im = Image.open(os.path.join(OUT, f))
    print(f, im.size)
