import { Branch, DailyPerformance, ActionPlanMilestone } from '../types';
import { generateSmartStrategyAnalysis } from '../components/branch/rca/strategyKnowledgeBank';
import { generateSmartActionPlan } from './smartActionPlanGenerator';
import { formatShortRupiah } from '../utils/formatters';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

interface GeminiDiagnosisResponse {
  diagnosisSummary: string;
  recommendedStrategy: string;
}

export const generateGeminiDiagnosisAndStrategy = async (
  branch: Branch,
  performanceHistory: DailyPerformance[] = []
): Promise<GeminiDiagnosisResponse> => {
  // If no API Key is provided, fallback seamlessly to internal Knowledge Bank
  if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
    return generateSmartStrategyAnalysis(branch.rootCauses || []);
  }

  const weakFactors = branch.rootCauses ? branch.rootCauses.filter((f) => f.score <= 2) : [];
  const moderateFactors = branch.rootCauses ? branch.rootCauses.filter((f) => f.score === 3) : [];
  const strongFactors = branch.rootCauses ? branch.rootCauses.filter((f) => f.score >= 4) : [];

  const branchPerf = performanceHistory.filter((p) => p.branchId === branch.id);
  const latestPerf = branchPerf.length > 0 ? branchPerf[branchPerf.length - 1] : null;

  const prompt = `Anda adalah SPV Senior & Konsultan Ahli Turnaround Minimarket TokoBASMALAH (PT. Sidogiri Mitra Utama).
Tugas Anda adalah menganalisis akar masalah toko DPK (Dalam Pengawasan Khusus) dan merumuskan strategi perbaikan 180 hari yang presisi dan realistis.

DATA PROFIL & TARGET CABANG:
- Kode & Nama Toko: [${branch.code}] ${branch.name}
- Kepala Toko (KTB): ${branch.kepalaToko || 'KTB'}
- Alamat: ${branch.address || '-'}
- Target Laba Harian: ${formatShortRupiah(branch.targetSalesPerDay || 1500000)}/hari
- Target Margin Profit: ${branch.targetMarginPct || 15}%
- Batas Biaya Operasional (Opex Max): ${formatShortRupiah(branch.targetMaxOpexPerMonth || 54000000)}/bulan
${latestPerf ? `- Kinerja Aktual Terakhir: Laba ${formatShortRupiah(latestPerf.salesActual)}/hari, Margin ${latestPerf.marginPct}%` : ''}

HASIL AUDIT DIAGNOSA RCA (SKALA 1 - 5):
- FAKTOR KRITIS (SKOR 1-2 / MERAH): ${weakFactors.map((f) => `${f.title} (Skor: ${f.score})`).join(', ') || 'Tidak ada'}
- FAKTOR SEDANG (SKOR 3 / KUNING): ${moderateFactors.map((f) => `${f.title} (Skor: ${f.score})`).join(', ') || 'Tidak ada'}
- FAKTOR BAIK (SKOR 4-5 / HIJAU): ${strongFactors.map((f) => `${f.title} (Skor: ${f.score})`).join(', ') || 'Tidak ada'}

PANDUAN SOP SIDOGIRI:
1. Efisiensi Listrik/AC: Suhu 24-25°C, matikan 1 unit saat sepi (08.00-11.00), bersihkan bunga es freezer/chiller.
2. Disiplin Stok & Margin: Zero OOS Top 50 SKU, disiplin FEFO, mark-down 10-20% sebelum expired 1-2 bulan, Add-on sales kasir kopi+gula margin >20%.
3. NKL & Pengawasan: SO parsial harian barang rawan (rokok/susu/kosmetik), briefing pagi KTB, canvassing UMKM sekitar.

Berikan output HANYA dalam format JSON valid tanpa markdown formatting tambahan dengan struktur persis berikut:
{
  "diagnosisSummary": "Tuliskan ringkasan analisa akar masalah utama toko ini (2-3 kalimat padat, jelas, dan lugas).",
  "recommendedStrategy": "Tuliskan 3-4 instruksi prioritas strategi turnaround 180 hari yang wajib dijalankan KTB & kru."
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 600,
            responseMimeType: 'application/json'
          }
        })
      }
    );

    if (!response.ok) {
      console.warn('Gemini API returned error status:', response.status, 'Falling back to Knowledge Bank.');
      return generateSmartStrategyAnalysis(branch.rootCauses || []);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parse JSON
    const parsed = JSON.parse(rawText);
    if (parsed.diagnosisSummary && parsed.recommendedStrategy) {
      return {
        diagnosisSummary: parsed.diagnosisSummary.trim(),
        recommendedStrategy: parsed.recommendedStrategy.trim()
      };
    }

    return generateSmartStrategyAnalysis(branch.rootCauses || []);
  } catch (err) {
    console.warn('Failed to call Gemini AI, using local Knowledge Bank fallback:', err);
    return generateSmartStrategyAnalysis(branch.rootCauses || []);
  }
};

export const generateGeminiActionPlan = async (
  branch: Branch,
  performanceHistory: DailyPerformance[] = []
): Promise<ActionPlanMilestone[]> => {
  // If no API Key or error, fallback to local Smart Action Plan Generator
  if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
    return generateSmartActionPlan(branch, performanceHistory);
  }

  const weakFactors = branch.rootCauses ? branch.rootCauses.filter((f) => f.score <= 2) : [];
  const branchPerf = performanceHistory.filter((p) => p.branchId === branch.id);
  const latestPerf = branchPerf.length > 0 ? branchPerf[branchPerf.length - 1] : null;

  const prompt = `Anda adalah SPV Senior Retail TokoBASMALAH (PT. Sidogiri Mitra Utama).
