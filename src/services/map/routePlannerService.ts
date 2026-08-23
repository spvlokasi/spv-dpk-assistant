import { Branch } from '../../types';
import { getBranchCoordinates } from './branchCoordinates';

export const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

export const calculateTotalRouteDistance = (branches: Branch[]): number => {
  if (branches.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < branches.length - 1; i++) {
    const c1 = getBranchCoordinates(branches[i]);
    const c2 = getBranchCoordinates(branches[i + 1]);
    total += calculateDistanceKm(c1.lat, c1.lng, c2.lat, c2.lng);
  }
  return Math.round(total * 10) / 10;
};

export const generateGoogleMapsRouteUrl = (branches: Branch[]): string => {
  if (branches.length === 0) return 'https://maps.google.com';
  const coords = branches.map((b) => {
    const c = getBranchCoordinates(b);
    return `${c.lat},${c.lng}`;
  });
  if (coords.length === 1) return `https://www.google.com/maps/search/?api=1&query=${coords[0]}`;
  return `https://www.google.com/maps/dir/${coords.join('/')}`;
};
