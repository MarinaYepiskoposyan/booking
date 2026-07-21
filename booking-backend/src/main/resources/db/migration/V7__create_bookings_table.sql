CREATE TABLE bookings (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    client_id           BIGINT          NOT NULL,
    provider_profile_id BIGINT          NOT NULL,
    service_id          BIGINT              NULL,
    time_slot_id        BIGINT          NOT NULL,
    status              VARCHAR(20)     NOT NULL DEFAULT 'PENDING',
    notes               TEXT                NULL,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_bookings PRIMARY KEY (id),
    CONSTRAINT fk_bookings_client
        FOREIGN KEY (client_id) REFERENCES users (id),
    CONSTRAINT fk_bookings_provider_profile
        FOREIGN KEY (provider_profile_id) REFERENCES provider_profiles (id),
    CONSTRAINT fk_bookings_service
        FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE SET NULL,
    CONSTRAINT fk_bookings_time_slot
        FOREIGN KEY (time_slot_id) REFERENCES time_slots (id)
);
