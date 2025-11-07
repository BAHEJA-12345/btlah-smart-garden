import { useState } from "react";
import { Button } from "@/components/ui/button";
import Papa from "papaparse";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const DataImport = () => {
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();

  // Local CSV file
  const csvUrl = "/plants-data.csv";

  const handleImport = async () => {
    setImporting(true);
    try {
      const response = await fetch(csvUrl);
      const csvText = await response.text();

      const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
      });

      const plants = parsed.data;

      for (const plant of plants) {
        await supabase.from("plants").insert(plant);
      }

      toast({
        title: "Success!",
        description: `${plants.length} plants imported successfully 🌱`,
      });
    } catch (error: any) {
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import plants",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-3xl font-bold">Import Plant Data</h1>
        <p className="text-muted-foreground">
          Click below to import all 1000+ plants from your dataset.
        </p>
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
