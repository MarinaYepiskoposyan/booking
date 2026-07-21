package com.booking.repository;

import com.booking.entity.ProviderProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProviderProfileRepository extends JpaRepository<ProviderProfile, Long> {
    Optional<ProviderProfile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);

    @Query("SELECT p FROM ProviderProfile p WHERE " +
           "(:search IS NULL OR LOWER(p.businessName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:city IS NULL OR LOWER(p.city) = LOWER(:city))")
    Page<ProviderProfile> findByFilters(
            @Param("search") String search,
            @Param("city") String city,
            Pageable pageable);
}
