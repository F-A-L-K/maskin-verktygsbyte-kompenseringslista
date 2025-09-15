-- Create table for tool change list
CREATE TABLE public.Verktygshanteringssystem_verktygsbyteslista (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date_created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  tool_number TEXT,
  cause TEXT,
  comment TEXT,
  signature TEXT,
  machine_number TEXT,
  manufacturing_order TEXT,
  amount_since_last_change INTEGER
);

-- Create table for compensation list  
CREATE TABLE public.Verktygshanteringssystem_kompenseringslista (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date_created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  tool_number TEXT,
  comment TEXT,
  signature TEXT,
  machine_number TEXT,
  manufacturing_order TEXT,
  compnum_coordinate_system TEXT,
  compnum_tool TEXT,
  compnum_number TEXT,
  compensation_direction TEXT,
  compensation_value TEXT
);

-- Enable Row Level Security
ALTER TABLE public.Verktygshanteringssystem_verktygsbyteslista ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.Verktygshanteringssystem_kompenseringslista ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tool change list
CREATE POLICY "Allow public access to tool changes" 
ON public.Verktygshanteringssystem_verktygsbyteslista 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create RLS policies for compensation list
CREATE POLICY "Allow public access to compensations" 
ON public.Verktygshanteringssystem_kompenseringslista 
FOR ALL 
USING (true)
WITH CHECK (true);