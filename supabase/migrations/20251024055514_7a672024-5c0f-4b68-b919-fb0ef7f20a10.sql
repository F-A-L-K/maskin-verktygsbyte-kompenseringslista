-- Enable RLS on verktygshanteringssystem_matrixkoder if not already enabled
ALTER TABLE public.verktygshanteringssystem_matrixkoder ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public access to matrixkoder table
CREATE POLICY "Allow public access to matrixkoder"
ON public.verktygshanteringssystem_matrixkoder
FOR ALL
USING (true)
WITH CHECK (true);