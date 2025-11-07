import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PlantRow {
  Type: string;
  'water- liters.day': string;
  Growth_Season: string;
  Temperature_C: string;
  Pot_Size: string;
  Light_Type: string;
  Soil_Type: string;
  Growth_Requirements: string;
  Care_Instructions: string;
  'Water.ml_Notif/day': string;
  Growth_Tracker: string;
  Benefit: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch the CSV file from Google Drive
    const csvUrl = 'https://drive.google.com/uc?export=download&id=1YhcSDnJf4Ahqn8JhUpg_DbshAnsSiAF_';
    console.log('Fetching CSV from:', csvUrl);
    
    const response = await fetch(csvUrl);
    const csvText = await response.text();
    
    // Parse CSV
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    const plants = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',');
      if (values.length < 12) continue;
      
      const plant = {
        name_ar: values[0]?.trim() || '',
        water_ml: parseInt(values[9]?.trim() || '0'),
        season: values[2]?.trim() || '',
        temperature: values[3]?.trim() || '',
        pot_size: values[4]?.trim() || '',
        light_type: values[5]?.trim() || '',
        soil_type: values[6]?.trim() || '',
        growth_requirements: values[7]?.trim() || '',
        care_instructions: values[8]?.trim() || '',
        growth_tracker: values[10]?.trim() || '',
        benefit: values[11]?.trim() || '',
      };
      
      plants.push(plant);
    }
    
    console.log(`Parsed ${plants.length} plants`);
    
    // Insert in batches of 100
    const batchSize = 100;
    let imported = 0;
    
    for (let i = 0; i < plants.length; i += batchSize) {
      const batch = plants.slice(i, i + batchSize);
      const { error } = await supabase.from('plants').insert(batch);
      
      if (error) {
        console.error('Batch insert error:', error);
        throw error;
      }
      
      imported += batch.length;
      console.log(`Imported ${imported}/${plants.length} plants`);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully imported ${imported} plants` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error('Import error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});