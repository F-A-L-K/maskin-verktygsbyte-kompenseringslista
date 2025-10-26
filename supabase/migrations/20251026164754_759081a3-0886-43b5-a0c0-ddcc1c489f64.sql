-- Create störningar table
CREATE TABLE public.verktygshanteringssystem_störningar (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  maskin_id UUID NOT NULL,
  område TEXT NOT NULL,
  kommentar TEXT NOT NULL,
  signatur TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.verktygshanteringssystem_störningar ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
CREATE POLICY "Allow public access to störningar"
ON public.verktygshanteringssystem_störningar
FOR ALL
USING (true)
WITH CHECK (true);