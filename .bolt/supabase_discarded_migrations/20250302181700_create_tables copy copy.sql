/*
  # Create tables for the construction document management system

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `code` (text, not null)
      - `name` (text, not null)
      - `description` (text)
      - `client_id` (uuid, foreign key to clients.id)
      - `contact_person` (text)
      - `project_manager` (text)
      - `status` (text, not null)
      - `start_date` (date, not null)
      - `end_date` (date)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `construction_elements`
      - `id` (uuid, primary key)
      - `code` (text, not null)
      - `name` (text, not null)
      - `description` (text)
      - `shortcut` (text)
      - `project_id` (uuid, foreign key to projects.id)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `text_blocks`
      - `id` (uuid, primary key)
      - `shortcut` (text, not null)
      - `name` (text, not null)
      - `content` (text, not null)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `document_types`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `document_type_blocks`
      - `id` (uuid, primary key)
      - `document_type_id` (uuid, foreign key to document_types.id)
      - `text_block_id` (uuid, foreign key to text_blocks.id, nullable)
      - `order` (integer, not null)
      - `input_label` (text)
      - `input_type` (text)
      - `required` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `documents`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `content` (text, not null)
      - `project_id` (uuid, foreign key to projects.id)
      - `type_id` (uuid, foreign key to document_types.id)
      - `element_id` (uuid, foreign key to construction_elements.id)
      - `status` (text, not null)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to perform CRUD operations
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  name text NOT NULL,
  description text,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  contact_person text,
  project_manager text,
  status text NOT NULL CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
  start_date date NOT NULL,
  end_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create construction_elements table
CREATE TABLE IF NOT EXISTS construction_elements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  name text NOT NULL,
  description text,
  shortcut text,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create text_blocks table
CREATE TABLE IF NOT EXISTS text_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shortcut text NOT NULL,
  name text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create document_types table
CREATE TABLE IF NOT EXISTS document_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create document_type_blocks table
CREATE TABLE IF NOT EXISTS document_type_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type_id uuid REFERENCES document_types(id) ON DELETE CASCADE,
  text_block_id uuid REFERENCES text_blocks(id) ON DELETE SET NULL,
  "order" integer NOT NULL,
  input_label text,
  input_type text CHECK (input_type IS NULL OR input_type IN ('text', 'number', 'date')),
  required boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  type_id uuid REFERENCES document_types(id) ON DELETE SET NULL,
  element_id uuid REFERENCES construction_elements(id) ON DELETE SET NULL,
  status text NOT NULL CHECK (status IN ('draft', 'review', 'approved', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE construction_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE text_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_type_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policies for projects
CREATE POLICY "Users can view projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for construction_elements
CREATE POLICY "Users can view construction_elements"
  ON construction_elements
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create construction_elements"
  ON construction_elements
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update construction_elements"
  ON construction_elements
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete construction_elements"
  ON construction_elements
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for text_blocks
CREATE POLICY "Users can view text_blocks"
  ON text_blocks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create text_blocks"
  ON text_blocks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update text_blocks"
  ON text_blocks
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete text_blocks"
  ON text_blocks
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for document_types
CREATE POLICY "Users can view document_types"
  ON document_types
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create document_types"
  ON document_types
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update document_types"
  ON document_types
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete document_types"
  ON document_types
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for document_type_blocks
CREATE POLICY "Users can view document_type_blocks"
  ON document_type_blocks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create document_type_blocks"
  ON document_type_blocks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update document_type_blocks"
  ON document_type_blocks
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete document_type_blocks"
  ON document_type_blocks
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for documents
CREATE POLICY "Users can view documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create documents"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update documents"
  ON documents
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete documents"
  ON documents
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at triggers for all tables
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_construction_elements_updated_at
  BEFORE UPDATE ON construction_elements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_text_blocks_updated_at
  BEFORE UPDATE ON text_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_types_updated_at
  BEFORE UPDATE ON document_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_type_blocks_updated_at
  BEFORE UPDATE ON document_type_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
