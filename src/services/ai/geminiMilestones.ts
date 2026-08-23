import { Branch, DailyPerformance, ActionPlanMilestone } from '../../types';
import { generateSmartActionPlan } from '../smartActionPlanGenerator';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export const generateGeminiMilestones = async (
  branch: Branch,
  performanceHistory: DailyPerformance[] = []
): Promise<ActionPlanMilestone[]> => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
    return generateSmartActionPlan(branch, performanceHistory);
  }

  const prompt = `Anda adalah SPV Senior Minimarket TokoBASMALAH.
Buat 4 Milestone Aksi Turnaround untuk toko [${branch.code}] ${branch.name}.
Target: Laba ${branch.targetSalesPerDay}/hari, Margin ${branch.targetMarginPct}%, Biaya Operasional <= ${branch.targetMaxOpexPerMonth}/bln.

Kembalikan HANYA array JSON valid (tanpa markdown):
[
  {
    "title": "M1: Judul Milestone...",
    "targetMetric": "Target terukur...",
    "tasks": [
      { "title": "Deskripsi tugas konkret...", "assignedTo": "KTB", "frequency": "harian" }
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
          generationConfig: { temperature: 0.2, maxOutputTokens: 1500 }
        })
      }
    );

    if (!response.ok) throw new Error('Gemini API request failed');
    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    const timestamp = Date.now();

    return parsed.map((m: any, idx: number) => ({
      id: `ms-gemini-${branch.id}-${idx + 1}`,
      branchId: branch.id,
      weekNumber: idx + 1,
      phase: idx < 2 ? 'fase_1' : idx < 4 ? 'fase_2' : 'fase_3',
      monthNumber: Math.floor(idx / 2) + 1,
      title: m.title,
      targetMetric: m.targetMetric,
      status: idx === 0 ? 'in_progress' : 'pending',
      tasks: (m.tasks || []).map((t: any, tIdx: number) => ({
        id: `t-${timestamp}-${idx + 1}-${tIdx + 1}`,
        title: t.title,
        assignedTo: t.assignedTo || 'KTB',
        frequency: t.frequency || 'harian',
        completed: false,
        verifiedBySpv: false
      }))
    }));
  } catch {
    return generateSmartActionPlan(branch, performanceHistory);
  }
};
