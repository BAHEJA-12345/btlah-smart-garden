import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plant, PlantFilters } from "@/types/plant";
import PlantCard from "@/components/PlantCard";
import Pagination from "@/components/Pagination";
import FilterBar from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Recommendations() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<PlantFilters>({
    potSize: "",
    soilType: "",
    lightType: "",
    temperature: "",
    season: "",
  });

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    fetchPlants();
  }, [currentPage, filters]);

  const fetchPlants = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("plants")
        .select("*", { count: "exact" });

      // Apply filters
      if (filters.potSize) query = query.eq("pot_size", filters.potSize);
      if (filters.soilType) query = query.eq("soil_type", filters.soilType);
      if (filters.lightType) query = query.eq("light_type", filters.lightType);
      if (filters.temperature) query = query.eq("temperature", filters.temperature);
      if (filters.season) query = query.eq("season", filters.season);

      // Apply pagination
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      const { data, error, count } = await query
        .range(from, to)
        .order("name_ar");

      if (error) throw error;

      const transformedPlants: Plant[] = (data || []).map((plant) => ({
        id: plant.id,
        nameAr: plant.name_ar,
        season: plant.season,
        temperature: plant.temperature,
        waterMl: plant.water_ml,
        potSize: plant.pot_size,
        soilType: plant.soil_type,
        lightType: plant.light_type,
        benefit: plant.benefit,
      }));

      setPlants(transformedPlants);
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
    } catch (error) {
      console.error("Error fetching plants:", error);
      toast.error("Failed to load plants");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToMyPlants = (plantId: string) => {
    toast.success("Plant added to your collection!");
    // TODO: Implement actual add to my plants functionality
  };

  const handleFilterChange = (newFilters: PlantFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] p-6">
        <p className="text-center mt-10 text-[#7BAE7F]">Loading plants...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-6">
      <h1 className="text-4xl font-bold mb-6 text-[#7BAE7F]">🌿 Plant Recommendations</h1>
      
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />

      {plants.length === 0 ? (
        <p className="text-center mt-10 text-gray-600">No plants found matching your filters</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {plants.map((plant) => (
              <div key={plant.id} className="space-y-3">
                <PlantCard plant={plant} />
                <Button 
                  onClick={() => handleAddToMyPlants(plant.id)}
                  className="w-full bg-[#7BAE7F] hover:bg-[#6a9d70] text-white rounded-xl"
                >
                  Add to My Plants
                </Button>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
