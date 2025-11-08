import { MapPin } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2 py-2 px-4">
      <MapPin className="size-6 text-blue-500" />
      <h1 className="text-xl font-bold">StreetSmart</h1>
    </div>
  );
}
