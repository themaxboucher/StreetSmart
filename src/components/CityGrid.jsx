import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button";

const cities = [
    { name: "Calgary", country: "Canada", safety: 8.9, inclusivity: 8.8, transport: 9.2 },
    { name: "Tokyo", country: "Japan", safety: 9.1, inclusivity: 8.7, transport: 9.5 },
    { name: "Vancouver", country: "Canada", safety: 8.4, inclusivity: 9.0, transport: 8.6 },
    { name: "Toronto", country: "Canada", safety: 7.2, inclusivity: 8.8, transport: 9.2 },
];

export default function CityGrid({onCitySelected}) {
    return (
    <div className="flex flex-col gap-4 p-4">
      {cities.map((city) => (
        <Card
          key={city.name}
          className="cursor-pointer hover:shadow-lg transition-all duration-200"
          onClick={() => onCitySelected?.(city)}
        >
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>{city.name}</span>
              <span className="text-sm text-muted-foreground">{city.country}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
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
            <Button variant="secondary" className="w-full mt-2">
              View Map
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
    );
}