-- Add foreign key constraint to link maskin_id to verktygshanteringssystem_maskiner
ALTER TABLE public.verktygshanteringssystem_störningar
ADD CONSTRAINT fk_maskin_id 
FOREIGN KEY (maskin_id) 
REFERENCES public.verktygshanteringssystem_maskiner(id)
ON DELETE CASCADE;