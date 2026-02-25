import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Calendar } from "lucide-react";

const months = [
  "Mar '25", "Apr '25", "May '25", "Jun '25", "Jul '25", "Aug '25",
  "Sep '25", "Oct '25", "Nov '25", "Dec '25", "Jan '26", "Feb '26",
];

// Simulated NDVI heatmap values per month (degradation over time)
const heatmapData = months.map((_, i) => {
  const degradation = i * 0.04;
  return Array.from({ length: 8 }, (__, j) => {
    const base = 0.65 - j * 0.03;
    const noise = Math.sin(i * 0.7 + j * 1.3) * 0.05;
    return Math.max(0.15, base - degradation + noise);
  });
});

const ndviToColor = (val: number) => {
  if (val > 0.55) return `hsl(152, 70%, ${30 + val * 40}%)`;
  if (val > 0.4) return `hsl(80, 60%, ${25 + val * 35}%)`;
  if (val > 0.3) return `hsl(45, 80%, ${20 + val * 40}%)`;
  return `hsl(15, 70%, ${20 + val * 35}%)`;
};

const SatelliteTimeline = () => {
  const [currentMonth, setCurrentMonth] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setCurrentMonth((prev) => {
        if (prev >= months.length - 1) {
          setPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [playing]);

  const gridData = heatmapData[currentMonth];
  const rows = 4;
  const cols = 8;
  const cellW = 52;
  const cellH = 38;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-panel p-4 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Satellite Temporal Playback
          </h3>
          <p className="text-[10px] text-muted-foreground">
            NDVI heatmap — Sentinel-2 composite bands
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-muted-foreground" />
          <AnimatePresence mode="wait">
            <motion.span
              key={currentMonth}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="text-xs font-mono font-bold text-primary"
            >
              {months[currentMonth]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="flex-1 flex items-center justify-center mb-3">
        <svg
          width={cols * cellW + 2}
          height={rows * cellH + 2}
          viewBox={`0 0 ${cols * cellW + 2} ${rows * cellH + 2}`}
          className="w-full max-w-[420px]"
        >
          {gridData.map((val, idx) => {
            const row = Math.floor(idx / cols);
            const col = idx % cols;
            // Duplicate rows to fill 4 rows from 8 values
            const r = idx < 4 ? 0 : idx < 8 ? 1 : idx < 4 ? 2 : 3;
            return (
              <motion.rect
                key={idx}
                x={col * cellW + 1}
                y={Math.floor(idx / cols) * cellH + 1}
                width={cellW - 1}
                height={cellH - 1}
                rx={3}
                fill={ndviToColor(val)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, fill: ndviToColor(val) }}
                transition={{ duration: 0.5 }}
              />
            );
          })}
          {/* Grid overlay for pixel look */}
          {Array.from({ length: cols + 1 }).map((_, i) => (
            <line key={`v${i}`} x1={i * cellW + 1} y1={1} x2={i * cellW + 1} y2={rows * cellH + 1} stroke="hsl(220, 25%, 6%)" strokeWidth={1} />
          ))}
          {Array.from({ length: rows + 1 }).map((_, i) => (
            <line key={`h${i}`} x1={1} y1={i * cellH + 1} x2={cols * cellW + 1} y2={i * cellH + 1} stroke="hsl(220, 25%, 6%)" strokeWidth={1} />
          ))}
        </svg>
      </div>

      {/* Color legend */}
      <div className="flex items-center justify-center gap-1 mb-3">
        <span className="text-[8px] font-mono text-muted-foreground">0.15</span>
        <div className="flex h-2 rounded overflow-hidden">
          {[0.15, 0.25, 0.35, 0.45, 0.55, 0.65].map((v) => (
            <div key={v} className="w-6" style={{ background: ndviToColor(v) }} />
          ))}
        </div>
        <span className="text-[8px] font-mono text-muted-foreground">0.70</span>
        <span className="text-[8px] font-mono text-muted-foreground ml-1">NDVI</span>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center gap-3 justify-center">
        <button
          onClick={() => setCurrentMonth(0)}
          className="p-1.5 rounded bg-secondary hover:bg-secondary/80 text-muted-foreground transition-colors"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setPlaying(!playing)}
          className="p-2 rounded-full bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-colors glow-green"
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={() => setCurrentMonth(months.length - 1)}
          className="p-1.5 rounded bg-secondary hover:bg-secondary/80 text-muted-foreground transition-colors"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Timeline Scrubber */}
      <div className="mt-3">
        <input
          type="range"
          min={0}
          max={months.length - 1}
          value={currentMonth}
          onChange={(e) => {
            setCurrentMonth(Number(e.target.value));
            setPlaying(false);
          }}
          className="w-full h-1 appearance-none bg-secondary rounded-full cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <div className="flex justify-between mt-1">
          <span className="text-[8px] font-mono text-muted-foreground">{months[0]}</span>
          <span className="text-[8px] font-mono text-muted-foreground">{months[months.length - 1]}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SatelliteTimeline;
