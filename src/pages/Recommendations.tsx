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
  Benefit: string;
}

const Recommendations: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const plantsPerPage = 50; // عدد النباتات في الصفحة

  useEffect(() => {
    Papa.parse("/بتله.csv", {
      download: true,
      header: true,
      complete: (results) => {
        setPlants(results.data as Plant[]);
        setLoading(false);
      },
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-green-700 text-lg">
        Loading plants...
      </div>
    );
  }

  // تقسيم الصفحات
  const indexOfLastPlant = currentPage * plantsPerPage;
  const indexOfFirstPlant = indexOfLastPlant - plantsPerPage;
  const currentPlants = plants.slice(indexOfFirstPlant, indexOfLastPlant);

  const totalPages = Math.ceil(plants.length / plantsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="bg-[#f9f7f3] min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center text-[#3a3a3a] mb-6">
        🌿 Smart Plant Recommendations
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentPlants.map((plant, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
          >
            <h2 className="text-xl font-semibold text-[#2f4f4f] mb-2 text-center">
              {plant.Type}
            </h2>
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <strong>🌱 Season:</strong> {plant.Growth_Season}
              </p>
              <p>
                <strong>🌡️ Temp:</strong> {plant.Temperature_C}°C
              </p>
              <p>
                <strong>💧 Water/day:</strong> {plant.Water_ml_day} ml
              </p>
              <p>
                <strong>🪴 Pot Size:</strong> {plant.Pot_Size}
              </p>
              <p>
                <strong>☀️ Light:</strong> {plant.Light_Type}
              </p>
              <p>
                <strong>🌍 Soil:</strong> {plant.Soil_Type}
              </p>
              <p>
                <strong>🌸 Benefit:</strong> {plant.Benefit}
              </p>
            </div>

            <button className="mt-3 w-full bg-[#7BAE7F] text-white py-2 rounded-xl hover:bg-[#6da672] transition">
              + Add to My Plants
            </button>
          </div>
        ))}
      </div>

      {/* أزرار الصفحات */}
      <div className="flex justify-center items-center gap-4 mt-10">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="bg-[#e5e3df] text-[#333] px-4 py-2 rounded-lg hover:bg-[#d7d5d0] disabled:opacity-50"
        >
          ◀ Previous
        </button>
        <span className="text-lg font-semibold text-[#333]">
          Page {currentPage} / {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="bg-[#7BAE7F] text-white px-4 py-2 rounded-lg hover:bg-[#6da672] disabled:opacity-50"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default Recommendations;
