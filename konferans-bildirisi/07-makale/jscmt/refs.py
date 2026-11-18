"""Kaynak veritabanı ve Vancouver biçimlendirici (JSCMT şablonundaki örneklere göre).

Her kayıt Crossref / yayıncı sayfasından doğrulanmıştır (DOI'ler dahil). Biçim:
  Dergi : Yazarlar. Başlık. *Kısaltılmış dergi adı*. Yıl;Cilt(Sayı):sayfa. doi:...
  Kitap : Yazarlar. *Kitap*. Baskı. Yer: Yayıncı; Yıl.
  Bölüm : Yazarlar. Başlık. In: Editör, editor. *Kitap*. Yer: Yayıncı; Yıl. p. sayfa.
  Standart: Kuruluş. *Başlık*. No. Yer: Yayıncı; Yıl.
  Tez   : Yazar. *Başlık* [tür]. Yer: Kurum; Yıl.
Altı yazardan fazlasında ilk altısı ve "et al." (şablondaki kural). Son sayfa kısaltılır (51–9).
İtalik için *...* işareti kullanılır (yapıcı bunu işler).
"""


def abbr_pages(p):
    """694-713 -> 694–713 ; 1165-1176 -> 1165–76 (ortak baş rakamlar atılır)."""
    if "-" not in p and "–" not in p:
        return p
    a, b = p.replace("–", "-").split("-")
    if len(a) == len(b):
        k = 0
        while k < len(a) - 1 and a[k] == b[k]:
            k += 1
        b = b[k:]
    return f"{a}–{b}"


J = {  # dergi kısaltmaları (NLM / ISO 4)
    "acta_biomater": "Acta Biomater", "mater_des": "Mater Des", "polymers": "Polymers (Basel)", "open_ceram": "Open Ceram", "heliyon": "Heliyon",
    "iop_earth": "IOP Conf Ser Earth Environ Sci", "iop_mse": "IOP Conf Ser Mater Sci Eng",
    "phys_chem_earth": "Phys Chem Earth", "environ_chall": "Environ Chall", "constr_build": "Constr Build Mater",
    "ijie": "Int J Ind Eng", "waste": "Waste", "appl_mech": "Appl Mech", "j_compos": "J Compos Sci",
    "therm_sci": "Therm Sci", "open_chem": "Open Chem", "mater_sci_eng_c": "Mater Sci Eng C",
    "j_funct": "J Funct Biomater", "ijbm": "Int J Biol Macromol", "carbpol": "Carbohydr Polym",
    "materials": "Materials (Basel)", "j_membr": "J Membr Sci", "int_j_des": "Int J Des",
    "sustainability": "Sustainability", "plos": "PLoS One", "annu_rev": "Annu Rev Ecol Syst",
    "polym_degrad": "Polym Degrad Stab",
}

