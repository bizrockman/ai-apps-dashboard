/*
  # Fix project schema and relationships

  1. Changes
    - Add cost_center and boq_number columns to projects table
    - Remove start_date and end_date columns from projects table
    - Create project_contact_persons junction table with role field
    - Enable RLS and add policies

  2. Tables Modified
    - projects: Added cost_center and boq_number, removed dates
    - project_contact_persons: New junction table for project-contact relationships

  3. Security
    - Enable RLS on project_contact_persons
    - Add CRUD policies for authenticated users
*/

-- Add new columns to projects
ALTER TABLE projects 
  ADD COLUMN IF NOT EXISTS cost_center text,
  ADD COLUMN IF NOT EXISTS boq_number text;

-- Add comment for boq_number
COMMENT ON COLUMN projects.boq_number IS 'Leistungsverzeichnis Nummer / Bill of Quantities (BOQ)';

-- Remove date columns from projects if they exist
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'start_date') THEN
    ALTER TABLE projects DROP COLUMN start_date;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'end_date') THEN
    ALTER TABLE projects DROP COLUMN end_date;
  END IF;
END $$;

-- Drop existing project_contact_persons table if it exists
DROP TABLE IF EXISTS project_contact_persons;

-- Create junction table for project contact persons with role
CREATE TABLE project_contact_persons (
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  contact_person_id uuid REFERENCES contact_persons(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('contact', 'manager')),
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (project_id, contact_person_id)
);

-- Enable RLS
ALTER TABLE project_contact_persons ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view project_contact_persons" ON project_contact_persons;
  DROP POLICY IF EXISTS "Users can create project_contact_persons" ON project_contact_persons;
  DROP POLICY IF EXISTS "Users can update project_contact_persons" ON project_contact_persons;
  DROP POLICY IF EXISTS "Users can delete project_contact_persons" ON project_contact_persons;

  -- Create new policies
  CREATE POLICY "Users can view project_contact_persons" 
    ON project_contact_persons FOR SELECT TO authenticated USING (true);

  CREATE POLICY "Users can create project_contact_persons" 
    ON project_contact_persons FOR INSERT TO authenticated WITH CHECK (true);

  CREATE POLICY "Users can update project_contact_persons" 
    ON project_contact_persons FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

  CREATE POLICY "Users can delete project_contact_persons" 
    ON project_contact_persons FOR DELETE TO authenticated USING (true);
END $$;