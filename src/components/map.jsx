import { useCallback, useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { Bike, LoaderCircle } from "lucide-react";
import { parseCalgaryBikewaysData } from "@/services/calgaryBikewaysService";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

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
  const [showBikeLayers, setShowBikeLayers] = useState(showBikePathsByDefault);
  const [bikePaths, setBikePaths] = useState([]);
  const [isLoadingPaths, setIsLoadingPaths] = useState(false);
  const [center, setCenter] = useState(canadaCenter);
  const [zoom, setZoom] = useState(defaultZoom);
  const [hoveredPolylineId, setHoveredPolylineId] = useState(null);
  const [selectedPolylineInfo, setSelectedPolylineInfo] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (!showBikeLayers) return;

    // Load bike paths when toggled on
    setIsLoadingPaths(true);
    let paths = [];

    // Use Calgary data if viewing Calgary
    if (selectedCity?.name === "Calgary") {
      paths = parseCalgaryBikewaysData();
    }

    setBikePaths(paths);
    setIsLoadingPaths(false);
  }, [showBikeLayers, selectedCity]);

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
      {selectedCity && (
        <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3">
          <Button
            onClick={() => {
              setShowBikeLayers(!showBikeLayers);
              if (showBikeLayers) setBikePaths([]);
            }}
            className={`${
              showBikeLayers
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } ${isLoadingPaths & "animate-pulse"}`}
            disabled={isLoadingPaths}
          >
            <Bike size={18} />
            {isLoadingPaths ? (
              <>
                Bike Paths: ON <LoaderCircle className="size-4 animate-spin" />
              </>
            ) : showBikeLayers ? (
              `Bike Paths (${bikePaths.length})`
            ) : (
              "Bike Paths"
            )}
          </Button>
        </div>
      )}

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
            />
          ))}

        {/* Render bike paths as polylines */}
        {showBikeLayers &&
          bikePaths.map((path) => {
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          {selectedPolylineInfo && (
            <>
              {/* Image */}
              <img
                src="https://images.unsplash.com/photo-1576949203318-3e5c58c20dd7?w=400&h=250&fit=crop"
                alt="Bike lane"
                className="w-full h-48 object-cover rounded-t-lg"
              />

              {/* Content */}
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl mb-2">
                    🚴 {selectedPolylineInfo.name || "Bike Path"}
                  </DialogTitle>
                  {selectedPolylineInfo.description && (
                    <DialogDescription className="text-sm text-gray-600 mb-3">
                      {selectedPolylineInfo.description}
                    </DialogDescription>
                  )}
                </DialogHeader>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {/* Type */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700">
                      Type
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {selectedPolylineInfo.type}
                    </span>
                  </div>

                  {/* Distance */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700">
                      Distance
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {selectedPolylineInfo.distance?.toFixed(2)} km
                    </span>
                  </div>

                  {/* Scenery */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700">
                      Scenery
                    </span>
                    <span className="text-xs font-semibold text-gray-600">
                      {selectedPolylineInfo.scenery}/10{" "}
                      {selectedPolylineInfo.scenery < 2
                        ? "🙁"
                        : selectedPolylineInfo.scenery < 4
                        ? "😐"
                        : selectedPolylineInfo.scenery < 6
                        ? "👍"
                        : selectedPolylineInfo.scenery < 8
                        ? "😊"
                        : "🤩"}
                    </span>
                  </div>

                  {/* Safety */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700">
                      Safety
                    </span>
                    <span className="text-xs font-semibold text-gray-600">
                      {selectedPolylineInfo.safeness}/10{" "}
                      {selectedPolylineInfo.safeness < 2
                        ? "⚠️"
                        : selectedPolylineInfo.safeness < 4
                        ? "😟"
                        : selectedPolylineInfo.safeness < 6
                        ? "👌"
                        : selectedPolylineInfo.safeness < 8
                        ? "✅"
                        : "🛡️"}
                    </span>
                  </div>

                  {/* Crowdiness */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700">
                      Crowdiness
                    </span>
                    <span className="text-xs font-semibold text-gray-600">
                      {selectedPolylineInfo.crowdiness}/10{" "}
                      {selectedPolylineInfo.crowdiness < 2
                        ? "🏜️"
                        : selectedPolylineInfo.crowdiness < 4
                        ? "🚴"
                        : selectedPolylineInfo.crowdiness < 6
                        ? "👥"
                        : selectedPolylineInfo.crowdiness < 8
                        ? "🚴‍♂️👥"
                        : "🌊"}
                    </span>
                  </div>

                  {/* Steepness */}
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-700">
                      Steepness
                    </span>
                    <span className="text-xs font-semibold text-gray-600">
                      {selectedPolylineInfo.steepness?.toFixed(1)}/10{" "}
                      {selectedPolylineInfo.steepness < 2
                        ? "🏞️"
                        : selectedPolylineInfo.steepness < 4
                        ? "🛣️"
                        : selectedPolylineInfo.steepness < 6
                        ? "📈"
                        : selectedPolylineInfo.steepness < 8
                        ? "⛰️"
                        : "🏔️"}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
