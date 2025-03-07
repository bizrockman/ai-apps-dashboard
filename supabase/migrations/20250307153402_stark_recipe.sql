/*
  # Fix Project Structure and Relations

  1. Changes
    - Add cost_center and boq_number fields to projects table
    - Remove start_date and end_date from projects table
    - Create project_contact_persons junction table with role field
    - Add RLS policies if they don't exist

  2. New Tables
    - project_contact_persons
      - project_id (uuid, references projects)
      - contact_person_id (uuid, references contact_persons)
      - role (text, either 'contact' or 'manager')
      - created_at (timestamptz)

  3. Security
    - Enable RLS on project_contact_persons
    - Add policies for authenticated users
*/

-- Add new columns to projects table
ALTER TABLE projects 
  ADD COLUMN IF NOT EXISTS cost_center text,
  ADD COLUMN IF NOT EXISTS boq_number text;

-- Add comment for boq_number
COMMENT ON COLUMN projects.boq_number IS 'Leistungsverzeichnis Nummer / Bill of Quantities (BOQ)';

-- Remove start_date and end_date columns
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'start_date') THEN
    ALTER TABLE projects DROP COLUMN start_date;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'end_date') THEN
    ALTER TABLE projects DROP COLUMN end_date;
  END IF;
END $$;

-- Create junction table for project contact persons if it doesn't exist
CREATE TABLE IF NOT EXISTS project_contact_persons (
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  contact_person_id uuid NOT NULL REFERENCES contact_persons(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('contact', 'manager')),
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (project_id, contact_person_id, role)
);

-- Enable RLS
ALTER TABLE project_contact_persons ENABLE ROW LEVEL SECURITY;

-- Create RLS policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'project_contact_persons' 
    AND policyname = 'Users can view project_contact_persons'
  ) THEN
    CREATE POLICY "Users can view project_contact_persons" 
    ON project_contact_persons
    FOR SELECT 
    TO authenticated 
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'project_contact_persons' 
    AND policyname = 'Users can create project_contact_persons'
  ) THEN
    CREATE POLICY "Users can create project_contact_persons" 
    ON project_contact_persons
    FOR INSERT 
    TO authenticated 
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'project_contact_persons' 
    AND policyname = 'Users can update project_contact_persons'
  ) THEN
    CREATE POLICY "Users can update project_contact_persons" 
    ON project_contact_persons
    FOR UPDATE 
    TO authenticated 
    USING (true)
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'project_contact_persons' 
    AND policyname = 'Users can delete project_contact_persons'
  ) THEN
    CREATE POLICY "Users can delete project_contact_persons" 
    ON project_contact_persons
    FOR DELETE 
    TO authenticated 
    USING (true);
  END IF;
END $$;