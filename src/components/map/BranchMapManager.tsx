import React, { useState, useMemo } from 'react';
import { Branch } from '../../types';
import { getBranchCoordinates } from '../../services/map';
import { BranchMapHeader } from './BranchMapHeader';
import { BranchMapLeaflet } from './BranchMapLeaflet';
import { BranchMapPopupCard } from './BranchMapPopupCard';
import { RoutePlannerPanel } from './RoutePlannerPanel';

interface BranchMapManagerProps {
  branches: Branch[];
  onNavigateToDetail?: (branchId: string) => void;
}

export const BranchMapManager: React.FC<BranchMapManagerProps> = ({ branches, onNavigateToDetail }) => {
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(branches[0]?.id || null);
  const [routeBranchIds, setRouteBranchIds] = useState<string[]>([]);

  const filteredBranches = useMemo(() => {
    return branches.filter((b) => {
      const city = getBranchCoordinates(b).city;
      const matchCity = selectedCity === 'all' || city === selectedCity;
      const isCritical = b.status === 'akut' || b.status === 'kritis';
      const matchStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'kritis' && isCritical) ||
        (selectedStatus === 'dalam_progres' && b.status === 'dalam_progres') ||
        (selectedStatus === 'siap_lulus' && (b.status === 'siap_lulus' || b.status === 'lulus_dpk'));
      return matchCity && matchStatus;
    });
  }, [branches, selectedCity, selectedStatus]);

  const selectedBranch = branches.find((b) => b.id === selectedBranchId) || filteredBranches[0] || null;

  const handleToggleRoute = (id: string) => {
    if (routeBranchIds.includes(id)) setRouteBranchIds(routeBranchIds.filter((item) => item !== id));
    else setRouteBranchIds([...routeBranchIds, id]);
  };

  return (
    <div className="space-y-4">
      <BranchMapHeader branches={branches} selectedCity={selectedCity} onSelectCity={setSelectedCity} selectedStatus={selectedStatus} onSelectStatus={setSelectedStatus} routeCount={routeBranchIds.length} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-2 h-[480px] sm:h-[540px]">
          <BranchMapLeaflet branches={filteredBranches} selectedBranchId={selectedBranchId} routeBranchIds={routeBranchIds} onSelectBranch={setSelectedBranchId} />
        </div>
        <div className="space-y-4">
          {selectedBranch && (
            <BranchMapPopupCard branch={selectedBranch} onNavigateToDetail={onNavigateToDetail} onAddToRoute={handleToggleRoute} isInRoute={routeBranchIds.includes(selectedBranch.id)} />
          )}
          <RoutePlannerPanel branches={branches} routeBranchIds={routeBranchIds} onReorderRoute={setRouteBranchIds} onRemoveFromRoute={(id) => setRouteBranchIds(routeBranchIds.filter((item) => item !== id))} onClearRoute={() => setRouteBranchIds([])} />
        </div>
      </div>
    </div>
  );
};
