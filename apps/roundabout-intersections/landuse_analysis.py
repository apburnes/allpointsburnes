"""
Functions to analyze landuse types within intersection buffers.
"""

import overpy
from typing import List, Dict, Any
from shapely.geometry import Polygon, Point
from shapely.ops import transform
import pyproj
import geopandas as gpd
from geometry_utils import calculate_area_meters
import config


def parse_landuse_way(way: overpy.Way) -> Polygon:
    """
    Convert an OSM way to a Shapely Polygon.

    Args:
        way: OSM way object

    Returns:
        Shapely Polygon representing the landuse area
    """
    nodes = way.get_nodes(resolve_missing=True)
    if len(nodes) < 3:
        raise ValueError(f"Way {way.id} has fewer than 3 nodes")

    coords = [(float(node.lon), float(node.lat)) for node in nodes]

    # Close the polygon if not already closed
    if coords[0] != coords[-1]:
        coords.append(coords[0])

    return Polygon(coords)


def parse_landuse_relation(relation: overpy.Relation) -> Polygon:
    """
    Convert an OSM relation (multipolygon) to a Shapely Polygon.

    Args:
        relation: OSM relation object

    Returns:
        Shapely Polygon (may be a MultiPolygon internally)
    """
    from shapely.geometry import MultiPolygon

    outer_ways = []
    inner_ways = []

    for member in relation.members:
        if member.type == "way":
            way = member.resolve()
            if way is None:
                continue

            nodes = way.get_nodes(resolve_missing=True)
            if len(nodes) < 3:
                continue

            coords = [(float(node.lon), float(node.lat)) for node in nodes]
            if coords[0] != coords[-1]:
                coords.append(coords[0])

            polygon = Polygon(coords)

            if member.role == "outer":
                outer_ways.append(polygon)
            elif member.role == "inner":
                inner_ways.append(polygon)

    if not outer_ways:
        raise ValueError(f"Relation {relation.id} has no outer ways")

    # Combine outer polygons
    if len(outer_ways) == 1:
        result = outer_ways[0]
    else:
        result = MultiPolygon(outer_ways)

    # Subtract inner polygons (holes)
    for inner in inner_ways:
        try:
            result = result.difference(inner)
        except Exception:
            # If difference fails, skip this inner
            continue

    return result


def create_landuse_geodataframe(result: overpy.Result) -> gpd.GeoDataFrame:
    """
    Create a GeoDataFrame from OSM landuse query results.

    Args:
        result: Overpass result containing landuse ways and relations

    Returns:
        GeoDataFrame with landuse polygons and their types
    """
    polygons = []
    landuse_types = []

    # Process ways
    for way in result.ways:
        if "landuse" not in way.tags:
            continue

        try:
            polygon = parse_landuse_way(way)
            if polygon.is_valid:
                polygons.append(polygon)
                landuse_types.append(way.tags.get("landuse", "unknown"))
        except (ValueError, Exception):
            continue

    # Process relations
    for relation in result.relations:
        if "landuse" not in relation.tags:
            continue

        try:
            polygon = parse_landuse_relation(relation)
            if polygon.is_valid:
                polygons.append(polygon)
                landuse_types.append(relation.tags.get("landuse", "unknown"))
        except (ValueError, Exception):
            continue

    if not polygons:
        # Return empty GeoDataFrame
        return gpd.GeoDataFrame(geometry=[], crs="EPSG:4326")

    gdf = gpd.GeoDataFrame(
        {"landuse": landuse_types, "geometry": polygons}, crs="EPSG:4326"
    )

    return gdf


def analyze_buffer_landuse(
    buffer: Polygon, landuse_gdf: gpd.GeoDataFrame
) -> Dict[str, float]:
    """
    Analyze landuse types within a buffer and calculate percentages.

    Args:
        buffer: Shapely Polygon representing the buffer
        landuse_gdf: GeoDataFrame with landuse polygons

    Returns:
        Dictionary mapping landuse types to their percentage of the buffer area
    """
    if landuse_gdf.empty:
        return {"unknown": 100.0}

    # Ensure same CRS
    if landuse_gdf.crs != buffer.crs:
        # Buffer should be in WGS84, ensure GDF is too
        landuse_gdf = landuse_gdf.to_crs("EPSG:4326")

    # Calculate total buffer area in square meters
    total_buffer_area = calculate_area_meters(buffer)

    if total_buffer_area == 0:
        return {"unknown": 100.0}

    # Find intersecting landuse polygons
    intersecting = landuse_gdf[landuse_gdf.intersects(buffer)].copy()

    if intersecting.empty:
        return {"unknown": 100.0}

    # Calculate intersection area for each landuse type
    landuse_areas: Dict[str, float] = {}

    for idx, row in intersecting.iterrows():
        landuse_type = row["landuse"]
        landuse_poly = row["geometry"]

        try:
            # Calculate intersection
            intersection = buffer.intersection(landuse_poly)
            if intersection.is_empty:
                continue

            # Calculate area in square meters
            area = calculate_area_meters(intersection)

            if landuse_type not in landuse_areas:
                landuse_areas[landuse_type] = 0.0
            landuse_areas[landuse_type] += area
        except Exception:
            # Skip if intersection calculation fails
            continue

    # Calculate percentages
    total_covered = sum(landuse_areas.values())
    percentages: Dict[str, float] = {}

    for landuse_type, area in landuse_areas.items():
        percentages[landuse_type] = (area / total_buffer_area) * 100.0

    # Add "unknown" for uncovered area
    uncovered = total_buffer_area - total_covered
    if uncovered > 0:
        percentages["unknown"] = (uncovered / total_buffer_area) * 100.0

    # Round to 2 decimal places
    percentages = {k: round(v, 2) for k, v in percentages.items()}

    return percentages
