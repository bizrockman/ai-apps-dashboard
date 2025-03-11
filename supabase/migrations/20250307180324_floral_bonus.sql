/*
  # Update document table for PDF storage

  1. Changes
    - Add pdf_content column for storing the actual PDF content
    - Add pdf_generated_at column for tracking generation timestamp
    - Add pdf_file_name column for storing the generated file name
    - Update status check constraint to include 'generated' status
*/

-- Add new columns for PDF storage
ALTER TABLE documents 
  ADD COLUMN IF NOT EXISTS pdf_content text,
  ADD COLUMN IF NOT EXISTS pdf_file_name text,
  ADD COLUMN IF NOT EXISTS pdf_generated_at timestamptz;

-- Update the status check constraint
ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_status_check;
ALTER TABLE documents ADD CONSTRAINT documents_status_check 
  CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'approved'::text, 'archived'::text, 'generated'::text]));