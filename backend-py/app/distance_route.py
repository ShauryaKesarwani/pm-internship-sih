from fastapi import APIRouter, HTTPException
import requests
from dotenv import load_dotenv
import os

router = APIRouter()

# Put your MapmyIndia REST Key here
load_dotenv()
MAPMYINDIA_REST_KEY = os.getenv("GOOGLE_API_KEY")

def get_latlon_from_query(query: str):
    """
    Use OpenStreetMap Nominatim to get lat/lon for a pincode or address
    """
    url = f"https://nominatim.openstreetmap.org/search"
    params = {
        "q": query,
        "country": "India",
        "format": "json",
        "limit": 1
    }
    headers = {"User-Agent": "fastapi-app-demo"}
    res = requests.get(url, params=params, headers=headers).json()
    if not res:
        return None
    return float(res[0]["lat"]), float(res[0]["lon"])


@router.get("/distance")
def get_distance(origin: str, destination: str):
    """
    Get driving distance and duration between two pincodes/addresses
    Example:
    /distance?origin=201301&destination=110001
    """
    coords1 = get_latlon_from_query(origin)
    coords2 = get_latlon_from_query(destination)

    if not coords1 or not coords2:
        raise HTTPException(status_code=400, detail="Could not fetch lat/lon for given inputs")

    lat1, lon1 = coords1
    lat2, lon2 = coords2

    # Call MapmyIndia Route API
    url = f"https://apis.mapmyindia.com/advancedmaps/v1/{MAPMYINDIA_REST_KEY}/route_adv/driving/{lon1},{lat1};{lon2},{lat2}"
    res = requests.get(url).json()

    if "routes" not in res:
        raise HTTPException(status_code=500, detail="MapmyIndia API error")

    distance_m = res["routes"][0]["summary"]["distance"]  # in meters
    duration_s = res["routes"][0]["summary"]["duration"]  # in seconds

    return {
        "from": origin,
        "to": destination,
        "distance_km": round(distance_m / 1000, 2),
        "duration_min": round(duration_s / 60, 2)
    }
