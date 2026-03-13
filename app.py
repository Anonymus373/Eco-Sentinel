# app.py - EcoSentinel Flask API Backend

from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

from config import HOST, PORT, DEBUG, CORS_ORIGINS, DEFAULT_REGIONS, DATA_DIR
from satellite import get_satellite_report, get_historical_timeseries
from risk_engine import calculate_risk, get_regional_risk_map

app = Flask(__name__)
CORS(app, origins=CORS_ORIGINS)

# ── Health check ─────────────────────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "EcoSentinel API", "version": "1.0.0"})


# ── Regions list ─────────────────────────────────────────────────────────────
@app.route("/api/regions", methods=["GET"])
def list_regions():
    return jsonify({"regions": DEFAULT_REGIONS})


# ── Satellite report for a region ────────────────────────────────────────────
@app.route("/api/report/<region_id>", methods=["GET"])
def region_report(region_id):
    region = next((r for r in DEFAULT_REGIONS if r["id"] == region_id), None)
    if not region:
        return jsonify({"error": f"Region '{region_id}' not found."}), 404

    report = get_satellite_report(region["lat"], region["lon"], region_id)
    risk = calculate_risk(report)
    return jsonify({"report": report, "risk": risk})


# ── Satellite report for custom coordinates ──────────────────────────────────
@app.route("/api/report", methods=["GET"])
def custom_report():
    try:
        lat = float(request.args.get("lat", 0))
        lon = float(request.args.get("lon", 0))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid lat/lon parameters."}), 400

    if not (-90 <= lat <= 90 and -180 <= lon <= 180):
        return jsonify({"error": "Coordinates out of range."}), 400

    report = get_satellite_report(lat, lon)
    risk = calculate_risk(report)
    return jsonify({"report": report, "risk": risk})


# ── Historical time-series ───────────────────────────────────────────────────
@app.route("/api/timeseries/<region_id>", methods=["GET"])
def region_timeseries(region_id):
    region = next((r for r in DEFAULT_REGIONS if r["id"] == region_id), None)
    if not region:
        return jsonify({"error": f"Region '{region_id}' not found."}), 404

    days = min(int(request.args.get("days", 30)), 90)
    ts = get_historical_timeseries(region["lat"], region["lon"], days)
    return jsonify(ts)


# ── Global risk overview map ──────────────────────────────────────────────────
@app.route("/api/risk-map", methods=["GET"])
def risk_map():
    results = get_regional_risk_map(DEFAULT_REGIONS, get_satellite_report)
    return jsonify({"regions": results})


# ── Alert summary ────────────────────────────────────────────────────────────
@app.route("/api/alerts", methods=["GET"])
def alerts():
    risk_map_data = get_regional_risk_map(DEFAULT_REGIONS, get_satellite_report)
    high_risk = [
        r for r in risk_map_data if r["risk_level"] in ("High", "Critical")
    ]
    alerts_list = []
    for r in high_risk:
        alerts_list.append(
            {
                "id": r["id"],
                "region": r["name"],
                "level": r["risk_level"],
                "score": r["risk_score"],
                "message": r["summary"],
            }
        )
    return jsonify({"alerts": alerts_list, "count": len(alerts_list)})


# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    os.makedirs(DATA_DIR, exist_ok=True)
    print(f"🌍 EcoSentinel API starting on http://{HOST}:{PORT}")
    app.run(host=HOST, port=PORT, debug=DEBUG)