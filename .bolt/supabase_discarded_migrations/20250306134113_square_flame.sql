/*
  # Create client_contact_persons table

  1. New Tables
    - `client_contact_persons`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key to clients)
      - `contact_person_id` (uuid, foreign key to contact_persons)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `client_contact_persons` table
    - Add policies for authenticated users
*/

-- Create the client_contact_persons table
CREATE TABLE IF NOT EXISTS client_contact_persons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  contact_person_id uuid NOT NULL REFERENCES contact_persons(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(client_id, contact_person_id)
);

-- Enable RLS
ALTER TABLE client_contact_persons ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read client_contact_persons"
  ON client_contact_persons
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create client_contact_persons"
  ON client_contact_persons
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update client_contact_persons"
  ON client_contact_persons
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete client_contact_persons"
  ON client_contact_persons
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE TRIGGER update_client_contact_persons_updated_at
  BEFORE UPDATE ON client_contact_persons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();