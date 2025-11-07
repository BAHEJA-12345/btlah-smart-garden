import React, { useEffect, useState } from "react";
import Papa from "papaparse";

const Recommendations = () => {
  const [plants, setPlants] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    pot: "",
    soil: "",
    light: "",
    temp: "",
    season: "",
  });
  const [page, setPage] = useState(1);
  const perPage = 20;
  
const csvUrl = "https://raw.githubusercontent.com/BAHEJA-12345/btlah-smart-garden/main/(2)%20بتله.csv";



  useEffect(() => {
    Papa.parse(csvUrl, {
      download: true,
      header: true,
      complete: (results) => {
        setPlants(results.data);
        setFiltered(results.data);
      },
    });
  }, []);

  // ✅ تطبيق الفلاتر
  useEffect(() => {
    let data = [...plants];
    if (filters.pot) data = data.filter((p) => p.Pot_Size === filters.pot);
    if (filters.soil) data = data.filter((p) => p.Soil_Type === filters.soil);
    if (filters.light) data = data.filter((p) => p.Light_Type === filters.light);
    if (filters.temp) data = data.filter((p) => p.Temperature_C.includes(filters.temp));
    if (filters.season) data = data.filter((p) => p.Growth_Season === filters.season);
    setFiltered(data);
    setPage(1);
  }, [filters, plants]);

  // ✅ التصفية مع الصفحات
  const startIndex = (page - 1) * perPage;
  const currentPlants = filtered.slice(startIndex, startIndex + perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="bg-[#F9F7F3] min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center text-[#7BAE7F] mb-6">
        🌿 Smart Plant Recommendations
      </h1>

      {/* ✅ شريط الفلترة */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <select
          onChange={(e) => setFilters({ ...filters, pot: e.target.value })}
          className="rounded-xl border p-2"
        >
          <option value="">Pot Size</option>
          <option value="ground">Ground</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
        <select
          onChange={(e) => setFilters({ ...filters, soil: e.target.value })}
          className="rounded-xl border p-2"
        >
          <option value="">Soil Type</option>
          <option value="Clay">Clay</option>
          <option value="Sandy">Sandy</option>
          <option value="Loamy">Loamy</option>
          <option value="Well-drained">Well-drained</option>
        </select>
        <select
          onChange={(e) => setFilters({ ...filters, light: e.target.value })}
          className="rounded-xl border p-2"
        >
          <option value="">Light Type</option>
          <option value="Full sun">Full sun</option>
          <option value="Indirect light">Indirect light</option>
          <option value="Partial shade">Partial shade</option>
        </select>
        <select
          onChange={(e) => setFilters({ ...filters, temp: e.target.value })}
          className="rounded-xl border p-2"
        >
          <option value="">Temperature</option>
          <option value="13">13–19°C</option>
          <option value="17">17–26°C</option>
          <option value="20">20–27°C</option>
        </select>
        <select
          onChange={(e) => setFilters({ ...filters, season: e.target.value })}
          className="rounded-xl border p-2"
        >
          <option value="">Season</option>
          <option value="Summer">Summer</option>
          <option value="Winter">Winter</option>
          <option value="Spring">Spring</option>
          <option value="Autumn">Autumn</option>
        </select>
      </div>

      {/* ✅ بطاقات النباتات */}
      {currentPlants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentPlants.map((plant, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-4 text-center border border-[#E5E5E5]"
            >
              <h2 className="font-bold text-lg text-[#7BAE7F] mb-2">
                {plant.Type || "—"}
              </h2>
              <p>🌸 <strong>Season:</strong> {plant.Growth_Season || "—"}</p>
              <p>🌡️ <strong>Temp:</strong> {plant.Temperature_C || "—"}°C</p>
              <p>💧 <strong>Water/day:</strong> {plant.Water_ml_day || "—"} ml</p>
              <p>🪴 <strong>Pot:</strong> {plant.Pot_Size || "—"}</p>
              <p>☀️ <strong>Light:</strong> {plant.Light_Type || "—"}</p>
              <p>🌱 <strong>Soil:</strong> {plant.Soil_Type || "—"}</p>
              <p>🍃 <strong>Benefit:</strong> {plant.Benefit || "—"}</p>

              <button className="bg-[#7BAE7F] text-white font-semibold px-4 py-2 rounded-xl mt-3 hover:opacity-90">
                + Add to My Plants
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-10">Loading plants...</p>
      )}

      {/* ✅ أزرار الصفحات */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="bg-gray-200 px-3 py-1 rounded-lg"
        >
          Prev
        </button>
        <span>
          {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-gray-200 px-3 py-1 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Recommendations;
