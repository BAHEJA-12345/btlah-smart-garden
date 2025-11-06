import { useState, useMemo } from "react";
import { mockPlants } from "@/data/mockPlants";
import PlantCard from "@/components/PlantCard";
import { Heart } from "lucide-react";

const MyPlants = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favoritePlants");
    return saved ? JSON.parse(saved) : [];
  });

  const favoritePlants = useMemo(() => {
    return mockPlants
      .filter((plant) => favorites.includes(plant.id))
      .map((plant) => ({ ...plant, isFavorite: true }));
  }, [favorites]);

  const handleToggleFavorite = (id: string) => {
    const newFavorites = favorites.filter((fav) => fav !== id);
    setFavorites(newFavorites);
    localStorage.setItem("favoritePlants", JSON.stringify(newFavorites));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 text-primary fill-primary" />
            <h1 className="text-4xl font-bold text-foreground">My Plants</h1>
          </div>
          <p className="text-muted-foreground">Your collection of favorite plants</p>
        </div>

        {favoritePlants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoritePlants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} onToggleFavorite={handleToggleFavorite} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
            <p className="text-muted-foreground text-lg mb-4">You haven't added any favorite plants yet</p>
            <p className="text-sm text-muted-foreground">
              Browse plants and click the heart icon to add them to your collection
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPlants;
