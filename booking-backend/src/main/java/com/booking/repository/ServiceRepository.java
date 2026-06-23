package com.booking.repository;

import com.booking.entity.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ServiceRepository extends JpaRepository<Service, Long> {
    Page<Service> findByProviderProfileIdAndIsActiveTrue(Long providerProfileId, Pageable pageable);
    Optional<Service> findByIdAndProviderProfileId(Long id, Long providerProfileId);
}
