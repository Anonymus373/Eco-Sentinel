'use strict';
/* ══════════════════════════════════════════════════
   EcoSentinel India — script.js
   India-specific data, Aravalli deep-dive, AI rec system
   ══════════════════════════════════════════════════ */

// ── Data ─────────────────────────────────────────────────────────────────────
const INDIA_DISTRICTS = [
  { name:'Nuh',           state:'Haryana',    lat:28.095, lon:77.003, ecrs:95, tier:'immediate', ndvi:0.178, lst:37.2, ndwi:-0.42, ndvi_slope:-0.047, moisture:0.42, night:44.8, veg_slope:-0.015, region:'aravalli' },
  { name:'Alwar',         state:'Rajasthan',  lat:27.557, lon:76.619, ecrs:82, tier:'immediate', ndvi:0.291, lst:35.8, ndwi:-0.35, ndvi_slope:-0.032, moisture:0.35, night:31.2, veg_slope:-0.010, region:'aravalli' },
  { name:'Faridabad',     state:'Haryana',    lat:28.411, lon:77.313, ecrs:88, tier:'immediate', ndvi:0.198, lst:38.1, ndwi:-0.48, ndvi_slope:-0.041, moisture:0.48, night:52.1, veg_slope:-0.018, region:'aravalli' },
  { name:'Gurugram',      state:'Haryana',    lat:28.459, lon:77.026, ecrs:79, tier:'collapse',  ndvi:0.231, lst:36.9, ndwi:-0.44, ndvi_slope:-0.028, moisture:0.44, night:48.3, veg_slope:-0.014, region:'aravalli' },
  { name:'Jaipur',        state:'Rajasthan',  lat:26.912, lon:75.787, ecrs:55, tier:'collapse',  ndvi:0.318, lst:35.2, ndwi:-0.29, ndvi_slope:-0.014, moisture:0.29, night:22.4, veg_slope:-0.007, region:'aravalli' },
  { name:'Mahendragarh',  state:'Haryana',    lat:28.273, lon:76.152, ecrs:52, tier:'collapse',  ndvi:0.334, lst:34.3, ndwi:-0.25, ndvi_slope:-0.011, moisture:0.25, night:14.2, veg_slope:-0.005, region:'aravalli' },
  { name:'Bhiwani',       state:'Haryana',    lat:28.793, lon:76.139, ecrs:43, tier:'drift',     ndvi:0.302, lst:33.8, ndwi:-0.22, ndvi_slope:-0.009, moisture:0.22, night:10.8, veg_slope:-0.004, region:'aravalli' },
  { name:'Sikar',         state:'Rajasthan',  lat:27.612, lon:75.140, ecrs:38, tier:'drift',     ndvi:0.362, lst:32.9, ndwi:-0.18, ndvi_slope:-0.006, moisture:0.18, night: 8.1, veg_slope:-0.002, region:'aravalli' },
  // India national
  { name:'Sundarbans',    state:'West Bengal', lat:21.950, lon:88.900, ecrs:71, tier:'collapse',  ndvi:0.58, lst:32.1, ndwi:-0.12, ndvi_slope:-0.022, moisture:0.15, night: 8.4, veg_slope:-0.008, region:'india' },
  { name:'Rann of Kutch', state:'Gujarat',     lat:23.714, lon:69.857, ecrs:64, tier:'collapse',  ndvi:0.14, lst:40.2, ndwi:-0.55, ndvi_slope:-0.018, moisture:0.55, night:12.1, veg_slope:-0.006, region:'india' },
  { name:'Kaziranga',     state:'Assam',       lat:26.577, lon:93.171, ecrs:48, tier:'drift',     ndvi:0.72, lst:30.5, ndwi:-0.08, ndvi_slope:-0.011, moisture:0.08, night: 5.2, veg_slope:-0.003, region:'india' },
  { name:'Nilgiris',      state:'Tamil Nadu',  lat:11.424, lon:76.695, ecrs:42, tier:'drift',     ndvi:0.68, lst:22.1, ndwi:-0.05, ndvi_slope:-0.008, moisture:0.05, night: 4.8, veg_slope:-0.002, region:'india' },
  { name:'Chambal',       state:'MP/Raj',      lat:26.295, lon:77.584, ecrs:58, tier:'collapse',  ndvi:0.31, lst:36.4, ndwi:-0.32, ndvi_slope:-0.016, moisture:0.32, night:18.3, veg_slope:-0.005, region:'india' },
  { name:'Garo Hills',    state:'Meghalaya',   lat:25.580, lon:90.490, ecrs:38, tier:'drift',     ndvi:0.76, lst:28.3, ndwi:-0.04, ndvi_slope:-0.007, moisture:0.04, night: 3.1, veg_slope:-0.002, region:'india' },
  { name:'Chilika Lake',  state:'Odisha',      lat:19.727, lon:85.318, ecrs:35, tier:'drift',     ndvi:0.45, lst:31.8, ndwi:-0.14, ndvi_slope:-0.006, moisture:0.14, night: 6.8, veg_slope:-0.002, region:'india' },
  { name:'Palghar',       state:'Maharashtra', lat:19.697, lon:72.765, ecrs:45, tier:'drift',     ndvi:0.54, lst:30.9, ndwi:-0.18, ndvi_slope:-0.010, moisture:0.18, night:12.4, veg_slope:-0.003, region:'india' },
  { name:'Mysuru',        state:'Karnataka',   lat:12.296, lon:76.639, ecrs:29, tier:'low',       ndvi:0.62, lst:27.4, ndwi:-0.07, ndvi_slope:-0.003, moisture:0.07, night: 4.2, veg_slope:-0.001, region:'india' },
  { name:'Dibang Valley', state:'Arunachal',   lat:28.638, lon:95.706, ecrs:18, tier:'low',       ndvi:0.81, lst:20.1, ndwi:-0.02, ndvi_slope:-0.001, moisture:0.02, night: 1.2, veg_slope:0.001,  region:'india' },
];

