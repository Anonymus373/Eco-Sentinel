# risk_engine.py - EcoSentinel Environmental Risk Assessment Engine

from config import RISK_THRESHOLDS


def _score_ndvi(ndvi: float) -> dict:
    t = RISK_THRESHOLDS["ndvi"]
    if ndvi >= t["healthy"]:
        level, score = "Low", 10
    elif ndvi >= t["moderate"]:
        level, score = "Moderate", 35
    elif ndvi >= t["stressed"]:
        level, score = "High", 65
    else:
        level, score = "Critical", 90
    return {
        "metric": "Vegetation Health (NDVI)",
        "value": ndvi,
        "unit": "",
        "level": level,
        "score": score,
        "description": _ndvi_description(ndvi),
    }


def _ndvi_description(ndvi: float) -> str:
    if ndvi >= 0.6:
        return "Dense, healthy vegetation cover detected."
    elif ndvi >= 0.4:
        return "Moderate vegetation; some stress indicators present."
    elif ndvi >= 0.2:
        return "Sparse or stressed vegetation. Degradation risk elevated."
    else:
        return "Severely degraded or bare land. Immediate attention required."


def _score_aqi(aqi: float) -> dict:
    t = RISK_THRESHOLDS["aqi"]
    if aqi <= t["low"]:
        level, score = "Low", 5
    elif aqi <= t["moderate"]:
        level, score = "Moderate", 30
    elif aqi <= t["high"]:
        level, score = "High", 60
    elif aqi <= t["very_high"]:
        level, score = "Very High", 80
    else:
        level, score = "Hazardous", 100
    return {
        "metric": "Air Quality Index (AQI)",
        "value": aqi,
        "unit": "AQI",
        "level": level,
        "score": score,
        "description": _aqi_description(aqi),
    }


def _aqi_description(aqi: float) -> str:
    if aqi <= 50:
        return "Air quality is satisfactory; minimal risk."
    elif aqi <= 100:
        return "Acceptable air quality; minor concern for sensitive groups."
    elif aqi <= 150:
        return "Unhealthy for sensitive groups. Reduced outdoor activity recommended."
    elif aqi <= 200:
        return "Unhealthy. Health effects possible for all population groups."
    else:
        return "Hazardous. Emergency health warnings in effect."


def _score_fire(fire_count: int, hotspots: list) -> dict:
    high_conf = sum(
        1 for f in hotspots if f.get("confidence") in ["high", "nominal", "h", "n"]
    )
    if fire_count == 0:
        level, score = "Low", 0
    elif fire_count <= 2 and high_conf == 0:
        level, score = "Low", 15
    elif fire_count <= 5:
        level, score = "Moderate", 45
    elif fire_count <= 15:
        level, score = "High", 72
    else:
        level, score = "Critical", 95
    return {
        "metric": "Active Fire Hotspots",
        "value": fire_count,
        "unit": "hotspots",
        "level": level,
        "score": score,
        "description": (
            "No active fire detected in the region."
            if fire_count == 0
            else f"{fire_count} fire hotspot(s) detected ({high_conf} high-confidence)."
        ),
    }


def _score_temp_anomaly(anomaly: float) -> dict:
    t = RISK_THRESHOLDS["temperature_anomaly"]
    abs_anom = abs(anomaly)
    if abs_anom < t["low"]:
        level, score = "Low", 5
    elif abs_anom < t["moderate"]:
        level, score = "Moderate", 35
    elif abs_anom < t["high"]:
        level, score = "High", 65
    else:
        level, score = "Critical", 90
    direction = "above" if anomaly >= 0 else "below"
    return {
        "metric": "Temperature Anomaly",
        "value": round(anomaly, 2),
        "unit": "°C",
        "level": level,
        "score": score,
        "description": f"Current temperature is {abs(round(anomaly, 1))}°C {direction} the 7-day average.",
    }


