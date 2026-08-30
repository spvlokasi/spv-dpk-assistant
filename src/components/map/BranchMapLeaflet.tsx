import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Branch } from '../../types';
import { getBranchCoordinates } from '../../services/map';

interface BranchMapLeafletProps {
  branches: Branch[];
  selectedBranchId: string | null;
  routeBranchIds?: string[];
  onSelectBranch: (id: string) => void;
}

export const BranchMapLeaflet: React.FC<BranchMapLeafletProps> = ({
  branches, selectedBranchId, routeBranchIds = [], onSelectBranch
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;
    const map = L.map(mapContainerRef.current, { center: [-7.08, 113.35], zoom: 9 });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map);
    markersRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    return () => { map.remove(); mapInstanceRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = markersRef.current;
    if (!map || !layerGroup) return;
    layerGroup.clearLayers();
    if (polylineRef.current) { polylineRef.current.remove(); polylineRef.current = null; }

    const bounds = L.latLngBounds([]);
    const routeCoords: [number, number][] = [];
    const seenMap: Record<string, number> = {};

    branches.forEach((b) => {
      const coords = getBranchCoordinates(b);
      let lat = coords.lat;
      let lng = coords.lng;
      const key = `${lat.toFixed(4)}_${lng.toFixed(4)}`;
      if (seenMap[key] != null) {
        seenMap[key] += 1;
        const count = seenMap[key];
        lat += Math.sin(count * 1.05) * (0.002 * count);
        lng += Math.cos(count * 1.05) * (0.002 * count);
      } else {
        seenMap[key] = 0;
      }

      const isSelected = b.id === selectedBranchId;
      const isCritical = b.status === 'akut' || b.status === 'kritis';
      const isProgress = b.status === 'dalam_progres';
      const color = isCritical ? '#f43f5e' : isProgress ? '#f59e0b' : '#10b981';
      const size = isSelected ? 36 : 28;

      const icon = L.divIcon({
        className: 'custom-basmalah-marker',
        html: `<div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -50%);"><div style="background: white; border: 2.5px solid ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; box-shadow: 0 3px 10px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 2px;"><img src="/logo.png" alt="Basmalah" style="width: 100%; height: 100%; object-fit: contain;" /></div><div style="background: ${color}; color: white; font-size: 8px; font-weight: 800; font-family: monospace; padding: 1px 3px; border-radius: 3px; margin-top: -3px; box-shadow: 0 1px 4px rgba(0,0,0,0.3); border: 1px solid white; white-space: nowrap;">${b.code}</div></div>`,
        iconSize: [size, size + 14], iconAnchor: [size / 2, size / 2]
      });

      const marker = L.marker([lat, lng], { icon }).addTo(layerGroup);
      marker.on('click', () => onSelectBranch(b.id));
      bounds.extend([lat, lng]);
    });

    if (routeBranchIds.length > 1) {
      routeBranchIds.forEach((id) => {
        const b = branches.find((item) => item.id === id);
        if (b) { const c = getBranchCoordinates(b); routeCoords.push([c.lat, c.lng]); }
      });
      if (routeCoords.length > 1) {
        polylineRef.current = L.polyline(routeCoords, { color: '#10b981', weight: 4, dashArray: '6, 8' }).addTo(map);
      }
    }

    if (branches.length > 1 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    } else if (branches.length === 1 && bounds.isValid()) {
      map.setView(bounds.getCenter(), 13);
    }
  }, [branches, selectedBranchId, routeBranchIds, onSelectBranch]);

  return <div ref={mapContainerRef} className="w-full h-full min-h-[420px] rounded-2xl overflow-hidden border border-slate-800 z-0" />;
};
