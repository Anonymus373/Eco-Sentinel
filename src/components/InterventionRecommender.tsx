import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Loader2, TreePine, Droplets, Shield, AlertTriangle, ChevronRight } from "lucide-react";
import { type District } from "@/data/mockData";

interface InterventionRecommenderProps {
  district: District | null;
}

interface Recommendation {
  id: string;
  title: string;
  priority: "critical" | "high" | "moderate";
  category: string;
  icon: typeof TreePine;
  description: string;
  timeline: string;
  cost: string;
  impact: string;
}

const getRecommendations = (district: District): Recommendation[] => {
  const recs: Recommendation[] = [];

  if (district.ndviTrend < -0.03) {
    recs.push({
      id: "r1",
      title: "Emergency Reforestation Protocol",
      priority: "critical",
      category: "Vegetation",
      icon: TreePine,
      description: `NDVI decline of ${district.ndviTrend.toFixed(3)}/month exceeds critical threshold. Deploy native species plantation across ${Math.floor(district.riskScore * 1.5)} hectares in degraded zones.`,
      timeline: "Immediate — 30 days",
      cost: "₹${(district.riskScore * 2.3).toFixed(1)}L",
      impact: "Projected +0.08 NDVI recovery within 6 months",
    });
  }

  if (district.moistureDeficit > 0.5) {
    recs.push({
      id: "r2",
      title: "Watershed Restoration Initiative",
      priority: district.moistureDeficit > 0.7 ? "critical" : "high",
      category: "Hydrology",
      icon: Droplets,
      description: `Moisture deficit at ${(district.moistureDeficit * 100).toFixed(0)}% — construct check dams and percolation tanks. Revive traditional johad water harvesting systems in ${district.name}.`,
      timeline: "60-90 days",
      cost: `₹${(district.moistureDeficit * 45).toFixed(1)}L`,
      impact: "Groundwater recharge +23% projected",
    });
  }

  if (district.nightlightVolatility > 250) {
    recs.push({
      id: "r3",
      title: "Encroachment Monitoring Deployment",
      priority: "high",
      category: "Enforcement",
      icon: Shield,
      description: `Nightlight volatility at +${district.nightlightVolatility}% indicates unauthorized construction/mining. Deploy drone surveillance grid and activate Section 19 Forest Conservation Act protocols.`,
      timeline: "15 days",
      cost: `₹${(district.nightlightVolatility * 0.12).toFixed(1)}L`,
      impact: "Halt encroachment advance within 2 quarters",
    });
  }

  if (district.vegetationSlope < -0.015) {
    recs.push({
      id: "r4",
      title: "Biodiversity Corridor Reconnection",
      priority: "moderate",
      category: "Ecology",
      icon: AlertTriangle,
      description: `Vegetation slope of ${district.vegetationSlope.toFixed(3)}/mo fragmenting wildlife corridors. Establish ecological bridges and buffer zone enforcement in ${district.name} sector.`,
      timeline: "90-180 days",
      cost: `₹${Math.abs(district.vegetationSlope * 1800).toFixed(1)}L`,
      impact: "Corridor connectivity +40% within 12 months",
    });
  }

  if (recs.length === 0) {
    recs.push({
      id: "r0",
      title: "Continue Routine Monitoring",
      priority: "moderate",
      category: "Maintenance",
      icon: Shield,
      description: `${district.name} shows stable ecological indicators. Maintain current monitoring frequency and seasonal reporting cadence.`,
      timeline: "Ongoing",
      cost: "Baseline",
      impact: "Sustain current resilience buffers",
    });
  }

  return recs;
};

const priorityStyles = {
  critical: { badge: "risk-badge-immediate", dot: "bg-risk-immediate" },
  high: { badge: "risk-badge-collapse", dot: "bg-risk-collapse" },
  moderate: { badge: "risk-badge-drift", dot: "bg-risk-drift" },
};

const InterventionRecommender = ({ district }: InterventionRecommenderProps) => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!district) {
      setRecommendations([]);
      return;
    }
    setLoading(true);
    setExpandedId(null);
    // Simulate AI processing delay
    const timer = setTimeout(() => {
      setRecommendations(getRecommendations(district));
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [district]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-panel h-full flex flex-col"
    >
      <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            AI Intervention Engine
          </h3>
        </div>
        {loading && (
          <div className="flex items-center gap-1.5">
            <Loader2 className="w-3 h-3 text-primary animate-spin" />
            <span className="text-[9px] font-mono text-primary">Analyzing...</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {!district && !loading && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Brain className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-[10px] font-mono text-muted-foreground">
                Select a district to generate<br />intervention recommendations
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 rounded-md bg-secondary/30 animate-pulse">
                <div className="h-3 w-2/3 bg-secondary rounded mb-2" />
                <div className="h-2 w-full bg-secondary rounded mb-1" />
                <div className="h-2 w-4/5 bg-secondary rounded" />
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!loading && recommendations.length > 0 && (
            <motion.div
              key={district?.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              {recommendations.map((rec, i) => {
                const style = priorityStyles[rec.priority];
                const Icon = rec.icon;
                const isExpanded = expandedId === rec.id;

                return (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                    className="p-3 rounded-md bg-secondary/40 border border-border hover:border-primary/20 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${style.dot}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-3.5 h-3.5 text-foreground/70" />
                          <span className="text-[11px] font-semibold text-foreground flex-1">
                            {rec.title}
                          </span>
                          <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${style.badge}`}>
                            {rec.priority.toUpperCase()}
                          </span>
                          <ChevronRight className={`w-3 h-3 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <p className="text-[10px] text-muted-foreground leading-relaxed mt-1 mb-2">
                                {rec.description}
                              </p>
                              <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-border/50">
                                <div>
                                  <span className="text-[8px] font-mono text-muted-foreground/60 uppercase">Timeline</span>
                                  <p className="text-[10px] font-mono text-foreground">{rec.timeline}</p>
                                </div>
                                <div>
                                  <span className="text-[8px] font-mono text-muted-foreground/60 uppercase">Est. Cost</span>
                                  <p className="text-[10px] font-mono text-foreground">{rec.cost}</p>
                                </div>
                                <div>
                                  <span className="text-[8px] font-mono text-muted-foreground/60 uppercase">Impact</span>
                                  <p className="text-[10px] font-mono text-primary">{rec.impact}</p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default InterventionRecommender;
