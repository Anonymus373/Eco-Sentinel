import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { districts, type RiskLevel } from "@/data/mockData";

const riskColors: Record<RiskLevel, string> = {
  low: "#2db87a",
  drift: "#e6a817",
  collapse: "#e06030",
  immediate: "#d94040",
};

const riskLabels: Record<RiskLevel, string> = {
  low: "LOW",
  drift: "DRIFT",
  collapse: "COLLAPSE",
  immediate: "IMMEDIATE",
};

const riskRadius: Record<RiskLevel, number> = {
  low: 6,
  drift: 8,
  collapse: 10,
  immediate: 13,
};

const IndiaMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [22.5, 82.0],
      zoom: 5,
      zoomControl: true,
      attributionControl: false,
      maxBounds: [[4, 62], [40, 102]],
      minZoom: 4,
    });

    // Satellite imagery
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 18,
    }).addTo(map);

    // Labels overlay
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 18,
      opacity: 0.6,
    }).addTo(map);

    // Add district markers
    districts.forEach((d) => {
      const color = riskColors[d.riskLevel];
      const radius = riskRadius[d.riskLevel];

      const circle = L.circleMarker([d.lat, d.lng], {
        radius,
        color,
        fillColor: color,
        fillOpacity: 0.6,
        weight: 2,
        opacity: 0.9,
      }).addTo(map);

      // Pulsing effect for immediate risk
      if (d.riskLevel === "immediate") {
        const pulseCircle = L.circleMarker([d.lat, d.lng], {
          radius: radius + 6,
          color,
          fillColor: color,
          fillOpacity: 0.15,
          weight: 1,
          opacity: 0.4,
          className: "animate-pulse-slow",
        }).addTo(map);
      }

      const popupContent = `
        <div style="
          background: hsl(200,20%,10%);
          color: hsl(180,20%,90%);
          padding: 12px;
          border-radius: 8px;
          min-width: 220px;
          font-family: 'Inter', sans-serif;
          border: 1px solid ${color}33;
        ">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <span style="font-weight:700;font-size:14px">${d.name}</span>
            <span style="
              background:${color}22;color:${color};
              padding:2px 8px;border-radius:4px;
              font-size:10px;font-weight:600;
              font-family:'JetBrains Mono',monospace;
              border:1px solid ${color}44;
            ">${riskLabels[d.riskLevel]}</span>
          </div>
          <div style="font-size:11px;color:hsl(200,10%,50%);margin-bottom:8px">${d.state}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px;font-family:'JetBrains Mono',monospace">
            <div>
              <div style="color:hsl(200,10%,50%);font-size:9px;text-transform:uppercase">Risk Score</div>
              <div style="font-weight:700;color:${color}">${d.riskScore}</div>
            </div>
            <div>
              <div style="color:hsl(200,10%,50%);font-size:9px;text-transform:uppercase">NDVI Δ</div>
              <div style="font-weight:700;color:${d.ndviChange < 0 ? '#e06030' : '#2db87a'}">${d.ndviChange > 0 ? '+' : ''}${d.ndviChange}%</div>
            </div>
            <div>
              <div style="color:hsl(200,10%,50%);font-size:9px;text-transform:uppercase">Moisture</div>
              <div style="font-weight:700;color:#e6a817">${d.moistureDeficit}%</div>
            </div>
            <div>
              <div style="color:hsl(200,10%,50%);font-size:9px;text-transform:uppercase">Updated</div>
              <div style="font-weight:500">${d.lastUpdated}</div>
            </div>
          </div>
        </div>
      `;

      circle.bindPopup(popupContent, {
        className: "eco-popup",
        closeButton: true,
        maxWidth: 260,
      });

      // Tooltip on hover
      circle.bindTooltip(`<div style="
        background:hsl(200,20%,10%);color:hsl(180,20%,90%);
        padding:6px 10px;border-radius:6px;font-size:11px;
        font-family:'Inter',sans-serif;border:1px solid ${color}44;
        box-shadow:0 4px 16px ${color}33;
      ">
        <strong>${d.name}</strong> <span style="color:${color};font-family:'JetBrains Mono',monospace;font-size:10px">${d.riskScore}</span>
      </div>`, {
        direction: "top",
        offset: [0, -8],
        className: "eco-tooltip",
        permanent: false,
      });
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <div className="gradient-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
            Satellite Risk Map — India
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Esri World Imagery · District risk markers · Click to inspect
          </p>
        </div>
        <div className="flex gap-3 text-xs font-mono">
          {(["low", "drift", "collapse", "immediate"] as RiskLevel[]).map((r) => (
            <span key={r} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: riskColors[r] }} />
              {riskLabels[r]}
            </span>
          ))}
        </div>
      </div>
      <div ref={mapRef} className="h-[520px]" style={{ background: "hsl(200,25%,6%)" }} />
    </div>
  );
};

export default IndiaMap;
