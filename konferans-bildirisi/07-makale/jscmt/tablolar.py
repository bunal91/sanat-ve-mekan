"""Tablolar ve şekil altyazıları (JSCMT makalesi).

Hücre ve altyazı metinleri aynı satır içi işaretlemeyi kullanır:
  *italik*  **kalın**  ~alt~  ^üst^  {@kaynak,anahtar}  (yer tutucu [[...]] yalnız metinde)
Altyazılar kural gereği italiksizdir; bu yüzden altyazılarda işaret kullanılmaz.
Sayılar hesap.json ile aynıdır (hesap.py).
"""

# genişlikler cm, toplam 18,0 (şablondaki metin genişliği)
TABLES = {
    "T1": dict(
        caption="Formulations: batch masses and derived proportions. C1–C3, compression series; F1 and F2, flexure series; S/W, solids-to-water ratio of the mixture as weighed out; dry-basis shares refer to the non-volatile mass.",
        widths=[1.2, 1.5, 1.5, 1.5, 1.5, 1.6, 1.8, 1.8, 1.8, 1.8, 2.0],
        align="lcccccccccc",
        head=["ID", "Water (g)", "Eggshell (g)", "Agar (g)", "Glycerol (g)", "*S*/*W* (g/g)", "Water (% of batch)", "Eggshell (% dry)", "Agar (% dry)", "Glycerol (% dry)", "Glycerol : agar (g/g)"],
        rows=[
            ["C1", "325", "80", "35", "5", "0.369", "73.0", "66.7", "29.2", "4.2", "0.14"],
            ["C2", "310", "90", "40", "5", "0.435", "69.7", "66.7", "29.6", "3.7", "0.13"],
            ["C3", "280", "110", "45", "10", "0.589", "62.9", "66.7", "27.3", "6.1", "0.22"],
            ["F1", "450", "190", "70", "60", "0.711", "58.4", "59.4", "21.9", "18.8", "0.86"],
            ["F2", "480", "190", "70", "30", "0.604", "62.3", "65.5", "24.1", "10.3", "0.43"],
        ]),
    "T2": dict(
        caption="Test programme and departures from the standards referred to.",
        widths=[2.2, 3.6, 4.2, 3.8, 4.2],
        align="lllll",
        head=["Test", "Reference", "Specimens", "Quantities reported", "Departures and limits"],
        rows=[
            ["Compression", "None", "Cubes cast in 50 mm moulds; three per formulation (C1–C3)", "Maximum load; stress on the measured dried section", "No named standard; dried dimensions not logged; strain not instrumented"],
            ["Three-point bending", "ASTM D790-17 {@astm_d790}: configuration and stress formula", "Cast in 180 × 60 × 20 mm moulds; span 120 mm; three per formulation (F1, F2)", "Maximum load; nominal flexural strength; flexural modulus", "Span-to-depth ratio 6:1 instead of 16:1; kerfed tension face; mould dimensions used in Eq. (1)"],
            ["Small-flame exposure", "ISO 11925-2:2020 {@iso_11925}: edge exposure, 45°, 15 s", "40 × 50 mm; two exposures", "Time to ignition; time to self-extinction; flame spread; melting and dripping", "Hand-held gas lighter; specimen 40 × 50 mm instead of 250 × 90 mm; no test enclosure"],
            ["Water absorption", "ASTM D570-98(2018) {@astm_d570}: 24 h immersion", "40 × 50 mm, 10 g, three coats of shellac; one specimen", "Mass gain (%)", "Non-standard specimen; coated specimen only"],
            ["Mass", "None", "One C3 cube", "Mass (g)", "Moisture state, dried volume and batch size not recorded"],
        ]),
    "T3": dict(
        caption="Compression series: means of three specimens per formulation. The implied loaded area is the quotient of mean load and mean stress; it is back-calculated, not measured.",
        widths=[1.4, 2.2, 2.6, 2.4, 3.2, 3.2, 3.0],
        align="lcccccc",
        head=["ID", "*S*/*W* (g/g)", "Maximum load (kN)", "*σ*~c~ (MPa)", "Implied loaded area (mm^2^)", "Load over the mould face (MPa)", "*σ*~c~/(*S*/*W*) (MPa)"],
        rows=[
            ["C1", "0.369", "3.89", "2.55", "1525", "1.56", "6.91"],
            ["C2", "0.435", "4.30", "3.12", "1378", "1.72", "7.16"],
            ["C3", "0.589", "6.80", "4.10", "1659", "2.72", "6.96"],
        ]),
    "T4": dict(
        caption="Flexural benchmark. ε~el~ and U are calculated from Eqs. (2) and (3) wherever strength and modulus are given for the same material; ranges cover the individual materials of each group. MDF, medium-density fibreboard; PLA, polylactic acid.",
        widths=[5.4, 3.0, 1.9, 1.8, 1.8, 1.7, 2.4],
        align="llccccl",
        head=["Material", "Basis", "*σ*~f~ (MPa)", "*E*~f~ (MPa)", "*ε*~el~ (%)", "*U* (kJ/m^3^)", "Source"],
        rows=[
            ["Concrete C20/25, flexural value extrapolated to a 20 mm section", "Design values", "3.5", "30 000", "0.012", "0.20", "{@en_1992}"],
            ["Mycelium composites, non-pressed (four)", "Measured means", "0.05–0.29", "1–9", "3.2–7.3", "1.3–8.1", "{@appels2019}"],
            ["Mycelium composites, cold-pressed (two)", "Measured means", "0.21–0.24", "12–15", "1.4–2.0", "1.5–2.4", "{@appels2019}"],
            ["Mycelium composites, heat-pressed (three)", "Measured means", "0.62–0.87", "34–80", "1.1–1.8", "4.6–5.7", "{@appels2019}"],
            ["**Eggshell–agar composite, F2**", "Measured mean, nominal section", "**2.33**", "**192**", "**1.21**", "**14.1**", "This study"],
            ["Gypsum plasterboard, 12.5 mm, standard type", "Measured, two directions", "2.62–4.74", "—", "—", "—", "{@ranachowski2020}"],
            ["Particleboard P2, over 13 to 20 mm", "Minimum requirement", "11", "1600", "0.69", "37.8", "{@en_312}"],
            ["MDF, general purpose, over 12 to 19 mm", "Minimum requirement", "20", "2200", "0.91", "90.9", "{@en_622}"],
            ["PLA with eggshell powder", "Measured maxima, at different filler contents", "67", "3400", "—", "—", "{@cree2023}"],
        ]),
    "T5": dict(
        caption="Limitations of the study, their consequences, and the experiments that would remove them.",
        widths=[0.9, 5.3, 6.3, 5.5],
        align="llll",
        head=["No.", "Limitation", "Consequence", "Experiment that removes it"],
        rows=[
            ["1", "Individual specimen values were not retained", "Means only, without standard deviation; regression on three means with one residual degree of freedom", "Repeat each series with at least five specimens and retain every value"],
            ["2", "Formulations were not designed as a factorial series", "Water content and glycerol-to-agar ratio vary together in the C series; only two glycerol levels in the F series", "Vary water at a fixed dry composition, and glycerol at a fixed water content, in small steps"],
            ["3", "Evaporation during the cook was not measured", "The water content as cast is unknown; *S*/*W* describes the recipe", "Weigh the mixture before casting"],
            ["4", "Dried dimensions and masses were not logged; the recorded cube mass conflicts with the recipe", "Compressive stresses cannot be recomputed; flexural values rest on mould dimensions; shrinkage and density are undetermined", "Record the dimensions and mass of every specimen after drying, and state the batch size"],
            ["5", "Flexural specimens were kerfed and tested at a span-to-depth ratio of 6:1", "*σ*~f~ and *E*~f~ describe the kerfed panel, with a contribution of shear to the deflection; they are not material constants", "Test plain specimens at a ratio of 16:1 alongside kerfed ones"],
            ["6", "Compressive strain was not instrumented", "No stress–strain curve, no compressive modulus, no energy absorption in compression", "Instrumented compression tests"],
            ["7", "No unloading or post-peak record", "Elastic recovery, for which the resilience index stands, and the energy absorbed beyond maximum load were not measured", "Loading–unloading cycles; full load–deflection record to large deflection"],
            ["8", "The flame exposure was not a standard test", "No reaction-to-fire classification; no data on heat release, smoke or toxicity", "ISO 11925-2 on standard specimens, followed by the tests required for classification"],
            ["9", "Water absorption was measured on one coated specimen", "The result reflects the coating; the uncoated behaviour is unknown", "Coated and uncoated series; humidity cycling"],
            ["10", "Durability was not examined", "Ageing, mould growth and behaviour under cyclic temperature and humidity are unknown", "Accelerated ageing and fungal-resistance tests"],
            ["11", "One operator, one laboratory, manual stirring; constituents not characterised", "Reproducibility between laboratories is untested; particle-size distribution is unknown", "Reproduction of the protocol elsewhere with characterised constituents"],
            ["12", "No life-cycle assessment", "The environmental case is qualitative", "Life-cycle assessment that includes drying time and coating"],
        ]),
}

