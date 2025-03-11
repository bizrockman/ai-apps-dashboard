/*
  # Add PDF storage and update status handling
  
  1. Changes
    - Add PDF storage columns (pdf_url, pdf_file_name, pdf_generated_at)
    - Add new status column with enum type
    - Migrate existing status data
    - Update constraints and indexes

  2. Security
    - Enable RLS on documents table
    - Add policies for authenticated users
*/

-- Create a temporary status column
ALTER TABLE documents 
  ADD COLUMN status_new text;

-- Copy existing status values
UPDATE documents 
SET status_new = status;

-- Drop the existing status constraint
ALTER TABLE documents 
  DROP CONSTRAINT IF EXISTS documents_status_check;

-- Drop the old status column
ALTER TABLE documents 
  DROP COLUMN status;

-- Rename the new column
ALTER TABLE documents 
  RENAME COLUMN status_new TO status;

-- Add the new constraint with updated values
ALTER TABLE documents 
  ADD CONSTRAINT documents_status_check 
  CHECK (status = ANY (ARRAY['draft', 'review', 'approved', 'archived', 'generated']));

-- Add PDF storage columns
ALTER TABLE documents 
  ADD COLUMN IF NOT EXISTS pdf_url text,
  ADD COLUMN IF NOT EXISTS pdf_file_name text,
  ADD COLUMN IF NOT EXISTS pdf_generated_at timestamptz;

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Add policies for authenticated users
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'documents' AND policyname = 'Users can view documents'
  ) THEN
    CREATE POLICY "Users can view documents" ON documents
      FOR SELECT TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'documents' AND policyname = 'Users can create documents'
  ) THEN
    CREATE POLICY "Users can create documents" ON documents
      FOR INSERT TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'documents' AND policyname = 'Users can update documents'
  ) THEN
    CREATE POLICY "Users can update documents" ON documents
      FOR UPDATE TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'documents' AND policyname = 'Users can delete documents'
  ) THEN
    CREATE POLICY "Users can delete documents" ON documents
      FOR DELETE TO authenticated
      USING (true);
  END IF;
END $$;