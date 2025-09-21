import requests
import math
import json
from pathlib import Path
from fastapi import APIRouter, HTTPException

router = APIRouter()

CACHE_FILE = Path("pincode_cache.json")

# Load cache at startup
if CACHE_FILE.exists():
    with open(CACHE_FILE, "r") as f:
        cache = json.load(f)
else:
    cache = {}

def save_cache():
    with open(CACHE_FILE, "w") as f:
        json.dump(cache, f)

def haversine_km(a, b):
    lat1, lon1 = a
    lat2, lon2 = b
    R = 6371.0088
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    s = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    return 2 * R * math.asin(min(1, math.sqrt(s)))

def get_coords_from_nominatim(postalcode, country="India"):
    url = "https://nominatim.openstreetmap.org/search"
    params = {"postalcode": postalcode, "country": country, "format": "json", "limit": 1}
    headers = {"User-Agent": "pincode-distance-checker/1.0"}
    r = requests.get(url, params=params, headers=headers, timeout=10)
    r.raise_for_status()
    data = r.json()
    if data:
        return float(data[0]["lat"]), float(data[0]["lon"])
    return None

def get_coords(postalcode):
    # 1. Check cache
    if postalcode in cache:
        return cache[postalcode]

    # 2. Call Nominatim if missing
    coords = get_coords_from_nominatim(postalcode)
    if coords:
        cache[postalcode] = coords
        save_cache()
    return coords

@router.get("/dist")
def get_distance(pin1: str, pin2: str, radius_km: float = 50.0):
    coords_a = get_coords(pin1)
    coords_b = get_coords(pin2)

    if not coords_a or not coords_b:
        raise HTTPException(status_code=404, detail="Could not resolve one or both pincodes")

    distance = haversine_km(coords_a, coords_b)
    return {
        "pin1": pin1,
        "pin2": pin2,
        "distance_km": round(distance, 2),
        "within_radius": distance <= radius_km
    }