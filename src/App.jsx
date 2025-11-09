import React, { useState } from "react";
import CityGrid from "./components/CityGrid";
import WeatherPanel from "./components/WeatherPanel";

function App() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  const handleViewMap = async (cityName) => {
    try {
      const response = await fetch(`http://127.0.0.1:7032/weather?city=${cityName}`);
      const data = await response.json();
      setWeatherData(data);
      setSelectedCity(cityName);
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto shadow-lg">
        <h2 className="text-2xl font-bold p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          Cities
        </h2>
  <CityGrid onSelectCity={handleViewMap} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50">
        {selectedCity ? (
          <div>
            <h1 className="text-3xl font-bold mb-4">{selectedCity}</h1>
            <div className="h-96 w-full rounded-lg bg-gray-200 flex items-center justify-center">
              Map & AI overview go here
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            replace with actual map
          </div>
        )}

        {/* Weather Panel */}
        <WeatherPanel weather={weatherData} />
      </div>
    </div>
  );
}

export default App;
