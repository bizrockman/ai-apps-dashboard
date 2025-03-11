/*
  # Update document table structure

  1. Changes
    - Remove pdf_url column
    - Add pdf_content column for storing the actual PDF content
    - Add pdf_generated_at column for tracking when PDFs are generated
    - Update status check constraint to include 'generated' status
*/

-- Add new columns for PDF storage if they don't exist
ALTER TABLE documents 
  ADD COLUMN IF NOT EXISTS pdf_content text,
  ADD COLUMN IF NOT EXISTS pdf_generated_at timestamptz;

-- Drop the pdf_url column if it exists
ALTER TABLE documents DROP COLUMN IF EXISTS pdf_url;

-- Update the status check constraint
ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_status_check;
ALTER TABLE documents ADD CONSTRAINT documents_status_check 
  CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'approved'::text, 'archived'::text, 'generated'::text]));