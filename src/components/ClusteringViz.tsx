import { useState } from "react";
import { motion } from "framer-motion";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ZAxis } from "recharts";
import { districts } from "@/data/mockData";

// Simulated K-Means clustering: assign clusters based on feature space
const assignCluster = (d: typeof districts[0]) => {
  if (d.riskScore >= 75) return 0; // Cluster 0: Critical degradation
  if (d.nightlightVolatility > 200 && d.moistureDeficit > 0.4) return 1; // Cluster 1: Urban pressure
  if (d.ndviTrend < -0.015) return 2; // Cluster 2: Vegetation stress
  return 3; // Cluster 3: Stable
};

const clusterConfig = [
  { name: "Critical Degradation", color: "hsl(0, 72%, 51%)", description: "Multi-factor ecological collapse" },
  { name: "Urban Pressure", color: "hsl(15, 85%, 55%)", description: "Encroachment-driven stress" },
  { name: "Vegetation Stress", color: "hsl(45, 90%, 55%)", description: "NDVI decline dominant" },
  { name: "Stable Ecosystem", color: "hsl(152, 70%, 45%)", description: "Within baseline parameters" },
];

const scatterData = districts.map((d) => ({
  name: d.name,
  // PCA-like projection: combine features into 2D space
  pc1: d.nightlightVolatility * 0.01 + d.moistureDeficit * 30 + Math.random() * 3,
  pc2: Math.abs(d.ndviTrend) * 500 + d.riskScore * 0.3 + Math.random() * 3,
  cluster: assignCluster(d),
  riskScore: d.riskScore,
  size: d.riskScore * 2 + 50,
}));

// Centroid positions for cluster labels
const centroids = [0, 1, 2, 3].map((c) => {
  const pts = scatterData.filter((d) => d.cluster === c);
  if (pts.length === 0) return null;
  return {
    pc1: pts.reduce((s, p) => s + p.pc1, 0) / pts.length,
    pc2: pts.reduce((s, p) => s + p.pc2, 0) / pts.length,
    label: clusterConfig[c].name,
    color: clusterConfig[c].color,
  };
});

const ClusteringViz = () => {
  const [activeCluster, setActiveCluster] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-panel p-4 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Unsupervised Anomaly Clustering
          </h3>
          <p className="text-[10px] text-muted-foreground">
            K-Means (k=4) — Feature space: Nightlight Volatility × NDVI Drift × Moisture Deficit
          </p>
        </div>
      </div>

      {/* Cluster legend */}
      <div className="flex items-center gap-4 mb-2 mt-1">
        {clusterConfig.map((c, i) => (
          <button
            key={i}
            onClick={() => setActiveCluster(activeCluster === i ? null : i)}
            className={`flex items-center gap-1.5 transition-opacity ${activeCluster !== null && activeCluster !== i ? "opacity-30" : "opacity-100"}`}
          >
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
            <span className="text-[9px] font-mono text-muted-foreground">{c.name}</span>
          </button>
        ))}
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 14%)" />
            <XAxis
              type="number"
              dataKey="pc1"
              name="PC1"
              tick={{ fontSize: 9, fill: "hsl(220, 10%, 40%)", fontFamily: "JetBrains Mono" }}
              axisLine={{ stroke: "hsl(220, 15%, 18%)" }}
              tickLine={false}
              label={{ value: "PC1 (Urban Pressure)", position: "bottom", fontSize: 9, fill: "hsl(220, 10%, 40%)", fontFamily: "JetBrains Mono", offset: 5 }}
            />
            <YAxis
              type="number"
              dataKey="pc2"
              name="PC2"
              tick={{ fontSize: 9, fill: "hsl(220, 10%, 40%)", fontFamily: "JetBrains Mono" }}
              axisLine={{ stroke: "hsl(220, 15%, 18%)" }}
              tickLine={false}
              label={{ value: "PC2 (Vegetation Stress)", angle: -90, position: "insideLeft", fontSize: 9, fill: "hsl(220, 10%, 40%)", fontFamily: "JetBrains Mono", offset: 10 }}
            />
            <ZAxis type="number" dataKey="size" range={[40, 200]} />
            <Tooltip
              contentStyle={{
                background: "hsl(220, 20%, 10%)",
                border: "1px solid hsl(220, 15%, 18%)",
                borderRadius: "6px",
                fontSize: "11px",
                fontFamily: "JetBrains Mono",
                color: "hsl(160, 20%, 90%)",
              }}
              formatter={(value: number, name: string) => {
                if (name === "PC1") return [`${value.toFixed(1)}`, "Urban Pressure Index"];
                if (name === "PC2") return [`${value.toFixed(1)}`, "Vegetation Stress Index"];
                return [value, name];
              }}
              labelFormatter={(_, payload) => {
                if (payload?.[0]?.payload?.name) {
                  const p = payload[0].payload;
                  return `${p.name} — ECRS: ${p.riskScore} — ${clusterConfig[p.cluster].name}`;
                }
                return "";
              }}
            />
            <Scatter data={scatterData} isAnimationActive>
              {scatterData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={clusterConfig[entry.cluster].color}
                  fillOpacity={activeCluster === null || activeCluster === entry.cluster ? 0.8 : 0.1}
                  stroke={clusterConfig[entry.cluster].color}
                  strokeWidth={1}
                  style={{ transition: "fill-opacity 0.3s ease" }}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ClusteringViz;
