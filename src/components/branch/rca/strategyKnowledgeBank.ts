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
      summary: `Belum ada data faktor diagnosa yang dinilai untuk Cabang ${shortName}. Muat standar konsep atau tambahkan faktor untuk memicu analisis otomatis.`,
      strategy: `1. Lakukan audit faktor internal operasional & eksternal pasar sekitar.\n2. Tetapkan prioritas perbaikan SOP kasir dan pengelolaan barang.\n3. Susun target harian terukur bersama KTB.`
    };
  }

  // Find critical (< 3) and moderate (= 3) factors
  const critical = factors.filter(f => f.score <= 2);
  const moderate = factors.filter(f => f.score === 3);
  const focusFactors = critical.length > 0 ? critical : moderate;

  // Synthesis for Summary
  const problemPhrases: string[] = [];
  focusFactors.slice(0, 3).forEach(f => {
    const t = f.title.toLowerCase();
    if (t.includes('listrik') || t.includes('energi') || t.includes('ac')) {
      problemPhrases.push('pemborosan biaya listrik operasional (AC/freezer/lampu)');
    } else if (t.includes('stok mati') || t.includes('slow moving') || t.includes('expired')) {
      problemPhrases.push('penumpukan slow-moving & stok mati yang menggerus margin');
    } else if (t.includes('kasir') || t.includes('up-selling') || t.includes('sop')) {
      problemPhrases.push('kasir pasif belum konsisten up-selling promo tebus murah');
    } else if (t.includes('out-of-stock') || t.includes('ketersediaan') || t.includes('sku')) {
      problemPhrases.push('sering terjadi kekosongan barang fast-moving (out of stock)');
    } else if (t.includes('so parsial') || t.includes('selisih') || t.includes('susut')) {
      problemPhrases.push('lemahnya hitung fisik SO harian pada kategori rawan selisih');
    } else if (t.includes('ktb') || t.includes('briefing') || t.includes('kepemimpinan')) {
      problemPhrases.push('kurangnya pengawasan briefing harian & kawal target oleh KTB');
    } else if (t.includes('kompetitor') || t.includes('harga')) {
      problemPhrases.push('tekanan perang harga dari gerai minimarket kompetitor terdekat');
    } else if (t.includes('canvassing') || t.includes('warung') || t.includes('pesantren')) {
      problemPhrases.push('belum optimalnya jemput bola (canvassing) grosir ke warung/komunitas');
    } else {
      problemPhrases.push(f.title.toLowerCase());
    }
  });

  const summary = problemPhrases.length > 0
    ? `Hasil audit Cabang ${shortName} menunjukkan titik lemah utama berpusat pada ${problemPhrases.join(', ')}. Hal ini berdampak langsung pada tergerusnya laba toko.`
    : `Kondisi operasional Cabang ${shortName} secara umum stabil dengan beberapa titik penyelarasan standar retail TokoBASMALAH.`;

  // Synthesis for Action Remedy Strategy
  const remedySteps: string[] = [];
  let stepNum = 1;

  focusFactors.slice(0, 4).forEach(f => {
    const t = f.title.toLowerCase();
    if (t.includes('listrik') || t.includes('energi') || t.includes('ac')) {
      remedySteps.push(`${stepNum++}. Efisiensi Opex: Kunci suhu AC 24-25°C, matikan 1 AC di jam sepi, dan bersihkan kondensor freezer tiap 2 minggu.`);
    } else if (t.includes('stok mati') || t.includes('slow moving') || t.includes('expired')) {
      remedySteps.push(`${stepNum++}. Penyelamatan Margin: Eksekusi program mark-down 10-20% untuk barang slow-moving 3 bulan sebelum masa kadaluarsa.`);
    } else if (t.includes('kasir') || t.includes('up-selling') || t.includes('sop')) {
      remedySteps.push(`${stepNum++}. Peningkatan Struk: Wajibkan kasir suggestive selling tebus murah dengan target minimal +Rp2.000 per struk transaksi.`);
    } else if (t.includes('out-of-stock') || t.includes('ketersediaan') || t.includes('sku')) {
      remedySteps.push(`${stepNum++}. Zero Out-of-Stock: Kawal ketersediaan Top 50 SKU fast-moving (air mineral, beras, minyak, rokok) selalu penuh di rak.`);
    } else if (t.includes('so parsial') || t.includes('selisih') || t.includes('susut')) {
      remedySteps.push(`${stepNum++}. Pengendalian NKL: Lakukan SO parsial harian bergilir sebelum pergantian shift kasir untuk kategori rawan.`);
    } else if (t.includes('ktb') || t.includes('briefing') || t.includes('kepemimpinan')) {
      remedySteps.push(`${stepNum++}. Disiplin Manajerial: KTB pimpin briefing pagi 10 menit untuk evaluasi target laba harian & pembagian tugas kru.`);
    } else if (t.includes('canvassing') || t.includes('warung') || t.includes('pesantren')) {
      remedySteps.push(`${stepNum++}. Pendorong Omzet Luar: KTB jadwalkan canvassing kartonan sembako 2x seminggu ke warung dan pondok sekitar.`);
    } else {
      remedySteps.push(`${stepNum++}. Perbaikan ${f.title}: Terapkan SOP standar Sidogiri dan pantau perkembangannya pada audit berkala.`);
    }
  });

  if (remedySteps.length === 0) {
    remedySteps.push('1. Pertahankan konsistensi kepatuhan SOP pelayanan kasir dan display 5R.');
    remedySteps.push('2. Pantau harian pencapaian target laba dan margin profit toko.');
  }

  const strategy = remedySteps.join('\n');

  return { summary, strategy };
};
