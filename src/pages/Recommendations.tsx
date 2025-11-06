import { useEffect, useState } from "react";
import Papa from "papaparse";

export default function Recommendations() {
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // رابط ملف CSV من GitHub (تأكدي من الاسم الكامل)
  const csvUrl =
    "https://raw.githubusercontent.com/BAHEJA-12345/btlah-smart-garden/main/%D8%A8%D8%AA%D9%84%D9%87.csv";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(csvUrl);
        const text = await response.text();

        const parsed = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
        });

        setPlants(parsed.data);
      } catch (error) {
        console.error("Error loading plants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading plant data...
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#FAF9F6] min-h-screen">
      <h1 className="text-4xl font-bold text-green-800 mb-6">🌿 All Plants</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {plants.length > 0 ? (
          plants.map((plant, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center text-center border border-green-100 hover:shadow-lg transition"
            >
              <img
                src={plant.image}
                alt={plant.Type}
                className="w-32 h-32 object-cover rounded-xl mb-3"
              />
              <h2 className="font-semibold text-xl mb-1">{plant.Type}</h2>
              <p className="text-gray-600 text-sm mb-1">
                💧 {plant["water-liters.day"]} L/day
              </p>
              <p className="text-gray-600 text-sm mb-1">
                🌞 {plant.Light_Type}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                🌡️ {plant.Temperature_C}°C
              </p>
              <p className="text-gray-600 text-sm mb-1">
                🪴 {plant.Pot_Size}
              </p>
              <p className="text-green-700 text-sm font-medium">
                🌱 {plant.Benefit}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">
            No plants found. Make sure your CSV file is public.
          </p>
        )}
      </div>
    </div>
  );
}
