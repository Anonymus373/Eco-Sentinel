import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { motion } from "framer-motion";
import { districts, type District, type RiskLevel } from "@/data/mockData";
import "leaflet/dist/leaflet.css";

const riskColors: Record<RiskLevel, string> = {
  low: "#2dd4a0",
  drift: "#eab308",
  collapse: "#f97316",
  immediate: "#ef4444",
};

const riskRadius: Record<RiskLevel, number> = {
  low: 8,
  drift: 12,
  collapse: 16,
  immediate: 20,
};

interface EcoMapProps {
  onDistrictSelect: (district: District) => void;
  selectedDistrict: District | null;
}

const MapController = () => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
};

const EcoMap = ({ onDistrictSelect, selectedDistrict }: EcoMapProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="glass-panel overflow-hidden h-full"
    >
      <div className="px-4 py-2 border-b border-border flex items-center justify-between">
        <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Aravalli Corridor — Risk Overlay
        </h3>
        <div className="flex items-center gap-3">
          {(["low", "drift", "collapse", "immediate"] as RiskLevel[]).map((level) => (
            <div key={level} className="flex items-center gap-1">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: riskColors[level] }}
              />
              <span className="text-[9px] font-mono text-muted-foreground capitalize">{level}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="h-[calc(100%-36px)]">
        <MapContainer
          center={[26.5, 75.5]}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
          zoomControl={true}
          attributionControl={false}
        >
          <MapController />
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          {districts.map((d) => (
            <CircleMarker
              key={d.id}
              center={[d.lat, d.lng]}
              radius={riskRadius[d.riskLevel]}
              pathOptions={{
                color: riskColors[d.riskLevel],
                fillColor: riskColors[d.riskLevel],
                fillOpacity: selectedDistrict?.id === d.id ? 0.8 : 0.35,
                weight: selectedDistrict?.id === d.id ? 3 : 1.5,
              }}
              eventHandlers={{
                click: () => onDistrictSelect(d),
              }}
            >
              <Popup className="eco-popup">
                <div className="text-xs font-mono">
                  <p className="font-bold">{d.name}, {d.state}</p>
                  <p>ECRS: {d.riskScore}</p>
                  <p>Risk: {d.riskLevel.toUpperCase()}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </motion.div>
  );
};

export default EcoMap;