# anahtar: (tür, yazarlar, başlık, ayrıntılar...)
A = "article"
REFS = {
    "skorczewska2022": dict(t=A, au="Skórczewska K, Lewandowski K, Szewczykowski P, Wilczewski S, Szulc J, Stopa P, et al.", ti="Waste eggshells as a natural filler for the poly(vinyl chloride) composites", j="polymers", y=2022, v="14", i="20", p="4372", doi="10.3390/polym14204372"),
    "vilarinho2022": dict(t=A, au="Vilarinho IS, Filippi E, Seabra MP", ti="Development of eco-ceramic wall tiles with bio-CaCO3 from eggshells waste", j="open_ceram", y=2022, v="9", p="100220", doi="10.1016/j.oceram.2022.100220"),
    "ngayakamo2022": dict(t=A, au="Ngayakamo B, Onwualu AP", ti="Recent advances in green processing technologies for valorisation of eggshell waste for sustainable construction materials", j="heliyon", y=2022, v="8", i="6", p="e09649", doi="10.1016/j.heliyon.2022.e09649"),
    "teara2019": dict(t=A, au="Teara A, Doh SI, Chin SC, Ding YJ, Wong J, Jiang XX", ti="Investigation on the durability of use fly ash and eggshells powder to replace the cement in concrete productions", j="iop_earth", y=2019, v="244", p="012025", doi="10.1088/1755-1315/244/1/012025"),
    "teara2020": dict(t=A, au="Teara A, Doh SI", ti="Mechanical properties of high strength concrete that replace cement partly by using fly ash and eggshell powder", j="phys_chem_earth", y=2020, v="120", p="102942", doi="10.1016/j.pce.2020.102942"),
    "nandhini2022": dict(t=A, au="Nandhini K, Karthikeyan J", ti="Sustainable and greener concrete production by utilizing waste eggshell powder as cementitious material – a review", j="constr_build", y=2022, v="335", p="127482", doi="10.1016/j.conbuildmat.2022.127482"),
    "diana2021": dict(t=A, au="Diana W, Widianti A, Hartono E", ti="The strength behaviour of eggshell powder substitution on soil-lime stabilization", j="iop_mse", y=2021, v="1144", i="1", p="012089", doi="10.1088/1757-899X/1144/1/012089"),
    "masued2019": dict(t=A, au="Masued GG", ti="Investigating the ability of using eggshell powder as a filler in hot mix asphalt mixture", j="iop_mse", y=2019, v="518", i="2", p="022047", doi="10.1088/1757-899X/518/2/022047"),
    "ngayakamo2020": dict(t=A, au="Ngayakamo BH, Bello A, Onwualu AP", ti="Development of eco-friendly fired clay bricks incorporated with granite and eggshell wastes", j="environ_chall", y=2020, v="1", p="100006", doi="10.1016/j.envc.2020.100006"),
    "victor2019": dict(t=A, au="Victor EI, Louis IC, Alfred NO, Ozioma UN", ti="Use of chicken eggshells as fillers in flexible polyurethane foam production", j="ijie", y=2019, v="3", i="1", p="1-6", doi="10.65000/w49y5h42"),
    "cree2023": dict(t=A, au="Cree D, Owuamanam S, Soleimani M", ti="Mechanical properties of a bio-composite produced from two biomaterials: polylactic acid and brown eggshell waste fillers", j="waste", y=2023, v="1", i="3", p="740-760", doi="10.3390/waste1030044"),
    "owuamanam2021": dict(t=A, au="Owuamanam S, Soleimani M, Cree DE", ti="Fabrication and characterization of bio-epoxy eggshell composites", j="appl_mech", y=2021, v="2", i="4", p="694-713", doi="10.3390/applmech2040040"),
    "owuamanam2020": dict(t=A, au="Owuamanam S, Cree D", ti="Progress of bio-calcium carbonate waste eggshell and seashell fillers in polymer composites: a review", j="j_compos", y=2020, v="4", i="2", p="70", doi="10.3390/jcs4020070"),
    "bilici2023": dict(t=A, au="Bilici V, Pesmen G, Yonetken A, Erol A", ti="Effect of variation of egg-shell particulate reinforcement on ultrasonic pulse velocity, attenuation, and hardness prediction in ceramic-metal composites", j="therm_sci", y=2023, v="27", i="4B", p="3179-3188", doi="10.2298/TSCI2304179B"),
    "yonetken2022": dict(t=A, au="Yönetken A, Erol A, Peşmen G", ti="Characterization of egg shell powder-doped ceramic–metal composites", j="open_chem", y=2022, v="20", i="1", p="716-724", doi="10.1515/chem-2022-0175"),
    "shafiei2019": dict(t=A, au="Shafiei S, Omidi M, Nasehi F, Golzar H, Mohammadrezaei D, Rezai Rad M, et al.", ti="Egg shell-derived calcium phosphate/carbon dot nanofibrous scaffolds for bone tissue engineering: fabrication and characterization", j="mater_sci_eng_c", y=2019, v="100", p="564-575", doi="10.1016/j.msec.2019.03.003"),
    "vonnie2022": dict(t=A, au="Vonnie JM, Rovina K, Azhar RA, Huda N, Erna KH, Felicia WXL, et al.", ti="Development and characterization of the biodegradable film derived from eggshell and cornstarch", j="j_funct", y=2022, v="13", i="2", p="67", doi="10.3390/jfb13020067"),
    "mostafavi2020": dict(t=A, au="Mostafavi FS, Zaeim D", ti="Agar-based edible films for food packaging applications – a review", j="ijbm", y=2020, v="159", p="1165-1176", doi="10.1016/j.ijbiomac.2020.05.123"),
    "rhim2011": dict(t=A, au="Rhim JW", ti="Effect of clay contents on mechanical and water vapor barrier properties of agar-based nanocomposite films", j="carbpol", y=2011, v="86", i="2", p="691-699", doi="10.1016/j.carbpol.2011.05.010"),
    "hernandez2022": dict(t=A, au="Hernández V, Ibarra D, Triana JF, Martínez-Soto B, Faúndez M, Vasco DA, et al.", ti="Agar biopolymer films for biodegradable packaging: a reference dataset for exploring the limits of mechanical performance", j="materials", y=2022, v="15", i="11", p="3954", doi="10.3390/ma15113954"),
    "phanthe2008": dict(t=A, au="Phan The D, Debeaufort F, Luu D, Voilley A", ti="Moisture barrier, wetting and mechanical properties of shellac/agar or shellac/cassava starch bilayer bio-membrane for food applications", j="j_membr", y=2008, v="325", i="1", p="277-283", doi="10.1016/j.memsci.2008.07.052"),
    "karana2015": dict(t=A, au="Karana E, Barati B, Rognoli V, Zeeuw van der Laan A", ti="Material driven design (MDD): a method to design for material experiences", j="int_j_des", y=2015, v="9", i="2", p="35-54"),
    "rognoli2015": dict(t=A, au="Rognoli V, Bianchini M, Maffei S, Karana E", ti="DIY materials", j="mater_des", y=2015, v="86", p="692-702", doi="10.1016/j.matdes.2015.07.020"),
    "jones2020": dict(t=A, au="Jones M, Mautner A, Luenco S, Bismarck A, John S", ti="Engineered mycelium composite construction materials from fungal biorefineries: a critical review", j="mater_des", y=2020, v="187", p="108397", doi="10.1016/j.matdes.2019.108397"),
    "girometta2019": dict(t=A, au="Girometta C, Picco AM, Baiguera RM, Dondi D, Babbini S, Cartabia M, et al.", ti="Physico-mechanical and thermodynamic properties of mycelium-based biocomposites: a review", j="sustainability", y=2019, v="11", i="1", p="281", doi="10.3390/su11010281"),
    "elsacker2019": dict(t=A, au="Elsacker E, Vandelook S, Brancart J, Peeters E, De Laet L", ti="Mechanical, physical and chemical characterisation of mycelium-based composites with different types of lignocellulosic substrates", j="plos", y=2019, v="14", i="7", p="e0213954", doi="10.1371/journal.pone.0213954"),
    "appels2019": dict(t=A, au="Appels FVW, Camere S, Montalti M, Karana E, Jansen KMB, Dijksterhuis J, et al.", ti="Fabrication factors influencing mechanical, moisture- and water-related properties of mycelium-based composites", j="mater_des", y=2019, v="161", p="64-71", doi="10.1016/j.matdes.2018.11.027"),
    "holling1973": dict(t=A, au="Holling CS", ti="Resilience and stability of ecological systems", j="annu_rev", y=1973, v="4", p="1-23", doi="10.1146/annurev.es.04.110173.000245"),
    "hull2011": dict(t=A, au="Hull TR, Witkowski A, Hollingbery L", ti="Fire retardant action of mineral fillers", j="polym_degrad", y=2011, v="96", i="8", p="1462-1469", doi="10.1016/j.polymdegradstab.2011.05.006"),
    "ranachowski2020": dict(t=A, au="Ranachowski Z, Ranachowski P, Dębowski T, Brodecki A, Kopec M, Roskosz M, et al.", ti="Mechanical and non-destructive testing of plasterboards subjected to a hydration process", j="materials", y=2020, v="13", i="10", p="2405", doi="10.3390/ma13102405"),
    "torres2010": dict(t=A, au="Torres FG, Troncoso OP, Piaggio F, Hijar A", ti="Structure–property relationships of a biopolymer network: the eggshell membrane", j="acta_biomater", y=2010, v="6", i="9", p="3687-3693", doi="10.1016/j.actbio.2010.03.014"),
}

