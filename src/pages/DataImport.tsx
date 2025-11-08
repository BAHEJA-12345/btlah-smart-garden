import { useEffect, useState } from "react";

export default function Recommendations() {
  const [plants, setPlants] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    pot: "",
    soil: "",
    light: "",
    season: "",
    temp: "",
  });

  useEffect(() => {
    async function fetchPlants() {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/BAHEJA-12345/btlah-smart-garden/main/plants.csv"
        );
        const text = await response.text();
        const rows = text.split("\n").slice(1);
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
        setFiltered(data);
      } catch (err) {
        console.error("Error loading CSV:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlants();
  }, []);

  // تحديث البيانات عند اختيار الفلاتر
  useEffect(() => {
    let data = [...plants];
    if (filters.pot) data = data.filter((p) => p.pot === filters.pot);
    if (filters.soil) data = data.filter((p) => p.soil === filters.soil);
    if (filters.light) data = data.filter((p) => p.light === filters.light);
    if (filters.season) data = data.filter((p) => p.season === filters.season);
    if (filters.temp) data = data.filter((p) => p.temp.includes(filters.temp));
    setFiltered(data);
  }, [filters, plants]);

  if (loading)
    return <p className="text-center mt-10">جارٍ تحميل النباتات... 🌿</p>;

  return (
    <div className="p-6 bg-[#F9F7F3] min-h-screen">
      <h1 className="text-3xl font-bold text-center text-[#7BAE7F] mb-8">
        🌿 قائمة النباتات الذكية
      </h1>

      {/* 🔍 شريط الفلاتر */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <select
          onChange={(e) => setFilters({ ...filters, pot: e.target.value })}
          className="rounded-xl border p-2"
        >
          <option value="">حجم الأصيص</option>
          <option value="ground">Ground</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>

        <select
          onChange={(e) => setFilters({ ...filters, soil: e.target.value })}
          className="rounded-xl border p-2"
        >
          <option value="">نوع التربة</option>
          <option value="Clay">Clay</option>
          <option value="Sandy">Sandy</option>
          <option value="Loamy">Loamy</option>
          <option value="Well-drained">Well-drained</option>
        </select>

        <select
          onChange={(e) => setFilters({ ...filters, light: e.target.value })}
          className="rounded-xl border p-2"
        >
          <option value="">نوع الإضاءة</option>
          <option value="Full sun">Full sun</option>
          <option value="Indirect light">Indirect light</option>
          <option value="Partial shade">Partial shade</option>
        </select>

        <select
          onChange={(e) => setFilters({ ...filters, season: e.target.value })}
          className="rounded-xl border p-2"
        >
          <option value="">الموسم</option>
          <option value="Summer">Summer</option>
          <option value="Winter">Winter</option>
          <option value="Spring">Spring</option>
          <option value="Autumn">Autumn</option>
        </select>

        <select
          onChange={(e) => setFilters({ ...filters, temp: e.target.value })}
          className="rounded-xl border p-2"
        >
          <option value="">درجة الحرارة</option>
          <option value="13">13–19°C</option>
          <option value="17">17–26°C</option>
          <option value="20">20–27°C</option>
        </select>
      </div>

      {/* 🌱 كروت النباتات */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">
          لا توجد نباتات مطابقة للفلاتر المحددة 🌱
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md p-4 text-center border border-[#E5E5E5]"
            >
              <h2 className="font-bold text-lg text-[#7BAE7F] mb-2">
                {p.type || "—"}
              </h2>
              <p>🌸 الموسم: {p.season || "—"}</p>
              <p>🌡️ الحرارة: {p.temp || "—"}°C</p>
              <p>💧 الماء: {p.ml || "—"} ml / يوم</p>
              <p>🪴 الأصيص: {p.pot || "—"}</p>
              <p>☀️ الإضاءة: {p.light || "—"}</p>
              <p>🌱 التربة: {p.soil || "—"}</p>
              <p>🍃 الفائدة: {p.benefit || "—"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