const TIER_COLORS = { low:'#22c55e', drift:'#f59e0b', collapse:'#f97316', immediate:'#ef4444' };
const TIER_LABELS = { low:'LOW', drift:'DRIFT', collapse:'COLLAPSE', immediate:'IMMEDIATE' };

// ── AI Recommendation Engine ───────────────────────────────────────────────
const INTERVENTIONS = {
  reforestation: {
    trigger: d => d.ndvi_slope < -0.002,
    priority: d => d.ndvi_slope < -0.004 ? 'CRITICAL' : 'HIGH',
    action: 'Emergency Reforestation Protocol',
    detail: d => `NDVI declining at ${Math.abs(d.ndvi_slope).toFixed(3)}/month. Plant native Aravalli species (Dhok, Khejri, Rohida). Target ${(Math.max(0, 0.35 - d.ndvi) * 100).toFixed(1)}% NDVI recovery over 18 months.`,
    budget: d => Math.round(Math.abs(d.ndvi_slope) * 50000),
    timeline: 18,
    color: '#ef4444',
  },
  watershed: {
    trigger: d => d.moisture > 0.25,
    priority: d => d.moisture > 0.38 ? 'CRITICAL' : 'HIGH',
    action: 'Watershed Restoration Initiative',
    detail: d => `Moisture deficit index: ${d.moisture.toFixed(3)}. Restore ${Math.round(d.moisture * 500)} ha of degraded catchments. Construct check dams & percolation ponds.`,
    budget: d => Math.round(d.moisture * 200),
    timeline: 24,
    color: '#38bdf8',
  },
  encroachment: {
    trigger: d => d.ndvi_slope < -0.015 || d.night > 30,
    priority: d => d.night > 45 ? 'CRITICAL' : 'MEDIUM',
    action: 'Encroachment Monitoring Deployment',
    detail: d => `Night-light volatility: ${d.night.toFixed(1)}σ. Deploy drone surveillance + real-time Sentinel-2 change detection for illegal construction. File FIRs on flagged coordinates.`,
    budget: () => 5,
    timeline: 3,
    color: '#f97316',
  },
  biodiversity: {
    trigger: d => d.ecrs > 60,
    priority: d => d.ecrs > 80 ? 'IMMEDIATE' : 'HIGH',
    action: 'Biodiversity Corridor Reconnection',
    detail: d => `ECRS ${d.ecrs}/100 — ecosystem collapse trajectory. Establish wildlife corridors between fragmented Aravalli patches. Species-specific habitat patches required. Coordinate with WCS India.`,
    budget: d => Math.round(d.ecrs * 2),
    timeline: 36,
    color: '#a78bfa',
  },
  heat: {
    trigger: d => d.lst > 36.0,
    priority: d => d.lst > 38 ? 'HIGH' : 'MEDIUM',
    action: 'Urban Heat Island Mitigation',
    detail: d => `LST ${d.lst.toFixed(1)}°C — significantly above regional baseline. Mandate green roofs on new construction. 20% tree cover requirement in urban expansion zones. Restrict heat-absorbing dark surfaces.`,
    budget: d => Math.round((d.lst - 30) * 8),
    timeline: 12,
    color: '#f59e0b',
  },
};

function getRecommendations(district) {
  const recs = [];
  const order = { IMMEDIATE:0, CRITICAL:1, HIGH:2, MEDIUM:3, LOW:4 };
  for (const [key, iv] of Object.entries(INTERVENTIONS)) {
    if (iv.trigger(district)) {
      recs.push({
        key, action: iv.action,
        priority: iv.priority(district),
        detail: iv.detail(district),
        budget: iv.budget(district),
        timeline: iv.timeline,
        color: iv.color,
      });
    }
  }
  return recs.sort((a,b) => (order[a.priority]||9) - (order[b.priority]||9));
}

// ── Seeded random time series ──────────────────────────────────────────────
function seeded(seed) {
  let s = Math.abs(seed % 2147483647) + 1;
  return () => { s = s * 16807 % 2147483647; return (s - 1) / 2147483646; };
}

