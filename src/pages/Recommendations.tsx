import React, { useEffect, useState } from "react";
import Papa from "papaparse";

interface Plant {
  Type: string;
  Water_ml_day: string;
  Growth_Season: string;
  Temperature_C: string;
  Pot_Size: string;
  Light_Type: string;
  Soil_Type: string;
  Growth_Require: string;
  Care_Instruction: string;
  Water_ml_Notif: string;
  Growth_Tracker: string;
  Benefit: string;
}

const Recommendations: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔄 Fetching CSV file...");
    Papa.parse("/بتله.csv", {
      download: true,
      header: true,
      complete: (results) => {
        console.log("✅ CSV loaded successfully:", results.data.length, "plants");
        setPlants(results.data as Plant[]);
        setLoading(false);
      },
      error: (error) => {
        console.error("❌ Error loading CSV:", error);
        setLoading(false);
      },
    });
  }, []);

  if (loading) {
    return (
      <div className="text-center text-green-700 text-lg mt-10">
        Loading plants...
      </div>
    );
  }

  if (plants.length === 0) {
    return (
      <div className="text-center text-gray-600 text-lg mt-10">
        No plants found 😢
      </div>
    );
  }

  return (
    <div className="bg-[#f9f7f3] min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center text-[#7BAE7F] mb-6">
        🌿 Smart Plant Recommendations
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {plants.slice(0, 1000).map((plant, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-4 border border-[#e3e1da] hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-[#7BAE7F] mb-2">
              {plant.Type}
            </h2>
            <p><strong>🌸 Season:</strong> {plant.Growth_Season}</p>
            <p><strong>🌡️ Temp:</strong> {plant.Temperature_C} °C</p>
            <p><strong>💧 Water/day:</strong> {plant.Water_ml_day} ml</p>
            <p><strong>🪴 Pot:</strong> {plant.Pot_Size}</p>
            <p><strong>☀️ Light:</strong> {plant.Light_Type}</p>
            <p><strong>🌱 Soil:</strong> {plant.Soil_Type}</p>
            <p><strong>🌿 Benefit:</strong> {plant.Benefit}</p>

            <button className="mt-3 w-full bg-[#7BAE7F] text-white py-2 rounded-xl font-medium hover:bg-[#6fa673] transition">
              + Add to My Plants
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
