import React, { useState, useMemo } from 'react';
import { Branch, DailyPerformance } from '../../types';
import { formatMonthYearIndo } from '../../utils/formatters';
import { PerformanceFilterBar } from './PerformanceFilterBar';
import { PerformanceKpiCards } from './PerformanceKpiCards';
import { PerformanceDataTable } from './PerformanceDataTable';
import { PerformanceInputModal } from './PerformanceInputModal';
import { PerformanceImportModal } from './PerformanceImportModal';

interface PerformanceTrackerProps {
  branches: Branch[];
  performance: DailyPerformance[];
  selectedBranchId?: string;
  onAddPerformance: (entry: DailyPerformance) => void;
  onDeletePerformance: (id: string) => void;
}

export const PerformanceTracker: React.FC<PerformanceTrackerProps> = ({
  branches,
  performance,
  selectedBranchId,
  onAddPerformance,
  onDeletePerformance
}) => {
  const [activeBranchId, setActiveBranchId] = useState<string>(selectedBranchId || (branches[0]?.id || ''));
  const currentMonthKey = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const currentBranch = branches.find((b) => b.id === activeBranchId);

  // Available unique months from performance + current month
  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>([currentMonthKey]);
    performance.forEach((p) => {
      if (p.date && p.date.length >= 7) monthsSet.add(p.date.slice(0, 7));
    });
    return Array.from(monthsSet)
      .sort((a, b) => b.localeCompare(a))
      .map((ym) => ({ value: ym, label: formatMonthYearIndo(ym) }));
  }, [performance, currentMonthKey]);

  // Filtered performance by Branch & Month
  const branchPerf = useMemo(() => {
    return performance
      .filter((p) => p.branchId === activeBranchId && (selectedMonth === 'all' || p.date.startsWith(selectedMonth)))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [performance, activeBranchId, selectedMonth]);

  // KPIs
  const totalSales = branchPerf.reduce((acc, p) => acc + p.salesActual, 0);
  const avgSales = branchPerf.length > 0 ? Math.round(totalSales / branchPerf.length) : 0;
  const totalTraffic = branchPerf.reduce((acc, p) => acc + p.trafficCount, 0);
  const avgTrafficPerDay = branchPerf.length > 0 ? Math.round(totalTraffic / branchPerf.length) : 0;
  const avgBasket = branchPerf.length > 0 ? Math.round(branchPerf.reduce((acc, p) => acc + p.basketSize, 0) / branchPerf.length) : 0;

  const handleBulkImport = (entries: DailyPerformance[]) => {
    entries.forEach((entry) => onAddPerformance(entry));
  };

  return (
    <div className="space-y-6">
      <PerformanceFilterBar branches={branches} activeBranchId={activeBranchId} onSelectBranch={setActiveBranchId} selectedMonth={selectedMonth} onSelectMonth={setSelectedMonth} availableMonths={availableMonths} onOpenAddModal={() => setShowModal(true)} onOpenImportModal={() => setShowImportModal(true)} />

      <PerformanceKpiCards avgSales={avgSales} totalTraffic={totalTraffic} avgTrafficPerDay={avgTrafficPerDay} avgBasket={avgBasket} targetSalesPerDay={currentBranch?.targetSalesPerDay || 1500000} totalDays={branchPerf.length} />

      <PerformanceDataTable branchPerf={branchPerf} targetSalesPerDay={currentBranch?.targetSalesPerDay || 1500000} onDeletePerformance={onDeletePerformance} />

      {showModal && <PerformanceInputModal branch={currentBranch} onSave={onAddPerformance} onClose={() => setShowModal(false)} />}

      {showImportModal && <PerformanceImportModal branches={branches} activeBranch={currentBranch} onImport={handleBulkImport} onClose={() => setShowImportModal(false)} />}
    </div>
  );
};
