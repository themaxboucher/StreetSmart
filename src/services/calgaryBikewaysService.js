import calgaryBikewaysCSV from "@/components/data/Calgary_Bikeways_20251108.csv?raw";

let cachedBikePaths = null;

// Parse MULTILINESTRING WKT format and convert to coordinates array
// Simplifies coordinates to reduce rendering overhead
function parseMultiLineString(wktString) {
  // Extract coordinates from MULTILINESTRING format
  // Example: MULTILINESTRING ((-114.2124446 51.1222347, -114.2124311 51.1222319, ...))
  const regex = /\(\(([^)]+)\)\)/;
  const match = wktString.match(regex);

  if (!match) return null;

  const coordString = match[1];
  const allCoords = coordString.split(",");
  const coordinates = [];

  // Sample every 3rd coordinate to reduce number of points while keeping path shape
  for (let i = 0; i < allCoords.length; i += 3) {
    const coord = allCoords[i].trim().split(" ");
    coordinates.push({
      lat: parseFloat(coord[1]),
      lng: parseFloat(coord[0]),
    });
  }

  // Always include the last coordinate
  if (allCoords.length > 0) {
    const lastCoord = allCoords[allCoords.length - 1].trim().split(" ");
    const lastPoint = {
      lat: parseFloat(lastCoord[1]),
      lng: parseFloat(lastCoord[0]),
    };
    // Check if last point isn't already included
    const lastInList = coordinates[coordinates.length - 1];
    if (
      !lastInList ||
      lastInList.lat !== lastPoint.lat ||
      lastInList.lng !== lastPoint.lng
    ) {
      coordinates.push(lastPoint);
    }
  }

  return coordinates.length > 0 ? coordinates : null;
}

// Calculate path attributes based on coordinates
function calculatePathAttributes(coordinates) {
  // Calculate distance in kilometers
  let distanceKm = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    const lat1 = (coordinates[i].lat * Math.PI) / 180;
    const lat2 = (coordinates[i + 1].lat * Math.PI) / 180;
    const deltaLat = lat2 - lat1;
    const deltaLng =
      ((coordinates[i + 1].lng - coordinates[i].lng) * Math.PI) / 180;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLng / 2) *
        Math.sin(deltaLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    distanceKm += 6371 * c; // Earth's radius in km
  }

  // Calculate steepness (variation in latitude, as proxy for elevation changes)
  let maxLatChange = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    const latChange = Math.abs(coordinates[i + 1].lat - coordinates[i].lat);
    maxLatChange = Math.max(maxLatChange, latChange);
  }
  const steepness = Math.min(10, maxLatChange * 50); // Scale to 0-10

  // Calculate windiness (ratio of straight-line distance to actual distance)
  const lat1 = (coordinates[0].lat * Math.PI) / 180;
  const lat2 = (coordinates[coordinates.length - 1].lat * Math.PI) / 180;
  const deltaLat = lat2 - lat1;
  const deltaLng =
    ((coordinates[coordinates.length - 1].lng - coordinates[0].lng) * Math.PI) /
    180;
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightDistance = 6371 * c;

  const windiness =
    distanceKm > 0 ? Math.min(10, (distanceKm / straightDistance) * 5) : 0;

  // Generate other attributes with some variation
  // Use coordinates hash to ensure same path gets same values
  let hash = 0;
  for (let i = 0; i < coordinates.length; i++) {
    hash += coordinates[i].lat + coordinates[i].lng;
  }
  hash = Math.abs(Math.sin(hash) * 10000);

  const scenery = Math.round((hash % 100) / 10); // 0-10
  const carTraffic = Math.round(((hash + 3) % 100) / 10); // 0-10
  const footTraffic = Math.round(((hash + 6) % 100) / 10); // 0-10
  const safety = Math.round(((hash + 9) % 100) / 10); // 0-10
  const crowdDensity = Math.round(((hash + 12) % 100) / 10); // 0-10
  const cleanliness = Math.round(((hash + 15) % 100) / 10); // 0-10
  const urbanRural = distanceKm > 5 ? "Rural" : "Urban";

  return {
    distance: parseFloat(distanceKm.toFixed(2)),
    scenery,
    carTraffic,
    footTraffic,
    safety,
    crowdDensity,
    steepness: parseFloat(steepness.toFixed(1)),
    windiness: parseFloat(windiness.toFixed(1)),
    cleanliness,
    urbanRural,
  };
}

// Calculate distance between two coordinate points (in degrees)
function getDistance(coord1, coord2) {
  const dLat = coord1.lat - coord2.lat;
  const dLng = coord1.lng - coord2.lng;
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

// Calculate the total length of a polyline (in degrees)
function getPolylineLength(coordinates) {
  let length = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    length += getDistance(coordinates[i], coordinates[i + 1]);
  }
  return length;
}

