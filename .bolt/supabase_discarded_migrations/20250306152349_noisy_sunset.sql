/*
  # Add contact persons table with salutation

  1. New Tables
    - `contact_persons`
      - `id` (uuid, primary key)
      - `firstname` (text, required)
      - `lastname` (text, required)
      - `salutation` (text)
      - `phone` (text)
      - `email` (text, unique)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Junction Tables
    - `client_contact_persons`
      - Links clients and contact persons (many-to-many)
    - `project_contact_persons`
      - Links projects and contact persons (many-to-many)

  3. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create contact_persons table
CREATE TABLE IF NOT EXISTS contact_persons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  firstname text NOT NULL,
  lastname text NOT NULL,
  salutation text,
  phone text,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create junction table for clients and contact persons
CREATE TABLE IF NOT EXISTS client_contact_persons (
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  contact_person_id uuid REFERENCES contact_persons(id) ON DELETE CASCADE,
  PRIMARY KEY (client_id, contact_person_id)
);

-- Create junction table for projects and contact persons
CREATE TABLE IF NOT EXISTS project_contact_persons (
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  contact_person_id uuid REFERENCES contact_persons(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, contact_person_id)
);

-- Enable RLS
ALTER TABLE contact_persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_contact_persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_contact_persons ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view contact_persons"
  ON contact_persons
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert contact_persons"
  ON contact_persons
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update contact_persons"
  ON contact_persons
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete contact_persons"
  ON contact_persons
  FOR DELETE
  TO authenticated
  USING (true);

-- Add policies for junction tables
CREATE POLICY "Users can view client_contact_persons"
  ON client_contact_persons
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage client_contact_persons"
  ON client_contact_persons
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view project_contact_persons"
  ON project_contact_persons
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage project_contact_persons"
  ON project_contact_persons
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add trigger for updating the updated_at timestamp
CREATE TRIGGER update_contact_persons_updated_at
  BEFORE UPDATE ON contact_persons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();