import React, { useState } from 'react';
import { Branch, DailyPerformance } from '../../types';
import { PerformanceHeaderBar } from './PerformanceHeaderBar';
import { PerformanceDataTable } from './PerformanceDataTable';
import { PerformanceInputModal } from './PerformanceInputModal';

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
  const [activeBranchId, setActiveBranchId] = useState<string>(
    selectedBranchId || (branches[0]?.id || '')
  );
  const [showModal, setShowModal] = useState(false);

  const currentBranch = branches.find((b) => b.id === activeBranchId);
  const branchPerf = performance
    .filter((p) => p.branchId === activeBranchId)
    .sort((a, b) => a.date.localeCompare(b.date));

  // Aggregated KPIs
  const totalSales = branchPerf.reduce((acc, p) => acc + p.salesActual, 0);
  const avgSales = branchPerf.length > 0 ? Math.round(totalSales / branchPerf.length) : 0;
  const avgMargin =
    branchPerf.length > 0
      ? (branchPerf.reduce((acc, p) => acc + p.marginPct, 0) / branchPerf.length).toFixed(1)
      : '0';
  const totalTraffic = branchPerf.reduce((acc, p) => acc + p.trafficCount, 0);
  const avgBasket =
    branchPerf.length > 0
      ? Math.round(branchPerf.reduce((acc, p) => acc + p.basketSize, 0) / branchPerf.length)
      : 0;

  return (
    <div className="space-y-6">
      <PerformanceHeaderBar
        branches={branches}
        activeBranchId={activeBranchId}
        onSelectBranch={setActiveBranchId}
        avgSales={avgSales}
        avgMargin={avgMargin}
        totalTraffic={totalTraffic}
        avgBasket={avgBasket}
        targetSalesPerDay={currentBranch?.targetSalesPerDay || 1500000}
        onOpenAddModal={() => setShowModal(true)}
      />

      <PerformanceDataTable
        branchPerf={branchPerf}
        targetSalesPerDay={currentBranch?.targetSalesPerDay || 1500000}
        onDeletePerformance={onDeletePerformance}
      />

      {showModal && (
        <PerformanceInputModal
          branch={currentBranch}
          onSave={onAddPerformance}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
