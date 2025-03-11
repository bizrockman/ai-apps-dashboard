/*
  # Remove RLS from all tables

  1. Changes
    - Disable RLS on all tables
    - Drop all RLS policies
*/

-- Disable RLS on all tables
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE construction_elements DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE document_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE document_type_blocks DISABLE ROW LEVEL SECURITY;
ALTER TABLE text_blocks DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_persons DISABLE ROW LEVEL SECURITY;
ALTER TABLE client_contact_persons DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_contact_persons DISABLE ROW LEVEL SECURITY;

-- Drop all policies from all tables
DROP POLICY IF EXISTS "Users can view documents" ON documents;
DROP POLICY IF EXISTS "Users can create documents" ON documents;
DROP POLICY IF EXISTS "Users can update documents" ON documents;
DROP POLICY IF EXISTS "Users can delete documents" ON documents;

DROP POLICY IF EXISTS "Users can view construction_elements" ON construction_elements;
DROP POLICY IF EXISTS "Users can create construction_elements" ON construction_elements;
DROP POLICY IF EXISTS "Users can update construction_elements" ON construction_elements;
DROP POLICY IF EXISTS "Users can delete construction_elements" ON construction_elements;

DROP POLICY IF EXISTS "Users can view document_types" ON document_types;
DROP POLICY IF EXISTS "Users can create document_types" ON document_types;
DROP POLICY IF EXISTS "Users can update document_types" ON document_types;
DROP POLICY IF EXISTS "Users can delete document_types" ON document_types;

DROP POLICY IF EXISTS "Users can view document_type_blocks" ON document_type_blocks;
DROP POLICY IF EXISTS "Users can create document_type_blocks" ON document_type_blocks;
DROP POLICY IF EXISTS "Users can update document_type_blocks" ON document_type_blocks;
DROP POLICY IF EXISTS "Users can delete document_type_blocks" ON document_type_blocks;

DROP POLICY IF EXISTS "Users can view text_blocks" ON text_blocks;
DROP POLICY IF EXISTS "Users can create text_blocks" ON text_blocks;
DROP POLICY IF EXISTS "Users can update text_blocks" ON text_blocks;
DROP POLICY IF EXISTS "Users can delete text_blocks" ON text_blocks;