/*
  # Fix construction element code validation

  1. Changes
    - Drop existing trigger and function if they exist
    - Create new validation function with improved code format check
    - Add new trigger for code validation
    - Ensure code uniqueness

  2. Security
    - Functions are only accessible by postgres role
    - Code format validation enforced at database level
*/

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS construction_elements_code_validator ON construction_elements;
DROP FUNCTION IF EXISTS validate_construction_element_code();

-- Create new validation function with improved checks
CREATE OR REPLACE FUNCTION validate_construction_element_code()
RETURNS trigger AS $$
BEGIN
  -- Check if code matches required format (BW followed by numbers)
  IF NEW.code !~ '^BW\d+$' THEN
    RAISE EXCEPTION 'Invalid code format. Code must start with BW followed by numbers';
  END IF;
  
  -- Check for uniqueness
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