function generateTimeSeries(district, months = 72) {
  // 72 months = Jan 2019 – Dec 2024
  const rng = seeded(Math.abs(district.lat * district.lon * 100) | 0);
  const baseNdvi = district.ndvi + district.ndvi_slope * -36; // start higher
  const series = [];
  for (let i = 0; i < months; i++) {
    const date = new Date(2019, i, 1);
    const month = date.getMonth();
    const seasonal = 0.07 * Math.sin(2 * Math.PI * (month - 2) / 12);
    const drift = district.ndvi_slope * i;
    const noise = (rng() - 0.5) * 0.025;
    series.push({
      date: `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`,
      ndvi: +Math.max(0.05, Math.min(0.9, baseNdvi + seasonal + drift + noise)).toFixed(3),
      lst: +(district.lst + 6 * Math.sin(2*Math.PI*(month-4)/12) + (rng()-0.5)*1.5 + 0.05*(i/12)).toFixed(2),
      ndwi: +(district.ndwi + 0.05*Math.sin(2*Math.PI*(month-8)/12) - 0.002*(i/12) + (rng()-0.5)*0.025).toFixed(3),
    });
  }
  return series;
}

// ── Utilities ──────────────────────────────────────────────────────────────
function timeAgo(minAgo) {
  if (minAgo < 60) return `${minAgo} min ago`;
  return `${Math.floor(minAgo/60)}h ${minAgo%60}m ago`;
}

const now = Date.now();
function minutesAgo(n) { return timeAgo(n); }

// ── Clock ──────────────────────────────────────────────────────────────────
function startClock() {
  const el = document.getElementById('utcTime');
  const update = () => {
    const n = new Date();
    el.textContent = n.toUTCString().match(/\d+:\d+:\d+/)[0] + ' UTC';
  };
  update(); setInterval(update, 1000);
}

// ── Tab nav ────────────────────────────────────────────────────────────────
let activeCharts = {};
function initTabs() {
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
      if (btn.dataset.tab === 'aravalli') initAravalliTab();
      if (btn.dataset.tab === 'analytics') initAnalyticsTab();
      if (btn.dataset.tab === 'recommend') initRecommendTab();
    });
  });
}

// ── INDIA MAP ─────────────────────────────────────────────────────────────
let indiaMap = null;
let selectedDistrictName = 'Sundarbans';

function initIndiaMap() {
  indiaMap = L.map('indiaMap', { zoomControl: true, attributionControl: false });
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Esri'
  }).addTo(indiaMap);
  indiaMap.setView([22, 80], 4);

  INDIA_DISTRICTS.forEach(d => {
    const color = TIER_COLORS[d.tier];
    const radius = 10 + d.ecrs / 8;

    const marker = L.circleMarker([d.lat, d.lon], {
      radius, color, fillColor: color, fillOpacity: 0.25, weight: 2,
    }).addTo(indiaMap);

    L.circleMarker([d.lat, d.lon], {
      radius: 4, color, fillColor: color, fillOpacity: 1, weight: 0,
    }).addTo(indiaMap);

    const popup = `
      <div style="font-family:monospace;font-size:11px;min-width:180px">
        <div style="color:${color};font-weight:bold;letter-spacing:1px;margin-bottom:6px">${d.name.toUpperCase()}</div>
        <div style="color:#7db896">State: <span style="color:#e8fff0">${d.state}</span></div>
        <div style="color:#7db896">ECRS: <span style="color:${color};font-weight:bold">${d.ecrs}/100</span></div>
        <div style="color:#7db896">Risk: <span style="color:${color}">${TIER_LABELS[d.tier]}</span></div>
        <div style="color:#7db896">NDVI: <span style="color:#e8fff0">${d.ndvi.toFixed(3)}</span></div>
        <div style="color:#7db896">LST: <span style="color:#e8fff0">${d.lst.toFixed(1)}°C</span></div>
      </div>`;

    marker.bindPopup(popup);
    marker.on('click', () => {
      selectedDistrictName = d.name;
      document.getElementById('selectedDistrict').textContent = d.name.toUpperCase() + ' DISTRICT';
      updateNdviMainChart(d);
    });
  });
}

// ── NDVI Main Chart ────────────────────────────────────────────────────────
let ndviMainChart = null;
function updateNdviMainChart(district) {
  const ts = generateTimeSeries(district, 72);
  const labels = ts.map(s => s.date.slice(5));
  const ndvis  = ts.map(s => s.ndvi);
  const baseline = ndvis.slice(0, 12).reduce((a,b)=>a+b,0)/12;

  if (ndviMainChart) ndviMainChart.destroy();
  ndviMainChart = new Chart(document.getElementById('chartNdviMain'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'Current', data: ndvis, borderColor: '#ef4444', backgroundColor: '#ef444410', fill: true, tension: 0.4, pointRadius: 0, borderWidth: 1.5 },
        { label: 'Baseline', data: Array(72).fill(baseline), borderColor: '#22c55e', borderDash: [4,3], fill: false, pointRadius: 0, borderWidth: 1 },
        { label: 'Threshold', data: Array(72).fill(0.20), borderColor: '#f59e0b', borderDash: [2,4], fill: false, pointRadius: 0, borderWidth: 1 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid:{color:'#182e1e'}, ticks:{color:'#2e5e3c',font:{size:8,family:'monospace'},maxTicksLimit:6} },
        y: { grid:{color:'#182e1e'}, ticks:{color:'#2e5e3c',font:{size:8,family:'monospace'}}, min:0.05, max:0.75 },
      }
    }
  });
}

