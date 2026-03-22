-- Add verified_only flag to requirements
ALTER TABLE requirements ADD COLUMN verified_only BOOLEAN NOT NULL DEFAULT false;
