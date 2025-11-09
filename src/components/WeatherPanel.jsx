import { useState, useEffect } from 'react';

// Cache weather data for 5 minutes
const weatherCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export function WeatherPanel({ city }) {
  const [weather, setWeather] = useState(null);
  
  useEffect(() => {
    if (!city) return;
    
    const abortController = new AbortController();
    const cityKey = city.name.toLowerCase();
    
    const fetchWeather = async () => {
      // Check cache first
      const cached = weatherCache.get(cityKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setWeather(cached.data);
        return;
      }
      
      try {
        const res = await fetch(
          `http://localhost:7032/weather?city=${encodeURIComponent(city.name)}`,
          { signal: abortController.signal }
        );
        const data = await res.json();
        
        if (!data.error) {
          // Update cache and state
          weatherCache.set(cityKey, { data, timestamp: Date.now() });
          if (!abortController.signal.aborted) {
            setWeather(data);
          }
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching weather:', error);
        }
      }
    };
    
    fetchWeather();
    
    // Cleanup function to abort in-flight requests
    return () => abortController.abort();
  }, [city]);

  if (!weather) return null;

  const aqiLevels = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
  const aqi = weather.air_quality?.aqi || 0;

  return (
    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-4 w-72 border border-gray-200 z-50 animate-slideIn">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{weather.city}</h3>
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt="weather icon"
          className="w-10 h-10"
        />
      </div>

      <p className="text-sm text-gray-600 capitalize">{weather.condition}</p>
      <p className="text-xl font-bold mt-1">{weather.temperature}°C</p>

      <div className="mt-2 text-xs text-gray-500 space-y-1">
        <p>Feels like: {weather.feels_like}°C</p>
        <p>Humidity: {weather.humidity}%</p>
        <p>Wind: {weather.wind_speed} m/s</p>
      </div>

      {/* Air Quality */}
      <div className="mt-4 border-t border-gray-200 pt-2">
        <h4 className="text-sm font-semibold text-gray-700 mb-1">Air Quality</h4>
        <p className="text-sm">
          AQI: <span className="font-medium">{aqi}</span> ({aqiLevels[aqi - 1]})
        </p>
        <div className="grid grid-cols-2 gap-x-2 text-xs text-gray-600 mt-1">
          <p>CO: {weather.air_quality.co}</p>
          <p>NO₂: {weather.air_quality.no2}</p>
          <p>O₃: {weather.air_quality.o3}</p>
          <p>PM2.5: {weather.air_quality.pm2_5}</p>
          <p>PM10: {weather.air_quality.pm10}</p>
        </div>
      </div>
    </div>
  );
}