// ── Alerts Feed ────────────────────────────────────────────────────────────
const ALERT_MSGS = {
  immediate: [
    'Vegetation cover dropped 18%+ below baseline. Emergency restoration protocol recommended.',
    'ECRS exceeded 90 — collapse risk elevated. Immediate field verification required.',
    'Nightlight volatility 50σ — illegal encroachment activity detected.',
  ],
  collapse: [
    'NDBI accumulation rate → 3.7% monthly. Urban pressure on eco-sensitive zone.',
    'Moisture deficit accelerating — tipping point projected within 6 months.',
    'Soil degradation precursors identified. Satellite-confirmed erosion expansion.',
  ],
  drift: [
    'Subtle deforestation accumulating. Seasonal anomalies show 19 months of drift.',
    'Biodiversity corridor fragmentation at 44%. Mosaic habitat below viability threshold.',
    'NDVI floor declining each monsoon cycle. Recovery capacity weakening.',
  ],
};

function initAlertsFeed() {
  const feed = document.getElementById('alertsFeed');
  const alerts = INDIA_DISTRICTS
    .filter(d => d.tier !== 'low')
    .sort((a,b) => b.ecrs - a.ecrs)
    .slice(0, 6);

  feed.innerHTML = alerts.map((d, i) => {
    const msgs = ALERT_MSGS[d.tier] || ALERT_MSGS.drift;
    const msg = msgs[i % msgs.length];
    return `
      <div class="alert-item ${d.tier}">
        <div style="display:flex;justify-content:space-between;align-items:baseline">
          <span class="alert-name ${d.tier}">${d.name}</span>
          <span class="alert-time">${minutesAgo(14 + i*18)}</span>
        </div>
        <div class="alert-state" style="color:#3d6b52">· ${d.state}</div>
        <div class="alert-msg">${msg}</div>
      </div>`;
  }).join('');
}

// ── District Table ─────────────────────────────────────────────────────────
function initDistrictTable() {
  const tbody = document.getElementById('districtTableBody');
  const rows = [...INDIA_DISTRICTS].sort((a,b) => b.ecrs - a.ecrs);
  document.getElementById('districtCount').textContent = `${rows.length} districts shown`;

  tbody.innerHTML = rows.map(d => {
    const updated = `${3 + Math.floor(d.ecrs/20)} min ago`;
    return `
      <tr>
        <td style="color:var(--text-hi);font-weight:600">${d.name}</td>
        <td>${d.state}</td>
        <td><span class="risk-pill ${d.tier}">${TIER_LABELS[d.tier]}</span></td>
        <td style="color:${TIER_COLORS[d.tier]};font-weight:700">${d.ecrs}</td>
        <td style="color:${d.ndvi < 0.25 ? '#ef4444' : '#7db896'}">${d.ndvi.toFixed(3)}</td>
        <td style="color:${d.moisture > 0.35 ? '#f97316' : '#7db896'}">${d.moisture.toFixed(3)}</td>
        <td style="color:${d.lst > 36 ? '#ef4444' : '#7db896'}">${d.lst.toFixed(1)}</td>
        <td style="color:#2e5e3c">${updated}</td>
      </tr>`;
  }).join('');
}

// ══════════════════════════════════════════════════
// ARAVALLI TAB
// ══════════════════════════════════════════════════
let aravalliMap = null;
let aravalliInited = false;

function initAravalliTab() {
  if (aravalliInited) return;
  aravalliInited = true;
  initAravalliMap();
  initSatLog();
  initTemporalPlayback();
  initAravalliAlerts();
  initClusterChart();
  initRankingsChart();
  initTrendGrid();
  updateDistrictDetail(INDIA_DISTRICTS[0]);  // Nuh default
  initAiEngine(INDIA_DISTRICTS[0]);
}

function initAravalliMap() {
  const aravalli = INDIA_DISTRICTS.filter(d => d.region === 'aravalli');
  aravalliMap = L.map('aravalliMap', { zoomControl: false, attributionControl: false });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(aravalliMap);
  aravalliMap.setView([28.0, 76.5], 7);

  aravalli.forEach(d => {
    const color = TIER_COLORS[d.tier];
    const r = 8 + d.ecrs / 10;
    const m = L.circleMarker([d.lat, d.lon], { radius:r, color, fillColor:color, fillOpacity:0.3, weight:2 }).addTo(aravalliMap);
    L.circleMarker([d.lat, d.lon], { radius:3, color, fillColor:color, fillOpacity:1, weight:0 }).addTo(aravalliMap);

    m.on('click', () => {
      updateDistrictDetail(d);
      initAiEngine(d);
      document.querySelectorAll('.ds-btn').forEach(b => b.classList.toggle('active', b.dataset.name === d.name));
    });
    m.bindTooltip(`<b style="color:${color}">${d.name}</b><br>ECRS: ${d.ecrs}`, { className:'eco-tt', permanent: d.ecrs >= 90 });
  });
}

