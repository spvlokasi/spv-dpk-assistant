export interface ProposalPreset {
  id: string;
  name: string;
  companyName: string;
  brandName: string;
  picName: string;
  programTitle: string;
  focusProducts: string;
  productCategory: string;
  discountPerUnit: number;
  minSpend: number;
  voucherQuota: number;
  targetSalesUnits: number;
  targetOmzet: number;
  fundingScheme: 'supplier' | 'joint' | 'store';
  backgroundStory: string;
  spvSignName: string;
  ktbSignName: string;
}

export const PROPOSAL_PRESETS: ProposalPreset[] = [
  {
    id: 'yakult',
    name: '🍶 PT Yakult Indonesia Persada',
    companyName: 'PT Yakult Indonesia Persada',
    brandName: 'Yakult',
    picName: 'Bpk. Hendra Gunawan (Area Sales Manager)',
    programTitle: 'Program Co-Marketing "Keluarga Sehat & Berkah TokoBasmalah"',
    focusProducts: 'Yakult Minuman Probiotik Fermentasi (Pack isi 5 botol)',
    productCategory: 'Minuman Segar & Sehat',
    discountPerUnit: 2000,
    minSpend: 25000,
    voucherQuota: 100,
    targetSalesUnits: 500,
    targetOmzet: 5500000,
    fundingScheme: 'supplier',
    backgroundStory: 'Peningkatan penetrasi konsumsi harian keluarga binaan TokoBasmalah melalui bundling sembako digital dan potongan harga khusus yang didukung penuh oleh Principal.',
    spvSignName: 'M. Maskur',
    ktbSignName: 'Kepala Toko'
  },
  {
    id: 'kanzler',
    name: '🌭 PT Macroprima Panganutama (Kanzler)',
    companyName: 'PT Macroprima Panganutama (Cimory Group)',
    brandName: 'Kanzler',
    picName: 'Ibu Ratna Dewi (Key Account Executive Jatim)',
    programTitle: 'Festival Gebyar Frozen Food & Sosis Siap Saji Hemat',
    focusProducts: 'Kanzler Singles (Original, Keju, Hot, Crispy) & Kanzler Cocktail Sausage',
    productCategory: 'Makanan Siap Saji & Olahan Daging',
    discountPerUnit: 3500,
    minSpend: 35000,
    voucherQuota: 150,
    targetSalesUnits: 750,
    targetOmzet: 9750000,
    fundingScheme: 'supplier',
    backgroundStory: 'Pemasaran intensif produk ready-to-eat & sosis viral Kanzler pada etalase katalog utama dengan voucher potongan harga instan via WhatsApp delivery.',
    spvSignName: 'M. Maskur',
    ktbSignName: 'Kepala Toko'
  },
  {
    id: 'unilever',
    name: '🧴 PT Unilever Indonesia Tbk',
    companyName: 'PT Unilever Indonesia Tbk',
    brandName: 'Unilever',
    picName: 'Bpk. Firman Syah (Distributor Trade Specialist)',
    programTitle: 'Program Rumah Bersih & Keluarga Higienis Basmalah',
    focusProducts: 'Sunlight Jeruk Nipis 700ml, Rinso Molto 770g, Lifebuoy Sabun 4x110g',
    productCategory: 'Kebutuhan Kebersihan Rumah Tangga',
    discountPerUnit: 3000,
    minSpend: 40000,
    voucherQuota: 120,
    targetSalesUnits: 600,
    targetOmzet: 8400000,
    fundingScheme: 'joint',
    backgroundStory: 'Program sharing margin 50:50 untuk mendongkrak basket size belanja ibu rumah tangga pada kategori fast moving home care.',
    spvSignName: 'M. Maskur',
    ktbSignName: 'Kepala Toko'
  }
];
