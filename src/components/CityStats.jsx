import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Bike,
  Bus,
  Footprints,
  Flower,
  Car,
  Network,
  TrendingUp,
  Star,
  Angry,
  Annoyed,
  Smile,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import bikePathsData from "@/components/data/bike-paths.js";
import { BikePathRatingDialog } from "./BikePathRatingDialog";

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

// Get icon and color for rating
function getRatingIcon(rating) {
  switch (rating) {
    case "good":
      return {
        icon: Smile,
        color: "text-green-600",
      };
    case "ok":
      return {
        icon: Annoyed,
        color: "text-yellow-600",
      };
    case "bad":
      return {
        icon: Angry,
        color: "text-red-600",
      };
    default:
      return {
        icon: Smile,
        color: "text-gray-400",
      };
  }
}

export function CityStats({ city, selectedBikePath, onClearBikePath }) {
  const navigate = useNavigate();
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);

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

  // If a bike path is selected, show bike path stats instead of city stats
  const bikePathStats = selectedBikePath
    ? [
        {
          label: "Scenery",
          value: selectedBikePath.scenery || "ok",
          icon: Flower,
          baseColor: "text-pink-500",
          baseBgColor: "bg-pink-50",
        },
        {
          label: "Nearby Traffic",
          value: selectedBikePath.carTraffic || "ok",
          icon: Car,
          baseColor: "text-red-500",
          baseBgColor: "bg-red-50",
        },
        {
          label: "Connectivity",
          value: selectedBikePath.connectivity || "ok",
          icon: Network,
          baseColor: "text-blue-500",
          baseBgColor: "bg-blue-50",
        },
        {
          label: "Incline",
          value: selectedBikePath.incline || "ok",
          icon: TrendingUp,
          baseColor: "text-orange-500",
          baseBgColor: "bg-orange-50",
        },
      ]
    : null;

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
          onClick={() => (selectedBikePath ? onClearBikePath() : navigate("/"))}
          variant="ghost"
          size="icon"
          className="hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </Button>
        <div className="flex-1">
          <h2 className="font-semibold text-lg text-gray-900">
            {selectedBikePath ? selectedBikePath.name : city.name}
          </h2>
          <p className="text-xs text-gray-500">
            {selectedBikePath ? "Bike Path" : city.country}
          </p>
        </div>
      </div>

      {/* Stats section */}
      <div className="flex-1 p-6 flex flex-col">
        <div className={bikePathStats ? "space-y-1" : "space-y-3"}>
          {(bikePathStats || stats).map((stat) => {
            const Icon = stat.icon;
            const isCycling = stat.label === "Cycling";
            const isComingSoon = stat.label !== "Cycling" && !bikePathStats;
            const hasData = stat.value !== null && stat.value !== undefined;

            // Show nothing if no data available (for non-Calgary cities) - only for city stats
            if (!hasData && !bikePathStats) {
              return (
                <div
                  key={stat.label}
                  className="bg-white border border-gray-200 rounded-xl p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <Icon size={20} className={stat.color} />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {stat.label}
                    </h3>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                      Coming soon
                    </span>
                  </div>
                </div>
              );
            }

            // For bike path stats, use icon-based rating display
            if (bikePathStats) {
              const ratingIcon = getRatingIcon(stat.value);
              const RatingIcon = ratingIcon.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center justify-between py-3 px-1"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${stat.baseBgColor}`}>
                      <Icon size={18} className={stat.baseColor} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {stat.label}
                    </span>
                  </div>
                  <RatingIcon size={20} className={ratingIcon.color} />
                </div>
              );
            }

            // For city stats, use modern card design
            return (
              <div
                key={stat.label}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <Icon size={20} className={stat.color} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {stat.label}
                      </h3>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className={`text-3xl font-bold ${stat.color}`}>
                          {stat.value}
                        </span>
                        <span className="text-sm text-gray-500 font-medium">
                          /10
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${stat.color.replace(
                      "text-",
                      "bg-"
                    )}`}
                    style={{ width: `${(stat.value / 10) * 100}%` }}
                  />
                </div>

                {/* Additional info for Cycling - only show when not viewing bike path */}
                {isCycling && city.name === "Calgary" && !bikePathStats && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bike Paths</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {bikePathsStats.count}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Total Distance
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {bikePathsStats.totalDistance} km
                      </span>
                    </div>
                  </div>
                )}

                {/* Coming soon badge for other stats - only for city stats */}
                {isComingSoon && !bikePathStats && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                      Coming soon
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {selectedBikePath && (
          <div className="mt-auto pt-6">
            <Button
              onClick={() => setIsRatingDialogOpen(true)}
              className="w-full"
              variant="default"
            >
              <Star size={16} />
              Rate This Bike Path
            </Button>
          </div>
        )}
      </div>

      {/* Bike Path Rating Dialog */}
      <BikePathRatingDialog
        isOpen={isRatingDialogOpen}
        onOpenChange={setIsRatingDialogOpen}
        pathInfo={selectedBikePath}
      />
    </div>
  );
}
