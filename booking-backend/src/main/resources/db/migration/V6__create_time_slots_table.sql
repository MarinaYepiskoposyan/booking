CREATE TABLE time_slots (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    provider_profile_id BIGINT          NOT NULL,
    service_id          BIGINT              NULL,
    slot_date           DATE            NOT NULL,
    start_time          TIME            NOT NULL,
    end_time            TIME            NOT NULL,
    status              VARCHAR(20)     NOT NULL DEFAULT 'AVAILABLE',
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_time_slots PRIMARY KEY (id),
    CONSTRAINT uq_time_slots_provider_date_start UNIQUE (provider_profile_id, slot_date, start_time),
    CONSTRAINT fk_time_slots_provider_profile
        FOREIGN KEY (provider_profile_id) REFERENCES provider_profiles (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_time_slots_service
        FOREIGN KEY (service_id) REFERENCES services (id)
        ON DELETE SET NULL
);
