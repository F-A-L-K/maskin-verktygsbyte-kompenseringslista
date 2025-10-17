-- Create table for tool management system tools
CREATE TABLE public.verktygshanteringssystem_verktyg (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plats TEXT,
  benämning TEXT NOT NULL,
  artikelnummer TEXT,
  mingräns INTEGER,
  maxgräns INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.verktygshanteringssystem_verktyg ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (following the pattern of other tables)
CREATE POLICY "Allow public read access to tools"
ON public.verktygshanteringssystem_verktyg
FOR SELECT
USING (true);

CREATE POLICY "Allow public insert access to tools"
ON public.verktygshanteringssystem_verktyg
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update access to tools"
ON public.verktygshanteringssystem_verktyg
FOR UPDATE
USING (true);

CREATE POLICY "Allow public delete access to tools"
ON public.verktygshanteringssystem_verktyg
FOR DELETE
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_verktygshanteringssystem_verktyg_updated_at
BEFORE UPDATE ON public.verktygshanteringssystem_verktyg
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();