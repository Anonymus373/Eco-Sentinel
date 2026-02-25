import { motion } from "framer-motion";
import { Satellite, Activity, Clock } from "lucide-react";
import { nationalStats } from "@/data/mockData";

const Header = () => {
  return (
    <header className="glass-panel px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center glow-green">
            <Satellite className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">
              EcoSentinel
            </h1>
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
              Ecosystem Drift Early Warning
            </p>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span>{nationalStats.monitored} Districts Live</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <Activity className="w-3.5 h-3.5 text-primary" />
          <span>{nationalStats.modelsActive} Models Active</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>Latency: {nationalStats.dataLatency}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
