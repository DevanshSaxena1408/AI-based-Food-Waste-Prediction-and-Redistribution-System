import math
from typing import Tuple

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the distance between two points using the Haversine formula
    Returns distance in kilometers
    """
    R = 6371  # Earth's radius in kilometers

    # Convert latitude and longitude from degrees to radians
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)

    # Haversine formula
    a = math.sin(delta_lat / 2) ** 2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c

    return round(distance, 2)

def filter_by_distance(items: list, user_lat: float, user_lon: float, max_distance: float = None):
    """
    Filter items by distance and add distance field to each item
    items: list of dictionaries with 'latitude' and 'longitude' fields
    user_lat, user_lon: user's current location
    max_distance: maximum distance in km (optional)
    """
    for item in items:
        if 'latitude' in item and 'longitude' in item:
            item['distance'] = calculate_distance(
                user_lat, user_lon,
                item['latitude'], item['longitude']
            )

    # Sort by distance
    items.sort(key=lambda x: x.get('distance', float('inf')))

    # Filter by max distance if specified
    if max_distance is not None:
        items = [item for item in items if item.get('distance', float('inf')) <= max_distance]

    return items
