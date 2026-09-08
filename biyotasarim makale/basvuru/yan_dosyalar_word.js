// Kapak sayfası ve genişletilmiş İngilizce özet -> .docx
const fs = require('fs');
const H = require('./word_uret.js');
const { Document, Packer, Paragraph, AlignmentType } = H.D;

function mdBloklar(dosya) {
  const satirlar = fs.readFileSync(dosya, 'utf8').split('\n');
  const bloklar = []; let i = 0;
  while (i < satirlar.length) {
    const s = satirlar[i];
    if (s.startsWith('|')) { const t = [];
      while (i < satirlar.length && satirlar[i].startsWith('|')) t.push(satirlar[i++]);
      bloklar.push({ tip: 'tablo', satirlar: t }); continue; }
    if (s.startsWith('## ')) { bloklar.push({ tip: 'h2', metin: s.slice(3) }); i++; continue; }
    if (s.startsWith('# ')) { bloklar.push({ tip: 'baslik', metin: s.slice(2) }); i++; continue; }
    if (s.startsWith('- ')) { bloklar.push({ tip: 'madde', metin: s.slice(2) }); i++; continue; }
    if (s.startsWith('> ') || s.trim() === '---' || s.trim() === '') { i++; continue; }
    bloklar.push({ tip: 'p', metin: s }); i++;
  }
  return bloklar;
}

function belgeYap(bloklar, ekSekil) {
  const o = [];
  for (const b of bloklar) {
    if (b.tip === 'baslik') {
      o.push(new Paragraph({ spacing: H.SATIR, alignment: AlignmentType.CENTER,
        children: [H.run(b.metin, { bold: true, size: 24 })] }));
      o.push(H.bos()); continue; }
    if (b.tip === 'h2') {
      o.push(H.bos());
      o.push(new Paragraph({ spacing: H.SATIR, alignment: AlignmentType.LEFT,
        children: [H.run(b.metin, { bold: true })] })); continue; }
    if (b.tip === 'tablo') { o.push(H.tabloYap(b.satirlar)); o.push(H.bos()); continue; }
    if (b.tip === 'madde') {
      o.push(new Paragraph({ spacing: H.SATIR, alignment: AlignmentType.LEFT,
        bullet: { level: 0 }, children: H.satirParcala(b.metin) })); continue; }
    o.push(new Paragraph({ spacing: H.SATIR, alignment: AlignmentType.JUSTIFIED,
      children: H.satirParcala(b.metin) }));
    o.push(H.bos());
  }
  if (ekSekil) { o.push(H.sekilYap(ekSekil, 14)); }
  return new Document({
    creator: '', title: '', description: '',
    styles: { default: { document: { run: { font: H.FONT, size: H.P9 } } } },
    sections: [{ properties: { page: { margin: { top: H.KENAR, right: H.KENAR,
      bottom: H.KENAR, left: H.KENAR } } }, children: o }],
  });
}

// 02-kapak-sayfasi.docx ve 03-genisletilmis-ingilizce-ozet.docx bu betikle
// ÜRETİLMEZ; ikisi de derginin resmî şablon dosyaları üzerine kurulmuştur.
// Yeniden üretimleri: kapak için `kapak_kur.py`, özet için şablon dosyası.
const isler = [
  ['04-editore-not.md', '04-editore-not.docx', null],
  ['05-ek-tablolar.md', '05-ek-tablolar.docx', null],
];
(async () => {
  for (const [gir, cik, sek] of isler) {
    const buf = await Packer.toBuffer(belgeYap(mdBloklar(gir), sek));
    fs.writeFileSync(cik, buf);
    console.log(`yazıldı: ${cik} (${Math.round(buf.length / 1024)} KB)`);
  }
})();
