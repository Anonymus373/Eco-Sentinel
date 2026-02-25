import { motion } from "framer-motion";
import { type District } from "@/data/mockData";
import { TrendingDown, Droplets, Sun, TreePine, MapPin } from "lucide-react";

interface DistrictDetailProps {
  district: District | null;
}

const MetricRow = ({
  label,
  value,
  unit,
  icon: Icon,
  danger,
}: {
  label: string;
  value: string;
  unit: string;
  icon: typeof TrendingDown;
  danger?: boolean;
}) => (
  <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
    <div className="flex items-center gap-2">
      <Icon className={`w-3.5 h-3.5 ${danger ? "text-risk-immediate" : "text-muted-foreground"}`} />
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
    <div className="text-right">
      <span className={`text-sm font-mono font-semibold ${danger ? "text-risk-immediate" : "text-foreground"}`}>
        {value}
      </span>
      <span className="text-[9px] font-mono text-muted-foreground ml-1">{unit}</span>
    </div>
  </div>
);

const DistrictDetail = ({ district }: DistrictDetailProps) => {
  if (!district) {
    return (
      <div className="glass-panel p-4 h-full flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground font-mono">
            Select a district on the map
          </p>
        </div>
      </div>
    );
  }

  const riskColorClass =
    district.riskLevel === "immediate"
      ? "text-risk-immediate"
      : district.riskLevel === "collapse"
      ? "text-risk-collapse"
      : district.riskLevel === "drift"
      ? "text-risk-drift"
      : "text-risk-low";

  const riskBadgeClass =
    district.riskLevel === "immediate"
      ? "risk-badge-immediate"
      : district.riskLevel === "collapse"
      ? "risk-badge-collapse"
      : district.riskLevel === "drift"
      ? "risk-badge-drift"
      : "risk-badge-low";

  return (
    <motion.div
      key={district.id}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-4 h-full"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-foreground">{district.name}</h3>
          <p className="text-[10px] font-mono text-muted-foreground">{district.state}</p>
        </div>
        <span className={`text-[10px] font-mono px-2 py-1 rounded ${riskBadgeClass}`}>
          {district.riskLevel.toUpperCase()}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
          Ecosystem Collapse Risk Score
        </p>
        <div className="flex items-end gap-2">
          <span className={`text-4xl font-mono font-bold ${riskColorClass}`}>
            {district.riskScore}
          </span>
          <span className="text-xs text-muted-foreground mb-1">/ 100</span>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full mt-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${district.riskScore}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full ${
              district.riskLevel === "immediate"
                ? "bg-risk-immediate"
                : district.riskLevel === "collapse"
                ? "bg-risk-collapse"
                : district.riskLevel === "drift"
                ? "bg-risk-drift"
                : "bg-risk-low"
            }`}
          />
        </div>
      </div>

      <div>
        <MetricRow
          label="NDVI Trend Slope"
          value={district.ndviTrend.toFixed(3)}
          unit="/month"
          icon={TrendingDown}
          danger={district.ndviTrend < -0.025}
        />
        <MetricRow
          label="Nightlight Volatility"
          value={`+${district.nightlightVolatility}`}
          unit="%"
          icon={Sun}
          danger={district.nightlightVolatility > 300}
        />
        <MetricRow
          label="Moisture Deficit"
          value={district.moistureDeficit.toFixed(2)}
          unit="idx"
          icon={Droplets}
          danger={district.moistureDeficit > 0.6}
        />
        <MetricRow
          label="Vegetation Slope"
          value={district.vegetationSlope.toFixed(3)}
          unit="/mo"
          icon={TreePine}
          danger={district.vegetationSlope < -0.02}
        />
      </div>
    </motion.div>
  );
};

export default DistrictDetail;
