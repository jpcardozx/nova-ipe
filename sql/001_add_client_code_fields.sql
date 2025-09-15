-- Add client_code field to crm_clients table
-- This field will store internal client codes for commercial control
ALTER TABLE crm_clients ADD COLUMN IF NOT EXISTS client_code VARCHAR(20) UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_crm_clients_client_code ON crm_clients(client_code);

-- Add comment to explain the purpose
COMMENT ON COLUMN crm_clients.client_code IS 'Internal client code for commercial control. Format: [STATUS][NAME][YEAR][SEQUENTIAL] (e.g., LDJO24001)';

-- Update existing clients with generated codes (optional - can be done through application)
-- This is commented out as it should be done carefully in production
-- UPDATE crm_clients SET client_code = CONCAT(
--     CASE
--         WHEN status = 'lead' THEN 'LD'
--         WHEN status = 'prospect' THEN 'PR'
--         WHEN status = 'client' THEN 'CL'
--         WHEN status = 'inactive' THEN 'IN'
--         ELSE 'LD'
--     END,
--     LEFT(UPPER(REPLACE(name, ' ', '')), 2),
--     RIGHT(EXTRACT(YEAR FROM created_at)::text, 2),
--     LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::text, 3, '0')
-- ) WHERE client_code IS NULL;

-- Ensure the unique constraint
ALTER TABLE crm_clients ADD CONSTRAINT uk_crm_clients_client_code UNIQUE (client_code);