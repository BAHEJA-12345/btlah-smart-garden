import { useEffect, useState } from "react";

export default function Recommendations() {
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlants() {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/BAHEJA-12345/btlah-smart-garden/main/plants.csv"
        );
        const text = await response.text();
        const rows = text.split("\n").slice(1); // تجاهل صف العناوين
        const data = rows.map((row) => {
          const cols = row.split(",");
          return {
            type: cols[0],
            water: cols[1],
            season: cols[2],
            temp: cols[3],
            pot: cols[4],
            light: cols[5],
            soil: cols[6],
            requirements: cols[7],
            care: cols[8],
            ml: cols[9],
            benefit: cols[10],
            image: cols[11],
          };
        });
        setPlants(data);
      } catch (err) {
        console.error("Error loading CSV:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPlants();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">جارٍ تحميل النباتات... 🌿</p>;
  }

  return (
    <div className="p-6 bg-[#F9F7F3] min-h-screen">
      <h1 className="text-3xl font-bold text-center text-[#7BAE7F] mb-8">
        🌿 قائمة النباتات
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {plants.map((p, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md p-4 text-center border border-[#E5E5E5]"
          >
            <h2 className="font-bold text-lg text-[#7BAE7F] mb-2">
              {p.type || "—"}
            </h2>
            <p>🌸 الموسم: {p.season || "—"}</p>
            <p>🌡️ الحرارة: {p.temp || "—"}°C</p>
            <p>💧 الماء: {p.ml || "—"} ml/يوم</p>
            <p>🪴 الأصيص: {p.pot || "—"}</p>
            <p>☀️ الإضاءة: {p.light || "—"}</p>
            <p>🌱 التربة: {p.soil || "—"}</p>
            <p>🍃 الفائدة: {p.benefit || "—"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
