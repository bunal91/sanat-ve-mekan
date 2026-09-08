// 01-makale-metni.md -> 01-makale-metni.docx (GAZİ MMFD biçimi)
const fs = require('fs');
const H = require('./word_uret.js');
const { Document, Packer, Paragraph, AlignmentType } = H.D;

const md = fs.readFileSync('01-makale-metni.md', 'utf8');
const satirlar = md.split('\n');

// --- markdown'ı bloklara ayır ---
const bloklar = [];
let i = 0;
while (i < satirlar.length) {
  const s = satirlar[i];
  if (s.startsWith('|')) {                       // çizelge
    const t = [];
    while (i < satirlar.length && satirlar[i].startsWith('|')) t.push(satirlar[i++]);
    bloklar.push({ tip: 'tablo', satirlar: t });
    continue;
  }
  if (s.startsWith('## ')) { bloklar.push({ tip: 'h2', metin: s.slice(3) }); i++; continue; }
  if (s.startsWith('### ')) { bloklar.push({ tip: 'h3', metin: s.slice(4) }); i++; continue; }
  if (s.startsWith('# ')) { bloklar.push({ tip: 'baslik', metin: s.slice(2) }); i++; continue; }
  if (s.startsWith('- ')) { bloklar.push({ tip: 'madde', metin: s.slice(2) }); i++; continue; }
  if (s.startsWith('> ')) { i++; continue; }      // yönerge notları atlanır
  if (s.trim() === '---' || s.trim() === '') { i++; continue; }
  bloklar.push({ tip: 'p', metin: s });
  i++;
}

// --- çizelge ve şekil bloklarını ayır ---
const cizelgeler = {};   // no -> {trBaslik, enBaslik, tablo}
const sekiller = {};     // no -> {trBaslik, enBaslik, dosya, cm}
const SEKIL_DOSYA = {
  1: ['Sekil-1-model-akis-semasi.png', 14],
  2: ['Sekil-2-orantililik.png', 8.5],
  3: ['Sekil-3-mekanizma-katkisi.png', 12.5],
  4: ['Sekil-4-sistem-siniri-siralama.png', 12],
  5: ['Sekil-6-salim-orani-esigi.png', 12],
  6: ['Sekil-5-isil-kutle-enerji.png', 14],
};

const govde = [];
let bolum = 'metin';
for (let k = 0; k < bloklar.length; k++) {
  const b = bloklar[k];
  if (b.tip === 'h2' && b.metin.startsWith('ÇİZELGELER')) { bolum = 'cizelge'; continue; }
  if (b.tip === 'h2' && b.metin.startsWith('ŞEKİL ALTI')) { bolum = 'sekil'; continue; }
  if (b.tip === 'h2' && b.metin.startsWith('7. KAYNAKLAR')) { bolum = 'kaynak'; govde.push(b); continue; }

  if (bolum === 'cizelge') {
    const m = b.metin && b.metin.match(/^\*\*Çizelge (\d+)\.\*\* (.+)$/);
    if (m) { cizelgeler[m[1]] = { tr: m[2] }; var sonC = m[1]; continue; }
    const e = b.metin && b.metin.match(/^\*\(Table \d+\. (.+)\)\*$/);
    if (e && sonC) { cizelgeler[sonC].en = e[1]; continue; }
    if (b.tip === 'tablo' && sonC) { cizelgeler[sonC].tablo = b.satirlar; continue; }
    continue;
  }
  if (bolum === 'sekil') {
    const m = b.metin && b.metin.match(/^\*\*Şekil (\d+)\.\*\* (.+)$/);
    if (m) { sekiller[m[1]] = { tr: m[2] }; var sonS = m[1]; continue; }
    const e = b.metin && b.metin.match(/^\*\(Figure \d+\. (.+)\)\*$/);
    if (e && sonS) { sekiller[sonS].en = e[1]; continue; }
    continue;
  }
  govde.push(b);
}

// --- belge öğelerini kur ---
const ogeler = [];
const eklendiC = new Set(), eklendiS = new Set();

