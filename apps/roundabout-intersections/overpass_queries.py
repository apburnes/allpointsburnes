"""
Overpass API query functions for OSM data.
"""

import overpy
from typing import List, Dict, Any
import time
import logging
import config

logger = logging.getLogger(__name__)


class OverpassQueries:
    """Handle Overpass API queries for OSM data."""

    def __init__(
        self,
        api_url: str = config.OVERPASS_API_URL,
        max_retries: int = 5,
        initial_delay: float = 5.0,
        max_delay: float = 300.0,
    ):
        """
        Initialize Overpass API client.

        Args:
            api_url: Overpass API endpoint URL
            max_retries: Maximum number of retry attempts
            initial_delay: Initial delay in seconds before first retry
            max_delay: Maximum delay in seconds between retries
        """
        self.api = overpy.Overpass(url=api_url)
        self.max_retries = max_retries
        self.initial_delay = initial_delay
        self.max_delay = max_delay

    def _query_with_retry(self, query: str, query_name: str = "query") -> overpy.Result:
        """
        Execute an Overpass query with retry logic and exponential backoff.

        Args:
            query: Overpass QL query string
            query_name: Name of the query for logging purposes

        Returns:
            Overpass result

        Raises:
            Exception: If query fails after all retries
        """
        delay = self.initial_delay
        last_exception = None

        for attempt in range(self.max_retries):
            try:
                logger.info(f"Executing {query_name} (attempt {attempt + 1}/{self.max_retries})...")
                result = self.api.query(query)
                if attempt > 0:
                    logger.info(f"{query_name} succeeded after {attempt + 1} attempts")
                return result
            except overpy.exception.OverpassTooManyRequests as e:
                last_exception = e
                if attempt < self.max_retries - 1:
                    logger.warning(
                        f"Server load too high for {query_name}. "
                        f"Retrying in {delay:.1f} seconds..."
                    )
                    time.sleep(delay)
                    # Exponential backoff with jitter
                    delay = min(delay * 2, self.max_delay)
                else:
                    logger.error(f"{query_name} failed after {self.max_retries} attempts")
            except overpy.exception.OverpassRuntimeError as e:
                error_msg = str(e).lower()
                if "too many requests" in error_msg or "rate limit" in error_msg or "server load" in error_msg:
                    last_exception = e
                    if attempt < self.max_retries - 1:
                        logger.warning(
                            f"Rate limit/server load error for {query_name}. "
                            f"Retrying in {delay:.1f} seconds..."
                        )
                        time.sleep(delay)
                        delay = min(delay * 2, self.max_delay)
                    else:
                        logger.error(f"{query_name} failed after {self.max_retries} attempts")
                else:
                    # Non-retryable error
                    logger.error(f"Non-retryable error in {query_name}: {e}")
                    raise
            except Exception as e:
                error_msg = str(e).lower()
                if "too many requests" in error_msg or "rate limit" in error_msg or "server load" in error_msg:
                    last_exception = e
                    if attempt < self.max_retries - 1:
                        logger.warning(
                            f"Rate limit/server load error for {query_name}. "
                            f"Retrying in {delay:.1f} seconds..."
                        )
                        time.sleep(delay)
                        delay = min(delay * 2, self.max_delay)
                    else:
                        logger.error(f"{query_name} failed after {self.max_retries} attempts")
                else:
                    # Unknown error, but might be retryable
                    logger.warning(f"Error in {query_name} (attempt {attempt + 1}): {e}")
                    if attempt < self.max_retries - 1:
                        time.sleep(delay)
                        delay = min(delay * 2, self.max_delay)
                    else:
                        raise

        # If we get here, all retries failed
        raise Exception(
            f"{query_name} failed after {self.max_retries} attempts. "
            f"Last error: {last_exception}"
        ) from last_exception

    def query_roads_with_lanes(self, bbox: List[float]) -> overpy.Result:
        """
        Query all roads with lane information in the bounding box.

        Args:
            bbox: Bounding box [min_lon, min_lat, max_lon, max_lat]

        Returns:
            Overpass result with ways (roads)
        """
        query = f"""
        [bbox:{bbox[1]},{bbox[0]},{bbox[3]},{bbox[2]}];
        (
          way["highway"]["lanes"];
          way["highway"]["lanes:forward"];
          way["highway"]["lanes:backward"];
          way["highway"~"^(primary|secondary|tertiary|residential|unclassified|service)$"];
        );
        (._;>;);
        out body;
        """
        return self._query_with_retry(query, "query_roads_with_lanes")

    def query_all_roads(self, bbox: List[float]) -> overpy.Result:
        """
        Query all roads in the bounding box (for intersection detection).

        Args:
            bbox: Bounding box [min_lon, min_lat, max_lon, max_lat]

        Returns:
            Overpass result with ways (roads) and nodes
        """
        query = f"""
        [bbox:{bbox[1]},{bbox[0]},{bbox[3]},{bbox[2]}];
        (
          way["highway"~"^(primary|secondary|tertiary|residential|unclassified|service)$"];
        );
        (._;>;);
        out body;
        """
        return self._query_with_retry(query, "query_all_roads")

    def query_traffic_signals(self, bbox: List[float]) -> overpy.Result:
        """
        Query all traffic signal nodes in the bounding box.

        Args:
            bbox: Bounding box [min_lon, min_lat, max_lon, max_lat]

        Returns:
            Overpass result with nodes (traffic signals)
        """
        query = f"""
        [bbox:{bbox[1]},{bbox[0]},{bbox[3]},{bbox[2]}];
        (
          node["highway"="traffic_signals"];
        );
        out body;
        """
        return self._query_with_retry(query, "query_traffic_signals")

    def query_landuse(self, bbox: List[float]) -> overpy.Result:
        """
        Query all landuse polygons in the bounding box.

        Args:
            bbox: Bounding box [min_lon, min_lat, max_lon, max_lat]

        Returns:
            Overpass result with ways (landuse polygons)
        """
        landuse_tags = "|".join(config.LANDUSE_TAGS)
        query = f"""
        [bbox:{bbox[1]},{bbox[0]},{bbox[3]},{bbox[2]}];
        (
          way["landuse"~"^({landuse_tags})$"];
          relation["landuse"~"^({landuse_tags})$"];
        );
        (._;>;);
        out body;
        """
        return self._query_with_retry(query, "query_landuse")

    def query_intersection_nodes(self, bbox: List[float]) -> overpy.Result:
        """
        Query nodes that are part of multiple roads (potential intersections).

        Args:
            bbox: Bounding box [min_lon, min_lat, max_lon, max_lat]

        Returns:
            Overpass result with nodes and ways
        """
        query = f"""
        [bbox:{bbox[1]},{bbox[0]},{bbox[3]},{bbox[2]}];
        (
          way["highway"~"^(primary|secondary|tertiary|residential|unclassified|service)$"];
        );
        (._;>;);
        out body;
        """
        return self._query_with_retry(query, "query_intersection_nodes")
