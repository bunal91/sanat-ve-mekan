#!/usr/bin/env python3
"""Makaledeki tüm türetilmiş sayıların tek kaynağı.

Girdi: tezde raporlanan ham değerler (formülasyon kütleleri, ortalama yük ve
gerilme, eğilme yükü ve modülü) ile karşılaştırma için kullanılan, kaynağı
doğrulanmış yayın değerleri. Çıktı: hesap.json ve ekrana özet.

Yalnızca standart kütüphane kullanır:  python3 hesap.py
"""
import json
import math
import os

HERE = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------------------- ham veri
# Kütleler gram; tezdeki reçeteler (parti kütlesi basma serisinde 445 g,
# eğilme serisinde 770 g).
FORMULATIONS = {
    "C1": dict(test="compression", water=325, shell=80, agar=35, glycerol=5),
    "C2": dict(test="compression", water=310, shell=90, agar=40, glycerol=5),
    "C3": dict(test="compression", water=280, shell=110, agar=45, glycerol=10),
    "F1": dict(test="flexure", water=450, shell=190, agar=70, glycerol=60),
    "F2": dict(test="flexure", water=480, shell=190, agar=70, glycerol=30),
}
# Basma: formülasyon başına üç küpün ortalaması (tek tek değerler saklanmamış).
COMPRESSION = {"C1": dict(F_kN=3.89, sigma=2.55),
               "C2": dict(F_kN=4.30, sigma=3.12),
               "C3": dict(F_kN=6.80, sigma=4.10)}
MOULD_EDGE = 50.0                      # mm, küp kalıbı
# Eğilme (F2): üç numunenin ortalaması; F1 ölçülemedi.
FLEX = dict(F_N=310.0, L=120.0, b=60.0, d=20.0, E=192.0)   # mm, MPa
# Diğer tekil ölçümler
MASS_C3_G = 173.0                      # g, kaydedilen tek küp kütlesi
WATER_ABS = dict(W0_g=10.0, gain_pct=0.7)

# ------------------------------------------------- karşılaştırma verileri
# Yalnızca tam metni ya da özeti bu çalışmada doğrulanan kaynaklar.
# (eğilme dayanımı MPa, eğilme modülü MPa)
APPELS_2019 = {            # Materials & Design 161, 64–71, Tablo 2 (ort.)
    "TRN": ("non-pressed", 0.22, 3), "TBN": ("non-pressed", 0.29, 9),
    "PCN": ("non-pressed", 0.05, 1), "PRN": ("non-pressed", 0.06, 1),
    "PCC": ("cold-pressed", 0.24, 12), "PRC": ("cold-pressed", 0.21, 15),
    "TRH": ("heat-pressed", 0.86, 80), "PCH": ("heat-pressed", 0.62, 34),
    "PRH": ("heat-pressed", 0.87, 72),
}
BOARDS = {
    # EN 312:2010, tip P2, kalınlık >13–20 mm: asgari eğilme dayanımı ve modül
    "Particleboard P2 (EN 312)": (11.0, 1600.0),
    # EN 622-5:2009, genel amaçlı kuru ortam MDF, >12–19 mm
    "MDF, general purpose (EN 622-5)": (20.0, 2200.0),
}
# EN 1992-1-1 Tablo 3.1, C20/25: fctm = 2,2 MPa, Ecm = 30 GPa;
# ince kesitte eğilmede çekme dayanımı (1,6 − h/1000)·fctm, h = 20 mm.
CONCRETE = dict(fctm=2.2, Ecm=30000.0, h=20.0)
# Ranachowski vd. 2020, Materials 13(10) 2405, Tablo 4: 12,5 mm standart
# alçı levha, teslim durumunda en büyük eğilme gerilmesi (MPa).
PLASTERBOARD = dict(parallel=4.74, perpendicular=2.62)
# Cree vd. 2023, Waste 1(3) 740–760 (özet): PLA + yumurta kabuğu tozu
PLA_ESP = dict(flex_strength=67.0, flex_modulus=3400.0)
# Elsacker vd. 2019, PLOS ONE 14(7) e0213954: miselyum kompozitleri
ELSACKER = dict(comp_strength=(0.35, 0.45), density=(59.77, 187.29),
                water_24h=(24.45, 30.28))
# Ngayakamo vd. 2020, Environmental Challenges 1, 100006 (özet)
FIRED_BRICK = dict(comp_strength=3.12, density=1.76, water_abs=12.2)


