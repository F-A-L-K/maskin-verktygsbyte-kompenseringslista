-- Create machines table for tool management system
CREATE TABLE public.verktygshanteringssystem_maskiner (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  maskiner_nummer TEXT NOT NULL UNIQUE,
  maskin_namn TEXT NOT NULL,
  ip_adambox TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.verktygshanteringssystem_maskiner ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to machines" 
ON public.verktygshanteringssystem_maskiner 
FOR SELECT 
USING (true);

-- Create policy for public insert access
CREATE POLICY "Allow public insert access to machines" 
ON public.verktygshanteringssystem_maskiner 
FOR INSERT 
WITH CHECK (true);

-- Create policy for public update access
CREATE POLICY "Allow public update access to machines" 
ON public.verktygshanteringssystem_maskiner 
FOR UPDATE 
USING (true);

-- Create policy for public delete access
CREATE POLICY "Allow public delete access to machines" 
ON public.verktygshanteringssystem_maskiner 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_maskiner_updated_at
BEFORE UPDATE ON public.verktygshanteringssystem_maskiner
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some example machines
INSERT INTO public.verktygshanteringssystem_maskiner (maskiner_nummer, maskin_namn, ip_adambox) VALUES
('5401', '5401 Fanuc Robodrill', NULL),
('5701', '5701 Fanuc Robodrill', NULL),
('5702', '5702 Fanuc Robodrill', NULL),
('5703', '5703 Fanuc Robodrill', NULL),
('5704', '5704 Fanuc Robodrill', NULL),
('5705', '5705 Fanuc Robodrill', NULL),
('5706', '5706 Fanuc Robodrill', NULL);