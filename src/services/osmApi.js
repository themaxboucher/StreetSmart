/**
 * OpenStreetMap Overpass API Service
 * Fetches bike paths and other map data from OpenStreetMap
 */

const OVERPASS_API_URL = "https://overpass-api.de/api/interpreter";

/**
 * Fetch bike paths from OpenStreetMap Overpass API
 * @param {google.maps.LatLngBounds} bounds - Map bounds
 * @returns {Promise<Array>} Array of bike paths with coordinates
 */
export const fetchBikePaths = async (bounds) => {
  if (!bounds) {
    console.warn("No bounds provided to fetchBikePaths");
    return [];
  }

  try {
    const south = bounds.getSouthWest().lat();
    const west = bounds.getSouthWest().lng();
    const north = bounds.getNorthEast().lat();
    const east = bounds.getNorthEast().lng();

    console.log("Fetching bike paths for bounds:", {
      south,
      west,
      north,
      east,
    });

    const query = `[out:json];
(
  way["highway"="cycleway"](${south},${west},${north},${east});
  way["bicycle"="designated"](${south},${west},${north},${east});
);
out geom;`;

    const response = await fetch(OVERPASS_API_URL, {
      method: "POST",
      body: query,
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Raw OSM data received:", data);

    // Convert elements (ways) to polylines
    const paths = data.elements
      .filter((element) => element.type === "way" && element.geometry)
      .map((way) => ({
        id: way.id,
        name: way.tags?.name || `Way ${way.id}`,
        cycleway: way.tags?.highway === "cycleway",
        bikeDesignated: way.tags?.bicycle === "designated",
        coordinates: way.geometry.map((point) => ({
          lat: point.lat,
          lng: point.lon,
        })),
      }));

    console.log(`Processed ${paths.length} bike paths:`, paths);

    return paths;
  } catch (error) {
    console.error("Error fetching bike paths from OpenStreetMap:", error);
    return [];
  }
};