def energy_index(sigma, E):
    """σ²/(2E), MPa girdi → kJ/m³ (1 MPa = 1000 kJ/m³)."""
    return sigma ** 2 / (2.0 * E) * 1000.0


def linfit(xs, ys):
    n = len(xs)
    mx, my = sum(xs) / n, sum(ys) / n
    sxx = sum((x - mx) ** 2 for x in xs)
    syy = sum((y - my) ** 2 for y in ys)
    sxy = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    slope = sxy / sxx
    icpt = my - slope * mx
    r2 = sxy ** 2 / (sxx * syy)
    out = dict(slope=slope, intercept=icpt, r2=r2, n=n)
    if n == 3:
        # n − 2 = 1 serbestlik derecesi: t dağılımı Cauchy'dir,
        # iki yönlü p = (2/π)·arctan(1/|t|)
        t = math.sqrt(r2 / (1.0 - r2))
        out["t"] = t
        out["p_two_sided"] = 2.0 / math.pi * math.atan(1.0 / t)
    return out


res = {"formulations": {}, "compression": {}, "fits": {}, "flexure": {},
       "comparators": {}, "other": {}}

# --------------------------------------------------------- bileşim oranları
for k, f in FORMULATIONS.items():
    nonvol = f["shell"] + f["agar"] + f["glycerol"]          # kuruyan katı
    total = nonvol + f["water"]
    res["formulations"][k] = dict(
        f, total=total, nonvolatile=nonvol,
        solids_to_water=nonvol / f["water"],
        water_mass_fraction=f["water"] / total,
        shell_dry_pct=100.0 * f["shell"] / nonvol,
        agar_dry_pct=100.0 * f["agar"] / nonvol,
        glycerol_dry_pct=100.0 * f["glycerol"] / nonvol,
        shell_to_binder=f["shell"] / (f["agar"] + f["glycerol"]),
        shell_to_agar=f["shell"] / f["agar"],
        glycerol_to_agar=f["glycerol"] / f["agar"],
        agar_in_liquid_pct=100.0 * f["agar"] / (f["water"] + f["agar"] + f["glycerol"]),
    )

# -------------------------------------------------------------------- basma
for k, c in COMPRESSION.items():
    area = c["F_kN"] * 1000.0 / c["sigma"]                   # mm²
    edge = math.sqrt(area)
    res["compression"][k] = dict(
        c, implied_area_mm2=area, implied_edge_mm=edge,
        area_ratio_to_mould=area / MOULD_EDGE ** 2,
        linear_shrinkage_pct=100.0 * (1.0 - edge / MOULD_EDGE),
        strength_per_ratio=c["sigma"] / res["formulations"][k]["solids_to_water"],
        nominal_stress_on_mould=c["F_kN"] * 1000.0 / MOULD_EDGE ** 2,
    )

ids = ["C1", "C2", "C3"]
sig = [COMPRESSION[k]["sigma"] for k in ids]
for name, key in [("solids_to_water", "solids_to_water"),
                  ("water_mass_fraction", "water_mass_fraction"),
                  ("agar_dry_pct", "agar_dry_pct"),
                  ("glycerol_dry_pct", "glycerol_dry_pct"),
                  ("glycerol_to_agar", "glycerol_to_agar"),
                  ("shell_batch_mass_g", "shell")]:
    xs = [res["formulations"][k][key] for k in ids]
    res["fits"][name] = dict(x=xs, y=sig, **linfit(xs, sig))
# Orijinden geçen tek parametreli orantı: σ = k·(katı/su)
xs = res["fits"]["solids_to_water"]["x"]
k_prop = sum(x * y for x, y in zip(xs, sig)) / sum(x * x for x in xs)
res["fits"]["proportional"] = dict(
    k=k_prop, residuals=[y - k_prop * x for x, y in zip(xs, sig)],
    max_rel_dev_pct=max(abs(y - k_prop * x) / y for x, y in zip(xs, sig)) * 100.0)

