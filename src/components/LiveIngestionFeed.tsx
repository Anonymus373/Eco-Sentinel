import { motion, AnimatePresence } from "framer-motion";
import { Satellite, ArrowUp, ArrowDown, Minus, Radio } from "lucide-react";
import { type SatellitePass } from "@/hooks/useLiveSimulation";

interface LiveIngestionFeedProps {
  passes: SatellitePass[];
  lastUpdate: Date;
}

const LiveIngestionFeed = ({ passes, lastUpdate }: LiveIngestionFeedProps) => {
  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const riskBadge = (level: string) => {
    const cls =
      level === "immediate"
        ? "risk-badge-immediate"
        : level === "collapse"
        ? "risk-badge-collapse"
        : level === "drift"
        ? "risk-badge-drift"
        : "risk-badge-low";
    return cls;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-panel h-full flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-2 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-primary animate-pulse-glow" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Live Satellite Ingestion
          </h3>
        </div>
        <span className="text-[9px] font-mono text-muted-foreground">
          Last: {formatTime(lastUpdate)}
        </span>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        <AnimatePresence initial={false}>
          {passes.map((pass) => (
            <motion.div
              key={pass.id}
              initial={{ opacity: 0, x: -30, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="glass-panel p-2.5 border border-border/50"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <Satellite className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-mono font-semibold text-foreground">
                    {pass.satellite}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-muted-foreground">
                  {formatTime(pass.timestamp)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-foreground">
                  {pass.districtName}
                </span>
                <div className="flex items-center gap-2">
                  {/* Score change */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {pass.oldScore}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <motion.span
                      initial={{ scale: 1.4 }}
                      animate={{ scale: 1 }}
                      className={`text-[11px] font-mono font-bold ${
                        pass.delta > 0
                          ? "text-risk-immediate"
                          : pass.delta < 0
                          ? "text-risk-low"
                          : "text-muted-foreground"
                      }`}
                    >
                      {pass.newScore}
                    </motion.span>
                  </div>

                  {/* Delta indicator */}
                  <div
                    className={`flex items-center gap-0.5 text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      pass.delta > 0
                        ? "bg-risk-immediate/10 text-risk-immediate"
                        : pass.delta < 0
                        ? "bg-risk-low/10 text-risk-low"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {pass.delta > 0 ? (
                      <ArrowUp className="w-2.5 h-2.5" />
                    ) : pass.delta < 0 ? (
                      <ArrowDown className="w-2.5 h-2.5" />
                    ) : (
                      <Minus className="w-2.5 h-2.5" />
                    )}
                    {pass.delta > 0 ? "+" : ""}
                    {pass.delta}
                  </div>

                  {/* Risk badge */}
                  {pass.oldLevel !== pass.newLevel && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${riskBadge(pass.newLevel)}`}
                    >
                      {pass.newLevel.toUpperCase()}
                    </motion.span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {passes.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Satellite className="w-6 h-6 text-muted-foreground/30 mx-auto mb-2 animate-pulse-glow" />
              <p className="text-[10px] font-mono text-muted-foreground">
                Awaiting satellite pass…
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LiveIngestionFeed;