# (dosya, genişlik cm, altyazı) — altyazılar kalın, italiksiz, yalnızca ilk sözcük büyük harf
FIGURES = [
    ("Fig_1.png", 18.0, "Production sequence: (a) collected eggshells; (b) eggshell powder passing the 150 µm sieve; (c) agar–glycerol binder during the cook; (d) surface of a cast panel after drying. Cropped and rescaled photographs; no other image adjustment."),
    ("Fig_2.png", 10.5, "Mean compressive strength against the solids-to-water ratio of the mixture, S/W. Points are means of three specimens; individual values and dispersion are not available. The solid line is the least-squares fit of Eq. (4); dashed segments extend it beyond the range of the data."),
    ("Fig_3.png", 8.0, "Cube under compression beyond the maximum load: the specimen has shortened and barrelled and remains in one piece. Cropped and rescaled photograph; no other image adjustment."),
    ("Fig_4.png", 18.0, "Flexure: (a) kerfed specimen in three-point bending at an early stage of loading, with the displacement transducer bearing on the lower face; (b) specimen at large deflection, the kerfs opening on the tension face; (c) kerfed panel bent by hand. Cropped and rescaled photographs; no other image adjustment."),
    ("Fig_5.png", 6.0, "Small-flame exposure of a specimen held in tongs: charring is confined to the area of flame contact. Cropped and rescaled photograph; no other image adjustment."),
    ("Fig_6.png", 14.5, "Flexural strength against flexural modulus for the composite and the benchmark materials of Table 4, on logarithmic axes. Grey lines are contours of the resilience index U (kJ/m^3^). Circles, triangles and squares: non-pressed, cold-pressed and heat-pressed mycelium composites {@appels2019}; diamonds: minimum requirements for wood-based boards; cross: concrete C20/25 at a section depth of 20 mm."),
]
