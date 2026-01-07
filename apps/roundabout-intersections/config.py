"""
Configuration for OSM intersection and landuse analysis.
"""

# Phoenix Metro Area bounding box [min_lon, min_lat, max_lon, max_lat]
# Approximate bounding box for Phoenix metro area
PHOENIX_BBOX = [-112.247308, 33.283753, -111.652349, 33.669733]

# Buffer radius in meters (0.5 miles = 804.67 meters)
BUFFER_RADIUS_METERS = 804.67

# Overpass API endpoint
# Alternative endpoints if the default is overloaded:
# - "https://overpass-api.de/api/interpreter" (default)
# - "https://overpass.kumi.systems/api/interpreter"
# - "https://overpass.openstreetmap.fr/api/interpreter"
OVERPASS_API_URL = "https://overpass-api.de/api/interpreter"

# Retry configuration for Overpass API
OVERPASS_MAX_RETRIES = 5
OVERPASS_INITIAL_DELAY = 5.0  # seconds
OVERPASS_MAX_DELAY = 300.0  # seconds (5 minutes)

# Delay between queries to be respectful of the API (seconds)
QUERY_DELAY = 2.0

# OSM tags for filtering
TWO_LANE_ROAD_TAGS = {
    "highway": [
        "primary",
        "secondary",
        "tertiary",
        "residential",
        "unclassified",
        "service",
    ]
}

# Landuse tags to analyze
LANDUSE_TAGS = [
    "residential",
    "commercial",
    "industrial",
    "retail",
    "office",
    "institutional",
    "mixed",
    "recreation_ground",
    "cemetery",
    "allotments",
    "farmland",
    "forest",
    "meadow",
    "park",
    "greenfield",
    "brownfield",
    "construction",
    "military",
    "port",
    "quarry",
    "railway",
    "religious",
    "reservoir",
    "salt_pond",
    "vineyard",
]
