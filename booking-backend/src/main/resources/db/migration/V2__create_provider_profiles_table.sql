CREATE TABLE provider_profiles (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    user_id         BIGINT          NOT NULL,
    business_name   VARCHAR(255)    NOT NULL,
    description     TEXT                NULL,
    address         VARCHAR(500)        NULL,
    city            VARCHAR(100)        NULL,
    country         VARCHAR(100)        NULL,
    website         VARCHAR(255)        NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_provider_profiles PRIMARY KEY (id),
    CONSTRAINT uq_provider_profiles_user_id UNIQUE (user_id),
    CONSTRAINT fk_provider_profiles_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
);
