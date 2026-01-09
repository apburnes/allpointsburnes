"""
Geometric utility functions for buffer and intersection calculations.
"""

import json
import os
import hashlib
from pathlib import Path
from shapely.geometry import Point, Polygon
from shapely.ops import transform
import pyproj
from typing import Tuple, List, Dict, Set
import overpy
import config


def create_buffer(
    point: Point, radius_meters: float = config.BUFFER_RADIUS_METERS
) -> Polygon:
    """
    Create a circular buffer around a point.

    Args:
        point: Shapely Point in WGS84 (lon, lat)
        radius_meters: Buffer radius in meters

    Returns:
        Shapely Polygon representing the buffer
    """
    # Project to a local UTM zone for accurate distance calculations
    # Phoenix is in UTM zone 12N (EPSG:32612)
    utm_proj = pyproj.Transformer.from_crs(
        "EPSG:4326", "EPSG:32612", always_xy=True
    )
    point_utm = transform(utm_proj.transform, point)

    # Create buffer in UTM coordinates (meters)
    buffer_utm = point_utm.buffer(radius_meters)

    # Transform back to WGS84
    wgs84_proj = pyproj.Transformer.from_crs(
        "EPSG:32612", "EPSG:4326", always_xy=True
    )
    buffer_wgs84 = transform(wgs84_proj.transform, buffer_utm)

    return buffer_wgs84


def calculate_area_meters(polygon: Polygon) -> float:
    """
    Calculate area of a polygon in square meters.

    Args:
        polygon: Shapely Polygon in WGS84

    Returns:
        Area in square meters
    """
    # Project to UTM for accurate area calculation
    utm_proj = pyproj.Transformer.from_crs(
        "EPSG:4326", "EPSG:32612", always_xy=True
    )
    polygon_utm = transform(utm_proj.transform, polygon)
    return polygon_utm.area


def calculate_bbox_area_square_miles(bbox: List[float]) -> float:
    """
    Calculate the area of a bounding box in square miles.

    Args:
        bbox: Bounding box [min_lon, min_lat, max_lon, max_lat]

    Returns:
        Area in square miles
    """
    # Create polygon from bounding box
    min_lon, min_lat, max_lon, max_lat = bbox
    polygon = Polygon([
        (min_lon, min_lat),
        (max_lon, min_lat),
        (max_lon, max_lat),
        (min_lon, max_lat),
        (min_lon, min_lat),
    ])

    # Calculate area in square meters
    area_m2 = calculate_area_meters(polygon)

    # Convert to square miles (1 square mile = 2,589,988.11 square meters)
    area_mi2 = area_m2 / 2589988.11

    return area_mi2


def break_bbox_into_chunks(bbox: List[float], chunk_size_miles: float = 2.0) -> List[List[float]]:
    """
    Break a bounding box into square chunks of specified size.

    If the bounding box area is under 3 square miles, returns the original bbox.
    Otherwise, divides it into chunks of the specified size.

    Args:
        bbox: Bounding box [min_lon, min_lat, max_lon, max_lat]
        chunk_size_miles: Size of each chunk in miles (default: 2.0 miles)

    Returns:
        List of bounding boxes [min_lon, min_lat, max_lon, max_lat]
    """
    min_lon, min_lat, max_lon, max_lat = bbox

    # Calculate area in square miles
    area_mi2 = calculate_bbox_area_square_miles(bbox)

    # If area is under 3 square miles, return original bbox
    if area_mi2 < 3.0:
        return [bbox]

    # Convert chunk size to meters (1 mile = 1609.34 meters)
    chunk_size_meters = chunk_size_miles * 1609.34

    # Project to UTM for accurate distance calculations
    utm_proj = pyproj.Transformer.from_crs(
        "EPSG:4326", "EPSG:32612", always_xy=True
    )
    wgs84_proj = pyproj.Transformer.from_crs(
        "EPSG:32612", "EPSG:4326", always_xy=True
    )

    # Convert corners to UTM
    min_corner_utm = utm_proj.transform(min_lon, min_lat)
    max_corner_utm = utm_proj.transform(max_lon, max_lat)

    # Calculate width and height in meters
    width_meters = max_corner_utm[0] - min_corner_utm[0]
    height_meters = max_corner_utm[1] - min_corner_utm[1]

    # Calculate number of chunks needed
    num_chunks_x = int(width_meters / chunk_size_meters) + 1
    num_chunks_y = int(height_meters / chunk_size_meters) + 1

    chunks = []

    # Create grid of chunks
    for i in range(num_chunks_x):
        for j in range(num_chunks_y):
            # Calculate chunk boundaries in UTM
            chunk_min_x = min_corner_utm[0] + (i * chunk_size_meters)
            chunk_max_x = min(chunk_min_x + chunk_size_meters, max_corner_utm[0])
            chunk_min_y = min_corner_utm[1] + (j * chunk_size_meters)
            chunk_max_y = min(chunk_min_y + chunk_size_meters, max_corner_utm[1])

            # Convert back to WGS84
            chunk_min_lon, chunk_min_lat = wgs84_proj.transform(chunk_min_x, chunk_min_y)
            chunk_max_lon, chunk_max_lat = wgs84_proj.transform(chunk_max_x, chunk_max_y)

            # Ensure we don't exceed original bbox
            chunk_min_lon = max(chunk_min_lon, min_lon)
            chunk_min_lat = max(chunk_min_lat, min_lat)
            chunk_max_lon = min(chunk_max_lon, max_lon)
            chunk_max_lat = min(chunk_max_lat, max_lat)

            chunks.append([chunk_min_lon, chunk_min_lat, chunk_max_lon, chunk_max_lat])

    return chunks


