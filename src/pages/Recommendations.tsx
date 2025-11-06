import { useState, useEffect } from "react";
import { PlantFilters, Plant } from "@/types/plant";
import FilterBar from "@/components/FilterBar";
import PlantCard from "@/components/PlantCard";
import Pagination from "@/components/Pagination";
import { supabase } from "@/integrations/supabase/client";

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
  const [plants, setPlants] = useState<Plant[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true);
      try {
        let query = supabase.from('plants').select('*', { count: 'exact' });

        // Apply filters
        if (filters.potSize) query = query.ilike('pot_size', `%${filters.potSize}%`);
        if (filters.soilType) query = query.ilike('soil_type', `%${filters.soilType}%`);
        if (filters.lightType) query = query.ilike('light_type', `%${filters.lightType}%`);
        if (filters.season) query = query.ilike('season', `%${filters.season}%`);
        if (filters.temperature) query = query.ilike('temperature', `%${filters.temperature}%`);

        // Pagination
        const from = (currentPage - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) throw error;

        const formattedPlants: Plant[] = (data || []).map((p: any) => ({
          id: p.id,
          nameAr: p.name_ar,
          season: p.season,
          temperature: p.temperature,
          waterMl: p.water_ml,
          potSize: p.pot_size,
          soilType: p.soil_type,
          lightType: p.light_type,
          benefit: p.benefit,
        }));

        setPlants(formattedPlants);
        setTotalCount(count || 0);
      } catch (error) {
        console.error('Error fetching plants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, [filters, currentPage]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const plantsWithFavorites = plants.map((plant) => ({
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

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading plants...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, totalCount)} of{" "}
                {totalCount} plants
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
          </>
        )}
      </div>
    </div>
  );
};

export default Recommendations;