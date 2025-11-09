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

@app.route("/api/cities", methods=["GET"])
def send_cities():
    return jsonify(cities)

if __name__ == "__main__":
    app.run(port=7032, debug=True)