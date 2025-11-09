import { Button } from "@/components/ui/button";
import { ChevronLeft, Bike, Bus, Footprints } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CityStats({ city }) {
  const navigate = useNavigate();

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
        <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
          Scores
        </h3>

        <div className="space-y-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
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
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{city.name}</span> is
            a great city for sustainable urban mobility. Check out the bike
            paths on the map to explore the cycling infrastructure!
          </p>
        </div>
      </div>
    </div>
  );
}
