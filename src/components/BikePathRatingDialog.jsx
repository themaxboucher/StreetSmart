import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  Flower,
  Car,
  Network,
  TrendingUp,
  Smile,
  Annoyed,
  Angry,
} from "lucide-react";

const RATING_OPTIONS = ["bad", "ok", "good"];

// Get icon for rating option
function getRatingIcon(option) {
  switch (option) {
    case "good":
      return Smile;
    case "ok":
      return Annoyed;
    case "bad":
      return Angry;
    default:
      return Smile;
  }
}

// Get color for rating option
function getRatingColor(option) {
  switch (option) {
    case "good":
      return "text-green-600";
    case "ok":
      return "text-yellow-600";
    case "bad":
      return "text-red-600";
    default:
      return "text-gray-400";
  }
}

export function BikePathRatingDialog({ isOpen, onOpenChange, pathInfo }) {
  const [formData, setFormData] = useState({
    scenery: null,
    nearbyTraffic: null,
    connectivity: null,
    incline: null,
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form submission:", {
      pathId: pathInfo?.id,
      pathName: pathInfo?.name,
      ...formData,
    });
    // Reset form and close dialog
    setFormData({
      scenery: null,
      nearbyTraffic: null,
      connectivity: null,
      incline: null,
    });
    onOpenChange(false);
  };

  const handleRatingChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = () => {
    setFormData({
      scenery: null,
      nearbyTraffic: null,
      connectivity: null,
      incline: null,
    });
    onOpenChange(false);
  };

  const getRatingButtonClassName = (field, option) => {
    const isSelected = formData[field] === option;
    const baseClasses = "flex-1 flex items-center justify-center";

    if (!isSelected) {
      return `${baseClasses} border-gray-300`;
    }

    switch (option) {
      case "good":
        return `${baseClasses} bg-green-500 hover:bg-green-600 text-white border-green-500`;
      case "ok":
        return `${baseClasses} bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500`;
      case "bad":
        return `${baseClasses} bg-red-500 hover:bg-red-600 text-white border-red-500`;
      default:
        return baseClasses;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Bike Path Rating</DialogTitle>
          <DialogDescription>
            Rate this bike path for each category
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Scenery Rating */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Flower size={16} className="text-gray-500" />
              Scenery
            </label>
            <div className="flex gap-2">
              {RATING_OPTIONS.map((option) => {
                const RatingIcon = getRatingIcon(option);
                const isSelected = formData.scenery === option;
                return (
                  <Button
                    key={option}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => handleRatingChange("scenery", option)}
                    className={getRatingButtonClassName("scenery", option)}
                    title={option}
                  >
                    <RatingIcon
                      size={20}
                      className={
                        isSelected ? "text-white" : getRatingColor(option)
                      }
                    />
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Nearby Traffic Rating */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Car size={16} className="text-gray-500" />
              Nearby Traffic
            </label>
            <div className="flex gap-2">
              {RATING_OPTIONS.map((option) => {
                const RatingIcon = getRatingIcon(option);
                const isSelected = formData.nearbyTraffic === option;
                return (
                  <Button
                    key={option}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => handleRatingChange("nearbyTraffic", option)}
                    className={getRatingButtonClassName(
                      "nearbyTraffic",
                      option
                    )}
                    title={option}
                  >
                    <RatingIcon
                      size={20}
                      className={
                        isSelected ? "text-white" : getRatingColor(option)
                      }
                    />
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Connectivity Rating */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Network size={16} className="text-gray-500" />
              Connectivity
            </label>
            <div className="flex gap-2">
              {RATING_OPTIONS.map((option) => {
                const RatingIcon = getRatingIcon(option);
                const isSelected = formData.connectivity === option;
                return (
                  <Button
                    key={option}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => handleRatingChange("connectivity", option)}
                    className={getRatingButtonClassName("connectivity", option)}
                    title={option}
                  >
                    <RatingIcon
                      size={20}
                      className={
                        isSelected ? "text-white" : getRatingColor(option)
                      }
                    />
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Incline Rating */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <TrendingUp size={16} className="text-gray-500" />
              Incline
            </label>
            <div className="flex gap-2">
              {RATING_OPTIONS.map((option) => {
                const RatingIcon = getRatingIcon(option);
                const isSelected = formData.incline === option;
                return (
                  <Button
                    key={option}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => handleRatingChange("incline", option)}
                    className={getRatingButtonClassName("incline", option)}
                    title={option}
                  >
                    <RatingIcon
                      size={20}
                      className={
                        isSelected ? "text-white" : getRatingColor(option)
                      }
                    />
                  </Button>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Submit Rating</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
