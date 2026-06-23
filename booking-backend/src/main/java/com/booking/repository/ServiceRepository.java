package com.booking.repository;

import com.booking.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByProviderProfileIdAndIsActiveTrue(Long providerProfileId);
    Optional<Service> findByIdAndProviderProfileId(Long id, Long providerProfileId);
}
