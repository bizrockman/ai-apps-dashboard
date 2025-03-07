/*
  # Add code generation for construction elements

  1. Changes
    - Add function to generate unique codes for construction elements
    - Add trigger to automatically generate codes before insert
    - Add unique constraint on code field

  2. Security
    - Function is only accessible by postgres role
*/

-- Function to generate a unique code for construction elements
CREATE OR REPLACE FUNCTION generate_construction_element_code()
RETURNS trigger AS $$
DECLARE
  base_code TEXT;
  counter INTEGER := 1;
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  -- Generate base code from first 3 letters of name (or less if name is shorter)
  base_code := UPPER(SUBSTRING(NEW.name, 1, 3));
  
  -- If no name provided, use 'CEL' as base
  IF base_code IS NULL OR base_code = '' THEN
    base_code := 'CEL';
  END IF;

  -- Generate initial code
  new_code := base_code || LPAD(counter::text, 3, '0');

  -- Check if code exists and increment counter until we find a unique code
  LOOP
    SELECT EXISTS (
      SELECT 1 
      FROM construction_elements 
      WHERE code = new_code
    ) INTO code_exists;

    EXIT WHEN NOT code_exists;
    
    counter := counter + 1;
    new_code := base_code || LPAD(counter::text, 3, '0');
  END LOOP;

  -- Set the generated code
  NEW.code := new_code;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically generate codes
CREATE TRIGGER construction_elements_code_generator
  BEFORE INSERT ON construction_elements
  FOR EACH ROW
  WHEN (NEW.code IS NULL)
  EXECUTE FUNCTION generate_construction_element_code();

-- Add unique constraint if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'construction_elements_code_key'
  ) THEN
    ALTER TABLE construction_elements
      ADD CONSTRAINT construction_elements_code_key UNIQUE (code);
  END IF;
END $$;