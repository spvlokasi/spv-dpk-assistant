import React from 'react';
import { Save, Loader2 } from 'lucide-react';
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
    <div className="space-y-6 max-w-5xl mx-auto pb-16 relative">
      <BranchHeaderProfile
        data={rca.data}
        isSaved={rca.isSaved}
        isSaving={rca.isSaving}
        isDirty={rca.isDirty}
        onSave={rca.handleSave}
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
          onSaveDiagnosa={rca.handleSave}
          isSaving={rca.isSaving}
        />
        <RcaFactorSection
          category="eksternal"
          factors={rca.eksternalFactors}
          onAddFactor={() => rca.addDefaultRcaFactor('eksternal')}
          onUpdateFactor={rca.handleUpdateFactor}
          onDeleteFactor={rca.handleRemoveFactor}
          onSaveDiagnosa={rca.handleSave}
          isSaving={rca.isSaving}
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
            onSave={rca.handleSave}
            isSaving={rca.isSaving}
          />
        </div>
      </div>

      {/* Floating Save Reminder when changes exist */}
      {rca.isDirty && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 border border-amber-500/60 backdrop-blur-md px-4 sm:px-5 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 text-xs max-w-md w-[92%] ring-1 ring-amber-500/20 animate-fade-in">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping flex-shrink-0" />
            <span className="text-slate-200 font-medium truncate">Ada perubahan akar masalah belum disimpan</span>
          </div>
          <button
            type="button"
            onClick={rca.handleSave}
            disabled={rca.isSaving}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950 transition-all active:scale-95 whitespace-nowrap flex-shrink-0"
          >
            {rca.isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Simpan ke DB</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
