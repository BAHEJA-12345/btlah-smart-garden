import { useState, useEffect } from "react";
import { benefits } from "@/data/mockPlants";
import PlantCard from "@/components/PlantCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plant } from "@/types/plant";
import { supabase } from "@/integrations/supabase/client";

const Benefits = () => {
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favoritePlants");
    return saved ? JSON.parse(saved) : [];
  });
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleBenefit = (benefit: string) => {
    setSelectedBenefits((prev) =>
      prev.includes(benefit) ? prev.filter((b) => b !== benefit) : [...prev, benefit]
    );
  };

  useEffect(() => {
    const fetchPlants = async () => {
      if (selectedBenefits.length === 0) {
        setPlants([]);
        return;
      }

      setLoading(true);
      try {
        let query = supabase.from('plants').select('*');
        
        // Filter by selected benefits
        selectedBenefits.forEach((benefit) => {
          query = query.ilike('benefit', `%${benefit}%`);
        });

        const { data, error } = await query;
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
      } catch (error) {
        console.error('Error fetching plants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, [selectedBenefits]);

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
          <h1 className="text-4xl font-bold text-foreground mb-2">Find Plants by Benefits</h1>
          <p className="text-muted-foreground">
            Select the benefits you're looking for and discover matching plants
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-card animate-slide-in">
          <h3 className="text-lg font-semibold text-foreground mb-4">Select Benefits</h3>
          <div className="flex flex-wrap gap-3">
            {benefits.map((benefit) => (
              <Button
                key={benefit}
                variant={selectedBenefits.includes(benefit) ? "default" : "outline"}
                onClick={() => toggleBenefit(benefit)}
                className={cn(
                  "rounded-full transition-all duration-200",
                  selectedBenefits.includes(benefit) && "shadow-lg"
                )}
              >
                {benefit}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading plants...</p>
          </div>
        ) : selectedBenefits.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Found {plants.length} plants with selected benefits
            </p>

            {plantsWithFavorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {plantsWithFavorites.map((plant) => (
                  <PlantCard key={plant.id} plant={plant} onToggleFavorite={handleToggleFavorite} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No plants found with the selected benefits
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Select one or more benefits above to see matching plants
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Benefits;