function updateDistrictDetail(d) {
  document.getElementById('ddpName').textContent = d.name;
  document.getElementById('ddpState').textContent = d.state;
  document.getElementById('ddpScore').textContent = d.ecrs;
  document.getElementById('ddpScore').style.color = TIER_COLORS[d.tier];
  document.getElementById('ddpFill').style.width = d.ecrs + '%';
  document.getElementById('ddpNdvi').textContent = (d.ndvi_slope).toFixed(3) + ' /month';
  document.getElementById('ddpNight').textContent = '+' + d.night.toFixed(1) + ' σ';
  document.getElementById('ddpMoisture').textContent = d.moisture.toFixed(3) + ' km²';
  document.getElementById('ddpVeg').textContent = d.veg_slope.toFixed(3) + ' /mo';
}

function initAiEngine(district) {
  const recs = getRecommendations(district);
  const container = document.getElementById('aiRecs');
  container.innerHTML = recs.slice(0, 4).map(r => `
    <div class="ai-rec-item">
      <div class="air-left">
        <div class="air-dot" style="background:${r.color}"></div>
        <div class="air-action">${r.action}</div>
      </div>
      <button class="air-btn ${r.priority.toLowerCase()}">${r.priority}</button>
    </div>`).join('');
}

function initSatLog() {
  const items = [
    { sat:'Cartasat-3', area:'Bilaspur',      ndvi:'17', lst:'33', delta:'+1.3' },
    { sat:'Sentinel-3A', area:'Ajmer',        ndvi:'34', lst:'33', delta:'+2.0' },
    { sat:'Cartasat-3', area:'Mahendragarh',  ndvi:'44', lst:'34', delta:'+1.8' },
    { sat:'RISAT-Terra', area:'Alwar',        ndvi:'47', lst:'39', delta:'-4.1' },
    { sat:'Sentinel-3A', area:'Alwar',        ndvi:'47', lst:'39', delta:'-4.1' },
  ];
  document.getElementById('satLogItems').innerHTML = items.map(it => `
    <div class="sat-log-item">
      <div><div class="sl-sat">${it.sat}</div><div class="sl-area">${it.area}</div></div>
      <div class="sl-metrics">
        <span class="sl-m green">NDVI ${it.ndvi}</span>
        <span class="sl-m amber">LST ${it.lst}</span>
        <span class="sl-m ${it.delta.startsWith('+') ? 'amber' : 'red'}">${it.delta}</span>
      </div>
    </div>`).join('');
}

function initTemporalPlayback() {
  const months = ['J','F','M','A','M','J','J','A','S','O','N','D','J','F','M','A','M','J','J','A','S','O','N','D'];
  const colors = ['#22c55e','#22c55e','#f59e0b','#f59e0b','#f97316','#f59e0b','#22c55e','#22c55e','#22c55e','#f59e0b','#f59e0b','#22c55e',
                  '#f59e0b','#f59e0b','#f97316','#f97316','#f97316','#f97316','#22c55e','#22c55e','#f59e0b','#f97316','#f97316','#ef4444'];
  const container = document.getElementById('tpMonths');
  container.innerHTML = months.map((m,i) => `<div class="tp-month" title="${m}" style="background:${colors[i]};width:calc((100% - ${months.length-1}*3px)/${months.length})"></div>`).join('');

  let pos = 0;
  const fill = document.getElementById('tpFill');
  const tpDate = document.getElementById('tpDate');
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const years = ['23','23','23','23','23','23','23','23','23','23','23','23','24','24','24','24','24','24','24','24','24','24','24','24'];

  setInterval(() => {
    pos = (pos + 1) % months.length;
    fill.style.width = ((pos+1)/months.length*100) + '%';
    tpDate.textContent = monthNames[pos % 12] + " '" + years[pos];
  }, 600);
}

function initAravalliAlerts() {
  const aravalli = INDIA_DISTRICTS.filter(d => d.region === 'aravalli').sort((a,b) => b.ecrs - a.ecrs);
  const msgs = {
    immediate: ['Vegetation cover dropped 40% below baseline. Emergency intervention.',
                'ECRS exceeded 90. Collapse risk trajectory confirmed.',
                'Illegal construction encroachment — NDBI +3.7%/month detected.'],
    collapse:  ['Urban pressure accumulating. Satellite anomaly confirmed.',
                'Soil degradation precursors identified in satellite-confirmed erosion expansion.'],
    drift:     ['NDVI slope trend: -0.007/month. Monitor for seasonal vs permanent drift.',
                'Biodiversity mosaic habitat approaching viability threshold.'],
  };
  const el = document.getElementById('aravalliAlerts');
  el.innerHTML = aravalli.slice(0, 5).map((d, i) => `
    <div class="afa-item">
      <div style="display:flex;justify-content:space-between">
        <span class="afa-name" style="color:${TIER_COLORS[d.tier]}">${d.name} <span style="color:#2e5e3c;font-size:0.5rem">${d.tier.toUpperCase()}</span></span>
        <span class="afa-time">${minutesAgo(10 + i * 12)}</span>
      </div>
      <div class="afa-msg">${(msgs[d.tier] || msgs.drift)[i % (msgs[d.tier]||msgs.drift).length]}</div>
    </div>`).join('');
}