def create_bbox_hash_filename(bbox: List[float], postfix: str) -> str:
    """
    Create a hash-based filename from a bounding box and postfix string.

    Args:
        bbox: Bounding box [min_lon, min_lat, max_lon, max_lat]
        postfix: String to append to the hash (e.g., "roads", "signals")

    Returns:
        Filename string in format "{hash}_{postfix}.geojson"
    """
    # Create a string representation of the bbox with fixed precision
    # Round to 6 decimal places (approximately 0.1 meter precision)
    bbox_str = ",".join(f"{coord:.6f}" for coord in bbox)

    # Create hash from the bbox string
    hash_obj = hashlib.md5(bbox_str.encode())
    hash_hex = hash_obj.hexdigest()[:12]  # Use first 12 characters for shorter filenames

    # Create filename with postfix
    filename = f"{hash_hex}_{postfix}.geojson"

    return filename


def check_bbox_file_exists(bbox: List[float], postfix: str, directory: str) -> bool:
    """
    Check if a GeoJSON file exists for a given bounding box and postfix.

    Args:
        bbox: Bounding box [min_lon, min_lat, max_lon, max_lat]
        postfix: String postfix used in filename (e.g., "roads", "signals")
        directory: Directory path to check for the file

    Returns:
        True if file exists, False otherwise
    """
    filename = create_bbox_hash_filename(bbox, postfix)
    file_path = Path(directory) / filename

    return file_path.exists()


def point_from_coords(lon: float, lat: float) -> Point:
    """
    Create a Shapely Point from longitude and latitude.

    Args:
        lon: Longitude
        lat: Latitude

    Returns:
        Shapely Point
    """
    return Point(lon, lat)


def polygon_from_osm_way(way_nodes: List[Tuple[float, float]]) -> Polygon:
    """
    Create a Shapely Polygon from OSM way nodes.

    Args:
        way_nodes: List of (lon, lat) tuples

    Returns:
        Shapely Polygon
    """
    if len(way_nodes) < 3:
        raise ValueError("Need at least 3 nodes to create a polygon")

    # Close the polygon if not already closed
    if way_nodes[0] != way_nodes[-1]:
        way_nodes.append(way_nodes[0])

    return Polygon(way_nodes)


def _write_features_to_geojson(features: List[Dict], output_file: str) -> int:
    """
    Shared helper function to write GeoJSON features to a file.

    Args:
        features: List of GeoJSON feature dictionaries
        output_file: Path to output GeoJSON file

    Returns:
        Number of features written
    """
    # Create data directory if it doesn't exist
    output_path = Path(output_file)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Create GeoJSON FeatureCollection
    geojson = {
        "type": "FeatureCollection",
        "features": features,
    }

    # Write to file
    with open(output_file, "w") as f:
        json.dump(geojson, f, indent=2)

    return len(features)


def write_roads_to_geojson(roads: List[overpy.Way], output_file: str = "./data/roads_result.geojson"):
    """
    Write a list of OSM ways (roads) to a GeoJSON file.

    Args:
        roads: List of overpy.Way objects (roads)
        output_file: Path to output GeoJSON file (default: ./data/roads_result.geojson)

    Returns:
        Number of features written
    """
    features = []

    for way in roads:
        try:
            # Get nodes for this way
            nodes = way.get_nodes(resolve_missing=True)
            if len(nodes) < 2:
                continue  # Skip ways with less than 2 nodes

            # Extract coordinates
            coordinates = [[float(node.lon), float(node.lat)] for node in nodes]

            # Create GeoJSON feature
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": coordinates,
                },
                "properties": {
                    "id": str(way.id),
                    "highway": way.tags.get("highway", "unknown"),
                    "name": way.tags.get("name", ""),
                    "ref": way.tags.get("ref", ""),
                    "lanes": way.tags.get("lanes", ""),
                    "lanes:forward": way.tags.get("lanes:forward", ""),
                    "lanes:backward": way.tags.get("lanes:backward", ""),
                    "oneway": way.tags.get("oneway", ""),
                },
            }

            features.append(feature)
        except Exception as e:
            # Skip ways that can't be processed
            continue

    return _write_features_to_geojson(features, output_file)


def write_signals_to_geojson(
    signals_result: overpy.Result,
    output_file: str = "./data/signals_result.geojson",
    filter_node_ids: Set[str] = None,
):
    """
    Write Overpass traffic signals result to a GeoJSON file.

    Args:
        signals_result: Overpass result containing nodes (traffic signals)
        output_file: Path to output GeoJSON file (default: ./data/signals_result.geojson)
        filter_node_ids: Optional set of node IDs to filter by. If provided, only these nodes will be included.

    Returns:
        Number of features written
    """
    features = []

    for node in signals_result.nodes:
        # Filter by node IDs if provided
        if filter_node_ids is not None and str(node.id) not in filter_node_ids:
            continue

        try:
            # Create GeoJSON Point feature
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [float(node.lon), float(node.lat)],
                },
                "properties": {
                    "id": str(node.id),
                    "highway": node.tags.get("highway", "traffic_signals"),
                    "crossing": node.tags.get("crossing", ""),
                    "button_operated": node.tags.get("button_operated", ""),
                    "tactile_paving": node.tags.get("tactile_paving", ""),
                },
            }

            features.append(feature)
        except Exception as e:
            # Skip nodes that can't be processed
            continue

    return _write_features_to_geojson(features, output_file)
