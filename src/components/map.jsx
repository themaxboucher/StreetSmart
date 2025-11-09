import { useCallback, useState, useEffect, useMemo } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import bikePathsData from "@/components/data/bike-paths.js";
import { BikePathDialog } from "./BikePathDialog";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const canadaCenter = {
  lat: 56.1304,
  lng: -106.3468,
};

const defaultZoom = 4;
const cityZoom = 11;

export function Map({
  selectedCity,
  onSelectCity,
  cities,
  showBikePathsByDefault = false,
  showMarkers = true,
}) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [map, setMap] = useState(null);
  const [bikePaths, setBikePaths] = useState([]);
  const [center, setCenter] = useState(canadaCenter);
  const [zoom, setZoom] = useState(defaultZoom);
  const [hoveredPolylineId, setHoveredPolylineId] = useState(null);
  const [selectedPolylineInfo, setSelectedPolylineInfo] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Create custom MapPin icon for markers (only when API is loaded)
  const mapPinIcon = useMemo(() => {
    if (!isLoaded || !window.google?.maps) return null;

    // SVG representation of Lucide MapPin icon in blue
    const svgString = `
      <svg width="32" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" 
          fill="#2b7fff" 
          stroke="#ffffff" 
          stroke-width="2"
        />
        <circle cx="12" cy="10" r="3" fill="#ffffff"/>
      </svg>
    `.trim();

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgString)}`,
      scaledSize: new window.google.maps.Size(32, 40),
      anchor: new window.google.maps.Point(16, 40), // Anchor at the bottom point of the pin
    };
  }, [isLoaded]);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    // Load bike paths when viewing Calgary
    let paths = [];

    if (selectedCity?.name === "Calgary") {
      paths = bikePathsData;
    }

    setBikePaths(paths);
  }, [selectedCity]);

  // Handle city selection - zoom into city
  useEffect(() => {
    if (!map || !selectedCity) {
      // Reset to Canada view if no city selected
      setCenter(canadaCenter);
      setZoom(defaultZoom);
      return;
    }

    // Zoom into selected city
    setCenter({ lat: selectedCity.lat, lng: selectedCity.lng });
    setZoom(cityZoom);
  }, [selectedCity, map]);

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <p className="text-gray-600">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          styles: [
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#616161" }],
            },
            {
              featureType: "poi",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "poi.business",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "poi.park",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "poi.attraction",
              stylers: [{ visibility: "off" }],
            },
          ],
        }}
      >
        {/* Render city markers */}
        {showMarkers &&
          cities.map((city) => (
            <Marker
              key={city.name}
              position={{ lat: city.lat, lng: city.lng }}
              title={city.name}
              onClick={() => onSelectCity(city)}
              icon={mapPinIcon}
            />
          ))}

        {/* Render bike paths as polylines */}
        {bikePaths.map((path) => {
          const isHovered = hoveredPolylineId === path.id;

          // Determine color based on hover state only
          let strokeColor = "#2b7fff"; // default blue
          let strokeWeight = 3; // default weight
          if (isHovered) {
            strokeColor = "#00d4ff"; // bright cyan when hovered
            strokeWeight = 4;
          }

          const handlePolylineClick = () => {
            setSelectedPolylineInfo(path);
            setIsDialogOpen(true);
          };

          return (
            <Polyline
              key={path.id}
              path={path.coordinates}
              options={{
                strokeColor,
                strokeOpacity: 0.8,
                strokeWeight,
                geodesic: true,
              }}
              onMouseOver={() => setHoveredPolylineId(path.id)}
              onMouseOut={() => setHoveredPolylineId(null)}
              onClick={handlePolylineClick}
            />
          );
        })}
      </GoogleMap>

      {/* Bike Path Dialog */}
      <BikePathDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        pathInfo={selectedPolylineInfo}
      />
    </div>
  );
}
