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
    const map = L.map(mapContainerRef.current, { center: [-7.05, 113.3], zoom: 9 });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);
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

    branches.forEach((b) => {
      const { lat, lng } = getBranchCoordinates(b);
      const isSelected = b.id === selectedBranchId;
      const isCritical = b.status === 'akut' || b.status === 'kritis';
      const isProgress = b.status === 'dalam_progres';
      const color = isCritical ? '#f43f5e' : isProgress ? '#f59e0b' : '#10b981';

      const icon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="background-color: ${color}; width: ${isSelected ? '24px' : '18px'}; height: ${isSelected ? '24px' : '18px'}; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px;">${b.code.replace('M', '')}</div>`,
        iconSize: [24, 24], iconAnchor: [12, 12]
      });

      const marker = L.marker([lat, lng], { icon }).addTo(layerGroup);
      marker.on('click', () => onSelectBranch(b.id));
      bounds.extend([lat, lng]);
    });

    // Draw route polyline if multiple branches in route
    if (routeBranchIds.length > 1) {
      routeBranchIds.forEach((id) => {
        const b = branches.find((item) => item.id === id);
        if (b) { const c = getBranchCoordinates(b); routeCoords.push([c.lat, c.lng]); }
      });
      if (routeCoords.length > 1) {
        polylineRef.current = L.polyline(routeCoords, { color: '#10b981', weight: 4, dashArray: '6, 8' }).addTo(map);
      }
    }

    if (branches.length > 0 && bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40] });
  }, [branches, selectedBranchId, routeBranchIds, onSelectBranch]);

  return <div ref={mapContainerRef} className="w-full h-full min-h-[420px] rounded-2xl overflow-hidden border border-slate-800 z-0" />;
};