function initClusterChart() {
  const aravalli = INDIA_DISTRICTS.filter(d => d.region === 'aravalli');
  const clusterColors = aravalli.map(d => TIER_COLORS[d.tier] + 'cc');

  if (activeCharts.cluster) activeCharts.cluster.destroy();
  activeCharts.cluster = new Chart(document.getElementById('clusterChart'), {
    type: 'scatter',
    data: {
      datasets: [{
        data: aravalli.map(d => ({ x: d.night, y: Math.abs(d.ndvi_slope) * 1000 })),
        backgroundColor: clusterColors,
        pointRadius: aravalli.map(d => 6 + d.ecrs / 15),
        pointHoverRadius: 10,
        label: 'Districts',
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const d = aravalli[ctx.dataIndex];
              return [`${d.name}`, `Night-σ: ${d.night.toFixed(1)}`, `NDVI-slope: ${d.ndvi_slope.toFixed(3)}`];
            }
          },
          backgroundColor:'#0c1510', borderColor:'#182e1e', borderWidth:1,
          titleColor:'#00ff88', bodyColor:'#e8fff0', titleFont:{family:'monospace',size:10}, bodyFont:{family:'monospace',size:10}
        }
      },
      scales: {
        x: { title:{display:true,text:'Night-light Volatility (σ)',color:'#2e5e3c',font:{size:9,family:'monospace'}}, grid:{color:'#182e1e'}, ticks:{color:'#2e5e3c',font:{size:8,family:'monospace'}} },
        y: { title:{display:true,text:'NDVI Slope ×10⁻³/month',color:'#2e5e3c',font:{size:9,family:'monospace'}}, grid:{color:'#182e1e'}, ticks:{color:'#2e5e3c',font:{size:8,family:'monospace'}} },
      }
    }
  });
}

function initRankingsChart() {
  const sorted = [...INDIA_DISTRICTS].sort((a,b) => b.ecrs - a.ecrs).slice(0, 10);
  if (activeCharts.rankings) activeCharts.rankings.destroy();
  activeCharts.rankings = new Chart(document.getElementById('rankingsChart'), {
    type: 'bar',
    data: {
      labels: sorted.map(d => d.name),
      datasets: [{
        data: sorted.map(d => d.ecrs),
        backgroundColor: sorted.map(d => TIER_COLORS[d.tier] + '99'),
        borderColor: sorted.map(d => TIER_COLORS[d.tier]),
        borderWidth: 1,
        borderRadius: 2,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor:'#0c1510', borderColor:'#182e1e', borderWidth:1, titleColor:'#00ff88', bodyColor:'#e8fff0', callbacks:{ label: ctx => `ECRS: ${ctx.raw}/100` } }
      },
      scales: {
        x: { min:0, max:100, grid:{color:'#182e1e'}, ticks:{color:'#2e5e3c',font:{size:8,family:'monospace'}} },
        y: { grid:{color:'#182e1e'}, ticks:{color:'#e8fff0',font:{size:8,family:'monospace'}} },
      }
    }
  });
}

function initTrendGrid() {
  const aravalli = INDIA_DISTRICTS.filter(d => d.region === 'aravalli');
  const grid = document.getElementById('trendsGrid');
  grid.innerHTML = aravalli.map(d => `
    <div class="trend-card">
      <div class="tc-title" style="color:${TIER_COLORS[d.tier]}">${d.name} [${TIER_LABELS[d.tier]}]</div>
      <div class="tc-sub">${d.state} · ECRS: ${d.ecrs}/100</div>
      <div class="tc-metrics">
        <span class="tc-m">Slope: <span style="color:${d.ndvi_slope < -0.02 ? '#ef4444' : '#f59e0b'}">${d.ndvi_slope.toFixed(3)}</span></span>
        <span class="tc-m">NDVI: <span style="color:var(--text-hi)">${d.ndvi.toFixed(3)}</span></span>
      </div>
      <canvas id="tc-chart-${d.name.replace(/\s/g,'')}" height="80"></canvas>
    </div>`).join('');

  aravalli.forEach(d => {
    const ts = generateTimeSeries(d, 72);
    const labels = ts.filter((_,i)=>i%3===0).map(s=>s.date.slice(5));
    const ndvis  = ts.filter((_,i)=>i%3===0).map(s=>s.ndvi);
    const baseline = ndvis.slice(0,4).reduce((a,b)=>a+b,0)/4;
    const color = TIER_COLORS[d.tier];
    new Chart(document.getElementById(`tc-chart-${d.name.replace(/\s/g,'')}`), {
      type:'line',
      data: {
        labels,
        datasets: [
          { data:ndvis, borderColor:color, backgroundColor:color+'15', fill:true, tension:0.4, pointRadius:0, borderWidth:1.5 },
          { data:Array(labels.length).fill(baseline), borderColor:'#22c55e', borderDash:[3,3], fill:false, pointRadius:0, borderWidth:1 },
          { data:Array(labels.length).fill(0.20), borderColor:'#ef4444', borderDash:[2,4], fill:false, pointRadius:0, borderWidth:0.8 },
        ]
      },
      options: {
        responsive:true, maintainAspectRatio:false,
        plugins:{legend:{display:false},tooltip:{enabled:false}},
        scales:{
          x:{display:true, grid:{color:'#182e1e'}, ticks:{color:'#2e5e3c',font:{size:7,family:'monospace'},maxTicksLimit:5}},
          y:{display:true, grid:{color:'#182e1e'}, ticks:{color:'#2e5e3c',font:{size:7,family:'monospace'}}, min:0.05, max:0.65}
        }
      }
    });
  });
}

