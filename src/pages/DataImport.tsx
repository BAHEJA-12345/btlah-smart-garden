import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const DataImport = () => {
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    setImporting(true);
    try {
      const { data, error } = await supabase.functions.invoke('import-plants');
      
      if (error) throw error;

      toast({
        title: "Success!",
        description: data.message || "Plants imported successfully",
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
          Click the button below to import 1000+ plants from your Google Drive dataset into the database.
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