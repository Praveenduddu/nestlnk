-- NestLnk Database Schema

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('CUSTOMER', 'FIRM', 'ADMIN')),
    company_name VARCHAR(200),
    phone VARCHAR(20),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    gemini_api_key_encrypted VARCHAR(512),
    gemini_api_key_iv VARCHAR(512),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS property_briefs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_type VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    size_sqft INTEGER NOT NULL,
    budget_min DECIMAL(12,2) NOT NULL,
    budget_max DECIMAL(12,2) NOT NULL,
    timeline VARCHAR(100) NOT NULL,
    scope TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('DRAFT', 'OPEN', 'CLOSED', 'SHORTLISTED')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES property_briefs(id) ON DELETE CASCADE,
    firm_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    estimated_cost DECIMAL(12,2) NOT NULL,
    design_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
    material_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
    labor_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
    other_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
    timeline VARCHAR(100) NOT NULL,
    pdf_url VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'SHORTLISTED', 'REJECTED', 'WITHDRAWN')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shortlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES property_briefs(id) ON DELETE CASCADE,
    firm_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(property_id, firm_id)
);

CREATE TABLE IF NOT EXISTS property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES property_briefs(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expiry_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS property_targeted_firms (
    property_id UUID NOT NULL REFERENCES property_briefs(id) ON DELETE CASCADE,
    firm_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (property_id, firm_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_property_briefs_customer ON property_briefs(customer_id);
CREATE INDEX IF NOT EXISTS idx_property_briefs_status ON property_briefs(status);
CREATE INDEX IF NOT EXISTS idx_quotations_property ON quotations(property_id);
CREATE INDEX IF NOT EXISTS idx_quotations_firm ON quotations(firm_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_shortlists_property ON shortlists(property_id);
CREATE INDEX IF NOT EXISTS idx_property_images_property ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_otps_email ON otps(email);
CREATE INDEX IF NOT EXISTS idx_property_targeted_firms_property ON property_targeted_firms(property_id);
CREATE INDEX IF NOT EXISTS idx_property_targeted_firms_firm ON property_targeted_firms(firm_id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS gemini_api_key_encrypted VARCHAR(512);
ALTER TABLE users ADD COLUMN IF NOT EXISTS gemini_api_key_iv VARCHAR(512);
