import { useState } from 'react';
import { Branch, PromoVoucher } from '../../../../types';
import { formatRupiah } from '../../../../utils/formatters';
import { PROPOSAL_PRESETS, ProposalPreset } from './proposalPresetsData';

export const useProposalForm = (branch: Branch, onApplyVoucherToStore?: (voucher: PromoVoucher) => void) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('yakult');
  const [activePreset, setActivePreset] = useState<ProposalPreset>(PROPOSAL_PRESETS[0]);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [copiedWA, setCopiedWA] = useState(false);
  const [voucherInstalled, setVoucherInstalled] = useState(false);

  const [companyName, setCompanyName] = useState(activePreset.companyName);
  const [brandName, setBrandName] = useState(activePreset.brandName);
  const [picName, setPicName] = useState(activePreset.picName);
  const [programTitle, setProgramTitle] = useState(activePreset.programTitle);
  const [focusProducts, setFocusProducts] = useState(activePreset.focusProducts);
  const [backgroundStory, setBackgroundStory] = useState(activePreset.backgroundStory);
  const [discountPerUnit, setDiscountPerUnit] = useState(activePreset.discountPerUnit);
  const [minSpend, setMinSpend] = useState(activePreset.minSpend);
  const [voucherQuota, setVoucherQuota] = useState(activePreset.voucherQuota);
  const [targetSalesUnits, setTargetSalesUnits] = useState(activePreset.targetSalesUnits);
  const [targetOmzet, setTargetOmzet] = useState(activePreset.targetOmzet);
  const [fundingScheme, setFundingScheme] = useState<'supplier' | 'joint' | 'store'>(activePreset.fundingScheme);
  const [proposalNo, setProposalNo] = useState(`047/PROP-DPK/BASMALAH/${new Date().getFullYear()}`);
  const [spvSignName, setSpvSignName] = useState(activePreset.spvSignName);
  const [ktbSignName, setKtbSignName] = useState(branch.name);

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const found = PROPOSAL_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setActivePreset(found);
      setCompanyName(found.companyName); setBrandName(found.brandName); setPicName(found.picName);
      setProgramTitle(found.programTitle); setFocusProducts(found.focusProducts);
      setBackgroundStory(found.backgroundStory); setDiscountPerUnit(found.discountPerUnit);
      setMinSpend(found.minSpend); setVoucherQuota(found.voucherQuota);
      setTargetSalesUnits(found.targetSalesUnits); setTargetOmzet(found.targetOmzet);
      setFundingScheme(found.fundingScheme); setSpvSignName(found.spvSignName);
      setKtbSignName(branch.name); setVoucherInstalled(false);
    }
  };

  const totalSponsorBudget = discountPerUnit * voucherQuota;
  const supplierContribution = fundingScheme === 'supplier' ? totalSponsorBudget : fundingScheme === 'joint' ? totalSponsorBudget / 2 : 0;

  const handleCopyWA = () => {
    const text = `*PROPOSAL KERJASAMA TRADE PROMO TOKOBASMALAH*\n\nKepada Yth.\n*${companyName}*\nU.p. ${picName}\n\nAssalamu'alaikum Wr. Wb.\nSehubungan program akselerasi omzet gerai *${branch.name}*, kami mengajukan penawaran program promosi *${programTitle}*:\n\n• Produk Fokus: ${focusProducts}\n• Target Penjualan: ${targetSalesUnits} unit / omzet ${formatRupiah(targetOmzet)}\n• Diskon: Kupon ${formatRupiah(discountPerUnit)} (Kuota ${voucherQuota} kupon)\n• Skema: ${fundingScheme === 'supplier' ? '100% Sponsor Principal' : fundingScheme === 'joint' ? 'Sharing 50:50' : 'Mandiri Toko'}\n\nWassalamu'alaikum Wr. Wb.\n*${spvSignName} (SPV DPK)* & *Kepala Toko ${branch.name}*`;
    navigator.clipboard.writeText(text);
    setCopiedWA(true);
    setTimeout(() => setCopiedWA(false), 2500);
  };

  const handleInstallVoucher = () => {
    if (onApplyVoucherToStore) {
      const vCode = `${brandName.replace(/\s+/g, '').toUpperCase().slice(0, 5)}${Math.round(discountPerUnit / 1000)}K`;
      onApplyVoucherToStore({
        id: `vouch-supp-${Date.now()}`, branchId: branch.id, code: vCode,
        discountAmount: discountPerUnit, minSpend, quota: voucherQuota, claimedCount: 0,
        usedCount: 0, validUntil: '2026-12-31', isActive: true,
        description: `Promo Spesial ${brandName} - Potongan ${formatRupiah(discountPerUnit)} min. belanja ${formatRupiah(minSpend)}`,
        fundingSource: fundingScheme, sponsorName: brandName
      });
      setVoucherInstalled(true);
      setTimeout(() => setVoucherInstalled(false), 3000);
    }
  };

  return {
    selectedPresetId, activeTab, setActiveTab, copiedWA, voucherInstalled,
    companyName, setCompanyName, brandName, setBrandName, picName, setPicName,
    programTitle, setProgramTitle, focusProducts, setFocusProducts,
    backgroundStory, setBackgroundStory, discountPerUnit, setDiscountPerUnit,
    minSpend, setMinSpend, voucherQuota, setVoucherQuota,
    targetSalesUnits, targetOmzet, fundingScheme, setFundingScheme,
    proposalNo, setProposalNo, spvSignName, setSpvSignName,
    ktbSignName, setKtbSignName, totalSponsorBudget, supplierContribution,
    handleSelectPreset, handleCopyWA, handleInstallVoucher
  };
};