// Merge overlapping polyline segments into complete routes
function mergePolylineSegments(segments) {
  const threshold = 0.0003; // About 30 meters in Calgary's latitude
  const minLength = 0.001; // Minimum length to keep a polyline (roughly 100 meters)

  let merged = [...segments.map((s) => ({ ...s, used: false }))];
  let passCount = 0;
  const maxPasses = 50; // Prevent infinite loops

  // Keep merging until no more connections can be found
  while (passCount < maxPasses) {
    let foundAnyMerge = false;
    passCount++;

    // Find all pairs that can be merged
    for (let i = 0; i < merged.length; i++) {
      if (merged[i].used) continue;

      for (let j = i + 1; j < merged.length; j++) {
        if (merged[j].used) continue;

        const seg1 = merged[i];
        const seg2 = merged[j];
        const start1 = seg1.coordinates[0];
        const end1 = seg1.coordinates[seg1.coordinates.length - 1];
        const start2 = seg2.coordinates[0];
        const end2 = seg2.coordinates[seg2.coordinates.length - 1];

        // Check all possible connections
        let newPath = null;

        // end1 connects to start2
        if (getDistance(end1, start2) < threshold) {
          newPath = [...seg1.coordinates, ...seg2.coordinates];
        }
        // end1 connects to end2 (reverse seg2)
        else if (getDistance(end1, end2) < threshold) {
          newPath = [...seg1.coordinates, ...seg2.coordinates.reverse()];
        }
        // start1 connects to start2 (reverse seg1)
        else if (getDistance(start1, start2) < threshold) {
          newPath = [...seg1.coordinates.reverse(), ...seg2.coordinates];
        }
        // start1 connects to end2
        else if (getDistance(start1, end2) < threshold) {
          newPath = [...seg2.coordinates, ...seg1.coordinates];
        }

        if (newPath) {
          // Mark segments as used and create merged segment
          merged[i].used = true;
          merged[j].used = true;
          merged.push({
            id: `merged-${passCount}-${i}-${j}`,
            coordinates: newPath,
            used: false,
          });
          foundAnyMerge = true;
          break; // Start over with the new merged segment
        }
      }
    }

    if (!foundAnyMerge) break;
  }

  // Collect all remaining segments (merged and unmerged) and filter by length
  const result = merged
    .filter(
      (seg) => !seg.used && getPolylineLength(seg.coordinates) >= minLength
    )
    .map((seg, index) => ({
      id: `route-${index}`,
      coordinates: seg.coordinates,
      bicycleClass: seg.bicycleClass,
      ...calculatePathAttributes(seg.coordinates),
    }));

  return result;
}

// Parse CSV and extract bike paths (cached)
export function parseCalgaryBikewaysData() {
  // Return cached data if already parsed
  if (cachedBikePaths) {
    return cachedBikePaths;
  }

  const lines = calgaryBikewaysCSV.trim().split("\n");
  const segments = [];

  // Skip header line and parse each row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    // Parse CSV with quoted fields
    const fields = [];
    let current = "";
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        fields.push(current.replace(/^"|"$/g, ""));
        current = "";
      } else {
        current += char;
      }
    }
    fields.push(current.replace(/^"|"$/g, ""));

    // Extract BICYCLE_CLASS (column 2) and MULTILINESTRING (column 7)
    const bicycleClass = fields[2];
    const multiLineString = fields[7];

    // Only include Bicycle Lane and Cycle Track
    const allowedClasses = ["Bicycle Lane", "Cycle Track"];
    if (!allowedClasses.includes(bicycleClass)) {
      continue;
    }

    if (multiLineString) {
      const coordinates = parseMultiLineString(multiLineString);
      if (coordinates && coordinates.length > 0) {
        segments.push({
          id: `segment-${i}`,
          bicycleClass: bicycleClass,
          coordinates: coordinates,
        });
      }
    }
  }

  // Merge overlapping segments into complete routes
  const bikePaths = mergePolylineSegments(segments);

  // Cache the result
  cachedBikePaths = bikePaths;

  // Log statistics about the parsed data
  const totalCoordinates = bikePaths.reduce(
    (sum, path) => sum + path.coordinates.length,
    0
  );
  console.log(`✅ Calgary Bikeways Data Loaded`);
  console.log(`   📍 Original Segments: ${segments.length}`);
  console.log(`   📍 Merged Routes: ${bikePaths.length}`);
  console.log(
    `   📍 Segments Reduction: ${(
      (1 - bikePaths.length / segments.length) *
      100
    ).toFixed(1)}%`
  );
  console.log(`   📍 Total Coordinates: ${totalCoordinates}`);
  console.log(
    `   📍 Avg Points per Route: ${(
      totalCoordinates / bikePaths.length
    ).toFixed(1)}`
  );

  return bikePaths;
}
