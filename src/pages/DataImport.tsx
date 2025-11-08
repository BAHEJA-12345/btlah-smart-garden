import { useState } from "react";
import Papa from "papaparse";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImportSummary {
  total: number;
  new: number;
  duplicates: number;
  duplicateNames: string[];
}

export default function DataImport() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [plantsToImport, setPlantsToImport] = useState<any[]>([]);

  const analyzeImport = async () => {
    setLoading(true);
    setSummary(null);

    try {
      const response = await fetch("/plants-data.csv");
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const mapped = results.data.map((row: any) => ({
            name_ar: row.Type || null,
            water_ml: row.Water_ml_Notif ? parseInt(row.Water_ml_Notif) : null,
            season: row.Growth_Season || null,
            temperature: row.Temperature_C || null,
            pot_size: row.Pot_Size || null,
            light_type: row.Light_Type || null,
            soil_type: row.Soil_Type || null,
            requirements: row.Growth_Requirements || null,
            care_instructions: row.Care_Instructions || null,
            growth_tracker: row.Growth_Tracker || null,
            benefit: row.Benefit || null,
          }));

          // Fetch existing plants from database
          const { data: existingPlants, error } = await supabase
            .from("plants")
            .select("name_ar");

          if (error) {
            console.error("Error fetching existing plants:", error);
            setLoading(false);
            return;
          }

          // Create a Set of existing plant names for quick lookup
          const existingNames = new Set(
            existingPlants?.map((p) => p.name_ar?.trim().toLowerCase()) || []
          );

          // Separate new and duplicate plants
          const newPlants: any[] = [];
          const duplicateNames: string[] = [];

          mapped.forEach((plant) => {
            const plantName = plant.name_ar?.trim().toLowerCase();
            if (plantName && existingNames.has(plantName)) {
              duplicateNames.push(plant.name_ar);
            } else if (plantName) {
              newPlants.push(plant);
            }
          });

          setSummary({
            total: mapped.length,
            new: newPlants.length,
            duplicates: duplicateNames.length,
            duplicateNames: duplicateNames.slice(0, 10), // Show first 10
          });

          setPlantsToImport(newPlants);
          setLoading(false);
          setDialogOpen(true);
        },
        error: (error) => {
          console.error("CSV parsing error:", error);
          setLoading(false);
        },
      });
    } catch (error) {
      console.error("Import error:", error);
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (plantsToImport.length === 0) {
      alert("لا توجد نباتات جديدة للاستيراد!");
      return;
    }

    setLoading(true);
    setProgress({ current: 0, total: plantsToImport.length });

    try {
      // Insert in batches of 100
      const batchSize = 100;
      for (let i = 0; i < plantsToImport.length; i += batchSize) {
        const batch = plantsToImport.slice(i, i + batchSize);
        const { error } = await supabase.from("plants").insert(batch);

        if (error) {
          console.error("Batch insert error:", error);
        }

        setProgress({
          current: Math.min(i + batchSize, plantsToImport.length),
          total: plantsToImport.length,
        });
      }

      setLoading(false);
      alert(`تم استيراد ${plantsToImport.length} نبات جديد بنجاح! 🌿`);
      setSummary(null);
      setPlantsToImport([]);
    } catch (error) {
      console.error("Import error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          استيراد بيانات النباتات
        </h1>

        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <p className="text-muted-foreground mb-6">
            سيتم استيراد بيانات النباتات من ملف CSV إلى قاعدة البيانات. تأكد من أن الملف موجود في المسار الصحيح.
          </p>

          <Button
            onClick={analyzeImport}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? "جارٍ التحليل..." : "تحليل واستيراد النباتات 🌿"}
          </Button>

          {summary && (
            <Alert className="mt-4">
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-semibold">ملخص التحليل:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>إجمالي النباتات في الملف: {summary.total}</li>
                    <li className="text-green-600 font-medium">
                      نباتات جديدة: {summary.new}
                    </li>
                    <li className="text-orange-600">
                      نباتات مكررة (موجودة بالفعل): {summary.duplicates}
                    </li>
                  </ul>
                  {summary.duplicateNames.length > 0 && (
                    <details className="mt-2">
                      <summary className="text-sm cursor-pointer text-muted-foreground">
                        عرض أمثلة للنباتات المكررة
                      </summary>
                      <ul className="mt-2 text-sm text-muted-foreground list-disc list-inside">
                        {summary.duplicateNames.map((name, i) => (
                          <li key={i}>{name}</li>
                        ))}
                        {summary.duplicates > 10 && (
                          <li className="text-xs">
                            ... و {summary.duplicates - 10} نباتات أخرى
                          </li>
                        )}
                      </ul>
                    </details>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>تأكيد الاستيراد</DialogTitle>
                <DialogDescription>
                  {summary && (
                    <div className="space-y-2">
                      <p>سيتم استيراد {summary.new} نبات جديد فقط.</p>
                      {summary.duplicates > 0 && (
                        <p className="text-orange-600">
                          سيتم تجاهل {summary.duplicates} نبات مكرر (موجود بالفعل في
                          قاعدة البيانات).
                        </p>
                      )}
                      {summary.new === 0 && (
                        <p className="text-red-600 font-medium">
                          جميع النباتات موجودة بالفعل في قاعدة البيانات!
                        </p>
                      )}
                    </div>
                  )}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    setDialogOpen(false);
                    handleImport();
                  }}
                  disabled={!summary || summary.new === 0}
                >
                  تأكيد الاستيراد ({summary?.new || 0} نبات)
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {loading && progress.total > 0 && (
            <div className="mt-6">
              <Progress value={(progress.current / progress.total) * 100} className="mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                تم استيراد {progress.current} من {progress.total} نبات
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
