import { motion } from "framer-motion";
import { Shield, AlertTriangle, Flame, Skull } from "lucide-react";
import { nationalStats } from "@/data/mockData";

const riskCards = [
  {
    label: "Low Risk",
    count: nationalStats.lowRisk,
    icon: Shield,
    colorClass: "text-risk-low",
    bgClass: "bg-risk-low/10",
    borderClass: "border-risk-low/30",
    glowClass: "glow-green",
  },
  {
    label: "Drift Risk",
    count: nationalStats.driftRisk,
    icon: AlertTriangle,
    colorClass: "text-risk-drift",
    bgClass: "bg-risk-drift/10",
    borderClass: "border-risk-drift/30",
    glowClass: "glow-warning",
  },
  {
    label: "Collapse Risk",
    count: nationalStats.collapseRisk,
    icon: Flame,
    colorClass: "text-risk-collapse",
    bgClass: "bg-risk-collapse/10",
    borderClass: "border-risk-collapse/30",
    glowClass: "",
  },
  {
    label: "Immediate",
    count: nationalStats.immediateRisk,
    icon: Skull,
    colorClass: "text-risk-immediate",
    bgClass: "bg-risk-immediate/10",
    borderClass: "border-risk-immediate/30",
    glowClass: "glow-danger",
  },
];

const RiskOverview = () => {
  return (
    <div className="grid grid-cols-4 gap-3">
      {riskCards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`glass-panel p-4 ${card.borderClass} ${card.glowClass}`}
        >
          <div className="flex items-center justify-between mb-2">
            <card.icon className={`w-4 h-4 ${card.colorClass}`} />
            <span className={`text-[10px] font-mono uppercase tracking-wider ${card.colorClass}`}>
              {card.label}
            </span>
          </div>
          <div className={`text-3xl font-bold font-mono ${card.colorClass}`}>
            {card.count}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">districts</p>
        </motion.div>
      ))}
    </div>
  );
};

export default RiskOverview;
