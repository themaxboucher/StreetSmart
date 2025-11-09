import { Button } from "@/components/ui/button";
import { ChevronLeft, Bike, Bus, Footprints } from "lucide-react";
import { useNavigate } from "react-router-dom";
import bikePathsData from "@/components/data/bike-paths.js";

// Calculate distance in kilometers between coordinates using Haversine formula
function calculateDistance(coordinates) {
  if (!coordinates || coordinates.length < 2) return 0;

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

  return distanceKm;
}

export function CityStats({ city, selectedBikePath, onClearBikePath }) {
  const navigate = useNavigate();

  // Calculate bike paths statistics for Calgary
  const bikePathsStats = {
    count: bikePathsData.length,
    totalDistance: bikePathsData
      .reduce((sum, path) => {
        const distance = path.distance || calculateDistance(path.coordinates);
        return sum + distance;
      }, 0)
      .toFixed(1),
  };

  if (!city) {
    return null;
  }

  const stats = [
    {
      label: "Cycling",
      value: city.cycling,
      icon: Bike,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      label: "Public Transit",
      value: city.publicTransport,
      icon: Bus,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      label: "Walkability",
      value: city.walkability,
      icon: Footprints,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto shadow-lg scrollbar-hide flex flex-col">
      {/* Header with back button */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3">
        <Button
          onClick={() => navigate("/")}
          variant="ghost"
          size="icon"
          className="hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </Button>
        <div>
          <h2 className="font-semibold text-lg text-gray-900">{city.name}</h2>
          <p className="text-xs text-gray-500">{city.country}</p>
        </div>
      </div>

      {/* City image */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={city.image}
          alt={city.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>

      {/* Stats section */}
      <div className="flex-1 p-6">
        <div className="space-y-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const isCycling = stat.label === "Cycling";
            const isComingSoon = stat.label !== "Cycling";
            const hasData = stat.value !== null && stat.value !== undefined;

            // Show nothing if no data available (for non-Calgary cities)
            if (!hasData) {
              return (
                <div
                  key={stat.label}
                  className={`${stat.bgColor} rounded-lg p-4`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon size={20} className={stat.color} />
                      <span className="font-medium text-gray-900">
                        {stat.label}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="inline-block px-2.5 py-1 bg-gray-300 text-gray-700 text-xs font-medium rounded-full">
                      Coming soon
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={stat.label}
                className={`${stat.bgColor} rounded-lg p-4`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon size={20} className={stat.color} />
                    <span className="font-medium text-gray-900">
                      {stat.label}
                    </span>
                  </div>
                  <span className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${stat.color.replace(
                      "text-",
                      "bg-"
                    )}`}
                    style={{ width: `${(stat.value / 10) * 100}%` }}
                  />
                </div>

                {/* Additional info for Cycling */}
                {isCycling && city.name === "Calgary" && (
                  <div className="mt-3 pt-3 border-t border-blue-200 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Bike Paths:</span>
                      <span className="font-semibold text-gray-900">
                        {bikePathsStats.count}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Total Distance:</span>
                      <span className="font-semibold text-gray-900">
                        {bikePathsStats.totalDistance} km
                      </span>
                    </div>
                  </div>
                )}

                {/* Coming soon badge for other stats */}
                {isComingSoon && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="inline-block px-2.5 py-1 bg-gray-300 text-gray-700 text-xs font-medium rounded-full">
                      Coming soon
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
