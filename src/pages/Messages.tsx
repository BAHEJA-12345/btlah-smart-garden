import { useMemo } from "react";
import { mockPlants } from "@/data/mockPlants";
import { Card } from "@/components/ui/card";
import { Droplets, Clock } from "lucide-react";
import { useState } from "react";

const Messages = () => {
  const [favorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favoritePlants");
    return saved ? JSON.parse(saved) : [];
  });

  const wateringReminders = useMemo(() => {
    return mockPlants
      .filter((plant) => favorites.includes(plant.id))
      .map((plant) => ({
        ...plant,
        nextWatering: "Today",
        time: "09:00 AM",
      }));
  }, [favorites]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <Droplets className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Watering Reminders</h1>
          </div>
          <p className="text-muted-foreground">Daily care reminders for your favorite plants</p>
        </div>

        {wateringReminders.length > 0 ? (
          <div className="space-y-4">
            {wateringReminders.map((plant) => (
              <Card
                key={plant.id}
                className="p-6 shadow-card hover:shadow-xl transition-all duration-300 animate-fade-in"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Droplets className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "Arial" }}>
                        {plant.nameAr}
                      </h3>
                    </div>
                    <p className="text-muted-foreground mb-3">
                      Water with {plant.waterMl}ml today
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{plant.time}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {plant.nextWatering}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Droplets className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
            <p className="text-muted-foreground text-lg mb-4">No watering reminders yet</p>
            <p className="text-sm text-muted-foreground">
              Add plants to your favorites to receive daily care reminders
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
