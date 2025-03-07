/*
  # Fix construction element code generation

  1. Changes
    - Add function to generate unique BW-prefixed codes for construction elements
    - Add trigger to automatically generate codes only when not provided
    - Ensure code uniqueness

  2. Security
    - Function is only accessible by postgres role
*/

-- Function to generate a unique code for construction elements
CREATE OR REPLACE FUNCTION generate_construction_element_code()
RETURNS trigger AS $$
DECLARE
  counter INTEGER := 1;
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  -- Only generate code if none provided
  IF NEW.code IS NULL THEN
    -- Generate initial code with BW prefix
    new_code := 'BW' || LPAD(counter::text, 3, '0');

    -- Check if code exists and increment counter until we find a unique code
    LOOP
      SELECT EXISTS (
        SELECT 1 
        FROM construction_elements 
        WHERE code = new_code
      ) INTO code_exists;

      EXIT WHEN NOT code_exists;
      
      counter := counter + 1;
      new_code := 'BW' || LPAD(counter::text, 3, '0');
    END LOOP;

    -- Set the generated code
    NEW.code := new_code;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace trigger to automatically generate codes only when not provided
DROP TRIGGER IF EXISTS construction_elements_code_generator ON construction_elements;
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