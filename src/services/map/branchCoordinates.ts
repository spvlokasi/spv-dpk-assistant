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
  W1001: { lat: -6.9850, lng: 112.5620, city: 'Gresik' },
  'T-102': { lat: -7.1610, lng: 113.4680, city: 'Pamekasan' },
  'T-208': { lat: -7.1550, lng: 113.4820, city: 'Pamekasan' },
  'T-315': { lat: -7.1680, lng: 113.4600, city: 'Pamekasan' }
};

export const getBranchCoordinates = (branch: Branch): { lat: number; lng: number; city: string } => {
  if (branch.code && DEFAULT_COORDS[branch.code]) {
    return DEFAULT_COORDS[branch.code];
  }

  const name = (branch.name || '').toLowerCase();
  const address = (branch.address || '').toLowerCase();
  const text = `${name} ${address}`;

  if (text.includes('bugih')) return { lat: -7.1582, lng: 113.4735, city: 'Pamekasan' };
  if (text.includes('pademawu')) return { lat: -7.1725, lng: 113.5180, city: 'Pamekasan' };
  if (text.includes('sotabar') || text.includes('pasean')) return { lat: -6.8850, lng: 113.5420, city: 'Pamekasan' };
  if (text.includes('tlangoh') || text.includes('tanjungbumi')) return { lat: -7.0420, lng: 113.1150, city: 'Bangkalan' };
  if (text.includes('tengket') || text.includes('arosbaya')) return { lat: -7.0150, lng: 112.9800, city: 'Bangkalan' };
  if (text.includes('kalianget')) return { lat: -7.0540, lng: 113.8920, city: 'Sumenep' };
  if (text.includes('sumenep')) return { lat: -7.0160, lng: 113.8640, city: 'Sumenep' };
  if (text.includes('sidayu')) return { lat: -6.9850, lng: 112.5620, city: 'Gresik' };
  if (text.includes('gresik')) return { lat: -7.1566, lng: 112.6555, city: 'Gresik' };
  if (text.includes('sampang')) return { lat: -7.1872, lng: 113.2394, city: 'Sampang' };
  if (text.includes('bangkalan')) return { lat: -7.0315, lng: 112.7483, city: 'Bangkalan' };
  if (text.includes('pasuruan')) return { lat: -7.6453, lng: 112.9075, city: 'Pasuruan' };
  if (text.includes('veteran')) return { lat: -7.1610, lng: 113.4680, city: 'Pamekasan' };
  if (text.includes('diponegoro')) return { lat: -7.1550, lng: 113.4820, city: 'Pamekasan' };
  if (text.includes('merdeka')) return { lat: -7.1680, lng: 113.4600, city: 'Pamekasan' };

  if (
    branch.latitude != null &&
    branch.longitude != null &&
    (Math.abs(branch.latitude - (-7.1595)) > 0.0001 || Math.abs(branch.longitude - 113.4735) > 0.0001) &&
    branch.latitude !== 0 &&
    branch.longitude !== 0
  ) {
    const city = branch.city && branch.city !== 'Jawa Timur' ? branch.city : 'Pamekasan';
    return { lat: branch.latitude, lng: branch.longitude, city };
  }

  const hash = (branch.id || branch.code || 'branch')
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const offsetLat = ((hash % 17) - 8) * 0.008;
  const offsetLng = (((hash * 7) % 19) - 9) * 0.008;

  return {
    lat: -7.1582 + offsetLat,
    lng: 113.4735 + offsetLng,
    city: branch.city && branch.city !== 'Jawa Timur' ? branch.city : 'Pamekasan'
  };
};
