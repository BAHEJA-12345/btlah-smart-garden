import React, { useEffect, useState } from "react";
import Papa from "papaparse";

interface Plant {
  Type: string;
  Growth_Season: string;
  Temperature_C: string;
  Water_ml_day: string;
  Pot_Size: string;
  Light_Type: string;
  Soil_Type: string;
  Benefit: string;
}

const Recommendations = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("📦 Starting to load plants from CSV...");
    Papa.parse("/بتله.csv", {
      download: true,
      header: true,
      complete: (results) => {
        console.log("✅ CSV loaded successfully:", results.data.length, "plants found");
        setPlants(results.data as Plant[]);
        setLoading(false);
      },
      error: (error) => {
        console.error("❌ Error loading CSV file:", error);
        setLoading(false);
      },
    });
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-20 text-green-700 font-semibold text-lg">
        Loading plants...
      </div>
    );
  }

  if (!plants.length) {
    return (
      <div className="text-center mt-20 text-red-600 font-semibold text-lg">
        ⚠️ No plants found. Please check that بتله.csv is inside /public
      </div>
    );
  }

  return (
    <div className="bg-[#f9f7f3] min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-800">
        🌿 Plant Recommendations
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plants.slice(0, 1000).map((plant, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-4 border border-green-100 hover:shadow-lg transition-all"
          >
            <h2 className="text-xl font-semibold text-green-800 mb-2">{plant.Type}</h2>
            <p><strong>🌤 Season:</strong> {plant.Growth_Season}</p>
            <p><strong>🌡 Temp:</strong> {plant.Temperature_C} °C</p>
            <p><strong>💧 Water:</strong> {plant.Water_ml_day} ml/day</p>
            <p><strong>🪴 Pot:</strong> {plant.Pot_Size_

