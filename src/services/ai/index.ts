import { generateGeminiDiagnosisAndStrategy, GeminiDiagnosisResponse } from './geminiDiagnosis';
import { generateGeminiMilestones } from './geminiMilestones';

export {
  generateGeminiDiagnosisAndStrategy,
  generateGeminiMilestones,
  generateGeminiMilestones as generateGeminiActionPlan
};
export type { GeminiDiagnosisResponse };
