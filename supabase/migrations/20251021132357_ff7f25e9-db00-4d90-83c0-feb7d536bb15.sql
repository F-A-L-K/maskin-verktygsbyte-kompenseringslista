-- Add machine_id column as foreign key to verktygshanteringssystem_maskiner
ALTER TABLE verktygshanteringssystem_verktygsbyteslista
ADD COLUMN machine_id uuid REFERENCES verktygshanteringssystem_maskiner(id) ON DELETE CASCADE;

-- Migrate existing data: match machine_number to machine id
UPDATE verktygshanteringssystem_verktygsbyteslista vb
SET machine_id = m.id
FROM verktygshanteringssystem_maskiner m
WHERE vb.machine_number = m.maskiner_nummer;

-- Remove the machine_number column
ALTER TABLE verktygshanteringssystem_verktygsbyteslista
DROP COLUMN IF EXISTS machine_number;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_verktygsbyteslista_machine_id 
ON verktygshanteringssystem_verktygsbyteslista(machine_id);