export type RiskLevel = "low" | "drift" | "collapse" | "immediate";

export interface District {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  riskScore: number;
  riskLevel: RiskLevel;
  ndviTrend: number;
  nightlightVolatility: number;
  moistureDeficit: number;
  vegetationSlope: number;
  lastUpdated: string;
}

export interface Alert {
  id: string;
  districtName: string;
  state: string;
  type: "drift_detected" | "threshold_breach" | "collapse_imminent" | "anomaly_cluster";
  message: string;
  severity: RiskLevel;
  timestamp: string;
}

export interface NDVIDataPoint {
  month: string;
  actual: number;
  baseline: number;
  predicted: number;
}

export const districts: District[] = [
  { id: "d1", name: "Alwar", state: "Rajasthan", lat: 27.56, lng: 76.63, riskScore: 87, riskLevel: "immediate", ndviTrend: -0.042, nightlightVolatility: 412, moistureDeficit: 0.73, vegetationSlope: -0.031, lastUpdated: "2026-02-25T08:30:00Z" },
  { id: "d2", name: "Gurugram", state: "Haryana", lat: 28.46, lng: 77.03, riskScore: 79, riskLevel: "collapse", ndviTrend: -0.038, nightlightVolatility: 385, moistureDeficit: 0.68, vegetationSlope: -0.027, lastUpdated: "2026-02-25T08:30:00Z" },
  { id: "d3", name: "Udaipur", state: "Rajasthan", lat: 24.58, lng: 73.68, riskScore: 62, riskLevel: "drift", ndviTrend: -0.019, nightlightVolatility: 198, moistureDeficit: 0.45, vegetationSlope: -0.014, lastUpdated: "2026-02-25T08:30:00Z" },
  { id: "d4", name: "Jaipur", state: "Rajasthan", lat: 26.91, lng: 75.79, riskScore: 71, riskLevel: "collapse", ndviTrend: -0.029, nightlightVolatility: 310, moistureDeficit: 0.58, vegetationSlope: -0.022, lastUpdated: "2026-02-25T08:30:00Z" },
  { id: "d5", name: "Jodhpur", state: "Rajasthan", lat: 26.24, lng: 73.02, riskScore: 45, riskLevel: "drift", ndviTrend: -0.012, nightlightVolatility: 142, moistureDeficit: 0.38, vegetationSlope: -0.009, lastUpdated: "2026-02-25T08:30:00Z" },
  { id: "d6", name: "Pushkar", state: "Rajasthan", lat: 26.49, lng: 74.55, riskScore: 23, riskLevel: "low", ndviTrend: 0.005, nightlightVolatility: 67, moistureDeficit: 0.18, vegetationSlope: 0.003, lastUpdated: "2026-02-25T08:30:00Z" },
  { id: "d7", name: "Sirohi", state: "Rajasthan", lat: 24.88, lng: 72.86, riskScore: 54, riskLevel: "drift", ndviTrend: -0.016, nightlightVolatility: 175, moistureDeficit: 0.41, vegetationSlope: -0.011, lastUpdated: "2026-02-25T08:30:00Z" },
  { id: "d8", name: "Faridabad", state: "Haryana", lat: 28.41, lng: 77.31, riskScore: 83, riskLevel: "immediate", ndviTrend: -0.039, nightlightVolatility: 398, moistureDeficit: 0.71, vegetationSlope: -0.029, lastUpdated: "2026-02-25T08:30:00Z" },
  { id: "d9", name: "Bhilwara", state: "Rajasthan", lat: 25.35, lng: 74.64, riskScore: 38, riskLevel: "drift", ndviTrend: -0.008, nightlightVolatility: 112, moistureDeficit: 0.29, vegetationSlope: -0.006, lastUpdated: "2026-02-25T08:30:00Z" },
  { id: "d10", name: "Ajmer", state: "Rajasthan", lat: 26.45, lng: 74.64, riskScore: 56, riskLevel: "drift", ndviTrend: -0.017, nightlightVolatility: 189, moistureDeficit: 0.43, vegetationSlope: -0.013, lastUpdated: "2026-02-25T08:30:00Z" },
  { id: "d11", name: "Rewari", state: "Haryana", lat: 28.19, lng: 76.62, riskScore: 74, riskLevel: "collapse", ndviTrend: -0.033, nightlightVolatility: 345, moistureDeficit: 0.62, vegetationSlope: -0.025, lastUpdated: "2026-02-25T08:30:00Z" },
  { id: "d12", name: "Pali", state: "Rajasthan", lat: 25.77, lng: 73.32, riskScore: 31, riskLevel: "low", ndviTrend: -0.003, nightlightVolatility: 89, moistureDeficit: 0.22, vegetationSlope: -0.002, lastUpdated: "2026-02-25T08:30:00Z" },
  { id: "d13", name: "Nuh", state: "Haryana", lat: 28.1, lng: 77.0, riskScore: 91, riskLevel: "immediate", ndviTrend: -0.048, nightlightVolatility: 445, moistureDeficit: 0.81, vegetationSlope: -0.035, lastUpdated: "2026-02-25T08:30:00Z" },
  { id: "d14", name: "Dausa", state: "Rajasthan", lat: 26.88, lng: 76.34, riskScore: 67, riskLevel: "collapse", ndviTrend: -0.025, nightlightVolatility: 267, moistureDeficit: 0.52, vegetationSlope: -0.019, lastUpdated: "2026-02-25T08:30:00Z" },
  { id: "d15", name: "Tonk", state: "Rajasthan", lat: 26.17, lng: 75.79, riskScore: 42, riskLevel: "drift", ndviTrend: -0.011, nightlightVolatility: 134, moistureDeficit: 0.34, vegetationSlope: -0.008, lastUpdated: "2026-02-25T08:30:00Z" },
  { id: "d16", name: "Mahendragarh", state: "Haryana", lat: 28.28, lng: 76.15, riskScore: 69, riskLevel: "collapse", ndviTrend: -0.026, nightlightVolatility: 278, moistureDeficit: 0.55, vegetationSlope: -0.02, lastUpdated: "2026-02-25T08:30:00Z" },
];

