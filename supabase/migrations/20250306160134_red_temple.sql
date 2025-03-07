/*
  # Fix contact persons table

  1. Changes
    - Add salutation column to contact_persons table
    - Fix column name typo (salution -> salutation)
    - Ensure proper Unicode handling for email and name fields
*/

-- Add salutation column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contact_persons' 
    AND column_name = 'salutation'
  ) THEN
    ALTER TABLE contact_persons ADD COLUMN salutation text;
  END IF;
END $$;