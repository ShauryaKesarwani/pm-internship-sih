import requests
import math

# ---------- CONFIG ----------
GEONAMES_USERNAME = "gamingwshaurya"  # register at geonames.org (free)
# ----------------------------

def geonames_pincode_to_coords(postalcode, country='IN'):
    url = "http://api.geonames.org/postalCodeLookupJSON"
    params = {"postalcode": postalcode, "country": country, "username": GEONAMES_USERNAME}
    r = requests.get(url, params=params, timeout=10)
    r.raise_for_status()
    data = r.json()
    # GeoNames returns list in 'postalcodes' (may be empty)
    pcs = data.get("postalcodes") or []
    if not pcs:
        return None
    # choose first entry or calculate centroid if you prefer averaging
    entry = pcs[0]
    return float(entry["lat"]), float(entry["lng"])

def haversine_km(a, b):
    lat1, lon1 = a
    lat2, lon2 = b
    R = 6371.0088  # Earth radius in km
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    s = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    return 2 * R * math.asin(min(1, math.sqrt(s)))


def get_coords_from_pincode(postalcode, country="India"):
    url = "https://nominatim.openstreetmap.org/search"
    params = {"postalcode": postalcode, "country": country, "format": "json", "limit": 1}
    headers = {"User-Agent": "pincode-distance-checker/1.0"}
    r = requests.get(url, params=params, headers=headers, timeout=10)
    r.raise_for_status()
    data = r.json()
    if data:
        return float(data[0]["lat"]), float(data[0]["lon"])
    return None

# print(get_coords_from_pincode("110001"))

def nominatim_postcode_lookup(postalcode, country="India"):
    url = "https://nominatim.openstreetmap.org/search"
    params = {"postalcode": postalcode, "country": country, "format": "json", "limit": 1}
    headers = {"User-Agent": "pincode-distance-checker"}
    r = requests.get(url, params=params, headers=headers, timeout=10)
    r.raise_for_status()
    data = r.json()
    if data:
        return float(data[0]["lat"]), float(data[0]["lon"])
    return None

def within_radius_km(pincode_a, pincode_b, radius_km=10):
    coords_a = nominatim_postcode_lookup(pincode_a)
    coords_b = nominatim_postcode_lookup(pincode_b)
    if not coords_a or not coords_b:
        raise ValueError("Could not find coordinates for one or both pincodes")
    distance = haversine_km(coords_a, coords_b)
    return distance, (distance <= radius_km)

# print(nominatim_postcode_lookup("110001"))

# Example usage:
if __name__ == "__main__":
    a = "400076"   # example pin
    b = "400022"
    dist, is_within = within_radius_km(a, b, radius_km=10)
    print(f"Distance = {dist:.2f} km. Within 10 km? {is_within}")