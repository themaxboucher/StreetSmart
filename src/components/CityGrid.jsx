import {useEffect, useState} from "react";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Bike, Bus, Footprints } from "lucide-react";

export default function CityGrid({onSelectCity}) {
    const [cities, setCities] = useState([]);

    useEffect(() => {
        fetch("http://localhost:7032/api/cities")
        .then((res) => res.json())
        .then((data) => setCities(data))
        .catch((err) => console.error("Error fetching cities: ", err));
    }, []);

    return (
    <div className="flex flex-col gap-4 p-4">
      {cities.map((city) => (
        <Card
          key={city.name}
          className="group relative w-full cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
          onClick={() => onSelectCity?.(city)}
        >
        {/* Background image */}
        <div
            className="relative h-70 bg-cover bg-center"
            style={{
              backgroundImage: `url(${city.image})`,
            }}
        >
        {/* Overlay */}
        <CardTitle className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-3 text-white transform group-hover:-translate-y-45 
                            transition-transform duration-300">
                <h3 className="text-xl font-bold">{city.name}</h3>
                <p className="text-sm text-gray-200">{city.country}</p>
            </div>
        </div>
        {/* Sliding Panel */}
          <CardContent className="absolute bottom-0 left-0 
                                w-full bg-white rounded-t-xl p-4 transform translate-y-full 
                                group-hover:translate-y-0 transition-transform duration-300 
                                ease-out shadow-inner">
            <div className="w-full space-y-4">
              {/* Cycling Score */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Bike size={16} />
                    <span className="font-medium">Cycling</span>
                  </div>
                  <span className="text-gray-600 font-semibold">
                    {city.cycling !== null ? `${city.cycling}/10` : "Coming Soon"}
                  </span>
                </div>
                {city.cycling !== null && (
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${(city.cycling / 10) * 100}%`,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Walkability Score */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Footprints size={16} />
                    <span className="font-medium">Walkability</span>
                  </div>
                  <span className="text-gray-600 font-semibold">
                    {city.walkability !== null ? `${city.walkability}/10` : "Coming Soon"}
                  </span>
                </div>
                {city.walkability !== null && (
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${(city.walkability / 10) * 100}%`,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Public Transport Score */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Bus size={16} />
                    <span className="font-medium">Public Transport</span>
                  </div>
                  <span className="text-gray-600 font-semibold">
                    {city.publicTransport !== null ? `${city.publicTransport}/10` : "Coming Soon"}
                  </span>
                </div>
                {city.publicTransport !== null && (
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${(city.publicTransport / 10) * 100}%`,
                      }}
                    />
                  </div>
                )}
                </div>
              </div>
              <Button variant="secondary" className="w-full mt-4" onClick={() => onSelectCity?.(city)}>
                View Map
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }