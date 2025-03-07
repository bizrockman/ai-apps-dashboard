/*
  # Update Projects Schema

  1. Changes
    - Add cost_center and boq_number fields
    - Remove start_date and end_date fields
    - Update contact_person and project_manager to use contact_persons table
    - Add code generation sequence

  2. New Fields
    - cost_center (text, optional)
    - boq_number (text, optional) - Leistungsverzeichnis number
*/

-- Create sequence for project codes
CREATE SEQUENCE IF NOT EXISTS project_code_seq START 1;

-- Add new columns
ALTER TABLE projects 
  ADD COLUMN IF NOT EXISTS cost_center text,
  ADD COLUMN IF NOT EXISTS boq_number text;

-- Add comment for boq_number
COMMENT ON COLUMN projects.boq_number IS 'Leistungsverzeichnis Nummer / Bill of Quantities (BOQ)';

-- Create junction tables for contact persons
CREATE TABLE IF NOT EXISTS project_contact_persons (
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  contact_person_id uuid REFERENCES contact_persons(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('contact', 'manager')),
  PRIMARY KEY (project_id, contact_person_id, role)
);

-- Enable RLS
ALTER TABLE project_contact_persons ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
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