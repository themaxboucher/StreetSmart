import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button";

// example city data
const cities = [
  {
    name: "Calgary",
    country: "Canada",
    safety: 9.1,
    inclusivity: 8.7,
    transport: 9.5,
    image: "https://images.unsplash.com/photo-1597288253816-54ea162cdf0d", // Unsplash Calgary
  },
  {
    name: "Vancouver",
    country: "Canada",
    safety: 8.4,
    inclusivity: 9.0,
    transport: 8.6,
    image: "https://images.unsplash.com/photo-1560814304-4f05b62af116", // Unsplash Vancouver
  },
  {
    name: "Montreal",
    country: "Canada",
    safety: 8.9,
    inclusivity: 8.8,
    transport: 9.2,
    image: "https://images.unsplash.com/photo-1547242651-45e06cae2491", // Unsplash Montreal
  },
  {
    name: "Toronto",
    country: "Canada",
    safety: 8.9,
    inclusivity: 8.8,
    transport: 9.2,
    image: "https://images.unsplash.com/photo-1586576782138-19304c43d0e1", // Unsplash Toronto
  },
  {
    name: "Edmonton",
    country: "Canada",
    safety: 8.9,
    inclusivity: 8.8,
    transport: 9.2,
    image: "https://images.unsplash.com/photo-1709014488957-bd321385b8a1", // Unsplash Edmonton
  }
];

export default function CityGrid({onCitySelected}) {
    return (
    <div className="flex flex-col gap-4 p-4">
      {cities.map((city) => (
        <Card
          key={city.name}
          className="group w-full cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
          onClick={() => onCitySelected?.(city)}
        >
        {/* Background image */}
        <div
            className="relative h-60 bg-cover bg-center"
            style={{
              backgroundImage: `url(${city.image})`,
            }}
        >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div
  className="absolute bottom-0 left-0 p-3 text-white transform group-hover:-translate-y-35 transition-transform duration-300"
>
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
            <Button variant="secondary" className="w-full mt-2">
              View Map
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
    );
}