import { Button } from "@/components/ui/button";
import { MapPin, Zap, Bike, Bus, Footprints } from "lucide-react";

export function CityCard({ city, onSelectCity }) {
  return (
    <div
      className="group relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100 bg-white"
      onClick={() => onSelectCity?.(city)}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-200">
        <img
          src={city.image}
          alt={city.name}
          className="w-full h-full object-cover transition-transform duration-300"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/20 to-transparent" />

        {/* City Title - Always Visible */}
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          <h3 className="text-lg font-semibold text-white">{city.name}</h3>
          <p className="text-xs text-gray-200">{city.country}</p>
        </div>

        {/* Hover Overlay - Stats and Button */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2 text-center">
              <Bike size={16} className="text-white mx-auto mb-1" />
              <p className="text-xs text-white/80 font-medium">Cycling</p>
              <p className="text-lg font-bold text-white">{city.cycling}</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2 text-center">
              <Bus size={16} className="text-white mx-auto mb-1" />
              <p className="text-xs text-white/80 font-medium">Transit</p>
              <p className="text-lg font-bold text-white">
                {city.publicTransport}
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2 text-center">
              <Footprints size={16} className="text-white mx-auto mb-1" />
              <p className="text-xs text-white/80 font-medium">Walkable</p>
              <p className="text-lg font-bold text-white">{city.walkability}</p>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onSelectCity?.(city);
            }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Zap size={16} />
            View on Map
          </Button>
        </div>
      </div>
    </div>
  );
}
