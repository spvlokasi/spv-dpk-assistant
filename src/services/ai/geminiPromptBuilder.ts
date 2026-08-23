import { Branch, DailyPerformance } from '../../types';
import { formatShortRupiah } from '../../utils/formatters';

export const buildDiagnosisPrompt = (branch: Branch, latestPerf: DailyPerformance | null) => {
  const weakFactors = branch.rootCauses ? branch.rootCauses.filter((f) => f.score <= 2) : [];
  const moderateFactors = branch.rootCauses ? branch.rootCauses.filter((f) => f.score === 3) : [];
  const strongFactors = branch.rootCauses ? branch.rootCauses.filter((f) => f.score >= 4) : [];

  return `Anda adalah SPV Senior & Konsultan Ahli Turnaround Minimarket TokoBASMALAH (PT. Sidogiri Mitra Utama).
DATA PROFIL & TARGET CABANG:
- Kode & Nama Toko: [${branch.code}] ${branch.name}
- KTB: ${branch.kepalaToko || 'KTB'}
- Target Laba Harian: ${formatShortRupiah(branch.targetSalesPerDay || 1500000)}/hari
- Target Margin Profit: ${branch.targetMarginPct || 15}%
- Batas Biaya Operasional Max: ${formatShortRupiah(branch.targetMaxOpexPerMonth || 54000000)}/bulan
${latestPerf ? `- Kinerja Terakhir: Laba ${formatShortRupiah(latestPerf.salesActual)}/hari, Margin ${latestPerf.marginPct}%` : ''}

HASIL AUDIT DIAGNOSA RCA (1-5):
- FAKTOR KRITIS (1-2): ${weakFactors.map((f) => `${f.title} (${f.score})`).join(', ') || 'Tidak ada'}
- FAKTOR SEDANG (3): ${moderateFactors.map((f) => `${f.title} (${f.score})`).join(', ') || 'Tidak ada'}
- FAKTOR BAIK (4-5): ${strongFactors.map((f) => `${f.title} (${f.score})`).join(', ') || 'Tidak ada'}

Berikan output JSON valid:
{
  "diagnosisSummary": "Ringkasan analisa akar masalah utama toko ini (2-3 kalimat padat).",
  "recommendedStrategy": "3-4 instruksi prioritas strategi turnaround 180 hari yang wajib dijalankan KTB & kru."
}`;
};
