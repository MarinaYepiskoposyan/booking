CREATE INDEX idx_services_provider_active ON services (provider_profile_id, is_active);
CREATE INDEX idx_users_role ON users (role);