# ------------------------------------------------------------------- eğilme
F, L, b, d, E = (FLEX[k] for k in ("F_N", "L", "b", "d", "E"))
sigma_f = 3.0 * F * L / (2.0 * b * d ** 2)
inertia = b * d ** 3 / 12.0
delta = F * L ** 3 / (48.0 * E * inertia)                    # doğrusal idealleştirme
strain = sigma_f / E
u_point = energy_index(sigma_f, E)                           # dış lif, kJ/m³
res["flexure"] = dict(
    FLEX, sigma_f=sigma_f, strain_elastic=strain,
    strain_check_6Dd_L2=6.0 * delta * d / L ** 2,
    midspan_deflection_mm=delta, span_to_depth=L / d,
    energy_index_kJ_m3=u_point,
    volume_average_kJ_m3=u_point / 9.0,
    stored_energy_J=0.5 * F * delta / 1000.0,
    span_volume_cm3=b * d * L / 1000.0,
)

# ---------------------------------------------------------- karşılaştırmalar
ap = {}
for k, (proc, s, m) in APPELS_2019.items():
    ap[k] = dict(process=proc, sigma=s, E=m, strain_pct=100.0 * s / m,
                 energy_index=energy_index(s, m))
res["comparators"]["appels_2019"] = ap
res["comparators"]["appels_ranges"] = {
    g: dict(sigma=(min(v["sigma"] for v in ap.values() if v["process"] == g),
                   max(v["sigma"] for v in ap.values() if v["process"] == g)),
            E=(min(v["E"] for v in ap.values() if v["process"] == g),
               max(v["E"] for v in ap.values() if v["process"] == g)),
            strain_pct=(min(v["strain_pct"] for v in ap.values() if v["process"] == g),
                        max(v["strain_pct"] for v in ap.values() if v["process"] == g)),
            energy_index=(min(v["energy_index"] for v in ap.values() if v["process"] == g),
                          max(v["energy_index"] for v in ap.values() if v["process"] == g)))
    for g in ("non-pressed", "cold-pressed", "heat-pressed")}
res["comparators"]["boards"] = {
    k: dict(sigma=s, E=m, strain_pct=100.0 * s / m, energy_index=energy_index(s, m),
            this_over_board_sigma=sigma_f / s, this_over_board_E=E / m,
            this_over_board_index=u_point / energy_index(s, m))
    for k, (s, m) in BOARDS.items()}
fl = (1.6 - CONCRETE["h"] / 1000.0) * CONCRETE["fctm"]
res["comparators"]["concrete_C20_25"] = dict(
    CONCRETE, fctm_fl=fl,
    strain_pct_axial=100.0 * CONCRETE["fctm"] / CONCRETE["Ecm"],
    strain_pct_flex=100.0 * fl / CONCRETE["Ecm"],
    energy_index_axial=energy_index(CONCRETE["fctm"], CONCRETE["Ecm"]),
    energy_index_flex=energy_index(fl, CONCRETE["Ecm"]),
    this_over_concrete_index=u_point / energy_index(fl, CONCRETE["Ecm"]))
res["comparators"]["plasterboard"] = dict(
    PLASTERBOARD, this_over_parallel=sigma_f / PLASTERBOARD["parallel"],
    this_over_perpendicular=sigma_f / PLASTERBOARD["perpendicular"])
res["comparators"]["pla_esp"] = dict(
    PLA_ESP, strength_ratio=PLA_ESP["flex_strength"] / sigma_f,
    modulus_ratio=PLA_ESP["flex_modulus"] / E)
res["comparators"]["elsacker_2019"] = dict(
    ELSACKER, c_series_over_mycelium=(COMPRESSION["C1"]["sigma"] / ELSACKER["comp_strength"][1],
                                      COMPRESSION["C3"]["sigma"] / ELSACKER["comp_strength"][0]))
res["comparators"]["fired_brick"] = FIRED_BRICK
best_myc = max(v["energy_index"] for v in ap.values())
res["comparators"]["this_over_mycelium"] = dict(
    sigma_over_strongest=sigma_f / max(v["sigma"] for v in ap.values()),
    E_over_stiffest=E / max(v["E"] for v in ap.values()),
    index_over_best=u_point / best_myc,
    index_over_worst=u_point / min(v["energy_index"] for v in ap.values()))

# -------------------------------------------------------------------- diğer
rho_nominal = MASS_C3_G / (MOULD_EDGE / 10.0) ** 3            # g/cm³
res["other"] = dict(
    mass_C3_g=MASS_C3_G, nominal_density_g_cm3=rho_nominal,
    areal_mass_20mm_kg_m2=rho_nominal * 20.0,
    water_gain_g=WATER_ABS["W0_g"] * WATER_ABS["gain_pct"] / 100.0,
    water_final_g=WATER_ABS["W0_g"] * (1 + WATER_ABS["gain_pct"] / 100.0))

