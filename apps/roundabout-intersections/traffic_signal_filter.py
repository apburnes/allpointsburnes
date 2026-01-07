"""
Functions to filter intersections that have traffic signals using spatial queries.
"""

import overpy
from typing import List, Dict, Set
from shapely.geometry import Point, LineString
from geometry_utils import point_from_coords, create_buffer
import logging

logger = logging.getLogger(__name__)


def _way_to_linestring(way: overpy.Way) -> LineString:
    """
    Convert an OSM way to a Shapely LineString.

    Args:
        way: OSM way object

    Returns:
        Shapely LineString representing the road
    """
    try:
        nodes = way.get_nodes(resolve_missing=True)
        if len(nodes) < 2:
            return None

        coordinates = [(float(node.lon), float(node.lat)) for node in nodes]
        return LineString(coordinates)
    except Exception as e:
        logger.debug(f"Error converting way {way.id} to LineString: {e}")
        return None


def _create_road_linestrings(two_lane_roads: List[overpy.Way]) -> List[LineString]:
    """
    Convert a list of OSM ways to LineString geometries.

    Args:
        two_lane_roads: List of OSM way objects (two-lane roads)

    Returns:
        List of LineString geometries representing the roads
    """
    road_lines = []
    for way in two_lane_roads:
        linestring = _way_to_linestring(way)
        if linestring is not None:
            road_lines.append(linestring)
    return road_lines


def filter_traffic_signals_by_spatial_query(
    signals_result: overpy.Result,
    two_lane_roads: List[overpy.Way],
    buffer_radius_meters: float = 2.0,
    min_road_intersections: int = 3,
) -> Set[str]:
    """
    Filter traffic signals using spatial queries against two-lane roads.

    Only returns traffic signals whose 2-meter buffer intersects with
    at least 3 two-lane road lines.

    Args:
        signals_result: Overpass result containing traffic signal nodes
        two_lane_roads: List of OSM way objects (two-lane roads)
        buffer_radius_meters: Radius of buffer around each signal (default: 2.0 meters)
        min_road_intersections: Minimum number of road intersections required (default: 3)

    Returns:
        Set of node IDs that are traffic signals intersecting with roads
    """
    # Convert two-lane roads to LineString geometries
    road_lines = _create_road_linestrings(two_lane_roads)
    logger.info(f"Created {len(road_lines)} road LineString geometries")

    eligible_signal_ids = set()

    for node in signals_result.nodes:
        if node.tags.get("highway") != "traffic_signals":
            continue

        try:
            # Create point for the traffic signal
            signal_point = point_from_coords(float(node.lon), float(node.lat))

            # Create 2-meter buffer around the signal
            signal_buffer = create_buffer(signal_point, buffer_radius_meters)

            # Count how many road lines intersect with the buffer
            intersection_count = 0
            for road_line in road_lines:
                if signal_buffer.intersects(road_line):
                    intersection_count += 1

            # Only include if buffer intersects with at least min_road_intersections roads
            if intersection_count >= min_road_intersections:
                eligible_signal_ids.add(str(node.id))
                logger.debug(
                    f"Signal {node.id} intersects with {intersection_count} roads"
                )

        except Exception as e:
            logger.warning(f"Error processing signal node {node.id}: {e}")
            continue

    logger.info(
        f"Found {len(eligible_signal_ids)} traffic signals intersecting with "
        f"at least {min_road_intersections} two-lane roads"
    )
    return eligible_signal_ids


def find_traffic_signal_nodes(result: overpy.Result) -> Set[str]:
    """
    Extract node IDs that have traffic signals.

    Args:
        result: Overpass result containing traffic signal nodes

    Returns:
        Set of node IDs that are traffic signals
    """
    signal_node_ids = set()
    for node in result.nodes:
        if node.tags.get("highway") == "traffic_signals":
            signal_node_ids.add(str(node.id))
    return signal_node_ids


def create_intersection_records_from_signals(
    signals_result: overpy.Result, signal_node_ids: Set[str]
) -> List[Dict]:
    """
    Create intersection records from traffic signal nodes.

    Args:
        signals_result: Overpass result containing traffic signal nodes
        signal_node_ids: Set of node IDs that are eligible traffic signals

    Returns:
        List of intersection dictionaries with node_id, coordinates, and signal info
    """
    intersection_records = []

    for node in signals_result.nodes:
        node_id = str(node.id)
        if node_id not in signal_node_ids:
            continue

        try:
            intersection_records.append(
                {
                    "node_id": node_id,
                    "lon": float(node.lon),
                    "lat": float(node.lat),
                    "node": node,
                    "roads": [],  # Will be empty since we're using signals directly
                    "road_names": [],
                    "road_ids": [],
                    "num_roads": 0,
                }
            )
        except Exception as e:
            logger.warning(f"Error creating intersection record for node {node_id}: {e}")
            continue

    return intersection_records


def filter_intersections_with_signals(
    intersections: List[Dict], signal_node_ids: Set[str]
) -> List[Dict]:
    """
    Filter intersections to only include those with traffic signals.

    Args:
        intersections: List of intersection records
        signal_node_ids: Set of node IDs that are traffic signals

    Returns:
        Filtered list of intersections that have traffic signals
    """
    filtered = []
    for intersection in intersections:
        node_id = intersection["node_id"]
        if node_id in signal_node_ids:
            filtered.append(intersection)
    return filtered