// ══════════════════════════════════════════════════
// ANALYTICS TAB
// ══════════════════════════════════════════════════
function initAnalyticsTab() {
  if (activeCharts.scatter) return;
  initScatterChart();
  initRadarChart();
  initLstChart();
}

function initScatterChart() {
  const aravalli = INDIA_DISTRICTS.filter(d => d.region === 'aravalli');
  activeCharts.scatter = new Chart(document.getElementById('chartScatter'), {
    type: 'scatter',
    data: {
      datasets: [{
        data: aravalli.map(d => ({ x: d.ndvi, y: d.ndwi })),
        backgroundColor: aravalli.map(d => TIER_COLORS[d.tier] + 'bb'),
        pointRadius: 7,
        label: 'Districts',
      }]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins:{legend:{display:false},tooltip:{backgroundColor:'#0c1510',borderColor:'#182e1e',borderWidth:1,titleColor:'#00ff88',bodyColor:'#e8fff0',callbacks:{label:ctx=>{const d=aravalli[ctx.dataIndex];return[d.name,`NDVI: ${d.ndvi}`,`NDWI: ${d.ndwi}`];}}}},
      scales:{
        x:{title:{display:true,text:'NDVI (Vegetation Health)',color:'#2e5e3c',font:{size:9,family:'monospace'}},grid:{color:'#182e1e'},ticks:{color:'#2e5e3c',font:{size:8,family:'monospace'}}},
        y:{title:{display:true,text:'NDWI (Water Stress)',color:'#2e5e3c',font:{size:9,family:'monospace'}},grid:{color:'#182e1e'},ticks:{color:'#2e5e3c',font:{size:8,family:'monospace'}}},
      }
    }
  });
}

function initRadarChart() {
  const nuh = INDIA_DISTRICTS.find(d => d.name === 'Nuh');
  const alwar = INDIA_DISTRICTS.find(d => d.name === 'Alwar');
  activeCharts.radar = new Chart(document.getElementById('chartRadar'), {
    type: 'radar',
    data: {
      labels: ['NDVI Loss', 'LST Stress', 'Moisture Deficit', 'Urban Expansion', 'Night-light σ'],
      datasets: [
        { label: 'Nuh', data: [95, 90, 85, 92, 88], backgroundColor:'#ef444430', borderColor:'#ef4444', pointBackgroundColor:'#ef4444', borderWidth:2 },
        { label: 'Alwar', data: [80, 72, 70, 65, 62], backgroundColor:'#f9731630', borderColor:'#f97316', pointBackgroundColor:'#f97316', borderWidth:2 },
      ]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins:{legend:{labels:{color:'#e8fff0',font:{family:'monospace',size:10}}}},
      scales:{r:{backgroundColor:'#0c1510',grid:{color:'#182e1e'},pointLabels:{color:'#6db88a',font:{size:9,family:'monospace'}},ticks:{color:'#2e5e3c',backdropColor:'transparent',font:{size:7}}}}
    }
  });
}

function initLstChart() {
  const aravalli = INDIA_DISTRICTS.filter(d => d.region === 'aravalli');
  const nuh = aravalli.find(d => d.name === 'Nuh');
  const ts = generateTimeSeries(nuh, 72);
  const labels = ts.filter((_,i)=>i%4===0).map(s=>s.date.slice(5));
  const lsts   = ts.filter((_,i)=>i%4===0).map(s=>s.lst);
  activeCharts.lst = new Chart(document.getElementById('chartLst'), {
    type:'line',
    data:{
      labels,
      datasets:[
        {label:'LST (Nuh)', data:lsts, borderColor:'#ef4444', backgroundColor:'#ef444415', fill:true, tension:0.4, pointRadius:0, borderWidth:1.5},
        {label:'Baseline (30°C)', data:Array(labels.length).fill(30), borderColor:'#22c55e', borderDash:[4,3], fill:false, pointRadius:0, borderWidth:1},
      ]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{legend:{labels:{color:'#e8fff0',font:{family:'monospace',size:9}}}},
      scales:{
        x:{grid:{color:'#182e1e'},ticks:{color:'#2e5e3c',font:{size:8,family:'monospace'},maxTicksLimit:6}},
        y:{grid:{color:'#182e1e'},ticks:{color:'#2e5e3c',font:{size:8,family:'monospace'}},title:{display:true,text:'°C',color:'#2e5e3c',font:{size:9}}},
      }
    }
  });
}

