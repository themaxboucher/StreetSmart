import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Map } from "@/components/map";
import { CityStats } from "@/components/CityStats";
import { cities } from "@/constants/cities";
import { WeatherPanel } from "@/components/WeatherPanel";

export function CityDetail() {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const [selectedBikePath, setSelectedBikePath] = useState(null);

  const selectedCity = useMemo(
    () =>
      cities.find(
        (city) => city.name.toLowerCase() === cityName?.toLowerCase()
      ),
    [cityName]
  );

  if (!selectedCity) {
    return (
      <div className="flex items-center justify-center flex-1 bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            City not found
          </h1>
          <p className="text-gray-600 mb-4">
            The city you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleCitySelect = (city) => {
    navigate(`/city/${city.name}`);
    setSelectedBikePath(null); // Clear selected bike path when changing cities
  };

  const handleBikePathSelect = (bikePath) => {
    setSelectedBikePath(bikePath);
  };

  return (
    <div className="flex w-full h-full">
      <CityStats
        city={selectedCity}
        selectedBikePath={selectedBikePath}
        onClearBikePath={() => setSelectedBikePath(null)}
      />

      {/* Map */}
      <div className="flex-1 overflow-hidden">
        <Map
          selectedCity={selectedCity}
          onSelectCity={handleCitySelect}
          cities={cities}
          showBikePathsByDefault={true}
          showMarkers={false}
          onBikePathSelect={handleBikePathSelect}
          onClearBikePath={() => setSelectedBikePath(null)}
          selectedBikePath={selectedBikePath}
        />
      </div>
      {/* Weather panel overlay when on the city detail page */}
      {selectedCity && <WeatherPanel city={selectedCity} />}
    </div>
  );
}
