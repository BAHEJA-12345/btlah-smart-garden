import { useEffect, useState } from "react";
import Papa from "papaparse";

interface Plant {
  Type: string;
  "water- liters.day": string;
  Growth_Season: string;
  Temperature_C: string;
  Pot_Size: string;
  Light_Type: string;
  Soil_Type: string;
  Growth_Requirements: string;
  Care_Instructions: string;
  Benefit: string;
  image: string;
}

export default function Recommendations() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const csvUrl =
      "https://raw.githubusercontent.com/BAHEJA-12345/btlah-smart-garden/refs/heads/main/%D8%A8%D8%AA%D9%84%D9%87%20(2).csv";

    Papa.parse(csvUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        console.log("✅ CSV Loaded:", result.data);
        setPlants(result.data as Plant[]);
        setLoading(false);
      },
      error: (error) => {
        console.error("❌ CSV Error:", error);
        setLoading(false);
      },
    });
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading plants...</p>;
  }

  if (plants.length === 0) {
    return <p className="text-center mt-10">No plants found 😢</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-green-800">🌿 All Plants</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {plants.map((plant, index) => (
          <div
            key={index}
            className="border rounded-xl p-4 shadow-sm hover:shadow-md bg-white"
          >
            {plant.image && (
              <img
                src={plant.image}
                alt={plant.Type}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            )}
            <h2 className="text-xl font-semibold">{plant.Type}</h2>
            <p className="text-sm text-gray-600">{plant.Benefit}</p>
            <p className="text-sm mt-2">
              💧 Water: {plant["water- liters.day"]} L/day
            </p>
            <p className="text-sm">🌡 Temp: {plant.Temperature_C}°C</p>
            <p className="text-sm">🪴 Pot: {plant.Pot_Size}</p>
            <p className="text-sm">☀️ Light: {plant.Light_Type}</p>
            <p className="text-sm">🌱 Soil: {plant.Soil_Type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
