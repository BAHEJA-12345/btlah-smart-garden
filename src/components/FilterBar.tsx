import { PlantFilters } from "@/types/plant";
import { filterOptions } from "@/data/mockPlants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterBarProps {
  filters: PlantFilters;
  onFilterChange: (filters: PlantFilters) => void;
}

const FilterBar = ({ filters, onFilterChange }: FilterBarProps) => {
  const handleFilterChange = (key: keyof PlantFilters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      potSize: "",
      soilType: "",
      lightType: "",
      temperature: "",
      season: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="bg-card rounded-xl p-6 shadow-card space-y-4 animate-slide-in">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Filter Plants</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
            <X className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Select value={filters.potSize} onValueChange={(value) => handleFilterChange("potSize", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Pot Size" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.potSizes.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.soilType} onValueChange={(value) => handleFilterChange("soilType", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Soil Type" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.soilTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.lightType} onValueChange={(value) => handleFilterChange("lightType", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Light Type" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.lightTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.temperature} onValueChange={(value) => handleFilterChange("temperature", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Temperature" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.temperatures.map((temp) => (
              <SelectItem key={temp} value={temp}>
                {temp}°C
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.season} onValueChange={(value) => handleFilterChange("season", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Season" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.seasons.map((season) => (
              <SelectItem key={season} value={season}>
                {season}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;
