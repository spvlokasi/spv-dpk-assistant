import { Branch, DailyPerformance } from '../../types';
import { generateSmartRetailAnalysis } from '../../components/branch/rca/strategyKnowledgeBank';
import { buildDiagnosisPrompt } from './geminiPromptBuilder';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export interface GeminiDiagnosisResponse {
  diagnosisSummary: string;
  recommendedStrategy: string;
}

export const generateGeminiDiagnosisAndStrategy = async (
  branch: Branch,
  performanceHistory: DailyPerformance[] = []
): Promise<GeminiDiagnosisResponse> => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
    const local = generateSmartRetailAnalysis(branch.name, branch.rootCauses || []);
    return { diagnosisSummary: local.summary, recommendedStrategy: local.strategy };
  }

  const branchPerf = performanceHistory.filter((p) => p.branchId === branch.id);
  const latestPerf = branchPerf.length > 0 ? branchPerf[branchPerf.length - 1] : null;
  const prompt = buildDiagnosisPrompt(branch, latestPerf);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, topP: 0.8, maxOutputTokens: 800 }
        })
      }
    );

    if (!response.ok) throw new Error(`Gemini API Error: ${response.status}`);
    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      diagnosisSummary: parsed.diagnosisSummary || 'Analisa berhasil disusun.',
      recommendedStrategy: parsed.recommendedStrategy || 'Terapkan SOP efisiensi biaya dan up-selling.'
    };
  } catch (error) {
    console.warn('Gemini API call failed, fallback to local knowledge bank:', error);
    const local = generateSmartRetailAnalysis(branch.name, branch.rootCauses || []);
    return { diagnosisSummary: local.summary, recommendedStrategy: local.strategy };
  }
};