function cizelgeEkle(no) {
  const c = cizelgeler[no]; if (!c || !c.tablo) return;
  ogeler.push(H.bos());
  ogeler.push(new Paragraph({ spacing: H.SATIR, alignment: AlignmentType.LEFT,
    children: H.satirParcala(`**Çizelge ${no}.** ${c.tr}`, H.P9) }));
  if (c.en) ogeler.push(new Paragraph({ spacing: H.SATIR, alignment: AlignmentType.LEFT,
    children: [H.run(`(Table ${no}. ${c.en})`, { size: H.P8, italics: true })] }));
  ogeler.push(H.tabloYap(c.tablo));
  ogeler.push(H.bos());
}

function sekilEkle(no) {
  const s = sekiller[no]; if (!s) return;
  const [dosya, cm] = SEKIL_DOSYA[no];
  ogeler.push(H.bos());
  ogeler.push(H.sekilYap(dosya, cm));
  ogeler.push(new Paragraph({ spacing: H.SATIR, alignment: AlignmentType.CENTER,
    children: H.satirParcala(`**Şekil ${no}.** ${s.tr}`, H.P9) }));
  if (s.en) ogeler.push(new Paragraph({ spacing: H.SATIR, alignment: AlignmentType.CENTER,
    children: [H.run(`(Figure ${no}. ${s.en})`, { size: H.P8, italics: true })] }));
  ogeler.push(H.bos());
}

for (const b of govde) {
  if (b.tip === 'baslik') {
    ogeler.push(new Paragraph({ spacing: H.SATIR, alignment: AlignmentType.CENTER,
      children: [H.run(b.metin, { bold: true, size: 24 })] }));
    ogeler.push(H.bos());
    continue;
  }
  if (b.tip === 'h2') {
    const m = b.metin.match(/^(.+?)\s*\((.+)\)$/);
    ogeler.push(H.bos());
    ogeler.push(new Paragraph({ spacing: H.SATIR, alignment: AlignmentType.LEFT,
      children: [H.run(m ? m[1] : b.metin, { bold: true })] }));
    if (m) ogeler.push(new Paragraph({ spacing: H.SATIR, alignment: AlignmentType.LEFT,
      children: [H.run(`(${m[2]})`, { bold: true, size: H.P8 })] }));
    continue;
  }
  if (b.tip === 'h3') {
    ogeler.push(H.bos());
    ogeler.push(new Paragraph({ spacing: H.SATIR, alignment: AlignmentType.LEFT,
      children: [H.run(b.metin, { bold: true })] }));
    continue;
  }
  if (b.tip === 'madde') {
    ogeler.push(new Paragraph({ spacing: H.SATIR, alignment: AlignmentType.LEFT,
      bullet: { level: 0 }, children: H.satirParcala(b.metin) }));
    continue;
  }
  // normal paragraf
  ogeler.push(new Paragraph({ spacing: H.SATIR, alignment: AlignmentType.JUSTIFIED,
    children: H.satirParcala(b.metin) }));
  ogeler.push(H.bos());

  // ilk anılma yerinde çizelge/şekil yerleştir
  for (const no of Object.keys(cizelgeler).sort()) {
    if (!eklendiC.has(no) && new RegExp(`Çizelge ${no}\\b`).test(b.metin)) {
      eklendiC.add(no); cizelgeEkle(no);
    }
  }
  for (const no of Object.keys(sekiller).sort()) {
    if (!eklendiS.has(no) && new RegExp(`Şekil ${no}\\b`).test(b.metin)) {
      eklendiS.add(no); sekilEkle(no);
    }
  }
}

// anılmayan kalmışsa sona ekle
for (const no of Object.keys(cizelgeler).sort()) if (!eklendiC.has(no)) cizelgeEkle(no);
for (const no of Object.keys(sekiller).sort()) if (!eklendiS.has(no)) sekilEkle(no);

const belge = new Document({
  creator: '', title: '', description: '',
  styles: { default: { document: { run: { font: H.FONT, size: H.P9 } } } },
  sections: [{
    properties: { page: { margin: { top: H.KENAR, right: H.KENAR,
      bottom: H.KENAR, left: H.KENAR } } },
    children: ogeler,
  }],
});

Packer.toBuffer(belge).then((buf) => {
  fs.writeFileSync('01-makale-metni.docx', buf);
  console.log(`yazıldı: 01-makale-metni.docx (${Math.round(buf.length / 1024)} KB)`);
  console.log(`çizelge: ${Object.keys(cizelgeler).length}, şekil: ${Object.keys(sekiller).length}`);
});
