import { useState } from "react";
import { motion } from "framer-motion";
import { districts as defaultDistricts, type District, type RiskLevel } from "@/data/mockData";

const riskColors: Record<RiskLevel, string> = {
  low: "hsl(152, 70%, 45%)",
  drift: "hsl(45, 90%, 55%)",
  collapse: "hsl(15, 85%, 55%)",
  immediate: "hsl(0, 72%, 51%)",
};

interface EcoMapProps {
  onDistrictSelect: (district: District) => void;
  selectedDistrict: District | null;
  districts?: District[];
  updatingDistrictId?: string | null;
}

// Normalize lat/lng to SVG coordinates within the Aravalli region
const mapBounds = {
  minLat: 24.0,
  maxLat: 29.0,
  minLng: 72.0,
  maxLng: 78.0,
};

const toSvg = (lat: number, lng: number, width: number, height: number) => {
  const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * width;
  const y = height - ((lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat)) * height;
  return { x, y };
};

const riskRadius: Record<RiskLevel, number> = {
  low: 8,
  drift: 12,
  collapse: 16,
  immediate: 20,
};

const EcoMap = ({ onDistrictSelect, selectedDistrict, districts: districtsProp, updatingDistrictId }: EcoMapProps) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const W = 500;
  const H = 420;
  const districts = districtsProp || defaultDistricts;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="glass-panel overflow-hidden h-full flex flex-col"
    >
      <div className="px-4 py-2 border-b border-border flex items-center justify-between">
        <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Aravalli Corridor — Risk Overlay
        </h3>
        <div className="flex items-center gap-3">
          {(["low", "drift", "collapse", "immediate"] as RiskLevel[]).map((level) => (
            <div key={level} className="flex items-center gap-1">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: riskColors[level] }}
              />
              <span className="text-[9px] font-mono text-muted-foreground capitalize">{level}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 relative p-2">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-full"
          style={{ background: "hsl(220, 25%, 5%)" }}
        >
          {/* Grid lines */}
          {Array.from({ length: 7 }).map((_, i) => (
            <line
              key={`vg-${i}`}
              x1={(i * W) / 6}
              y1={0}
              x2={(i * W) / 6}
              y2={H}
              stroke="hsl(220, 15%, 12%)"
              strokeWidth={0.5}
            />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={`hg-${i}`}
              x1={0}
              y1={(i * H) / 5}
              x2={W}
              y2={(i * H) / 5}
              stroke="hsl(220, 15%, 12%)"
              strokeWidth={0.5}
            />
          ))}

          {/* Aravalli range approximate line */}
          <path
            d="M 80,350 Q 150,280 200,200 T 320,80 L 380,40"
            fill="none"
            stroke="hsl(152, 70%, 45%)"
            strokeWidth={1}
            strokeDasharray="4 6"
            opacity={0.2}
          />

          {/* District markers */}
          {districts.map((d) => {
            const { x, y } = toSvg(d.lat, d.lng, W, H);
            const isSelected = selectedDistrict?.id === d.id;
            const isHovered = hovered === d.id;
            const isUpdating = updatingDistrictId === d.id;
            const r = riskRadius[d.riskLevel];

            return (
              <g
                key={d.id}
                onClick={() => onDistrictSelect(d)}
                onMouseEnter={() => setHovered(d.id)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
              >
                {/* Glow */}
                <circle
                  cx={x}
                  cy={y}
                  r={isUpdating ? r * 3 : r * 2}
                  fill={riskColors[d.riskLevel]}
                  opacity={isUpdating ? 0.3 : isSelected ? 0.15 : 0.06}
                  style={{ transition: "all 0.6s ease" }}
                />
                {/* Live update ring */}
                {isUpdating && (
                  <circle cx={x} cy={y} r={r * 1.5} fill="none" stroke="white" strokeWidth={1.5} opacity={0.6}>
                    <animate attributeName="r" values={`${r};${r * 3.5}`} dur="1s" repeatCount="1" />
                    <animate attributeName="opacity" values="0.6;0" dur="1s" repeatCount="1" />
                  </circle>
                )}
                {/* Pulse ring for immediate */}
                {d.riskLevel === "immediate" && (
                  <circle
                    cx={x}
                    cy={y}
                    r={r * 1.5}
                    fill="none"
                    stroke={riskColors[d.riskLevel]}
                    strokeWidth={1}
                    opacity={0.4}
                  >
                    <animate
                      attributeName="r"
                      values={`${r};${r * 2.5};${r}`}
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.4;0;0.4"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                {/* Main dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected || isHovered ? r * 1.2 : r}
                  fill={riskColors[d.riskLevel]}
                  fillOpacity={isSelected ? 0.9 : 0.5}
                  stroke={isSelected ? "white" : riskColors[d.riskLevel]}
                  strokeWidth={isSelected ? 2 : 1}
                  style={{ transition: "all 0.2s ease" }}
                />
                {/* Label */}
                {(isSelected || isHovered) && (
                  <g>
                    <rect
                      x={x + r + 4}
                      y={y - 18}
                      width={d.name.length * 7 + 50}
                      height={28}
                      rx={4}
                      fill="hsl(220, 20%, 10%)"
                      fillOpacity={0.95}
                      stroke="hsl(220, 15%, 20%)"
                      strokeWidth={1}
                    />
                    <text
                      x={x + r + 10}
                      y={y - 3}
                      fill="hsl(160, 20%, 90%)"
                      fontSize={10}
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {d.name} · ECRS {d.riskScore}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Coordinate labels */}
          <text x={5} y={H - 5} fill="hsl(220, 10%, 30%)" fontSize={8} fontFamily="JetBrains Mono">
            72°E, 24°N
          </text>
          <text x={W - 70} y={15} fill="hsl(220, 10%, 30%)" fontSize={8} fontFamily="JetBrains Mono">
            78°E, 29°N
          </text>
        </svg>
      </div>
    </motion.div>
  );
};

export default EcoMap;
