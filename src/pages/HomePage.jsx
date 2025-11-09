import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Map } from "@/components/map";
import CityGrid from "@/components/CityGrid";
import { WeatherPanel } from "@/components/WeatherPanel";
import { cities as CITIES } from "@/constants/cities";

export function HomePage() {
  const [selectedCity, setSelectedCity] = useState(null);
  const navigate = useNavigate();

  const handleSelectCity = (city) => {
    // Ensure we have lat/lng; if not, try to resolve from local constants
    let resolved = city;
    if (city && (city.lat === undefined || city.lng === undefined)) {
      const local = CITIES.find((c) => c.name === city.name);
      if (local) {
        resolved = { ...local, ...city };
      }
    }

    // Set selected city but DO NOT navigate — keeping user on HomePage
    // so the WeatherPanel and map remain visible.
    setSelectedCity(resolved);
  };

  // Separate action to navigate to city detail when required
  const goToCityDetail = (city) => {
    if (city && city.name) navigate(`/city/${city.name}`);
  };

  return (
    <div className="flex w-full h-full">
      <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto shadow-lg">
  <CityGrid onSelectCity={(city) => { handleSelectCity(city); goToCityDetail(city); }} />
        {selectedCity && <WeatherPanel city={selectedCity} />}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Map
          selectedCity={selectedCity}
          onSelectCity={handleSelectCity}
          cities={CITIES}
        />
      </div>
    </div>
  );
}
