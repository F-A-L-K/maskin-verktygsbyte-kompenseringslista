-- Add tool_id column as foreign key to verktygshanteringssystem_verktyg
ALTER TABLE verktygshanteringssystem_verktygsbyteslista
ADD COLUMN tool_id uuid REFERENCES verktygshanteringssystem_verktyg(id) ON DELETE CASCADE;

-- If tool_number contains UUIDs (tool IDs), copy them to tool_id
-- This handles existing data where tool_number might be a UUID
UPDATE verktygshanteringssystem_verktygsbyteslista
SET tool_id = tool_number::uuid
WHERE tool_number IS NOT NULL 
  AND tool_number ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- For any records where tool_number is a plats (position number), 
-- match it to the tool's ID from verktygshanteringssystem_verktyg
UPDATE verktygshanteringssystem_verktygsbyteslista vb
SET tool_id = v.id
FROM verktygshanteringssystem_verktyg v
WHERE vb.tool_id IS NULL 
  AND vb.tool_number IS NOT NULL
  AND v.plats = vb.tool_number;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_verktygsbyteslista_tool_id 
ON verktygshanteringssystem_verktygsbyteslista(tool_id);