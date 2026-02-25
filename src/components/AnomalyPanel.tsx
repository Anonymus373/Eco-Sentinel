import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { districts } from "@/data/mockData";

const sorted = [...districts].sort((a, b) => b.riskScore - a.riskScore).slice(0, 10);

const getBarColor = (score: number) => {
  if (score >= 80) return "hsl(0, 72%, 51%)";
  if (score >= 60) return "hsl(15, 85%, 55%)";
  if (score >= 40) return "hsl(45, 90%, 55%)";
  return "hsl(152, 70%, 45%)";
};

const AnomalyPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-panel p-4 h-full"
    >
      <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
        District Risk Rankings — Top 10
      </h3>
      <p className="text-[10px] text-muted-foreground mb-3">
        Ecosystem Collapse Risk Score (ECRS) by anomaly severity
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={sorted} layout="vertical" margin={{ top: 0, right: 5, left: 0, bottom: 0 }}>
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 9, fill: "hsl(220, 10%, 50%)", fontFamily: "JetBrains Mono" }}
            axisLine={{ stroke: "hsl(220, 15%, 18%)" }}
            tickLine={false}
          />
          <YAxis
            dataKey="name"
            type="category"
            width={80}
            tick={{ fontSize: 9, fill: "hsl(220, 10%, 50%)", fontFamily: "JetBrains Mono" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(220, 20%, 10%)",
              border: "1px solid hsl(220, 15%, 18%)",
              borderRadius: "6px",
              fontSize: "11px",
              fontFamily: "JetBrains Mono",
              color: "hsl(160, 20%, 90%)",
            }}
            formatter={(value: number) => [`ECRS: ${value}`, ""]}
          />
          <Bar dataKey="riskScore" radius={[0, 4, 4, 0]} barSize={14}>
            {sorted.map((entry, index) => (
              <Cell key={index} fill={getBarColor(entry.riskScore)} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default AnomalyPanel;
