"""
Functions to filter and identify two-lane roads from OSM data.
"""

import overpy
from typing import List, Dict, Set


def is_two_lane_road(way: overpy.Way) -> bool:
    """
    Check if an OSM way represents a two-lane road.

    A road is considered two-lane if:
    - lanes = 2 OR lanes <= 4, AND
    - (lanes - lanes:forward = 1) OR (lanes - lanes:backward = 1)

    Args:
        way: OSM way object

    Returns:
        True if the road is two-lane, False otherwise
    """
    tags = way.tags

    # Automatically ignore service roads
    if tags.get("highway") == "service":
        return False

    # Get total lanes
    lanes = None
    if "lanes" in tags:
        try:
            lanes = int(tags["lanes"])
        except (ValueError, TypeError):
            pass

    # Must have lanes tag and it must be 2 or <= 4
    if lanes is None:
        return False

    if lanes != 2 and lanes > 4:
        return False

    # Get forward and backward lanes
    forward_lanes = None
    backward_lanes = None

    if "lanes:forward" in tags:
        try:
            forward_lanes = int(tags["lanes:forward"])
        except (ValueError, TypeError):
            pass

    if "lanes:backward" in tags:
        try:
            backward_lanes = int(tags["lanes:backward"])
        except (ValueError, TypeError):
            pass

    # Check if lanes - lanes:forward = 1
    if forward_lanes is not None:
        if lanes - forward_lanes == 1:
            return True

    # Check if lanes - lanes:backward = 1
    if backward_lanes is not None:
        if lanes - backward_lanes == 1:
            return True

    # If no forward/backward lanes specified, but lanes is 2, assume it's two-lane
    if lanes == 2 and forward_lanes is None and backward_lanes is None:
        return True

    return False


def filter_two_lane_roads(result: overpy.Result) -> List[overpy.Way]:
    """
    Filter ways from Overpass result to only include two-lane roads.

    Args:
        result: Overpass API result

    Returns:
        List of OSM ways that are two-lane roads
    """
    two_lane_roads = []
    for way in result.ways:
        if is_two_lane_road(way):
            two_lane_roads.append(way)
    return two_lane_roads


def get_road_name(way: overpy.Way) -> str:
    """
    Get the name of a road from its OSM tags.

    Args:
        way: OSM way object

    Returns:
        Road name or "Unnamed Road" if no name available
    """
    tags = way.tags
    return tags.get("name", tags.get("ref", f"Way {way.id}"))
