from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os, requests

load_dotenv()

app = Flask(__name__)
CORS(app)

cities = [
  {
    "name": "Calgary",
    "country": "Canada",
    "cycling": 5.2,
    "walkability": None,
    "publicTransport": None,
    "image": "https://images.unsplash.com/photo-1597288253816-54ea162cdf0d", # Unsplash Calgary
  },
  {
    "name": "Vancouver",
    "country": "Canada",
    "cycling": None,
    "walkability": None,
    "publicTransport": None,
    "image": "https://images.unsplash.com/photo-1560814304-4f05b62af116", # Unsplash Vancouver
  },
  {
    "name": "Montreal",
    "country": "Canada",
    "cycling": None,
    "walkability": None,
    "publicTransport": None,
    "image": "https://images.unsplash.com/photo-1547242651-45e06cae2491", # Unsplash Montreal
  },
  {
    "name": "Toronto",
    "country": "Canada",
    "cycling": None,
    "walkability": None,
    "publicTransport": None,
    "image": "https://images.unsplash.com/photo-1586576782138-19304c43d0e1", # Unsplash Toronto
  },
  {
    "name": "Edmonton",
    "country": "Canada",
    "cycling": None,
    "walkability": None,
    "publicTransport": None,
    "image": "https://images.unsplash.com/photo-1709014488957-bd321385b8a1", # Unsplash Edmonton
  }
]

OPENWEATHER_KEY = os.getenv("OPENWEATHER_KEY")

@app.route("/api/cities", methods=["GET"])
def send_cities():
    return jsonify(cities)

@app.route("/weather")
def get_weather_for_city():
    city = request.args.get("city")
    if not city:
        return jsonify({"error": "City name required"}), 400

    try:
        # Using OpenWeather's Geocoding API to get lat/lon off city name
        geo_url = (
            f"https://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={OPENWEATHER_KEY}"
        )
        geo_resp = requests.get(geo_url)
        geo_data = geo_resp.json()

        if not geo_data:
            return jsonify({"error": f"City {city} not found"}), 404
        
        lat = geo_data[0]["lat"]
        lon = geo_data[0]["lon"]

        # Using acquired geo data for the weather API call
        weather_url = (
            f"https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&appid={OPENWEATHER_KEY}&units=metric"
        )

        # Also get air pollution data
        air_url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={OPENWEATHER_KEY}"
        air_resp = requests.get(air_url)
        air_data = air_resp.json() if air_resp.ok else {}

        weather_resp = requests.get(weather_url)
        weather_data = weather_resp.json()

        # Parse data with fallbacks for different OpenWeather response shapes
        # Some endpoints (classic /weather) return top-level 'main' and 'weather'
        # One Call returns a 'current' object with similar fields.
        def safe_get(d, *keys, default=None):
            cur = d
            try:
                for k in keys:
                    cur = cur[k]
                return cur
            except Exception:
                return default

        # Temperature
        temperature = safe_get(weather_data, "main", "temp")
        if temperature is None:
            temperature = safe_get(weather_data, "current", "temp")

        # Format temperature to one decimal place if available
        if temperature is not None:
            try:
                temperature = round(float(temperature), 1)
            except Exception:
                # leave original value if it can't be parsed
                pass
            
        # Feels like
        feelslike = safe_get(weather_data, "main", "feels_like")
        if feelslike is None:
            feelslike = safe_get(weather_data, "current", "feels_like")

        # Description & icon
        description = safe_get(weather_data, "weather", 0, "description")
        icon = safe_get(weather_data, "weather", 0, "icon")
        if description is None:
            description = safe_get(weather_data, "current", "weather", 0, "description")
            icon = safe_get(weather_data, "current", "weather", 0, "icon")

        # Humidity
        humidity = safe_get(weather_data, "main", "humidity")
        if humidity is None:
            humidity = safe_get(weather_data, "current", "humidity")

        # Wind speed
        wind_speed = safe_get(weather_data, "wind", "speed")
        if wind_speed is None:
            wind_speed = safe_get(weather_data, "current", "wind_speed")

        # Air quality safe extraction
        air_entry = safe_get(air_data, "list", 0, default={})
        aq = safe_get(air_entry, "main", "aqi")
        components = safe_get(air_entry, "components", default={})

        result = {
            "city": city,
            "temperature": temperature,
            "feels_like": feelslike,
            "description": description.title() if isinstance(description, str) else None,
            "icon": icon,
            "humidity": humidity,
            "wind_speed": wind_speed,
            "air_quality": {
                "aqi": aq,
                "co": components.get("co"),
                "no2": components.get("no2"),
                "o3": components.get("o3"),
                "pm2_5": components.get("pm2_5"),
                "pm10": components.get("pm10"),
            }
        }

        return jsonify(result)
    except Exception as e:
        print("Error fetching weather: ", e)
        return jsonify({"error": "Weather data failed to fetch"}), 500
if __name__ == "__main__":
    app.run(port=7032, debug=True)