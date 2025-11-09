import {useEffect, useState} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button";

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
            className="relative h-60 bg-cover bg-center"
            style={{
              backgroundImage: `url(${city.image})`,
            }}
        >
        {/* Overlay */}
        <CardTitle className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-3 text-white transform group-hover:-translate-y-35 
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
            <div className="space-y-1 text-gray-800 text-sm">
            <div className="flex justify-between">
              <span>Safety</span>
              <span>{city.safety}</span>
            </div>
            <div className="flex justify-between">
              <span>Inclusivity</span>
              <span>{city.inclusivity}</span>
            </div>
            <div className="flex justify-between">
              <span>Transport</span>
              <span>{city.transport}</span>
            </div>
            </div>
            <Button variant="secondary" className="w-full mt-2" onClick={() => onSelectCity?.(city)}>
              View Map
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
    );
}