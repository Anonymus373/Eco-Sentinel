import { useState, useEffect } from "react";
import Header from "@/components/Header";
import RiskOverview from "@/components/RiskOverview";
import EcoMap from "@/components/EcoMap";
import NDVIChart from "@/components/NDVIChart";
import AlertFeed from "@/components/AlertFeed";
import DistrictDetail from "@/components/DistrictDetail";
import AnomalyPanel from "@/components/AnomalyPanel";
import SatelliteTimeline from "@/components/SatelliteTimeline";
import InterventionRecommender from "@/components/InterventionRecommender";
import ClusteringViz from "@/components/ClusteringViz";
import LiveIngestionFeed from "@/components/LiveIngestionFeed";
import { useLiveSimulation } from "@/hooks/useLiveSimulation";
import { type District } from "@/data/mockData";

const Index = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const { liveDistricts, passes, lastUpdate, updatingDistrictId } = useLiveSimulation(true);

  // Keep selectedDistrict in sync with live updates
  useEffect(() => {
    if (selectedDistrict) {
      const updated = liveDistricts.find((d) => d.id === selectedDistrict.id);
      if (updated && updated.riskScore !== selectedDistrict.riskScore) {
        setSelectedDistrict(updated);
      }
    }
  }, [liveDistricts, selectedDistrict]);

  return (
    <div className="min-h-screen bg-background p-3 flex flex-col gap-3">
      <Header />
      <RiskOverview liveDistricts={liveDistricts} />

      {/* Main Row: Map + Detail/NDVI + Alerts */}
      <div className="grid grid-cols-12 gap-3" style={{ height: "460px" }}>
        <div className="col-span-5 h-full">
          <EcoMap
            onDistrictSelect={setSelectedDistrict}
            selectedDistrict={selectedDistrict}
            districts={liveDistricts}
            updatingDistrictId={updatingDistrictId}
          />
        </div>
        <div className="col-span-4 h-full flex flex-col gap-3">
          <div className="flex-1 min-h-0">
            <DistrictDetail district={selectedDistrict} />
          </div>
          <div className="h-[220px]">
            <NDVIChart districtName={selectedDistrict?.name} />
          </div>
        </div>
        <div className="col-span-3 h-full">
          <AlertFeed />
        </div>
      </div>

      {/* Second Row: Live Feed + Satellite Timeline + AI Recommender + Clustering */}
      <div className="grid grid-cols-12 gap-3" style={{ height: "340px" }}>
        <div className="col-span-3 h-full">
          <LiveIngestionFeed passes={passes} lastUpdate={lastUpdate} />
        </div>
        <div className="col-span-2 h-full">
          <SatelliteTimeline />
        </div>
        <div className="col-span-3 h-full">
          <InterventionRecommender district={selectedDistrict} />
        </div>
        <div className="col-span-4 h-full">
          <ClusteringViz />
        </div>
      </div>

      {/* Bottom Row: Risk Rankings */}
      <div className="h-[260px]">
        <AnomalyPanel />
      </div>
    </div>
  );
};

export default Index;
