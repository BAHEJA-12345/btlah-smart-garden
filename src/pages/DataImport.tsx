import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Papa from "papaparse";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const DataImport = () => {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const { toast } = useToast();

  // ✅ رابط ملف النباتات من GitHub
  const csvUrl = "https://raw.githubusercontent.com/BAHEJA-12345/btlah-smart-garden/main/plants.csv";

  const handleImport = async () => {
    setImporting(true);
    setProgress({ current: 0, total: 0 });
    try {
      // تحميل ملف CSV من GitHub
      const response = await fetch(csvUrl);
      const csvText = await response.text();

      // تحليل CSV إلى JSON
      const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
      });

      // تحويل كل صف إلى كائن جاهز للإدخال في Supabase
      const plants = parsed.data.map((row: any) => ({
        name_ar: row.Type || "",
        water_ml: parseInt(row.Water_ml_Notification || "0"),
        season: row.Growth_Season || "",
        temperature: row.Temperature_C || "",
        pot_size: row.Pot_Size || "",
        light_type: row.Light_Type || "",
        soil_type: row.Soil_Type || "",
        growth_requirements: row.Growth_Requirements || "",
        care_instructions: row.Care_Instructions || "",
        growth_tracker: row.Growth_Tracker || "",
        benefit: row.Benefit || "",
      }));

      setProgress({ current: 0, total: plants.length });

      // 🚀 إدخال البيانات إلى جدول plants في Supabase على دفعات (batch size = 100)
      const batchSize = 100;
      let imported = 0;

      for (let i = 0; i < plants.length; i += batchSize) {
        const batch = plants.slice(i, i + batchSize);
        const { error } = await supabase.from("plants").insert(batch);
        if (error) throw error;

        imported += batch.length;
        setProgress({ current: imported, total: plants.length });
      }

      toast({
        title: "✅ Success!",
        description: `${plants.length} plants imported successfully 🌱`,
      });
    } catch (error: any) {
      toast({
        title: "❌ Import Failed",
        description: error.message || "Failed to import plants",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  const progressPercentage =
    progress.total > 0
      ? Math.round((progress.current / progress.total) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-3xl font-bold">🌿 Import Plant Data</h1>
        <p className="text-muted-foreground">
          Click below to import all 1000+ plants from your dataset.
        </p>

        {importing && progress.total > 0 && (
          <div className="space-y-2">
            <Progress value={progressPercentage} className="w-full" />
            <p className="text-sm text-muted-foreground">
              {progress.current} of {progress.total} plants imported (
              {progressPercentage}%)
            </p>
          </div>
        )}

        <Button
          onClick={handleImport}
          disabled={importing}
          size="lg"
          className="w-full"
        >
          {importing ? "Importing..." : "Import Plants"}
        </Button>
      </div>
    </div>
  );
};
