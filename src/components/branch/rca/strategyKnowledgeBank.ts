import { RootCauseFactor } from '../../../types';

interface AnalysisResult {
  summary: string;
  strategy: string;
}

export const generateSmartRetailAnalysis = (
  branchName: string,
  factors: RootCauseFactor[]
): AnalysisResult => {
  const shortName = branchName.replace(/^(TokoBASMALAH|Cabang Basmalah|Basmalah)\s+/i, '');
  if (!factors || factors.length === 0) {
    return {
      summary: `Belum ada data faktor diagnosa untuk Cabang ${shortName}. Muat standar konsep untuk memicu analisis otomatis.`,
      strategy: `1. Lakukan audit faktor internal & eksternal.\n2. Tetapkan prioritas SOP kasir dan pengelolaan barang.\n3. Susun target harian terukur.`
    };
  }

  const critical = factors.filter(f => f.score <= 2);
  const focusFactors = critical.length > 0 ? critical : factors.filter(f => f.score === 3);

  const problemPhrases: string[] = [];
  focusFactors.slice(0, 3).forEach(f => {
    const t = f.title.toLowerCase();
    if (t.includes('listrik') || t.includes('energi') || t.includes('ac')) problemPhrases.push('pemborosan listrik operasional');
    else if (t.includes('stok mati') || t.includes('slow moving') || t.includes('expired')) problemPhrases.push('penumpukan slow-moving & stok mati');
    else if (t.includes('kasir') || t.includes('up-selling') || t.includes('sop')) problemPhrases.push('kasir pasif belum konsisten up-selling');
    else if (t.includes('out-of-stock') || t.includes('ketersediaan') || t.includes('sku')) problemPhrases.push('kekosongan barang fast-moving');
    else if (t.includes('so parsial') || t.includes('selisih') || t.includes('susut')) problemPhrases.push('lemahnya hitung fisik SO harian');
    else if (t.includes('ktb') || t.includes('briefing') || t.includes('kepemimpinan')) problemPhrases.push('kurangnya pengawasan briefing harian KTB');
    else if (t.includes('canvassing') || t.includes('warung')) problemPhrases.push('belum optimalnya canvassing grosir');
    else problemPhrases.push(f.title.toLowerCase());
  });

  const summary = problemPhrases.length > 0
    ? `Hasil audit Cabang ${shortName} menunjukkan titik lemah berpusat pada ${problemPhrases.join(', ')} yang menggerus laba toko.`
    : `Kondisi operasional Cabang ${shortName} stabil dengan beberapa penyelarasan standar retail TokoBASMALAH.`;

  const remedySteps: string[] = [];
  let stepNum = 1;
  focusFactors.slice(0, 4).forEach(f => {
    const t = f.title.toLowerCase();
    if (t.includes('listrik') || t.includes('energi') || t.includes('ac')) remedySteps.push(`${stepNum++}. Efisiensi Biaya: Kunci suhu AC 24-25°C & bersihkan kondensor.`);
    else if (t.includes('stok mati') || t.includes('slow moving') || t.includes('expired')) remedySteps.push(`${stepNum++}. Penyelamatan Margin: Eksekusi mark-down 10-20% sebelum ED.`);
    else if (t.includes('kasir') || t.includes('up-selling')) remedySteps.push(`${stepNum++}. Up-Selling Kasir: Wajibkan kasir suggestive selling tebus murah.`);
    else if (t.includes('out-of-stock') || t.includes('sku')) remedySteps.push(`${stepNum++}. Zero OOS: Kawal ketersediaan Top 50 SKU fast-moving.`);
    else if (t.includes('so parsial') || t.includes('susut')) remedySteps.push(`${stepNum++}. Kontrol NKL: Lakukan SO parsial harian bergilir.`);
    else if (t.includes('ktb') || t.includes('briefing')) remedySteps.push(`${stepNum++}. Briefing KTB: KTB pimpin briefing harian 10 menit.`);
    else if (t.includes('canvassing') || t.includes('warung')) remedySteps.push(`${stepNum++}. Canvassing: Jadwalkan canvassing sembako 2x seminggu.`);
    else remedySteps.push(`${stepNum++}. SOP Standar: Terapkan SOP standar Sidogiri dan evaluasi berkala.`);
  });

  if (remedySteps.length === 0) {
    remedySteps.push('1. Pertahankan kepatuhan SOP pelayanan kasir & 5R.');
    remedySteps.push('2. Pantau harian pencapaian target laba dan margin profit toko.');
  }

  return { summary, strategy: remedySteps.join('\n') };
};
