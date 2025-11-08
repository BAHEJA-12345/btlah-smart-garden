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

export default function DataImport() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleImport = async () => {
    setLoading(true);
    setProgress({ current: 0, total: 0 });

    try {
      const response = await fetch("/plants-data.csv");
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const totalPlants = results.data.length;
          setProgress({ current: 0, total: totalPlants });

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

          // Insert in batches of 100
          const batchSize = 100;
          for (let i = 0; i < mapped.length; i += batchSize) {
            const batch = mapped.slice(i, i + batchSize);
            const { error } = await supabase.from("plants").insert(batch);

            if (error) {
              console.error("Batch insert error:", error);
            }

            setProgress({ current: Math.min(i + batchSize, totalPlants), total: totalPlants });
          }

          setLoading(false);
          alert(`تم استيراد ${totalPlants} نبات بنجاح! 🌿`);
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

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? "جارٍ الاستيراد..." : "استيراد النباتات 🌿"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>تأكيد الاستيراد</DialogTitle>
                <DialogDescription>
                  هل أنت متأكد من رغبتك في استيراد بيانات النباتات؟ سيتم إضافة البيانات الجديدة إلى قاعدة البيانات.
                  <br /><br />
                  <strong>ملاحظة:</strong> قد يؤدي هذا إلى إنشاء نسخ مكررة إذا تم الاستيراد عدة مرات.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    setDialogOpen(false);
                    handleImport();
                  }}
                >
                  تأكيد الاستيراد
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