def _score_deforestation(rate: float) -> dict:
    t = RISK_THRESHOLDS["deforestation_rate"]
    if rate < t["low"]:
        level, score = "Low", 5
    elif rate < t["moderate"]:
        level, score = "Moderate", 40
    elif rate < t["high"]:
        level, score = "High", 70
    else:
        level, score = "Critical", 95
    return {
        "metric": "Deforestation Rate",
        "value": round(rate * 100, 2),
        "unit": "%/month",
        "level": level,
        "score": score,
        "description": f"Estimated canopy loss rate of {round(rate * 100, 2)}% per month.",
    }


def calculate_risk(satellite_report: dict) -> dict:
    """
    Calculates composite environmental risk from a satellite report.
    Returns a structured risk assessment with individual scores and overall risk.
    """
    ndvi = satellite_report.get("ndvi", 0.5)
    aqi = satellite_report.get("air_quality", {}).get("aqi", 50)
    fire_count = satellite_report.get("fire_count", 0)
    hotspots = satellite_report.get("fire_hotspots", [])
    temp_anomaly = satellite_report.get("climate", {}).get("temp_anomaly", 0)
    deforestation_rate = satellite_report.get("deforestation_rate", 0)

    factors = [
        _score_ndvi(ndvi),
        _score_aqi(aqi),
        _score_fire(fire_count, hotspots),
        _score_temp_anomaly(temp_anomaly),
        _score_deforestation(deforestation_rate),
    ]

    # Weighted composite score
    weights = [0.30, 0.20, 0.25, 0.15, 0.10]
    composite = sum(f["score"] * w for f, w in zip(factors, weights))
    composite = round(composite, 1)

    if composite < 20:
        overall_level = "Low"
        overall_color = "#22c55e"
        summary = "Environmental conditions are within normal parameters. Continue routine monitoring."
        recommendations = [
            "Maintain current monitoring cadence.",
            "Document baseline measurements for future comparison.",
            "Review and update emergency response protocols.",
        ]
    elif composite < 45:
        overall_level = "Moderate"
        overall_color = "#f59e0b"
        summary = "Moderate environmental stress detected. Increased vigilance recommended."
        recommendations = [
            "Increase satellite observation frequency for this region.",
            "Alert local environmental agencies to prepare contingency plans.",
            "Initiate targeted field surveys to verify remote sensing data.",
        ]
    elif composite < 70:
        overall_level = "High"
        overall_color = "#f97316"
        summary = "Significant environmental risk. Coordinated response action needed."
        recommendations = [
            "Activate regional environmental response teams immediately.",
            "Issue public advisories for affected communities.",
            "Deploy ground-truth verification teams within 48 hours.",
            "Submit incident report to national environmental authority.",
        ]
    else:
        overall_level = "Critical"
        overall_color = "#ef4444"
        summary = "Critical environmental emergency detected. Immediate intervention required."
        recommendations = [
            "Declare environmental emergency and mobilize all available resources.",
            "Coordinate with international environmental bodies (UNEP, WWF).",
            "Evacuate high-risk zones if human safety is threatened.",
            "Launch immediate aerial assessment and satellite tasking.",
            "Engage media for public awareness and behavioral response.",
        ]

    return {
        "composite_score": composite,
        "overall_level": overall_level,
        "overall_color": overall_color,
        "summary": summary,
        "recommendations": recommendations,
        "factors": factors,
        "region_id": satellite_report.get("region_id", ""),
        "timestamp": satellite_report.get("timestamp", ""),
    }


def get_regional_risk_map(regions: list, satellite_fn) -> list:
    """
    Generates risk assessments for a list of regions.
    satellite_fn: callable(lat, lon, region_id) -> satellite_report
    """
    results = []
    for region in regions:
        report = satellite_fn(region["lat"], region["lon"], region["id"])
        risk = calculate_risk(report)
        results.append(
            {
                "id": region["id"],
                "name": region["name"],
                "lat": region["lat"],
                "lon": region["lon"],
                "risk_level": risk["overall_level"],
                "risk_score": risk["composite_score"],
                "risk_color": risk["overall_color"],
                "summary": risk["summary"],
            }
        )
    return results