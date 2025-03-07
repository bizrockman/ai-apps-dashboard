/*
  # Update Projects Schema and Add Contact Person Relations

  1. Changes
    - Add cost_center and boq_number fields to projects table
    - Create project_contact_persons junction table for managing contact person relationships
    - Add RLS policies for secure access

  2. New Tables
    - project_contact_persons
      - project_id (uuid, references projects)
      - contact_person_id (uuid, references contact_persons)
      - role (text, either 'contact' or 'manager')

  3. Security
    - Enable RLS on project_contact_persons
    - Add policies for authenticated users
*/

-- Create sequence for project codes if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'project_code_seq') THEN
    CREATE SEQUENCE project_code_seq START 1;
  END IF;
END $$;

-- Add new columns to projects table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'cost_center') THEN
    ALTER TABLE projects ADD COLUMN cost_center text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'boq_number') THEN
    ALTER TABLE projects ADD COLUMN boq_number text;
  END IF;
END $$;

-- Add comment for boq_number
COMMENT ON COLUMN projects.boq_number IS 'Leistungsverzeichnis Nummer / Bill of Quantities (BOQ)';

-- Create junction table for project contact persons if it doesn't exist
CREATE TABLE IF NOT EXISTS project_contact_persons (
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  contact_person_id uuid NOT NULL REFERENCES contact_persons(id) ON DELETE CASCADE,
  role text NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (project_id, contact_person_id, role),
  CONSTRAINT valid_role CHECK (role IN ('contact', 'manager'))
);

-- Enable RLS
ALTER TABLE project_contact_persons ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view project_contact_persons" ON project_contact_persons;
DROP POLICY IF EXISTS "Users can create project_contact_persons" ON project_contact_persons;
DROP POLICY IF EXISTS "Users can update project_contact_persons" ON project_contact_persons;
DROP POLICY IF EXISTS "Users can delete project_contact_persons" ON project_contact_persons;

-- Create RLS policies
CREATE POLICY "Users can view project_contact_persons" 
ON project_contact_persons
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can create project_contact_persons" 
ON project_contact_persons
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Users can update project_contact_persons" 
ON project_contact_persons
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "Users can delete project_contact_persons" 
ON project_contact_persons
FOR DELETE 
TO authenticated 
USING (true);