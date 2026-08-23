import { RootCauseFactor, DpkStatus } from '../../../types';

export const getTodayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const getAutoStatus = (factors: RootCauseFactor[], currentStatus: DpkStatus): DpkStatus => {
  if (currentStatus === 'lulus_dpk') return 'lulus_dpk';
  if (!factors || factors.length === 0) return currentStatus;
  const avg = factors.reduce((acc, curr) => acc + curr.score, 0) / factors.length;
  if (avg <= 2.5) return 'kritis';
  if (avg <= 3.8) return 'dalam_progres';
  return 'siap_lulus';
};
