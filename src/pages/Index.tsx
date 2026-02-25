import { useState } from "react";
import Header from "@/components/Header";
import RiskOverview from "@/components/RiskOverview";
import EcoMap from "@/components/EcoMap";
import NDVIChart from "@/components/NDVIChart";
import AlertFeed from "@/components/AlertFeed";
import DistrictDetail from "@/components/DistrictDetail";
import AnomalyPanel from "@/components/AnomalyPanel";
import { type District } from "@/data/mockData";

const Index = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  return (
    <div className="min-h-screen bg-background p-3 flex flex-col gap-3">
      <Header />
      <RiskOverview />

      <div className="flex-1 grid grid-cols-12 gap-3" style={{ minHeight: "480px" }}>
        {/* Map - takes 5 columns */}
        <div className="col-span-5">
          <EcoMap
            onDistrictSelect={setSelectedDistrict}
            selectedDistrict={selectedDistrict}
          />
        </div>

        {/* Center: District detail + NDVI chart stacked */}
        <div className="col-span-4 flex flex-col gap-3">
          <div className="flex-1">
            <DistrictDetail district={selectedDistrict} />
          </div>
          <div>
            <NDVIChart districtName={selectedDistrict?.name} />
          </div>
        </div>

        {/* Right: Alert feed */}
        <div className="col-span-3">
          <AlertFeed />
        </div>
      </div>

      {/* Bottom row */}
      <div className="h-[260px]">
        <AnomalyPanel />
      </div>
    </div>
  );
};

export default Index;
