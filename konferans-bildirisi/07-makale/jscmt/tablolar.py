"""Tablolar ve şekil altyazıları (JSCMT makalesi). Yazarın Word metninden üretildi (transform.py, post.py).

Hücre ve altyazı metinleri aynı satır içi işaretlemeyi kullanır:
  *italik*  **kalın**  ~alt~  ^üst^  {@kaynak,anahtar}  (yer tutucu [[...]] yalnız metinde)
"""

# genişlikler cm, toplam 18,0 (şablondaki metin genişliği)
TABLES = {
    "T1": dict(
        caption="Reported uses of eggshell, grouped by the phase that binds it.",
        widths=[3.4, 3.6, 8.0, 3.0],
        align="llll",
        head=["Application", "Binding phase", "Role of eggshell as reported", "Source"],
        rows=[
            ["Concrete", "Portland cement", "Partial cement replacement with fly ash (35–45% combined; 5–10% eggshell in high-strength mixes)", "Teara et al. {@teara2019}; Teara & Doh {@teara2020}"],
            ["Fired clay brick", "Clay body fired at 900–1100 °C", "10% eggshell powder with 20% granite powder", "Ngayakamo et al. {@ngayakamo2020}"],
            ["Soil stabilisation", "Hydrated lime or quicklime", "Substitute for up to 50% of the optimum lime content", "Diana et al. {@diana2021}"],
            ["Hot-mix asphalt", "Bitumen", "Mineral filler in place of Portland cement; optimum 6%", "Masued {@masued2019}"],
            ["Ceramic wall tile", "Fired ceramic body", "Replaces limestone, up to 100%", "Vilarinho et al. {@vilarinho2022}"],
            ["Poly(vinyl chloride)", "Unplasticised PVC, extruded", "Filler, 10–40 phr", "Skórczewska et al. {@skorczewska2022}"],
            ["Polyurethane foam", "Flexible polyurethane", "5–20% of the calcium carbonate filler", "Victor et al. {@victor2019}"],
            ["Polylactic acid", "PLA", "Filler, 5–20 wt.%", "Cree et al. {@cree2023}"],
            ["Bio-epoxy", "Partially bio-derived epoxy", "Filler, 5–20 wt.%", "Owuamanam et al. {@owuamanam2021}"],
            ["Starch film", "Corn starch, cast film", "Additive in the film", "Vonnie et al. {@vonnie2022}"],
            ["Ceramic–metal composite", "Fe–B~4~C sintered at 1400 °C", "Reinforcement, up to 6.66%", "Bilici et al. {@bilici2023}; Yönetken et al. {@yonetken2022}"],
            ["This study", "Agar–glycerol gel, cast below 100 °C", "Major phase, 59–67% of the dry mass", "—"],
        ]),
    "T2": dict(
        caption="Production protocol: parameters that were set, and quantities that were not controlled or not recorded.",
        widths=[2.6, 3.4, 6.0, 6.0],
        align="llll",
        head=["Stage", "Operation", "Parameters", "Not controlled or not recorded"],
        rows=[
            ["Mineral fraction", "Cleaning", "Removal of membrane and organic residue", "—"],
            ["", "Heat treatment", "120 °C, 20 min, laboratory oven", "Sterility"],
            ["", "Drying", "Ambient, to constant mass", "—"],
            ["", "Milling", "Laboratory mechanical grinder, to a visually uniform powder", "Grinder type, duration"],
            ["", "Sieving", "150 µm mesh; passing fraction used", "Particle-size distribution"],
            ["Binder phase", "Liquid phase", "Water and glycerol mixed before any solid is added", "—"],
            ["", "Agar addition", "Incremental, under continuous manual stirring", "Shear rate"],
            ["", "Dissolution", "95 °C, until fully dissolved", "—"],
            ["", "Cook", "80 °C, continuous stirring; 55 min heating in total", "Evaporation loss"],
            ["Composite", "Mineral addition", "Near the end of the cook, at 80 °C, incremental", "—"],
            ["", "Casting", "Silicone moulds, levelled, no release agent", "Pouring temperature"],
            ["", "Drying in the mould", "4 days at about 23 °C, no direct sun or draught", "Relative humidity"],
            ["", "Consolidation", "7 further days demoulded, same conditions", "Dried dimensions and mass"],
            ["Finish", "Shellac", "Three coats, absorption specimen only", "Interval between coats"],
        ]),
    "T3": dict(
        caption="Formulations: batch masses and derived proportions. C1–C3 form the compression series and F1–F2 the flexure series. S/W is the solids-to-water ratio of the mixture as weighed out; dry-basis shares refer to the non-volatile mass.",
        widths=[1.2, 1.5, 1.5, 1.5, 1.5, 1.6, 1.8, 1.8, 1.8, 1.8, 2.0],
        align="lcccccccccc",
        head=["ID", "Water (g)", "Eggshell (g)", "Agar (g)", "Glycerol (g)", "S/W (g/g)", "Water (% of batch)", "Eggshell (% dry)", "Agar (% dry)", "Glycerol (% dry)", "Glycerol : agar (g/g)"],
        rows=[
            ["C1", "325", "80", "35", "5", "0.369", "73.0", "66.7", "29.2", "4.2", "0.14"],
            ["C2", "310", "90", "40", "5", "0.435", "69.7", "66.7", "29.6", "3.7", "0.13"],
            ["C3", "280", "110", "45", "10", "0.589", "62.9", "66.7", "27.3", "6.1", "0.22"],
            ["F1", "450", "190", "70", "60", "0.711", "58.4", "59.4", "21.9", "18.8", "0.86"],
            ["F2", "480", "190", "70", "30", "0.604", "62.3", "65.5", "24.1", "10.3", "0.43"],
        ]),
    "T4": dict(
        caption="Test programme and departures from the standards referred to.",
        widths=[2.2, 3.6, 4.2, 3.8, 4.2],
        align="lllll",
        head=["Test", "Reference", "Specimens", "Quantities reported", "Departures and limits"],
        rows=[
            ["Compression", "None", "Cubes cast in 50 mm moulds; three per formulation (C1–C3)", "Maximum load; stress on the measured dried section", "No named standard; dried dimensions not logged; strain not instrumented"],
            ["Three-point bending", "ASTM D790-17: configuration and Eq. (1)", "Cast in 180 × 60 × 20 mm moulds; span 120 mm; three per formulation (F1, F2)", "Maximum load; nominal flexural strength; flexural modulus", "Span-to-depth ratio 6:1 instead of 16:1; kerfed tension face; mould dimensions used in Eq. (1)"],
            ["Small-flame exposure", "ISO 11925-2:2020: edge exposure, 45°, 15 s", "40 × 50 mm; two exposures", "Time to ignition; time to self-extinction; spread; melting and dripping", "Hand-held gas lighter; specimen 40 × 50 mm instead of 250 × 90 mm; no test enclosure"],
            ["Water absorption", "ASTM D570-98(2018): 24 h immersion", "40 × 50 mm, 10 g, three coats of shellac; one specimen", "Mass gain", "Non-standard specimen; coated specimen only"],
            ["Mass", "—", "One C3 cube", "Mass", "Moisture state, dried volume and batch size not recorded"],
        ]),
    "T5": dict(
        caption="Compression series: means of three specimens per formulation. The implied loaded area is the quotient of mean load and mean stress; it is back-calculated, not measured.",
        widths=[1.4, 2.2, 2.6, 2.4, 3.2, 3.2, 3.0],
        align="lcccccc",
        head=["ID", "S/W (g/g)", "Maximum load (kN)", "Compressive strength *σ*~c~ (MPa)", "Implied loaded area (mm^2^)", "Load over the mould face (MPa)", "*σ*~c~ / (S/W) (MPa)"],
        rows=[
            ["C1", "0.369", "3.89", "2.55", "1525", "1.56", "6.91"],
            ["C2", "0.435", "4.30", "3.12", "1378", "1.72", "7.16"],
            ["C3", "0.589", "6.80", "4.10", "1659", "2.72", "6.96"],
        ]),
    "T6": dict(
        caption="Flexural benchmark. ε~el~ and U are calculated from Eqs. (2) and (3) wherever strength and modulus are given for the same material; ranges cover the individual materials of each group.",
        widths=[5.4, 3.0, 1.9, 1.8, 1.8, 1.7, 2.4],
        align="llccccl",
        head=["Material", "Basis", "*σ*~f~ (MPa)", "*E*~f~ (MPa)", "*ε*~el~ (%)", "*U* (kJ/m^3^)", "Source"],
        rows=[
            ["Concrete C20/25, flexural value extrapolated to a 20 mm section", "Design values", "3.5", "30 000", "0.012", "0.20", "CEN {@en_1992}"],
            ["Mycelium composites, non-pressed (four)", "Measured means", "0.05–0.29", "1–9", "3.2–7.3", "1.3–8.1", "Appels et al. {@appels2019}"],
            ["Mycelium composites, cold-pressed (two)", "Measured means", "0.21–0.24", "12–15", "1.4–2.0", "1.5–2.4", "Appels et al. {@appels2019}"],
            ["Mycelium composites, heat-pressed (three)", "Measured means", "0.62–0.87", "34–80", "1.1–1.8", "4.6–5.7", "Appels et al. {@appels2019}"],
            ["**Eggshell–agar composite, F2**", "Measured mean, nominal section", "**2.33**", "**192**", "**1.21**", "**14.1**", "This study"],
            ["Gypsum plasterboard, 12.5 mm, standard type", "Measured, two directions", "2.62–4.74", "—", "—", "—", "Ranachowski et al. {@ranachowski2020}"],
            ["Particleboard P2, over 13 to 20 mm", "Minimum requirement", "11", "1600", "0.69", "37.8", "CEN {@en_312}"],
            ["MDF, general purpose, over 12 to 19 mm", "Minimum requirement", "20", "2200", "0.91", "90.9", "CEN {@en_622}"],
            ["PLA with eggshell powder", "Measured maxima, at different filler contents", "67", "3400", "—", "—", "Cree et al. {@cree2023}"],
        ]),
    "T7": dict(
        caption="Application envelope: conditions of use, their basis in the results, and what remains to be established.",
        widths=[4.6, 6.0, 7.4],
        align="lll",
        head=["Condition of use", "Basis in the results", "Still to be established"],
        rows=[
            ["Non-load-bearing surfaces only", "Compressive strength 2.6–4.1 MPa; nominal flexural strength 2.3 MPa, below the requirements for wood-based boards (Table 6)", "Behaviour under fixing and handling loads; creep under self-weight"],
            ["Dry interiors", "Mass gain of 0.7% obtained only with an intact shellac coating; local loss of surface where the coating was thin", "Absorption of the uncoated material; cyclic humidity; durability of the coating; resistance to mould growth"],
            ["Away from ignition sources and escape routes", "Ignition after about 10 s under a small flame; self-extinction about 4 s after its removal; no melting or dripping", "Reaction-to-fire classification on standard specimens"],
            ["Small cast units rather than large sheets", "Linear drying shrinkage of the order of 19–26% (back-calculated); kerfed panels can be bent", "Dimensional tolerances and warping after drying; joint design"],
            ["Demountable units on reversible fixings", "Deformation without fragmentation in compression and in bending", "Behaviour under impact and repeated assembly; end-of-life route"],
        ]),
    "T8": dict(
        caption="Limitations of the study, their consequences, and the experiments that would remove them.",
        widths=[5.4, 6.1, 6.5],
        align="lll",
        head=["Limitation", "Consequence", "Experiment that removes it"],
        rows=[
            ["Individual specimen values were not retained", "Means only, without standard deviation; regression on three means with one residual degree of freedom", "Repeat each series with at least five specimens and retain every value"],
            ["Formulations were not designed as a factorial series", "Water content and glycerol-to-agar ratio vary together in the C series; only two glycerol levels in the F series", "Vary water at a fixed dry composition, and glycerol at a fixed water content, in small steps"],
            ["Evaporation during the cook was not measured", "The water content as cast is unknown; S/W describes the recipe", "Weigh the mixture before casting"],
            ["Dried dimensions and masses were not logged; the recorded cube mass conflicts with the recipe", "Compressive stresses cannot be recomputed; flexural values rest on mould dimensions; shrinkage and density are undetermined", "Record the dimensions and mass of every specimen after drying, and state the batch size"],
            ["Flexural specimens were kerfed and tested at a span-to-depth ratio of 6:1", "*σ*~f~ and *E*~f~ describe the kerfed panel, with a contribution of shear to the deflection; they are not material constants", "Test plain specimens at a ratio of 16:1 alongside kerfed ones"],
            ["Compressive strain was not instrumented", "No stress–strain curve, no compressive modulus, no energy absorption in compression", "Instrumented compression tests"],
            ["No unloading or post-peak record", "Elastic recovery, for which the resilience index stands, and the energy absorbed beyond maximum load were not measured", "Loading–unloading cycles; full load–deflection record to large deflection"],
            ["The flame exposure was not a standard test", "No reaction-to-fire classification; no data on heat release, smoke or toxicity", "ISO 11925-2 on standard specimens, followed by the tests required for classification"],
            ["Water absorption was measured on one coated specimen", "The result reflects the coating; the uncoated behaviour is unknown", "Coated and uncoated series; humidity cycling"],
            ["Durability was not examined", "Ageing, mould growth and behaviour under cyclic temperature and humidity are unknown", "Accelerated ageing and fungal-resistance tests"],
            ["One operator, one laboratory, manual stirring; constituents not characterised", "Reproducibility between laboratories is untested; particle-size distribution is unknown", "Reproduction of the protocol elsewhere with characterised constituents"],
            ["No life-cycle assessment", "The environmental case is qualitative", "Life-cycle assessment that includes drying time and coating"],
        ]),
}

