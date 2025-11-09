import { Bike, Bus, Footprints } from "lucide-react";

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
        <div className="absolute inset-0 bg-radial from-black/40 to-transparent" />

        {/* City Title - Hidden on Hover */}
        <div className="absolute inset-0 flex flex-col justify-center items-center p-4 space-y-1 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
          <h3 className="text-2xl font-semibold text-white">{city.name}</h3>
          <p className="text-xs text-gray-200">{city.country}</p>
        </div>

        {/* Hover Overlay - Progress Bars */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-10">
          <div className="w-full max-w-xs space-y-4">
            {/* Cycling Score */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-white">
                  <Bike size={16} />
                  <span className="font-medium">Cycling</span>
                </div>
                <span className="text-white/80 font-semibold">
                  {city.cycling !== null ? `${city.cycling}/10` : "-"}
                </span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{
                    width:
                      city.cycling !== null
                        ? `${(city.cycling / 10) * 100}%`
                        : "0%",
                  }}
                />
              </div>
            </div>

            {/* Walkability Score */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-white">
                  <Footprints size={16} />
                  <span className="font-medium">Walkability</span>
                </div>
                <span className="text-white/80 font-semibold">
                  {city.walkability !== null ? `${city.walkability}/10` : "-"}
                </span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{
                    width:
                      city.walkability !== null
                        ? `${(city.walkability / 10) * 100}%`
                        : "0%",
                  }}
                />
              </div>
            </div>

            {/* Public Transport Score */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-white">
                  <Bus size={16} />
                  <span className="font-medium">Public Transport</span>
                </div>
                <span className="text-white/80 font-semibold">
                  {city.publicTransport !== null
                    ? `${city.publicTransport}/10`
                    : "-"}
                </span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{
                    width:
                      city.publicTransport !== null
                        ? `${(city.publicTransport / 10) * 100}%`
                        : "0%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
