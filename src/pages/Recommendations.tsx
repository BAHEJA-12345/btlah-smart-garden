import { useState, useMemo } from "react";
import { PlantFilters } from "@/types/plant";
import { mockPlants } from "@/data/mockPlants";
import FilterBar from "@/components/FilterBar";
import PlantCard from "@/components/PlantCard";
import Pagination from "@/components/Pagination";

const ITEMS_PER_PAGE = 20;

const Recommendations = () => {
  const [filters, setFilters] = useState<PlantFilters>({
    potSize: "",
    soilType: "",
    lightType: "",
    temperature: "",
    season: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favoritePlants");
    return saved ? JSON.parse(saved) : [];
  });

  const filteredPlants = useMemo(() => {
    return mockPlants.filter((plant) => {
      if (filters.potSize && plant.potSize !== filters.potSize) return false;
      if (filters.soilType && plant.soilType !== filters.soilType) return false;
      if (filters.lightType && plant.lightType !== filters.lightType) return false;
      if (filters.season && plant.season !== filters.season) return false;
      if (filters.temperature) {
        const [min, max] = filters.temperature.split("-").map(Number);
        const [plantMin, plantMax] = plant.temperature.split("-").map(Number);
        if (plantMin < min || plantMax > max) return false;
      }
      return true;
    });
  }, [filters]);

  const totalPages = Math.ceil(filteredPlants.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPlants = filteredPlants.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const plantsWithFavorites = paginatedPlants.map((plant) => ({
    ...plant,
    isFavorite: favorites.includes(plant.id),
  }));

  const handleToggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((fav) => fav !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem("favoritePlants", JSON.stringify(newFavorites));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">Smart Recommendations</h1>
          <p className="text-muted-foreground">
            Find the perfect plants for your space using our smart filters
          </p>
        </div>

        <FilterBar filters={filters} onFilterChange={setFilters} />

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredPlants.length)} of{" "}
            {filteredPlants.length} plants
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {plantsWithFavorites.map((plant) => (
              <PlantCard key={plant.id} plant={plant} onToggleFavorite={handleToggleFavorite} />
            ))}
          </div>

          {plantsWithFavorites.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No plants match your filters. Try adjusting them!</p>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