# (dosya, genişlik cm, altyazı) — sıra metindeki şekil numarasıdır (Fig. 1 … Fig. 8)
FIGURES = [
    ("Fig_1.png", 18.0, "Production sequence: (a) collected eggshells; (b) shell powder passing the 150 µm sieve; (c) the agar–glycerol binder during the cook; (d) surface of a cast panel after drying."),
    ("Fig_2.png", 8.5, "Trial pieces and specimens produced during development, including cubes, discs, panels and slotted modules."),
    ("Fig_3.png", 12.0, "Formulations: (a) composition of the non-volatile mass, which is the composition of the dried solid; (b) solids-to-water ratio of the mixture as weighed out."),
    ("Fig_4.png", 18.0, "Flexure: (a) kerfed specimen in three-point bending at an early stage of loading, with the displacement transducer bearing on the lower face; (b) specimen at large deflection, the kerfs opening on the tension face; (c) a kerfed panel bent by hand."),
    ("Fig_5.png", 6.0, "Small-flame exposure of a specimen held in tongs: charring is confined to the area of flame contact."),
    ("Fig_6.png", 10.5, "Mean compressive strength against the solids-to-water ratio of the mixture. Points are means of three specimens; individual values and dispersion are not available. The solid line is the least-squares fit of Eq. (4); the dashed segments extend it beyond the range of the data."),
    ("Fig_7.png", 8.0, "Cube under compression beyond the maximum load: the specimen has shortened and barrelled and remains in one piece."),
    ("Fig_8.png", 14.5, "Flexural strength against flexural modulus for the composite and the benchmark materials of Table 6, on logarithmic axes. Grey lines are contours of the resilience index U. Circles, triangles and squares are the non-pressed, cold-pressed and heat-pressed mycelium composites of Appels et al. {@appels2019}; diamonds are minimum requirements for wood-based boards; the cross is concrete C20/25 at a section depth of 20 mm."),
]
