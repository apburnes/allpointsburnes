# OSM Intersection and Landuse Analysis for Phoenix Metro

This project analyzes OpenStreetMap (OSM) data to identify intersections where two two-lane roads meet with traffic lights in the Phoenix, AZ metro area. For each intersection, it creates a half-mile radius buffer and analyzes the types of landuse within that buffer, calculating the percentage of each landuse type.

## Overview

The analysis workflow:

1. Queries OSM data for Phoenix metro area roads
2. Filters roads to identify two-lane roads (using `lanes=2` or `lanes:forward=1` + `lanes:backward=1`)
3. Finds intersections where two or more two-lane roads meet
4. Filters intersections to only include those with traffic signals
5. Creates 0.5-mile (804.67m) radius buffers around each intersection
6. Queries landuse polygons from OSM
7. Calculates the percentage of each landuse type within each buffer
8. Exports results as GeoJSON

## Requirements

- Python 3.10 or higher
- [uv](https://github.com/astral-sh/uv) - Fast Python package installer

## Setup

1. Install `uv` if you haven't already:
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

2. Navigate to the project directory:
   ```bash
   cd apps/roundabout-intersections
   ```

3. Install dependencies using `uv`:
   ```bash
   uv sync
   ```

   This will create a virtual environment and install all required dependencies.

## Usage

Run the main analysis script:

```bash
uv run python main.py
```

The script will:
- Query OSM data via the Overpass API
- Process intersections and landuse data
- Export results to `results.geojson`

### Output Format

The output GeoJSON file contains a FeatureCollection where each feature represents an intersection with:

- **Geometry**: Point (intersection coordinates)
- **Properties**:
  - `intersection_id`: OSM node ID
  - `roads`: List of road names intersecting at this point
  - `road_ids`: List of OSM way IDs
  - `num_roads`: Number of roads intersecting
  - `landuse_breakdown`: Dictionary mapping landuse types to percentages
  - `total_area_analyzed_m2`: Total buffer area in square meters
  - `total_area_analyzed_mi2`: Total buffer area in square miles

### Example Output

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-112.0740, 33.4484]
      },
      "properties": {
        "intersection_id": "123456",
        "roads": ["Main Street", "First Avenue"],
        "road_ids": ["123", "456"],
        "num_roads": 2,
        "landuse_breakdown": {
          "residential": 45.2,
          "commercial": 30.1,
          "park": 15.3,
          "unknown": 9.4
        },
        "total_area_analyzed_m2": 2035718.5,
        "total_area_analyzed_mi2": 0.7854
      }
    }
  ]
}
```

## Configuration

Edit `config.py` to customize:

- **Phoenix Metro Bounding Box**: `PHOENIX_BBOX` - Adjust the area of analysis
- **Buffer Radius**: `BUFFER_RADIUS_METERS` - Change the buffer size (default: 804.67m = 0.5 miles)
- **Overpass API URL**: `OVERPASS_API_URL` - Use a different Overpass instance if needed
  - Default: `https://overpass-api.de/api/interpreter`
  - Alternatives: `https://overpass.kumi.systems/api/interpreter` or `https://overpass.openstreetmap.fr/api/interpreter`
- **Retry Configuration**: Adjust retry behavior for rate-limited requests
  - `OVERPASS_MAX_RETRIES` - Maximum retry attempts (default: 5)
  - `OVERPASS_INITIAL_DELAY` - Initial delay before first retry in seconds (default: 5.0)
  - `OVERPASS_MAX_DELAY` - Maximum delay between retries in seconds (default: 300.0)
- **Query Delay**: `QUERY_DELAY` - Delay between queries to be respectful of the API (default: 2.0 seconds)
- **Landuse Tags**: `LANDUSE_TAGS` - Add or remove landuse types to analyze

### Handling Rate Limits

The script includes automatic retry logic with exponential backoff to handle "Server load too high" errors from the Overpass API. If you encounter persistent rate limiting:

1. Increase `QUERY_DELAY` to wait longer between queries
2. Increase `OVERPASS_INITIAL_DELAY` and `OVERPASS_MAX_DELAY` for longer retry intervals
3. Try a different Overpass API endpoint by changing `OVERPASS_API_URL`
4. Run the script during off-peak hours when the API is less loaded

## Project Structure

```
roundabout-intersections/
├── main.py                 # Main analysis script
├── config.py              # Configuration settings
├── overpass_queries.py    # OSM Overpass API query functions
├── two_lane_filter.py     # Two-lane road filtering logic
├── intersection_detection.py  # Intersection detection algorithm
├── traffic_signal_filter.py   # Traffic signal filtering
├── geometry_utils.py      # Buffer and geometric calculations
├── landuse_analysis.py    # Landuse percentage calculations
├── pyproject.toml         # Python project configuration
└── README.md              # This file
```

## Dependencies

- `overpy`: Overpass API client for Python
- `shapely`: Geometric operations (buffers, intersections)
- `geopandas`: Spatial data handling and analysis
- `osmnx`: Optional network analysis (currently not used but available)
- `pyproj`: Coordinate system transformations

## Notes

- OSM data completeness varies - some roads may not have explicit lane tags
- Traffic signals may be tagged on ways or nodes - the script handles both
- Landuse polygons may overlap - the script calculates intersection areas
- Large datasets may require pagination or area subdivision for Overpass queries
- The script uses UTM Zone 12N (EPSG:32612) for accurate distance and area calculations in the Phoenix area

## License

MIT
