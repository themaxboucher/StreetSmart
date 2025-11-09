import { useCallback, useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  Polyline,
} from "@react-google-maps/api";
import { Bike, LoaderCircle } from "lucide-react";
import { fetchBikePaths } from "@/services/osmApi";
import { Button } from "./ui/button";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const defaultCenter = {
  lat: 51.0447,
  lng: -114.0719,
};

export function Map() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showBikeLayers, setShowBikeLayers] = useState(true);
  const [bikePaths, setBikePaths] = useState([]);
  const [isLoadingPaths, setIsLoadingPaths] = useState(false);
  const boundsTimeoutRef = useRef(null);
  const [markers, setMarkers] = useState([]);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (!map || !showBikeLayers) return;

    // Fetch bike paths when toggled on
    const loadPaths = async () => {
      setIsLoadingPaths(true);
      const bounds = map.getBounds();
      const paths = await fetchBikePaths(bounds);
      setBikePaths(paths);
      setIsLoadingPaths(false);
    };

    loadPaths();
  }, [map, showBikeLayers]);

  // Handle map bounds change to refresh bike paths with debounce
  const handleBoundsChanged = useCallback(() => {
    if (!map || !showBikeLayers) return;

    // Clear previous timeout to debounce rapid calls
    if (boundsTimeoutRef.current) {
      clearTimeout(boundsTimeoutRef.current);
    }

    // Wait 1s after bounds change before making API call
    boundsTimeoutRef.current = setTimeout(async () => {
      setIsLoadingPaths(true);
      const bounds = map.getBounds();
      const paths = await fetchBikePaths(bounds);
      setBikePaths(paths);
      setIsLoadingPaths(false);
    }, 1000);
  }, [map, showBikeLayers]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (boundsTimeoutRef.current) {
        clearTimeout(boundsTimeoutRef.current);
      }
    };
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-[500px] bg-gray-200 flex items-center justify-center">
        <p className="text-gray-600">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden relative">
      {/* Bike Layer Toggle */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3">
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

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onBoundsChanged={handleBoundsChanged}
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
        {/* Render bike paths as polylines */}
        {showBikeLayers &&
          bikePaths.map((path) => (
            <Polyline
              key={path.id}
              path={path.coordinates}
              options={{
                strokeColor: "#0EA5E9",
                strokeOpacity: 0.8,
                strokeWeight: 3,
                geodesic: true,
              }}
            />
          ))}

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => setSelectedMarker(marker)}
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={{
              lat: selectedMarker.lat,
              lng: selectedMarker.lng,
            }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2">
              <h3 className="font-semibold text-gray-800">
                {selectedMarker.title}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedMarker.description}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {selectedMarker.lat.toFixed(4)}, {selectedMarker.lng.toFixed(4)}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
