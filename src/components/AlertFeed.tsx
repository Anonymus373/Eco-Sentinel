import { motion } from "framer-motion";
import { AlertTriangle, Zap, Flame, Radio } from "lucide-react";
import { alerts, type Alert, type RiskLevel } from "@/data/mockData";

const severityConfig: Record<RiskLevel, { icon: typeof AlertTriangle; badgeClass: string }> = {
  low: { icon: Radio, badgeClass: "risk-badge-low" },
  drift: { icon: AlertTriangle, badgeClass: "risk-badge-drift" },
  collapse: { icon: Flame, badgeClass: "risk-badge-collapse" },
  immediate: { icon: Zap, badgeClass: "risk-badge-immediate" },
};

const typeLabels: Record<Alert["type"], string> = {
  drift_detected: "DRIFT",
  threshold_breach: "THRESHOLD",
  collapse_imminent: "COLLAPSE",
  anomaly_cluster: "ANOMALY",
};

const AlertFeed = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-panel h-full flex flex-col"
    >
      <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
        <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Alert Feed
        </h3>
        <span className="text-[10px] font-mono text-risk-immediate animate-pulse-glow">
          {alerts.filter((a) => a.severity === "immediate").length} CRITICAL
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {alerts.map((alert, i) => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              className="p-3 rounded-md bg-secondary/50 border border-border hover:border-primary/30 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-2">
                <Icon className={`w-3.5 h-3.5 mt-0.5 ${alert.severity === "immediate" ? "text-risk-immediate" : alert.severity === "collapse" ? "text-risk-collapse" : "text-risk-drift"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-foreground">
                      {alert.districtName}
                    </span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${config.badgeClass}`}>
                      {typeLabels[alert.type]}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    {alert.message}
                  </p>
                  <p className="text-[9px] font-mono text-muted-foreground/60 mt-1">
                    {new Date(alert.timestamp).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AlertFeed;
