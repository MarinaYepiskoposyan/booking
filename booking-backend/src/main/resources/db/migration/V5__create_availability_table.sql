CREATE TABLE availability (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    provider_profile_id BIGINT          NOT NULL,
    day_of_week         VARCHAR(20)     NOT NULL,
    start_time          TIME            NOT NULL,
    end_time            TIME            NOT NULL,
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_availability PRIMARY KEY (id),
    CONSTRAINT uq_availability_provider_day UNIQUE (provider_profile_id, day_of_week),
    CONSTRAINT fk_availability_provider_profile
        FOREIGN KEY (provider_profile_id) REFERENCES provider_profiles (id)
        ON DELETE CASCADE
);