# kitap, bölüm, standart, tez, bildiri
OTHER = {
    "armisen1997": "Armisen R. Agar. In: Imeson AP, editor. *Thickening and gelling agents for food*. Boston: Springer; 1997. p. 1–21. doi:10.1007/978-1-4615-2197-6_1",
    "ashby2011": "Ashby MF. *Materials selection in mechanical design*. 4th ed. Oxford: Butterworth-Heinemann; 2011.",
    "callister2018": "Callister WD Jr, Rethwisch DG. *Materials science and engineering: an introduction*. 10th ed. Hoboken: Wiley; 2018.",
    "holling1996": "Holling CS. Engineering resilience versus ecological resilience. In: Schulze PC, editor. *Engineering within ecological constraints*. Washington (DC): National Academy Press; 1996. p. 31–44. doi:10.17226/4919",
    "ayala2017": "Ayala Garcia C, Rognoli V, Karana E. Five kingdoms of DIY materials for design. In: Karana E, editor. *Proceedings of EKSIG 2017: Alive. Active. Adaptive*; 2017 Jun 19–20; Delft, the Netherlands. doi:10.21606/eksig2017.115",
    "astm_d790": "ASTM International. *Standard test methods for flexural properties of unreinforced and reinforced plastics and electrical insulating materials*. ASTM D790-17. West Conshohocken: ASTM International; 2017.",
    "astm_d570": "ASTM International. *Standard test method for water absorption of plastics*. ASTM D570-98(2018). West Conshohocken: ASTM International; 2018.",
    "iso_11925": "International Organization for Standardization. *Reaction to fire tests — Ignitability of products subjected to direct impingement of flame — Part 2: Single-flame source test*. ISO 11925-2:2020. Geneva: ISO; 2020.",
    "en_312": "European Committee for Standardization. *Particleboards — Specifications*. EN 312:2010. Brussels: CEN; 2010.",
    "en_622": "European Committee for Standardization. *Fibreboards — Specifications — Part 5: Requirements for dry process boards (MDF)*. EN 622-5:2009. Brussels: CEN; 2009.",
    "en_1992": "European Committee for Standardization. *Eurocode 2: Design of concrete structures — Part 1-1: General rules and rules for buildings*. EN 1992-1-1:2004. Brussels: CEN; 2004.",
    "en_13501": "European Committee for Standardization. *Fire classification of construction products and building elements — Part 1: Classification using data from reaction to fire tests*. EN 13501-1:2018. Brussels: CEN; 2018.",
    "unal2025": "Ünal B. *Biyoloji bazlı malzemelerin üretiminden mekânsal dirençlilik analizine: tasarım odaklı deneysel bir yaklaşım* [From the production of biology-based materials to spatial resilience analysis: an experimental design-based approach] [PhD thesis]. Ankara: Hacettepe University; 2025.",
}


def vancouver(key):
    if key in OTHER:
        return OTHER[key]
    r = REFS[key]
    au = r["au"] if r["au"].endswith(".") else r["au"] + "."
    s = f"{au} {r['ti']}. *{J[r['j']]}*. {r['y']};{r['v']}"
    if r.get("i"):
        s += f"({r['i']})"
    s += f":{abbr_pages(r['p'])}."
    if r.get("doi"):
        s += f" doi:{r['doi']}"
    return s


ALL_KEYS = list(REFS) + list(OTHER)

if __name__ == "__main__":
    for k in ALL_KEYS:
        print(f"{k:16s} {vancouver(k)}")
