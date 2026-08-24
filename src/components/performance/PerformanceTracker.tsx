import React, { useState, useEffect, useMemo } from 'react';
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
  onBulkAddPerformance?: (entries: DailyPerformance[]) => void;
  onDeletePerformance: (id: string) => void;
}

export const PerformanceTracker: React.FC<PerformanceTrackerProps> = ({
  branches, performance, selectedBranchId, onAddPerformance, onBulkAddPerformance, onDeletePerformance
}) => {
  const [activeBranchId, setActiveBranchId] = useState<string>(selectedBranchId || branches[0]?.id || '');
  const currentMonthKey = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    const validId = selectedBranchId || branches[0]?.id || '';
    if (validId && (!activeBranchId || !branches.some((b) => b.id === activeBranchId))) {
      setActiveBranchId(validId);
    }
  }, [selectedBranchId, branches, activeBranchId]);

  const targetBranchId = activeBranchId || selectedBranchId || branches[0]?.id || '';
  const currentBranch = branches.find((b) => b.id === targetBranchId) || branches[0];

  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>([currentMonthKey]);
    performance.forEach((p) => { if (p.date?.length >= 7) monthsSet.add(p.date.slice(0, 7)); });
    return Array.from(monthsSet).sort((a, b) => b.localeCompare(a)).map((ym) => ({ value: ym, label: formatMonthYearIndo(ym) }));
  }, [performance, currentMonthKey]);

  const branchPerf = useMemo(() => {
    return performance
      .filter((p) => (p.branchId === targetBranchId || (currentBranch && p.branchId === currentBranch.code)) && (selectedMonth === 'all' || p.date.startsWith(selectedMonth)))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [performance, targetBranchId, currentBranch, selectedMonth]);

  const totalSales = branchPerf.reduce((acc, p) => acc + p.salesActual, 0);
  const avgSales = branchPerf.length > 0 ? Math.round(totalSales / branchPerf.length) : 0;
  const totalTraffic = branchPerf.reduce((acc, p) => acc + p.trafficCount, 0);
  const avgTrafficPerDay = branchPerf.length > 0 ? Math.round(totalTraffic / branchPerf.length) : 0;
  const avgBasket = branchPerf.length > 0 ? Math.round(branchPerf.reduce((acc, p) => acc + p.basketSize, 0) / branchPerf.length) : 0;

  const handleImport = (entries: DailyPerformance[]) => {
    if (onBulkAddPerformance) onBulkAddPerformance(entries);
    else entries.forEach((e) => onAddPerformance(e));
  };

  return (
    <div className="space-y-6">
      <PerformanceFilterBar branches={branches} activeBranchId={targetBranchId} onSelectBranch={setActiveBranchId} selectedMonth={selectedMonth} onSelectMonth={setSelectedMonth} availableMonths={availableMonths} onOpenAddModal={() => setShowModal(true)} onOpenImportModal={() => setShowImportModal(true)} />
      <PerformanceKpiCards avgSales={avgSales} totalTraffic={totalTraffic} avgTrafficPerDay={avgTrafficPerDay} avgBasket={avgBasket} targetSalesPerDay={currentBranch?.targetSalesPerDay || 1500000} totalDays={branchPerf.length} />
      <PerformanceDataTable branchPerf={branchPerf} targetSalesPerDay={currentBranch?.targetSalesPerDay || 1500000} onDeletePerformance={onDeletePerformance} />
      {showModal && <PerformanceInputModal branch={currentBranch} onSave={onAddPerformance} onClose={() => setShowModal(false)} />}
      {showImportModal && <PerformanceImportModal branches={branches} activeBranch={currentBranch} onImport={handleImport} onClose={() => setShowImportModal(false)} />}
    </div>
  );
};
