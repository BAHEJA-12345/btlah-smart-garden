-- Create plants table
CREATE TABLE public.plants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  season TEXT NOT NULL,
  temperature TEXT NOT NULL,
  water_ml INTEGER NOT NULL,
  pot_size TEXT NOT NULL,
  soil_type TEXT NOT NULL,
  light_type TEXT NOT NULL,
  benefit TEXT NOT NULL,
  growth_requirements TEXT,
  care_instructions TEXT,
  growth_tracker TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (everyone can view plants)
CREATE POLICY "Plants are viewable by everyone" 
ON public.plants 
FOR SELECT 
USING (true);

-- Create index for common queries
CREATE INDEX idx_plants_season ON public.plants(season);
CREATE INDEX idx_plants_pot_size ON public.plants(pot_size);
CREATE INDEX idx_plants_benefit ON public.plants(benefit);
CREATE INDEX idx_plants_soil_type ON public.plants(soil_type);
CREATE INDEX idx_plants_light_type ON public.plants(light_type);