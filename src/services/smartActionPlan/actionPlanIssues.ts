import { Branch, DailyPerformance } from '../../types';

export const detectBranchIssues = (branch: Branch, performanceHistory: DailyPerformance[] = []) => {
  const branchPerf = performanceHistory.filter(p => p.branchId === branch.id);
  const latestPerf = branchPerf.length > 0 ? branchPerf[branchPerf.length - 1] : null;

  const targetSales = branch.targetSalesPerDay || 1500000;
  const targetMargin = branch.targetMarginPct || 15;
  const targetOpex = branch.targetMaxOpexPerMonth || 54000000;

  const actualSales = latestPerf ? latestPerf.salesActual : targetSales * 0.7;
  const actualMargin = latestPerf ? latestPerf.marginPct : Math.max(targetMargin - 4, 8);

  const weakRootCauses = branch.rootCauses ? branch.rootCauses.filter(f => f.score <= 2) : [];
  const moderateRootCauses = branch.rootCauses ? branch.rootCauses.filter(f => f.score === 3) : [];

  const hasElectricityIssue = weakRootCauses.some(f => f.title.toLowerCase().includes('listrik') || f.title.toLowerCase().includes('energi')) ||
    branch.diagnosisSummary?.toLowerCase().includes('listrik') || branch.diagnosisSummary?.toLowerCase().includes('ac');

  const hasStockIssue = weakRootCauses.some(f => f.title.toLowerCase().includes('stok') || f.title.toLowerCase().includes('barang') || f.title.toLowerCase().includes('sku')) ||
    branch.diagnosisSummary?.toLowerCase().includes('stok') || branch.diagnosisSummary?.toLowerCase().includes('oos');

  const hasMarginIssue = actualMargin < targetMargin || weakRootCauses.some(f => f.title.toLowerCase().includes('margin') || f.title.toLowerCase().includes('laba'));
  const hasShrinkageIssue = weakRootCauses.some(f => f.title.toLowerCase().includes('susut') || f.title.toLowerCase().includes('nkl') || f.title.toLowerCase().includes('hilang'));
  const hasTrafficIssue = weakRootCauses.some(f => f.title.toLowerCase().includes('traffic') || f.title.toLowerCase().includes('pengunjung') || f.title.toLowerCase().includes('pelanggan'));

  return {
    targetSales, targetMargin, targetOpex, actualSales, actualMargin,
    hasElectricityIssue, hasStockIssue, hasMarginIssue, hasShrinkageIssue, hasTrafficIssue,
    weakRootCauses, moderateRootCauses
  };
};