export const alerts: Alert[] = [
  { id: "a1", districtName: "Nuh", state: "Haryana", type: "collapse_imminent", message: "ECRS 91 — Vegetation cover dropped 48% below seasonal baseline. Mining activity cluster detected via nightlight anomaly.", severity: "immediate", timestamp: "2026-02-25T08:12:00Z" },
  { id: "a2", districtName: "Alwar", state: "Rajasthan", type: "threshold_breach", message: "ECRS crossed 85 threshold. NDVI slope acceleration detected — 3.1% monthly decline exceeding 2σ historical variance.", severity: "immediate", timestamp: "2026-02-25T07:45:00Z" },
  { id: "a3", districtName: "Faridabad", state: "Haryana", type: "anomaly_cluster", message: "Urban encroachment front advancing 2.3km/quarter into Aravalli buffer zone. Nightlight intensity +412% over 18 months.", severity: "immediate", timestamp: "2026-02-25T06:30:00Z" },
  { id: "a4", districtName: "Gurugram", state: "Haryana", type: "drift_detected", message: "Moisture deficit accumulation exceeding seasonal norms. Soil degradation precursors identified in western quadrant.", severity: "collapse", timestamp: "2026-02-25T05:15:00Z" },
  { id: "a5", districtName: "Jaipur", state: "Rajasthan", type: "drift_detected", message: "NDVI trend slope shifted from -0.018 to -0.029 over 6 months. Biodiversity corridor fragmentation at 34%.", severity: "collapse", timestamp: "2026-02-25T04:00:00Z" },
  { id: "a6", districtName: "Udaipur", state: "Rajasthan", type: "drift_detected", message: "Water body index declining. Lake surface area reduced 12% vs. 5-year average despite normal precipitation.", severity: "drift", timestamp: "2026-02-24T22:00:00Z" },
];

export const ndviTimeSeries: NDVIDataPoint[] = [
  { month: "Mar '25", actual: 0.62, baseline: 0.65, predicted: 0.63 },
  { month: "Apr '25", actual: 0.58, baseline: 0.63, predicted: 0.59 },
  { month: "May '25", actual: 0.51, baseline: 0.58, predicted: 0.53 },
  { month: "Jun '25", actual: 0.55, baseline: 0.61, predicted: 0.54 },
  { month: "Jul '25", actual: 0.59, baseline: 0.67, predicted: 0.57 },
  { month: "Aug '25", actual: 0.56, baseline: 0.68, predicted: 0.55 },
  { month: "Sep '25", actual: 0.52, baseline: 0.66, predicted: 0.51 },
  { month: "Oct '25", actual: 0.48, baseline: 0.63, predicted: 0.47 },
  { month: "Nov '25", actual: 0.44, baseline: 0.60, predicted: 0.43 },
  { month: "Dec '25", actual: 0.41, baseline: 0.58, predicted: 0.40 },
  { month: "Jan '26", actual: 0.38, baseline: 0.56, predicted: 0.37 },
  { month: "Feb '26", actual: 0.35, baseline: 0.55, predicted: 0.34 },
  { month: "Mar '26", actual: null as any, baseline: 0.54, predicted: 0.31 },
  { month: "Apr '26", actual: null as any, baseline: 0.52, predicted: 0.28 },
  { month: "May '26", actual: null as any, baseline: 0.50, predicted: 0.25 },
];

export const nationalStats = {
  totalDistricts: 742,
  monitored: 742,
  lowRisk: 412,
  driftRisk: 198,
  collapseRisk: 97,
  immediateRisk: 35,
  lastSatellitePass: "2026-02-25T06:42:00Z",
  dataLatency: "1.8h",
  modelsActive: 4,
};
