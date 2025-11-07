import { Plant } from "@/types/plant";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Droplets, Thermometer, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlantCardProps {
  plant: Plant;
  onToggleFavorite?: (id: string) => void;
}

const PlantCard = ({ plant, onToggleFavorite }: PlantCardProps) => {
  return (
    <Card className="group overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white rounded-2xl border border-[#E8E3D9]">
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: "Arial" }}>
              {plant.nameAr}
            </h3>
            <p className="text-sm text-[#7BAE7F] font-medium">{plant.season}</p>
          </div>
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="icon"
              className="hover:scale-110 transition-transform"
              onClick={() => onToggleFavorite(plant.id)}
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-colors",
                  plant.isFavorite ? "fill-[#7BAE7F] text-[#7BAE7F]" : "text-gray-400"
                )}
              />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Thermometer className="h-4 w-4 text-[#7BAE7F]" />
            <span className="text-gray-600">{plant.temperature}°C</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Droplets className="h-4 w-4 text-[#7BAE7F]" />
            <span className="text-gray-600">{plant.waterMl}ml/day</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Sun className="h-4 w-4 text-[#7BAE7F]" />
            <span className="text-gray-600">{plant.lightType}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">🪴 {plant.potSize}</span>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-[#E8E3D9]">
          <div className="text-sm">
            <span className="font-medium text-gray-800">Soil:</span>
            <span className="ml-2 text-gray-600">{plant.soilType}</span>
          </div>
          <div className="inline-block">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#7BAE7F]/10 text-[#7BAE7F]">
              {plant.benefit}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PlantCard;
