import { useState, useEffect, useCallback, useRef } from "react";
import { districts as baseDistricts, type District, type RiskLevel } from "@/data/mockData";

export interface SatellitePass {
  id: string;
  satellite: string;
  timestamp: Date;
  districtId: string;
  districtName: string;
  oldScore: number;
  newScore: number;
  oldLevel: RiskLevel;
  newLevel: RiskLevel;
  delta: number;
}

const SATELLITES = ["Sentinel-2A", "Landsat-9", "MODIS-Terra", "Cartosat-3", "RISAT-2B"];

const getRiskLevel = (score: number): RiskLevel => {
  if (score >= 80) return "immediate";
  if (score >= 60) return "collapse";
  if (score >= 35) return "drift";
  return "low";
};

export const useLiveSimulation = (enabled: boolean = true) => {
  const [liveDistricts, setLiveDistricts] = useState<District[]>(baseDistricts);
  const [passes, setPasses] = useState<SatellitePass[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [updatingDistrictId, setUpdatingDistrictId] = useState<string | null>(null);
  const passCounter = useRef(0);

  const simulatePass = useCallback(() => {
    setLiveDistricts((prev) => {
      const idx = Math.floor(Math.random() * prev.length);
      const district = prev[idx];
      const delta = Math.round((Math.random() - 0.45) * 8); // slight upward bias
      const newScore = Math.max(5, Math.min(99, district.riskScore + delta));
      const newLevel = getRiskLevel(newScore);

      const pass: SatellitePass = {
        id: `pass-${passCounter.current++}`,
        satellite: SATELLITES[Math.floor(Math.random() * SATELLITES.length)],
        timestamp: new Date(),
        districtId: district.id,
        districtName: district.name,
        oldScore: district.riskScore,
        newScore,
        oldLevel: district.riskLevel,
        newLevel,
        delta,
      };

      setPasses((p) => [pass, ...p].slice(0, 20));
      setLastUpdate(new Date());
      setUpdatingDistrictId(district.id);
      setTimeout(() => setUpdatingDistrictId(null), 1500);

      const updated = [...prev];
      updated[idx] = {
        ...district,
        riskScore: newScore,
        riskLevel: newLevel,
        ndviTrend: +(district.ndviTrend + (Math.random() - 0.5) * 0.004).toFixed(4),
        moistureDeficit: +Math.max(0, Math.min(1, district.moistureDeficit + (Math.random() - 0.5) * 0.03)).toFixed(3),
        nightlightVolatility: Math.max(0, district.nightlightVolatility + Math.round((Math.random() - 0.5) * 20)),
        lastUpdated: new Date().toISOString(),
      };
      return updated;
    });
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const interval = setInterval(simulatePass, 4000);
    // Initial pass after 2s
    const timeout = setTimeout(simulatePass, 2000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [enabled, simulatePass]);

  return { liveDistricts, passes, lastUpdate, updatingDistrictId };
};
