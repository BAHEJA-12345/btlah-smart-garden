import React, { useEffect, useState } from "react";
import Papa from "papaparse";

interface Plant {
  Type: string;
  Growth_Season: string;
  Temperature_C: string;
  Pot_Size: string;
  Soil_Type: string;
  Light_Type: string;
  Water_ml_day: string;
  Benefit: string;
}

const Recommendations = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Papa.parse(
      "https://raw.githubusercontent.com/BAHEJA-12345/btlah-smart-garden/main/%D8%A8%D8%AA%D9%84%D9%87.csv",
      {
        download: true,
        header: true,
        complete: (results) => {
          setPlants(results.data as Plant[]);
          setLoading(false);
        },
      }
    );
  }, []);

  if (loading) return <p className="text-center text-green-700 mt-10">Loading plants...</p>;

  return (
    <div className="bg-[#f9f7f3] min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center text-[#2d2d2d] mb-8">🌿 Smart Plant Recommendations</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {plants.slice(0, 60).map((plant, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md border border-[#e6e2da] p-4 transition hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold text-[#2d2d2d] mb-2">{plant.Type}</h2>
            <p><strong>🌤️ Season:</strong> {plant.Growth_Season}</p>
            <p><strong>🌡️ Temp:</strong> {plant.Temperature_C}</p>
            <p><strong>💧 Water:</strong> {plant.Water_ml_day} ml/day</p>
            <p><strong>🪴 Pot:</strong> {plant.Pot_Size}</p>
            <p><strong>☀️ Light:</strong> {plant.Light_Type}</p>
            <p><strong>🌱 Soil:</strong> {plant.Soil_Type}</p>
            <p><strong>🌸 Benefit:</strong> {plant.Benefit}</p>
            <button className="bg-[#7BAE7F] text-white rounded-lg px-4 py-2 mt-3 hover:bg-[#689b6c] transition">
              + Add to My Plants
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
