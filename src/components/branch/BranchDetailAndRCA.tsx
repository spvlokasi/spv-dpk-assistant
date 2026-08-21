import React from 'react';
import { Branch } from '../../types';
import { BranchHeaderProfile } from './rca/BranchHeaderProfile';
import { BranchPeriodPicker } from './rca/BranchPeriodPicker';
import { BranchFinancialTargets } from './rca/BranchFinancialTargets';
import { RcaFactorSection } from './rca/RcaFactorSection';
import { RcaHealthScoreCard } from './rca/RcaHealthScoreCard';
import { RcaStrategyPlan } from './rca/RcaStrategyPlan';
import { useBranchRca } from './rca/useBranchRca';

interface BranchDetailAndRCAProps {
  branch: Branch;
  onBack: () => void;
  onSaveBranch: (branch: Branch) => void;
  onNavigateToTab: (tab: string) => void;
}

export const BranchDetailAndRCA: React.FC<BranchDetailAndRCAProps> = ({
  branch,
  onSaveBranch
}) => {
  const rca = useBranchRca(branch, onSaveBranch);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <BranchHeaderProfile
        data={rca.data}
        isSaved={rca.isSaved}
        startDate={rca.data.diagnosisStartDate || ''}
        endDate={rca.data.diagnosisEndDate || ''}
        onChangeStartDate={(val) => rca.setData({ ...rca.data, diagnosisStartDate: val })}
        onChangeEndDate={(val) => rca.setData({ ...rca.data, diagnosisEndDate: val })}
        onResetDates={() => rca.setData({ ...rca.data, diagnosisStartDate: '', diagnosisEndDate: '' })}
      />

      <BranchPeriodPicker
        diagnosisLogs={rca.diagnosisLogs}
        onSelectHistoryLog={rca.handleSelectHistoryLog}
      />

      <BranchFinancialTargets
        targetSalesPerDay={rca.data.targetSalesPerDay}
        targetMarginPct={rca.data.targetMarginPct}
        targetMaxOpexPerMonth={rca.data.targetMaxOpexPerMonth}
      />

      {/* 2-Column RCA Factor Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RcaFactorSection
          category="internal"
          factors={rca.internalFactors}
          onAddFactor={() => rca.addDefaultRcaFactor('internal')}
          onUpdateFactor={rca.handleUpdateFactor}
          onDeleteFactor={rca.handleRemoveFactor}
          onLoadPreset={rca.handleApplyPreset}
        />
        <RcaFactorSection
          category="eksternal"
          factors={rca.eksternalFactors}
          onAddFactor={() => rca.addDefaultRcaFactor('eksternal')}
          onUpdateFactor={rca.handleUpdateFactor}
          onDeleteFactor={rca.handleRemoveFactor}
          onSaveDiagnosa={rca.handleSave}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-4">
          <RcaHealthScoreCard avgScore={rca.avgScore} status={rca.data.status} />
        </div>
        <div className="md:col-span-8">
          <RcaStrategyPlan
            diagnosisSummary={rca.data.diagnosisSummary}
            recommendedStrategy={rca.data.recommendedStrategy}
            onChangeSummary={(val) => rca.setData({ ...rca.data, diagnosisSummary: val })}
            onChangeStrategy={(val) => rca.setData({ ...rca.data, recommendedStrategy: val })}
            onGenerateAnalysis={rca.handleGenerateAISummary}
            onClearAnalysis={rca.handleClearAnalysis}
          />
        </div>
      </div>
    </div>
  );
};
