package com.booking.repository;

import com.booking.entity.Availability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AvailabilityRepository extends JpaRepository<Availability, Long> {

    List<Availability> findByProviderProfileId(Long providerProfileId);

    @Modifying
    @Query("DELETE FROM Availability a WHERE a.providerProfile.id = :providerProfileId")
    void deleteByProviderProfileId(@Param("providerProfileId") Long providerProfileId);
}
