from flask import Flask, jsonify
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
    "safety": 9.1,
    "inclusivity": 8.7,
    "transport": 9.5,
    "image": "https://images.unsplash.com/photo-1597288253816-54ea162cdf0d", # Unsplash Calgary
  },
  {
    "name": "Vancouver",
    "country": "Canada",
    "safety": 8.4,
    "inclusivity": 9.0,
    "transport": 8.6,
    "image": "https://images.unsplash.com/photo-1560814304-4f05b62af116", # Unsplash Vancouver
  },
  {
    "name": "Montreal",
    "country": "Canada",
    "safety": 8.9,
    "inclusivity": 8.8,
    "transport": 9.2,
    "image": "https://images.unsplash.com/photo-1547242651-45e06cae2491", # Unsplash Montreal
  },
  {
    "name": "Toronto",
    "country": "Canada",
    "safety": 8.9,
    "inclusivity": 8.8,
    "transport": 9.2,
    "image": "https://images.unsplash.com/photo-1586576782138-19304c43d0e1", # Unsplash Toronto
  },
  {
    "name": "Edmonton",
    "country": "Canada",
    "safety": 8.9,
    "inclusivity": 8.8,
    "transport": 9.2,
    "image": "https://images.unsplash.com/photo-1709014488957-bd321385b8a1", # Unsplash Edmonton
  }
]

OPENWEATHER_KEY = os.getenv("OPENWEATHER_KEY")

@app.route("/api/cities", methods=["GET"])
def send_cities():
    return jsonify(cities)

@app.route("/api/weather/<city>")
def get_weather_for_city(city):
    # cityData = next((city for city in cities if city["name"].lower() == city.lower()), None)
    # if not cityData:
    #     return jsonify({"error": "City not found"}), 404
    
    try:
        # Using OpenWeather's Geocoding API to get lat/lon off city name
        geo_url = (
            f"http://api.openweathermap.org/geo/1.0/direct?q={city},124&limit=1&appid={OPENWEATHER_KEY}"
        )
        geo_resp = requests.get(geo_url)
        geo_data = geo_resp.json()

        if not geo_data:
            return jsonify({"error": f"City {city} not found"}), 404
        
        lat = geo_data[0]["lat"]
        lon = geo_data[0]["lon"]

        # Using acquired geo data for the weather API call
        weather_url = (
            f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_KEY}"
        )
        weather_resp = requests.get(weather_url)
        weather_data = weather_resp.json()

        # Parse data
        result = {
            "city": city,
            "temperature": weather_data["main"]["temp"],
            "description": weather_data["weather"][0]["description"].title(),
            "icon": weather_data["weather"][0]["icon"],
            "humidity": weather_data["main"]["humidity"],
            "wind_speed": weather_data["wind"]["speed"],
        }

        return jsonify(result)
    except Exception as e:
        print("Error fetching weather: ", e)
        return jsonify({"error": "Weather data failed to fetch"}), 500
if __name__ == "__main__":
    app.run(port=7032, debug=True)