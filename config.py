# config.py - EcoSentinel Configuration

import os

# API Keys (set via environment variables)
SENTINEL_HUB_CLIENT_ID = os.getenv("SENTINEL_HUB_CLIENT_ID", "")
SENTINEL_HUB_CLIENT_SECRET = os.getenv("SENTINEL_HUB_CLIENT_SECRET", "")
NASA_EARTHDATA_TOKEN = os.getenv("NASA_EARTHDATA_TOKEN", "")

# Server
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 5000))
DEBUG = os.getenv("DEBUG", "false").lower() == "true"
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")

# Satellite Data Sources
SENTINEL_HUB_BASE_URL = "https://services.sentinel-hub.com"
SENTINEL_HUB_TOKEN_URL = "https://services.sentinel-hub.com/auth/realms/main/protocol/openid-connect/token"

# NASA FIRMS (Fire Information for Resource Management System)
NASA_FIRMS_BASE_URL = "https://firms.modaps.eosdis.nasa.gov/api/area/csv"
NASA_FIRMS_MAP_KEY = os.getenv("NASA_FIRMS_MAP_KEY", "demo_key")

# Open-Meteo (free, no key needed)
OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1"

# OpenAQ Air Quality (free)
OPENAQ_BASE_URL = "https://api.openaq.org/v2"

# Risk Thresholds
RISK_THRESHOLDS = {
    "aqi": {
        "low": 50,
        "moderate": 100,
        "high": 150,
        "very_high": 200,
        "extreme": 300,
    },
    "ndvi": {
        "healthy": 0.6,
        "moderate": 0.4,
        "stressed": 0.2,
        "critical": 0.0,
    },
    "temperature_anomaly": {
        "low": 1.0,
        "moderate": 2.0,
        "high": 3.0,
        "extreme": 5.0,
    },
    "deforestation_rate": {
        "low": 0.01,
        "moderate": 0.05,
        "high": 0.10,
        "extreme": 0.20,
    },
}

# Monitoring Regions (default)
DEFAULT_REGIONS = [
    {
        "id": "amazon",
        "name": "Amazon Rainforest",
        "lat": -3.4653,
        "lon": -62.2159,
        "bbox": [-73.99, -18.04, -44.82, 5.27],
    },
    {
        "id": "sahel",
        "name": "Sahel Belt",
        "lat": 13.5137,
        "lon": 2.1098,
        "bbox": [-17.33, 10.01, 37.34, 20.00],
    },
    {
        "id": "great_barrier",
        "name": "Great Barrier Reef",
        "lat": -18.2871,
        "lon": 147.6992,
        "bbox": [142.53, -24.50, 154.00, -10.68],
    },
    {
        "id": "arctic",
        "name": "Arctic Region",
        "lat": 78.2232,
        "lon": 15.6267,
        "bbox": [-180.0, 65.0, 180.0, 90.0],
    },
    {
        "id": "borneo",
        "name": "Borneo Rainforest",
        "lat": 0.9619,
        "lon": 114.5548,
        "bbox": [108.0, -4.1, 119.3, 7.4],
    },
    {
        "id": "congo",
        "name": "Congo Basin",
        "lat": -0.2280,
        "lon": 23.6549,
        "bbox": [11.0, -5.0, 31.3, 5.4],
    },
]

# Cache settings
CACHE_TTL = 600  # 10 minutes
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

# Satellite indices
INDICES = ["NDVI", "EVI", "NDWI", "NBR", "LST"]