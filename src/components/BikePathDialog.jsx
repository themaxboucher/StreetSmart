import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

// Helper component for rating display
function RatingBar({ value, max = 10 }) {
  const percentage = (value / max) * 100;
  const getColor = (val) => {
    if (val < 3) return "bg-red-400";
    if (val < 6) return "bg-yellow-400";
    return "bg-green-400";
  };

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor(value)} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-8">
        {value}/10
      </span>
    </div>
  );
}

export function BikePathDialog({ isOpen, onOpenChange, pathInfo }) {
  if (!pathInfo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0 overflow-hidden">
        <>
          {/* Image */}
          <img
            src="https://cdn.visitcalgary.com/containers/media/neighbourhoods/downtown/neighbourhood_downtown_memorial_drive_downtown_biking.jpg/861420d77bd2877b6e2f4877b3c288f5/neighbourhood_downtown_memorial_drive_downtown_biking.webp"
            alt="Bike lane"
            className="w-full h-40 object-cover"
          />

          {/* Content */}
          <div className="p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                {pathInfo.name || "Bike Path"}
              </DialogTitle>
              {pathInfo.description && (
                <DialogDescription className="text-xs text-gray-500 mt-1">
                  {pathInfo.description}
                </DialogDescription>
              )}
            </DialogHeader>

            <div className="space-y-3">
              {/* Distance */}
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Distance
                </span>
                <span className="text-sm text-gray-900 font-medium">
                  {pathInfo.distance?.toFixed(2)} km
                </span>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100 my-2" />

              {/* Scenery */}
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Scenery
                </span>
                <RatingBar value={pathInfo.scenery} />
              </div>

              {/* Safety */}
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Safety
                </span>
                <RatingBar value={pathInfo.safeness} />
              </div>

              {/* Connectivity */}
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Connectivity
                </span>
                <RatingBar value={pathInfo.connectivity} />
              </div>

              {/* Steepness */}
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Steepness
                </span>
                <RatingBar value={Math.round(pathInfo.steepness)} />
              </div>
            </div>
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
}
