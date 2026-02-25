import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { ndviTimeSeries } from "@/data/mockData";

const NDVIChart = ({ districtName }: { districtName?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-panel p-4 h-full"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            NDVI Temporal Analysis
          </h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {districtName || "Aravalli Region"} — Vegetation Index vs Baseline
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-primary rounded" />
            <span className="text-[9px] font-mono text-muted-foreground">Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-muted-foreground/50 rounded" />
            <span className="text-[9px] font-mono text-muted-foreground">Baseline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-risk-immediate rounded opacity-60" />
            <span className="text-[9px] font-mono text-muted-foreground">Predicted</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={ndviTimeSeries} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="ndviGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(152, 70%, 45%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(152, 70%, 45%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 9, fill: "hsl(220, 10%, 50%)", fontFamily: "JetBrains Mono" }}
            axisLine={{ stroke: "hsl(220, 15%, 18%)" }}
            tickLine={false}
          />
          <YAxis
            domain={[0.2, 0.75]}
            tick={{ fontSize: 9, fill: "hsl(220, 10%, 50%)", fontFamily: "JetBrains Mono" }}
            axisLine={{ stroke: "hsl(220, 15%, 18%)" }}
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
          />
          <ReferenceLine
            y={0.4}
            stroke="hsl(45, 90%, 55%)"
            strokeDasharray="5 5"
            strokeOpacity={0.5}
            label={{ value: "Drift Threshold", fontSize: 9, fill: "hsl(45, 90%, 55%)", fontFamily: "JetBrains Mono" }}
          />
          <Area
            type="monotone"
            dataKey="baseline"
            stroke="hsl(220, 10%, 50%)"
            strokeWidth={1}
            strokeDasharray="4 4"
            fill="none"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="actual"
            stroke="hsl(152, 70%, 45%)"
            strokeWidth={2}
            fill="url(#ndviGrad)"
            dot={false}
            connectNulls={false}
          />
          <Area
            type="monotone"
            dataKey="predicted"
            stroke="hsl(0, 72%, 51%)"
            strokeWidth={1.5}
            strokeDasharray="6 3"
            fill="url(#predGrad)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default NDVIChart;
