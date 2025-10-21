-- Remove the tool_number column from verktygshanteringssystem_verktygsbyteslista
-- We're keeping tool_id as the only reference to the tool
ALTER TABLE verktygshanteringssystem_verktygsbyteslista
DROP COLUMN IF EXISTS tool_number;