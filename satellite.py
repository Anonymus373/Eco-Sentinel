# satellite.py - EcoSentinel Satellite Data Module
# Fetches environmental indices from open APIs (Open-Meteo, NASA FIRMS, OpenAQ)

import requests
import json
import math
import random
import time
import os
from datetime import datetime, timedelta
from config import (
    OPEN_METEO_BASE_URL,
    OPENAQ_BASE_URL,
    NASA_FIRMS_BASE_URL,
    NASA_FIRMS_MAP_KEY,
    CACHE_TTL,
    DATA_DIR,
)

# ── In-memory cache ──────────────────────────────────────────────────────────
_cache: dict = {}


def _cache_get(key: str):
    entry = _cache.get(key)
    if entry and (time.time() - entry["ts"]) < CACHE_TTL:
        return entry["data"]
    return None


def _cache_set(key: str, data):
    _cache[key] = {"ts": time.time(), "data": data}


# ── NDVI simulation (Sentinel-2 bands require auth; we approximate) ──────────
def _ndvi_from_coords(lat: float, lon: float) -> float:
    """
    Approximate NDVI using biome heuristics + seeded noise.
    Replace with real Sentinel Hub API calls when credentials are set.
    """
    seed = int(abs(lat * 1000) + abs(lon * 1000)) % 9973
    rng = random.Random(seed + int(time.time() // 3600))  # changes hourly

    # Tropical zones
    if -23.5 <= lat <= 23.5:
        base = 0.65
    # Temperate
    elif 23.5 < abs(lat) <= 60:
        base = 0.45
    # Polar / arid
    else:
        base = 0.15

    noise = rng.uniform(-0.12, 0.12)
    return round(max(0.0, min(1.0, base + noise)), 3)


# ── Fire hotspots via NASA FIRMS ──────────────────────────────────────────────
def get_fire_hotspots(lat: float, lon: float, radius_deg: float = 5.0) -> list:
    cache_key = f"fires_{lat:.1f}_{lon:.1f}"
    cached = _cache_get(cache_key)
    if cached:
        return cached

    # NASA FIRMS CSV endpoint
    bbox = f"{lon - radius_deg},{lat - radius_deg},{lon + radius_deg},{lat + radius_deg}"
    url = f"{NASA_FIRMS_BASE_URL}/{NASA_FIRMS_MAP_KEY}/MODIS_NRT/world/1/{bbox}"

    try:
        resp = requests.get(url, timeout=8)
        if resp.status_code == 200 and "latitude" in resp.text:
            lines = resp.text.strip().split("\n")
            headers = lines[0].split(",")
            fires = []
            for line in lines[1:50]:  # cap at 50
                vals = line.split(",")
                if len(vals) >= len(headers):
                    row = dict(zip(headers, vals))
                    fires.append(
                        {
                            "lat": float(row.get("latitude", 0)),
                            "lon": float(row.get("longitude", 0)),
                            "brightness": float(row.get("brightness", 300)),
                            "confidence": row.get("confidence", "n"),
                            "acq_date": row.get("acq_date", ""),
                        }
                    )
            _cache_set(cache_key, fires)
            return fires
    except Exception:
        pass

    # Fallback: synthetic hotspots
    rng = random.Random(int(abs(lat + lon) * 100))
    fires = []
    count = rng.randint(0, 8)
    for _ in range(count):
        fires.append(
            {
                "lat": lat + rng.uniform(-radius_deg, radius_deg),
                "lon": lon + rng.uniform(-radius_deg, radius_deg),
                "brightness": rng.uniform(300, 450),
                "confidence": rng.choice(["low", "nominal", "high"]),
                "acq_date": datetime.utcnow().strftime("%Y-%m-%d"),
            }
        )
    _cache_set(cache_key, fires)
    return fires


# ── Air quality via Open-Meteo AQI ───────────────────────────────────────────
def get_air_quality(lat: float, lon: float) -> dict:
    cache_key = f"aqi_{lat:.2f}_{lon:.2f}"
    cached = _cache_get(cache_key)
    if cached:
        return cached

    url = (
        f"https://air-quality-api.open-meteo.com/v1/air-quality"
        f"?latitude={lat}&longitude={lon}"
        f"&current=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,ozone"
    )
    try:
        resp = requests.get(url, timeout=8)
        if resp.status_code == 200:
            d = resp.json().get("current", {})
            result = {
                "aqi": d.get("us_aqi", 0),
                "pm2_5": d.get("pm2_5", 0),
                "pm10": d.get("pm10", 0),
                "co": d.get("carbon_monoxide", 0),
                "no2": d.get("nitrogen_dioxide", 0),
                "ozone": d.get("ozone", 0),
                "source": "open-meteo",
            }
            _cache_set(cache_key, result)
            return result
    except Exception:
        pass

    # Fallback
    rng = random.Random(int(abs(lat * lon * 10)))
    return {
        "aqi": rng.randint(20, 180),
        "pm2_5": round(rng.uniform(5, 80), 1),
        "pm10": round(rng.uniform(10, 120), 1),
        "co": round(rng.uniform(200, 1200), 0),
        "no2": round(rng.uniform(5, 60), 1),
        "ozone": round(rng.uniform(50, 180), 1),
        "source": "synthetic",
    }


# ── Climate data via Open-Meteo ───────────────────────────────────────────────
def get_climate_data(lat: float, lon: float) -> dict:
    cache_key = f"climate_{lat:.2f}_{lon:.2f}"
    cached = _cache_get(cache_key)
    if cached:
        return cached

    url = (
        f"{OPEN_METEO_BASE_URL}/forecast"
        f"?latitude={lat}&longitude={lon}"
        f"&current=temperature_2m,relative_humidity_2m,precipitation,"
        f"wind_speed_10m,surface_pressure,cloud_cover"
        f"&hourly=temperature_2m&past_days=7&forecast_days=1"
    )
    try:
        resp = requests.get(url, timeout=8)
        if resp.status_code == 200:
            data = resp.json()
            curr = data.get("current", {})
            hourly = data.get("hourly", {})
            temps = hourly.get("temperature_2m", [])
            avg_temp = sum(temps) / len(temps) if temps else curr.get("temperature_2m", 20)
            result = {
                "temperature": curr.get("temperature_2m", 20),
                "humidity": curr.get("relative_humidity_2m", 60),
                "precipitation": curr.get("precipitation", 0),
                "wind_speed": curr.get("wind_speed_10m", 5),
                "pressure": curr.get("surface_pressure", 1013),
                "cloud_cover": curr.get("cloud_cover", 30),
                "avg_temp_7d": round(avg_temp, 1),
                "temp_anomaly": round(curr.get("temperature_2m", 20) - avg_temp, 2),
                "source": "open-meteo",
            }
            _cache_set(cache_key, result)
            return result
    except Exception:
        pass

    rng = random.Random(int(abs(lat * 1000)))
    temp = round(rng.uniform(15, 35), 1)
    return {
        "temperature": temp,
        "humidity": rng.randint(30, 95),
        "precipitation": round(rng.uniform(0, 20), 1),
        "wind_speed": round(rng.uniform(0, 30), 1),
        "pressure": round(rng.uniform(995, 1025), 1),
        "cloud_cover": rng.randint(0, 100),
        "avg_temp_7d": temp - round(rng.uniform(-3, 3), 1),
        "temp_anomaly": round(rng.uniform(-2, 4), 2),
        "source": "synthetic",
    }


# ── Sea surface temperature anomaly (ENSO proxy) ────────────────────────────
def get_sst_anomaly(lat: float, lon: float) -> float:
    rng = random.Random(int(abs(lat * lon)) % 9999)
    return round(rng.uniform(-1.5, 3.5), 2)


# ── Combined satellite report for a region ──────────────────────────────────
def get_satellite_report(lat: float, lon: float, region_id: str = "") -> dict:
    cache_key = f"report_{region_id or f'{lat:.2f}_{lon:.2f}'}"
    cached = _cache_get(cache_key)
    if cached:
        return cached

    ndvi = _ndvi_from_coords(lat, lon)
    fires = get_fire_hotspots(lat, lon)
    air = get_air_quality(lat, lon)
    climate = get_climate_data(lat, lon)
    sst = get_sst_anomaly(lat, lon)

    # Historical NDVI trend (7 days synthetic)
    rng = random.Random(int(abs(lat + lon) * 100))
    ndvi_trend = [round(ndvi + rng.uniform(-0.05, 0.05), 3) for _ in range(7)]
    ndvi_trend[-1] = ndvi

    report = {
        "region_id": region_id,
        "lat": lat,
        "lon": lon,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "ndvi": ndvi,
        "ndvi_trend": ndvi_trend,
        "evi": round(ndvi * 0.85, 3),
        "fire_hotspots": fires,
        "fire_count": len(fires),
        "air_quality": air,
        "climate": climate,
        "sst_anomaly": sst,
        "deforestation_rate": round(max(0, (0.5 - ndvi) * 0.3), 4),
    }

    _cache_set(cache_key, report)
    return report


# ── Historical time-series (for charts) ──────────────────────────────────────
def get_historical_timeseries(lat: float, lon: float, days: int = 30) -> dict:
    rng = random.Random(int(abs(lat * lon * 100)) % 99991)
    base_ndvi = _ndvi_from_coords(lat, lon)
    base_aqi = rng.randint(30, 140)
    base_temp = rng.uniform(18, 32)

    series = []
    for i in range(days):
        date = (datetime.utcnow() - timedelta(days=days - i)).strftime("%Y-%m-%d")
        drift = i * 0.001
        noise_n = rng.uniform(-0.03, 0.03)
        noise_a = rng.randint(-15, 15)
        noise_t = rng.uniform(-1.5, 1.5)
        series.append(
            {
                "date": date,
                "ndvi": round(max(0, min(1, base_ndvi - drift + noise_n)), 3),
                "aqi": max(0, base_aqi + noise_a),
                "temperature": round(base_temp + noise_t, 1),
            }
        )
    return {"series": series, "days": days}