import { CityCard } from "./CityCard";
import { cities } from "@/constants/cities";

export function Sidebar({ onSelectCity }) {
  return (
    <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto shadow-lg scrollbar-hide">
      <div className="flex flex-col gap-4 p-4">
        {cities.map((city) => (
          <CityCard key={city.name} city={city} onSelectCity={onSelectCity} />
        ))}
      </div>
    </div>
  );
}
