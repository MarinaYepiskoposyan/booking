CREATE TABLE services (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    provider_profile_id BIGINT          NOT NULL,
    name                VARCHAR(255)    NOT NULL,
    description         TEXT                NULL,
    duration_minutes    INT             NOT NULL,
    price               DECIMAL(10,2)   NOT NULL,
    currency            VARCHAR(3)      NOT NULL DEFAULT 'USD',
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_services PRIMARY KEY (id),
    CONSTRAINT fk_services_provider_profile
        FOREIGN KEY (provider_profile_id) REFERENCES provider_profiles (id)
        ON DELETE CASCADE
);