// ══════════════════════════════════════════════════
// RECOMMENDATIONS TAB
// ══════════════════════════════════════════════════
let selectedRecDistrict = null;
function initRecommendTab() {
  const aravalli = INDIA_DISTRICTS.filter(d => d.region === 'aravalli').sort((a,b)=>b.ecrs-a.ecrs);
  if (selectedRecDistrict) return;
  selectedRecDistrict = aravalli[0];

  const sel = document.getElementById('districtSelector');
  sel.innerHTML = aravalli.map(d => `
    <div class="ds-btn ${d.name===aravalli[0].name?'active':''}" data-name="${d.name}" onclick="selectRecDistrict('${d.name}')">
      <div class="ds-name">${d.name}</div>
      <div class="ds-state">${d.state}</div>
      <div class="ds-ecrs" style="color:${TIER_COLORS[d.tier]}">${TIER_LABELS[d.tier]} · ${d.ecrs}/100</div>
    </div>`).join('');

  renderRecommendations(aravalli[0]);
}

window.selectRecDistrict = function(name) {
  const d = INDIA_DISTRICTS.find(x => x.name === name);
  if (!d) return;
  selectedRecDistrict = d;
  document.querySelectorAll('.ds-btn').forEach(b => b.classList.toggle('active', b.dataset.name === name));
  renderRecommendations(d);
};

function renderRecommendations(d) {
  document.getElementById('recDistrictName').textContent = `${d.name}, ${d.state}`;
  document.getElementById('recEcrsVal').textContent = `${d.ecrs}/100`;
  document.getElementById('recEcrsVal').style.color = TIER_COLORS[d.tier];
  document.getElementById('recTierVal').textContent = TIER_LABELS[d.tier];
  document.getElementById('recTierVal').style.color = TIER_COLORS[d.tier];
  document.getElementById('recNdviSlope').textContent = d.ndvi_slope.toFixed(3) + '/mo';
  document.getElementById('recAnomaly').textContent = d.ecrs > 60 ? 'DETECTED' : 'NONE';
  document.getElementById('recAnomaly').style.color = d.ecrs > 60 ? '#ef4444' : '#22c55e';

  const recs = getRecommendations(d);
  const container = document.getElementById('recInterventions');
  const priorityStyles = {
    IMMEDIATE: { bg:'#ef444420', color:'#ef4444', border:'#ef444460' },
    CRITICAL:  { bg:'#ef444415', color:'#ef4444', border:'#ef444440' },
    HIGH:      { bg:'#f9731620', color:'#f97316', border:'#f9731640' },
    MEDIUM:    { bg:'#f59e0b20', color:'#f59e0b', border:'#f59e0b40' },
    LOW:       { bg:'#22c55e15', color:'#22c55e', border:'#22c55e30' },
  };

  container.innerHTML = recs.map(r => {
    const ps = priorityStyles[r.priority] || priorityStyles.LOW;
    return `
      <div class="intervention-card" style="border-left-color:${r.color}">
        <div class="ic-header">
          <div class="ic-action">${r.action}</div>
          <span class="ic-priority" style="background:${ps.bg};color:${ps.color};border:1px solid ${ps.border}">${r.priority}</span>
        </div>
        <div class="ic-detail">${r.detail}</div>
        <div class="ic-footer">
          <div class="ic-footer-item"><span>BUDGET</span><strong>₹${r.budget} Cr</strong></div>
          <div class="ic-footer-item"><span>TIMELINE</span><strong>${r.timeline} months</strong></div>
          <div class="ic-footer-item"><span>DEPARTMENT</span><strong>${r.key === 'reforestation' ? 'Forest Dept' : r.key === 'watershed' ? 'Water Resources' : r.key === 'encroachment' ? 'Revenue/Police' : r.key === 'heat' ? 'Urban Planning' : 'Environment'}</strong></div>
        </div>
      </div>`;
  }).join('');

  const totalBudget = recs.reduce((a, r) => a + r.budget, 0);
  const maxTimeline = recs.length ? Math.max(...recs.map(r => r.timeline)) : 0;
  document.getElementById('budgetSummary').innerHTML = `
    <div class="bs-title">DISTRICT INTERVENTION BUDGET SUMMARY</div>
    <div class="bs-grid">
      <div class="bs-item"><div class="bs-val" style="color:var(--green)">₹${totalBudget} Cr</div><div class="bs-lbl">TOTAL BUDGET</div></div>
      <div class="bs-item"><div class="bs-val" style="color:var(--amber)">${recs.length}</div><div class="bs-lbl">INTERVENTIONS</div></div>
      <div class="bs-item"><div class="bs-val" style="color:var(--blue)">${maxTimeline} mo</div><div class="bs-lbl">MAX TIMELINE</div></div>
    </div>`;
}

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  startClock();
  initTabs();
  initIndiaMap();
  initAlertsFeed();
  initDistrictTable();

  // Load Sundarbans NDVI chart by default
  const sundarbans = INDIA_DISTRICTS.find(d => d.name === 'Sundarbans');
  updateNdviMainChart(sundarbans);
});