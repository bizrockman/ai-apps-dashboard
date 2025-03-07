/*
  # Make construction element code validation optional

  1. Changes
    - Drop existing trigger and function
    - Create new validation function that only checks for uniqueness
    - Add new trigger for code validation
    - Remove strict BW prefix requirement

  2. Security
    - Functions are only accessible by postgres role
    - Code uniqueness still enforced at database level
*/

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS construction_elements_code_validator ON construction_elements;
DROP FUNCTION IF EXISTS validate_construction_element_code();

-- Create new validation function that only checks uniqueness
CREATE OR REPLACE FUNCTION validate_construction_element_code()
RETURNS trigger AS $$
BEGIN
  -- Check for uniqueness only
  IF EXISTS (
    SELECT 1 
    FROM construction_elements 
    WHERE code = NEW.code 
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
  ) THEN
    RAISE EXCEPTION 'Code % already exists', NEW.code;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create new trigger for code validation
CREATE TRIGGER construction_elements_code_validator
  BEFORE INSERT OR UPDATE ON construction_elements
  FOR EACH ROW
  EXECUTE FUNCTION validate_construction_element_code();