with open(os.path.join(HERE, "hesap.json"), "w", encoding="utf-8") as fh:
    json.dump(res, fh, ensure_ascii=False, indent=1)

if __name__ == "__main__":
    print("== Bileşim (kuru baz % / oranlar)")
    for k, v in res["formulations"].items():
        print(f"  {k}: toplam {v['total']} g | katı {v['nonvolatile']} g | katı:su {v['solids_to_water']:.3f} | "
              f"su % {100*v['water_mass_fraction']:.1f} | kabuk {v['shell_dry_pct']:.1f} agar {v['agar_dry_pct']:.1f} "
              f"gliserol {v['glycerol_dry_pct']:.1f} | kabuk:bağlayıcı {v['shell_to_binder']:.2f} | "
              f"kabuk:agar {v['shell_to_agar']:.2f} | gli:agar {v['glycerol_to_agar']:.3f} | sıvıda agar % {v['agar_in_liquid_pct']:.1f}")
    print("== Basma")
    for k, v in res["compression"].items():
        print(f"  {k}: F {v['F_kN']} kN σ {v['sigma']} MPa | alan {v['implied_area_mm2']:.0f} mm² "
              f"({100*v['area_ratio_to_mould']:.0f} %) | kenar {v['implied_edge_mm']:.1f} mm | "
              f"büzülme {v['linear_shrinkage_pct']:.1f} % | σ/(katı:su) {v['strength_per_ratio']:.2f} | "
              f"kalıp alanına göre {v['nominal_stress_on_mould']:.2f} MPa")
    for n, f in res["fits"].items():
        if n == "proportional":
            print(f"  orantı: σ = {f['k']:.3f}·x | en büyük sapma {f['max_rel_dev_pct']:.1f} %")
        else:
            print(f"  fit {n}: eğim {f['slope']:.4f} kesişim {f['intercept']:.4f} R² {f['r2']:.5f} "
                  f"t {f['t']:.2f} p {f['p_two_sided']:.3f}")
    fx = res["flexure"]
    print("== Eğilme")
    print(f"  σf {fx['sigma_f']:.3f} MPa | ε {fx['strain_elastic']:.4f} | sehim {fx['midspan_deflection_mm']:.2f} mm | "
          f"L/d {fx['span_to_depth']:.0f} | σ²/2E {fx['energy_index_kJ_m3']:.2f} kJ/m³ | "
          f"hacim ort. {fx['volume_average_kJ_m3']:.2f} | enerji {fx['stored_energy_J']:.3f} J")
    print("== Karşılaştırma (σ MPa, E MPa, σ/E %, σ²/2E kJ/m³)")
    for k, v in ap.items():
        print(f"  Appels {k} {v['process']:13s} {v['sigma']:.2f} {v['E']:>5} {v['strain_pct']:.2f} {v['energy_index']:.2f}")
    for g, v in res["comparators"]["appels_ranges"].items():
        print(f"  Appels {g}: σ {v['sigma']} E {v['E']} ε {v['strain_pct'][0]:.2f}–{v['strain_pct'][1]:.2f} U {v['energy_index'][0]:.1f}–{v['energy_index'][1]:.1f}")
    for k, v in res["comparators"]["boards"].items():
        print(f"  {k}: {v['sigma']} {v['E']} {v['strain_pct']:.2f} {v['energy_index']:.1f} | bu çalışma/levha: "
              f"σ {v['this_over_board_sigma']:.3f} E {v['this_over_board_E']:.3f} U {v['this_over_board_index']:.3f}")
    c = res["comparators"]["concrete_C20_25"]
    print(f"  Beton C20/25: fctm {c['fctm']} fctm,fl {c['fctm_fl']:.2f} | ε {c['strain_pct_axial']:.4f}/{c['strain_pct_flex']:.4f} % | "
          f"U {c['energy_index_axial']:.3f}/{c['energy_index_flex']:.3f} | bu çalışma/beton {c['this_over_concrete_index']:.0f}×")
    print("  Alçı levha:", res["comparators"]["plasterboard"])
    print("  PLA+ESP:", res["comparators"]["pla_esp"])
    print("  Miselyuma göre:", res["comparators"]["this_over_mycelium"])
    print("  Elsacker:", res["comparators"]["elsacker_2019"])
    print("== Diğer:", res["other"])
