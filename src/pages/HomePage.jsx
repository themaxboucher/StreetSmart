import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Map } from "@/components/map";
import { Sidebar } from "@/components/Sidebar";
import { cities } from "@/constants/cities";

export function HomePage() {
  const [selectedCity, setSelectedCity] = useState(null);
  const navigate = useNavigate();

  const handleSelectCity = (city) => {
    setSelectedCity(city);
    // Navigate to the city detail page
    navigate(`/city/${city.name}`);
  };

  return (
    <div className="flex w-full h-full">
      <Sidebar onSelectCity={handleSelectCity} />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Map
          selectedCity={selectedCity}
          onSelectCity={handleSelectCity}
          cities={cities}
        />
      </div>
    </div>
  );
}
