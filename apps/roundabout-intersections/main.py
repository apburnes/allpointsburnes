"""
Main script for OSM intersection analysis.

This script:
1. Queries OSM data for Phoenix metro area in chunks
2. Filters two-lane roads and traffic signals for each chunk
3. Identifies traffic signals that intersect with two-lane roads
4. Exports aggregated results as GeoJSON
"""

import json
import logging
import time
from pathlib import Path
from typing import List, Dict, Any
from shapely.geometry import Point
import overpy
import config
import overpass_queries
import two_lane_filter
import traffic_signal_filter
import geometry_utils

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def export_to_geojson(intersections: List[Dict], output_file: str = "results.geojson"):
    """
    Export intersection results to GeoJSON format.

    Args:
        intersections: List of intersection dictionaries
        output_file: Output file path
    """
    features = []

    for intersection in intersections:
        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [intersection["lon"], intersection["lat"]],
            },
            "properties": {
                "intersection_id": intersection.get("node_id", "unknown"),
                "roads": intersection.get("road_names", []),
                "road_ids": intersection.get("road_ids", []),
                "num_roads": intersection.get("num_roads", 0),
            },
        }

        features.append(feature)

    geojson = {"type": "FeatureCollection", "features": features}

    with open(output_file, "w") as f:
        json.dump(geojson, f, indent=2)

    logger.info(f"Exported {len(features)} intersections to {output_file}")


def main():
    """Main analysis workflow."""
    logger.info("Starting OSM intersection analysis for Phoenix metro")

    # Initialize Overpass API client with retry configuration
    overpass = overpass_queries.OverpassQueries(
        api_url=config.OVERPASS_API_URL,
        max_retries=config.OVERPASS_MAX_RETRIES,
        initial_delay=config.OVERPASS_INITIAL_DELAY,
        max_delay=config.OVERPASS_MAX_DELAY,
    )

    # Break bounding box into chunks
    logger.info("Breaking bounding box into chunks...")
    bbox_chunks = geometry_utils.break_bbox_into_chunks(config.PHOENIX_BBOX, chunk_size_miles=2.0)
    logger.info(f"Created {len(bbox_chunks)} bounding box chunks")

    # Aggregate results from all chunks
    all_intersecting_signals = []

    # Data directory for saving chunk results
    data_dir = Path("data/intersections")
    data_dir.mkdir(exist_ok=True)

    # Process each chunk: query, filter, and find intersecting signals
    for i, chunk_bbox in enumerate(bbox_chunks):
        logger.info(f"Processing chunk {i+1}/{len(bbox_chunks)}: {chunk_bbox}")

        # Check if chunk results file already exists
        if geometry_utils.check_bbox_file_exists(chunk_bbox, "intersections", str(data_dir)):
            logger.info(f"  Chunk {i+1} results already exist, skipping...")
            continue

        # Query all roads in this chunk
        logger.info(f"  Querying roads from chunk {i+1}...")
        try:
            roads_result = overpass.query_all_roads(chunk_bbox)
            logger.info(f"  Found {len(roads_result.ways)} roads in chunk {i+1}")
            time.sleep(config.QUERY_DELAY)  # Be respectful of the API
        except Exception as e:
            logger.error(f"  Error querying roads in chunk {i+1}: {e}")
            continue

        # Filter to two-lane roads for this chunk
        logger.info(f"  Filtering two-lane roads from chunk {i+1}...")
        two_lane_roads = two_lane_filter.filter_two_lane_roads(roads_result)
        logger.info(f"  Found {len(two_lane_roads)} two-lane roads in chunk {i+1}")

        if len(two_lane_roads) < 2:
            logger.warning(f"  Not enough two-lane roads in chunk {i+1}, skipping...")
            continue

        # Query traffic signals in this chunk
        logger.info(f"  Querying traffic signals from chunk {i+1}...")
        try:
            time.sleep(config.QUERY_DELAY)  # Be respectful of the API
            signals_result = overpass.query_traffic_signals(chunk_bbox)
            logger.info(f"  Found {len(signals_result.nodes)} traffic signal nodes in chunk {i+1}")
        except Exception as e:
            logger.error(f"  Error querying traffic signals in chunk {i+1}: {e}")
            continue

        # Filter traffic signals using spatial query against two-lane roads for this chunk
        logger.info(f"  Filtering traffic signals using spatial query for chunk {i+1}...")
        try:
            signal_node_ids = traffic_signal_filter.filter_traffic_signals_by_spatial_query(
                signals_result,
                two_lane_roads,
                buffer_radius_meters=2.0,
                min_road_intersections=3,
            )
            logger.info(f"  Found {len(signal_node_ids)} eligible traffic signal nodes in chunk {i+1}")

            # Create intersection records from filtered signals for this chunk
            chunk_intersections = traffic_signal_filter.create_intersection_records_from_signals(
                signals_result, signal_node_ids
            )

            # Save chunk intersections to GeoJSON file
            filename = geometry_utils.create_bbox_hash_filename(chunk_bbox, "intersections")
            chunk_output_file = data_dir / filename
            export_to_geojson(chunk_intersections, str(chunk_output_file))
            logger.info(f"  Saved {len(chunk_intersections)} intersections to {chunk_output_file}")

        except Exception as e:
            logger.error(f"  Error filtering signals in chunk {i+1}: {e}")
            continue

    # Aggregate and export results
    logger.info(f"Total intersecting signals found across all chunks: {len(all_intersecting_signals)}")

    # Combine all chunk results
    for filename in data_dir.glob("*.geojson"):
        with open(filename, "r") as f:
            data = json.load(f)
            all_intersecting_signals.extend(data["features"])

    # Deduplicate based on properties.intersection_id
    logger.info(f"Total intersecting signals found across all chunks: {len(all_intersecting_signals)}")
    seen_ids = set()
    unique_signals = []
    for signal in all_intersecting_signals:
        intersection_id = signal.get("properties", {}).get("intersection_id")
        if intersection_id and intersection_id not in seen_ids:
            seen_ids.add(intersection_id)
            unique_signals.append(signal)

    logger.info(f"After deduplication: {len(unique_signals)} unique intersections")

    # Step 8: Export to GeoJSON
    logger.info("Exporting results to GeoJSON...")
    geojson = {"type": "FeatureCollection", "features": unique_signals}
    with open("results.geojson", "w") as f:
        json.dump(geojson, f, indent=2)
    logger.info(f"Exported {len(unique_signals)} intersections to results.geojson")

    logger.info("Analysis complete!")


if __name__ == "__main__":
    main()
