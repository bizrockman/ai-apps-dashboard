/*
  # Add contact_persons table and modify projects and clients tables

  1. New Tables
    - `contact_persons`
      - `id` (uuid, primary key)
      - `firstname` (text, not null)
      - `lastname` (text, not null)
      - `phone` (text)
      - `mobile` (text)
      - `email` (text, unique, not null)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Modify Tables
    - `projects`
      - Add `cost_center` (text)
      - Add `boq_number` (text, comment: 'Leistungsverzeichnis Nummer / Bill of Quantities (BOQ)')

    - `clients`
      - Remove `address`
      - Add `street_1` (text)
      - Add `street_2` (text)

  3. Relationships
    - A project can have 0:n `project_contact_persons`
    - A client can have 0:n `client_contact_persons`
*/

-- Create contact_persons table
CREATE TABLE IF NOT EXISTS contact_persons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  firstname text NOT NULL,
  lastname text NOT NULL,
  phone text,
  mobile text,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Modify projects table
ALTER TABLE projects
ADD COLUMN cost_center text,
ADD COLUMN boq_number text;

COMMENT ON COLUMN projects.boq_number IS 'Leistungsverzeichnis Nummer / Bill of Quantities (BOQ)';

-- Modify clients table
ALTER TABLE clients
DROP COLUMN address,
ADD COLUMN business_unit text,
ADD COLUMN street_1 text,
ADD COLUMN street_2 text,
ADD COLUMN zipcode text,
ADD COLUMN city text;

-- Create project_contact_persons table
CREATE TABLE IF NOT EXISTS project_contact_persons (
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  contact_person_id uuid REFERENCES contact_persons(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, contact_person_id)
);

-- Create client_contact_persons table
CREATE TABLE IF NOT EXISTS client_contact_persons (
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  contact_person_id uuid REFERENCES contact_persons(id) ON DELETE CASCADE,
  PRIMARY KEY (client_id, contact_person_id)
);
