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

    // Fetch the CSV file from public folder
    const csvUrl = `${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovableproject.com')}/plants-data.csv`;
    console.log('Fetching CSV from:', csvUrl);
    
    const response = await fetch(csvUrl);
    const csvText = await response.text();
    
    // Parse CSV with proper column mapping
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Create column index mapping
    const columnMap: Record<string, number> = {};
    headers.forEach((header, index) => {
      columnMap[header] = index;
    });
    
    const plants = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',');
      if (values.length < 11) continue;
      
      const plant = {
        name_ar: values[columnMap['Type']]?.trim() || '',
        water_ml: parseInt(values[columnMap['Water_ml_Notif']]?.trim() || '0'),
        season: values[columnMap['Growth_Season']]?.trim() || '',
        temperature: values[columnMap['Temperature_C']]?.trim() || '',
        pot_size: values[columnMap['Pot_Size']]?.trim() || '',
        light_type: values[columnMap['Light_Type']]?.trim() || '',
        soil_type: values[columnMap['Soil_Type']]?.trim() || '',
        growth_requirements: values[columnMap['Growth_Requirements']]?.trim() || '',
        care_instructions: values[columnMap['Care_Instructions']]?.trim() || '',
        growth_tracker: values[columnMap['Growth_Tracker']]?.trim() || '',
        benefit: values[columnMap['Benefit']]?.trim() || '',
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