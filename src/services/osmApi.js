/**
 * OpenStreetMap Overpass API Service
 * Fetches bike route relations and their member ways
 */

const OVERPASS_API_URL = "https://overpass-api.de/api/interpreter";

/**
 * Fetch bike paths from OpenStreetMap via bicycle route relations
 * Groups ways by their relation membership
 * @param {google.maps.LatLngBounds} bounds - Map bounds
 * @returns {Promise<Array>} Array of bike route polylines
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

    // Query for bicycle relations and their member ways
    const query = `[out:json][timeout:90];
(
  relation["route"="bicycle"](${south},${west},${north},${east});
  way(r)(${south},${west},${north},${east});
);
out body geom;`;

    console.log("Fetching bike routes from bounds:", {
      south,
      west,
      north,
      east,
    });

    const response = await fetch(OVERPASS_API_URL, {
      method: "POST",
      body: query,
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Raw OSM data received:", data);

    // Extract relations and ways
    const relations = data.elements.filter(
      (el) => el.type === "relation" && el.tags?.route === "bicycle"
    );
    const ways = data.elements.filter((el) => el.type === "way" && el.geometry);

    console.log(
      `Found ${relations.length} bicycle relations and ${ways.length} ways`
    );

    // Group ways by relation - create separate polylines for each way
    const paths = [];
    const processedWayIds = new Set();

    // Process each relation
    for (const relation of relations) {
      const relationMembers = relation.members || [];
      const relationName =
        relation.tags?.name || `Route ${relation.tags?.ref || relation.id}`;

      // Find all member ways for this relation and create a polyline for each
      for (const member of relationMembers) {
        if (member.type === "way") {
          const way = ways.find((w) => w.id === member.ref);
          if (way && way.geometry) {
            const coordinates = way.geometry.map((point) => ({
              lat: point.lat,
              lng: point.lon,
            }));

            paths.push({
              id: way.id,
              name: way.tags?.name || relationName,
              relationName: relationName,
              ref: relation.tags?.ref || "",
              type: "way",
              coordinates: coordinates,
              relationId: relation.id,
            });

            processedWayIds.add(way.id);
          }
        }
      }
    }

    // Also include any standalone ways that are cycleways (not part of a relation)
    const standaloneWays = ways.filter(
      (way) =>
        !processedWayIds.has(way.id) &&
        (way.tags?.highway === "cycleway" || way.tags?.bicycle === "designated")
    );

    for (const way of standaloneWays) {
      paths.push({
        id: way.id,
        name: way.tags?.name || `Way ${way.id}`,
        type: "standalone",
        coordinates: way.geometry.map((point) => ({
          lat: point.lat,
          lng: point.lon,
        })),
      });
    }

    console.log(
      `Processed ${paths.length} bike routes: ${relations.length} from relations, ${standaloneWays.length} standalone ways`
    );
    console.log("Bike paths:", paths);

    return paths;
  } catch (error) {
    console.error("Error fetching bike paths from OpenStreetMap:", error);
    return [];
  }
};
