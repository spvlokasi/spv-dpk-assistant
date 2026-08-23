import { Branch } from '../../types';

export interface BranchLocation {
  id: string;
  code: string;
  name: string;
  lat: number;
  lng: number;
  city: string;
}

const DEFAULT_COORDS: Record<string, { lat: number; lng: number; city: string }> = {
  M3017: { lat: -7.1582, lng: 113.4735, city: 'Pamekasan' },
  M3019: { lat: -7.1725, lng: 113.5180, city: 'Pamekasan' },
  M3021: { lat: -6.8850, lng: 113.5420, city: 'Pamekasan' },
  M1026: { lat: -7.0420, lng: 113.1150, city: 'Bangkalan' },
  M1025: { lat: -7.0150, lng: 112.9800, city: 'Bangkalan' },
  M4016: { lat: -7.0540, lng: 113.8920, city: 'Sumenep' },
  W1001: { lat: -6.9850, lng: 112.5620, city: 'Gresik' }
};

export const getBranchCoordinates = (branch: Branch): { lat: number; lng: number; city: string } => {
  if (branch.latitude && branch.longitude) {
    return { lat: branch.latitude, lng: branch.longitude, city: branch.city || 'Jawa Timur' };
  }
  if (DEFAULT_COORDS[branch.code]) return DEFAULT_COORDS[branch.code];
  const name = branch.name.toLowerCase();
  if (name.includes('bugih')) return { lat: -7.1582, lng: 113.4735, city: 'Pamekasan' };
  if (name.includes('pademawu')) return { lat: -7.1725, lng: 113.5180, city: 'Pamekasan' };
  if (name.includes('sotabar')) return { lat: -6.8850, lng: 113.5420, city: 'Pamekasan' };
  if (name.includes('tlangoh')) return { lat: -7.0420, lng: 113.1150, city: 'Bangkalan' };
  if (name.includes('tengket')) return { lat: -7.0150, lng: 112.9800, city: 'Bangkalan' };
  if (name.includes('kalianget')) return { lat: -7.0540, lng: 113.8920, city: 'Sumenep' };
  if (name.includes('sidayu')) return { lat: -6.9850, lng: 112.5620, city: 'Gresik' };
  if (name.includes('pasuruan')) return { lat: -7.6453, lng: 112.9075, city: 'Pasuruan' };
  return { lat: -7.1600 + (Math.random() * 0.05 - 0.025), lng: 113.4800 + (Math.random() * 0.05 - 0.025), city: 'Madura' };
};
