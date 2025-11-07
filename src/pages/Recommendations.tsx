import React, { useState, useEffect } from "react";
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

export default function Recommendations() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [filtered, setFiltered] = useState<Plant[]>([]);
  const [filters, setFilters] = useState({
    Pot_Size: "",
    Soil_Type: "",
    Light_Type: "",
    Growth_Season: "",
  });
  const [page, setPage] = useState(1);
  const perPage = 20;

  // ✅ تحميل بيانات CSV
  useEffect(() => {
    Papa.parse(
      "https://drive.google.com/uc?export=download&id=1YhcSDnJf4Ahqn8JhUpg_DbshAnsSiAF_",
      {
        download: true,
        header: true,
        complete: (results) => {
          setPlants(results.data as Plant[]);
          setFiltered(results.data as Plant[]);
        },
      }
    );
  }, []);

  // ✅ تحديث الفلترة
  const handleFilter = (key: keyof typeof filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    let filteredList = plants.filter((plant) => {
      return (
        (newFilters.Pot_Size === "" ||
          plant.Pot_Size.toLowerCase().includes(newFilters.Pot_Size.toLowerCase())) &&
        (newFilters.Soil_Type === "" ||
          plant.Soil_Type.toLowerCase().includes(newFilters.Soil_Type.toLowerCase())) &&
        (newFilters.Light_Type === "" ||
          plant.Light_Type.toLowerCase().includes(newFilters.Light_Type.toLowerCase())) &&
        (newFilters.Growth_Season === "" ||
          plant.Growth_Season.toLowerCase().includes(newFilters.Growth_Season.toLowerCase()))
      );
    });
    setFiltered(filteredList);
    setPage(1);
  };

  // ✅ تقسيم الصفحات
  const totalPages = Math.ceil(filtered.length / perPage);
  const startIndex = (page - 1) * perPage;
  const currentPlants = filtered.slice(startIndex, startIndex + perPage);

  return (
    <div className="min-h-screen bg-[#F9F7F3] px-6 py-8">
      <h1 className="text-3xl font-bold text-center text-[#7BAE7F] mb-8">
        🌿 Smart Plant Recommendations
      </h1>

      {/* 🔍 الفلترة */}
      <div className="flex flex-wrap justify-center gap-4 mb-10 bg-white shadow-md rounded-2xl p-4">
        {["Pot_Size", "Soil_Type", "Light_Type", "Growth_Season"].map((key) => (
          <select
            key={key}
            className="border border-gray-300 rounded-xl px-3 py-2 text-gray-700"
            onChange={(e) =>
              handleFilter(key as keyof typeof filters, e.target.value)
            }
          >
            <option value="">All {key.replace("_", " ")}</option>
            {[...new Set(plants.map((p) => (p as any)[key]))]
              .filter(Boolean)
              .map((option, i) => (
                <option key={i} value={option}>
                  {option}
                </option>
              ))}
          </select>
        ))}
      </div>

      {/* 🪴 كروت النباتات */}
      {currentPlants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentPlants.map((plant, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2 text-[#7BAE7F]">
                {plant.Type || "نبتة غير معروفة"}
              </h2>
              <p>🌸 <b>Season:</b> {plant.Growth_Season}</p>
              <p>🌡️ <b>Temp:</b> {plant.Temperature_C} °C</p>
              <p>💧 <b>Water/day:</b> {plant.Water_ml_day} ml</p>
              <p>🪴 <b>Pot:</b> {plant.Pot_Size}</p>
              <p>☀️ <b>Light:</b> {plant.Light_Type}</p>
              <p>🌱 <b>Soil:</b> {plant.Soil_Type}</p>
              <p>🍃 <b>Benefit:</b> {plant.Benefit}</p>
              <button className="mt-4 bg-[#7BAE7F] text-white px-4 py-2 rounded-xl w-full">
                + Add to My Plants
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">Loading plants...</p>
      )}

      {/* 📄 الترقيم */}
      <div className="flex justify-center items-center gap-3 mt-8">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="bg-gray-200 px-3 py-1 rounded-lg disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-gray-200 px-3 py-1 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
