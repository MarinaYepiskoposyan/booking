package com.booking.repository;

import com.booking.entity.ProviderProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProviderProfileRepository extends JpaRepository<ProviderProfile, Long> {
    Optional<ProviderProfile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
