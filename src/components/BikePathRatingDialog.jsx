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
import { Slider } from "./ui/slider";
import { Flower, Shield, Network, TrendingUp } from "lucide-react";

export function BikePathRatingDialog({ isOpen, onOpenChange, pathInfo }) {
  const [formData, setFormData] = useState({
    scenery: 5,
    safeness: 5,
    connectivity: 5,
    steepness: 5,
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
      scenery: 5,
      safeness: 5,
      connectivity: 5,
      steepness: 5,
    });
    onOpenChange(false);
  };

  const handleSliderChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value[0], // Slider returns array, take first value
    }));
  };

  const handleCancel = () => {
    setFormData({
      scenery: 5,
      safeness: 5,
      connectivity: 5,
      steepness: 5,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Bike Path Rating</DialogTitle>
          <DialogDescription>
            Rate this bike path on a scale of 1-10 for each category
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Scenery Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Flower size={16} className="text-gray-500" />
                Scenery
              </label>
              <span className="text-sm font-semibold text-gray-700 min-w-12 text-right">
                {formData.scenery.toFixed(1)}/10
              </span>
            </div>
            <Slider
              value={[formData.scenery]}
              onValueChange={(value) => handleSliderChange("scenery", value)}
              min={1}
              max={10}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Safety Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Shield size={16} className="text-gray-500" />
                Safety
              </label>
              <span className="text-sm font-semibold text-gray-700 min-w-12 text-right">
                {formData.safeness.toFixed(1)}/10
              </span>
            </div>
            <Slider
              value={[formData.safeness]}
              onValueChange={(value) => handleSliderChange("safeness", value)}
              min={1}
              max={10}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Connectivity Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Network size={16} className="text-gray-500" />
                Connectivity
              </label>
              <span className="text-sm font-semibold text-gray-700 min-w-12 text-right">
                {formData.connectivity.toFixed(1)}/10
              </span>
            </div>
            <Slider
              value={[formData.connectivity]}
              onValueChange={(value) =>
                handleSliderChange("connectivity", value)
              }
              min={1}
              max={10}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Steepness Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <TrendingUp size={16} className="text-gray-500" />
                Steepness
              </label>
              <span className="text-sm font-semibold text-gray-700 min-w-12 text-right">
                {formData.steepness.toFixed(1)}/10
              </span>
            </div>
            <Slider
              value={[formData.steepness]}
              onValueChange={(value) => handleSliderChange("steepness", value)}
              min={1}
              max={10}
              step={0.1}
              className="w-full"
            />
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
