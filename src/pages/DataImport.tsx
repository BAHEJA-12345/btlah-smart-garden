import { useEffect, useState } from "react";
import Papa from "papaparse";

export default function Recommendations() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const csvUrl =
      "https://raw.githubusercontent.com/BAHEJA-12345/btlah-smart-garden/main/%D8%A8%D8%AA%D9%84%D9%87.csv"; // رابط ملفك بGitHub

    Papa.parse(csvUrl, {
      download: true,
      header: true,
      complete: (results) => {
        const cleanData = results.data.filter((row) => row.Type);
        setPlants(cleanData);
        setLoading(false);
      },
    });
  }, []);

  if (loading)
    return <p className="text-center mt-10">جارٍ تحميل بيانات النباتات...</p>;

  const totalPages = Math.ceil(plants.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const displayedPlants = plants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 bg-[#FAF9F6] min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-[#4B6043]">
        🌿 التوصيات الذكية (عرض {plants.length} نبتة)
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedPlants.map((plant, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow p-4 text-center border border-[#E5E7EB]"
          >
            <h2 className="text-xl font-semibold mb-2">{plant.Type}</h2>

            {plant.image && (
              <a href={plant.image} target="_blank" rel="noopener noreferrer">
                <img
                  src={plant.image}
                  alt={plant.Type}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              </a>
            )}

            <p>💧 {plant["water-liters.day"]} لتر/اليوم</p>
            <p>🌡 {plant.Temperature_C}°C</p>
            <p>🪴 {plant.Pot_Size}</p>
            <p>☀ {plant.Light_Type}</p>
            <p>🌱 {plant.Growth_Season}</p>
            <p className="text-sm mt-2 italic">{plant.Benefit}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-10">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-[#CDE7B0] rounded-lg disabled:opacity-50"
        >
          السابق
        </button>

        <span className="font-semibold">
          صفحة {page} من {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-[#CDE7B0] rounded-lg disabled:opacity-50"
        >
          التالي
        </button>
      </div>
    </div>
  );
}