Buatlah Roadmap Rencana Aksi Turnaround 180 Hari untuk toko:
- Toko: [${branch.code}] ${branch.name} (KTB: ${branch.kepalaToko || 'KTB'})
- Target Laba: ${formatShortRupiah(branch.targetSalesPerDay || 1500000)}/hari | Target Margin: ${branch.targetMarginPct || 15}% | Opex Max: ${formatShortRupiah(branch.targetMaxOpexPerMonth || 54000000)}/bln
- Akar Masalah Terdeteksi: ${weakFactors.map((f) => f.title).join(', ') || branch.diagnosisSummary || 'Efisiensi Toko'}

Buat 3 Milestone Utama (Fase 1: Penyelamatan/BEP Bulan 1, Fase 2: Pertumbuhan Profit Bulan 2, Fase 3: Autopilot & Lulus DPK Bulan 4).
Masing-masing milestone harus memiliki 3-4 tugas spesifik untuk KTB, Kasir, atau Pramuniaga.

Format JSON Output:
[
  {
    "id": "ms-1",
    "branchId": "${branch.id}",
    "phase": "fase_1",
    "monthNumber": 1,
    "weekNumber": 1,
    "title": "M1: Judul Milestone Fase 1",
    "targetMetric": "Target Angka Rupiah / Opex Spesifik",
    "status": "in_progress",
    "tasks": [
      {
        "id": "t-1",
        "title": "Judul tugas aksi konkret",
        "assignedTo": "KTB",
        "frequency": "harian",
        "completed": false,
        "verifiedBySpv": false
      }
    ]
  }
]`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1200,
            responseMimeType: 'application/json'
          }
        })
      }
    );

    if (!response.ok) {
      return generateSmartActionPlan(branch, performanceHistory);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const parsed = JSON.parse(rawText);

    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((m, idx) => ({
        ...m,
        id: `ms-gemini-${branch.id}-w${m.weekNumber || idx + 1}`,
        branchId: branch.id,
        tasks: (m.tasks || []).map((t: any, tIdx: number) => ({
          ...t,
          id: `t-gemini-${Date.now()}-${idx}-${tIdx}`,
          completed: false,
          verifiedBySpv: false
        }))
      }));
    }

    return generateSmartActionPlan(branch, performanceHistory);
  } catch (err) {
    console.warn('Gemini Action Plan failed, using local generator:', err);
    return generateSmartActionPlan(branch, performanceHistory);
  }
};
