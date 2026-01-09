"""
Functions to detect intersections where two two-lane roads meet.
"""

import overpy
from typing import List, Dict, Set, Tuple
from collections import defaultdict
from shapely.geometry import Point
import two_lane_filter


def find_intersections(two_lane_roads: List[overpy.Way]) -> Dict[str, List[overpy.Way]]:
    """
    Find nodes where two or more two-lane roads intersect.

    Args:
        two_lane_roads: List of OSM ways that are two-lane roads

    Returns:
        Dictionary mapping node IDs to lists of ways that intersect at that node
    """
    # Map node ID to list of ways that contain it
    node_to_ways: Dict[str, List[overpy.Way]] = defaultdict(list)

    for way in two_lane_roads:
        try:
            # Get node IDs from the way
            node_ids = way.get_nodes(resolve_missing=True)
            for node_id in node_ids:
                node_to_ways[str(node_id)].append(way)
        except Exception:
            # Skip way if we can't get nodes
            continue

    # Filter to only nodes where at least 2 two-lane roads meet
    intersections = {
        node_id: ways
        for node_id, ways in node_to_ways.items()
        if len(ways) >= 2
    }

    return intersections


def get_intersection_point(
    node_id: str, result: overpy.Result
) -> Tuple[float, float, overpy.Node]:
    """
    Get the coordinates of an intersection node.

    Args:
        node_id: OSM node ID
        result: Overpass result containing the node

    Returns:
        Tuple of (longitude, latitude, node object)
    """
    node = result.get_node(int(node_id))
    if node is None:
        raise ValueError(f"Node {node_id} not found in result")
    return (float(node.lon), float(node.lat), node)


def create_intersection_records(
    intersections: Dict[str, List[overpy.Way]], result: overpy.Result
) -> List[Dict]:
    """
    Create intersection records with coordinates and road information.

    Args:
        intersections: Dictionary mapping node IDs to lists of intersecting ways
        result: Overpass result containing nodes

    Returns:
        List of intersection dictionaries with node_id, coordinates, and road info
    """
    intersection_records = []

    for node_id, ways in intersections.items():
        try:
            lon, lat, node = get_intersection_point(node_id, result)
            road_names = [two_lane_filter.get_road_name(way) for way in ways]
            road_ids = [str(way.id) for way in ways]

            intersection_records.append(
                {
                    "node_id": node_id,
                    "lon": lon,
                    "lat": lat,
                    "node": node,
                    "roads": ways,
                    "road_names": road_names,
                    "road_ids": road_ids,
                    "num_roads": len(ways),
                }
            )
        except (ValueError, KeyError) as e:
            # Skip if node not found
            continue

    return intersection_records
