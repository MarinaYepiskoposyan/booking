package com.booking.repository;

import com.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b " +
           "JOIN FETCH b.providerProfile pp " +
           "JOIN FETCH b.timeSlot ts " +
           "LEFT JOIN FETCH b.service s " +
           "WHERE b.client.id = :clientId " +
           "ORDER BY b.createdAt DESC")
    List<Booking> findByClientIdWithDetails(@Param("clientId") Long clientId);

    @Query("SELECT b FROM Booking b " +
           "JOIN FETCH b.client c " +
           "JOIN FETCH b.providerProfile pp " +
           "JOIN FETCH b.timeSlot ts " +
           "LEFT JOIN FETCH b.service s " +
           "WHERE pp.user.id = :providerUserId " +
           "ORDER BY ts.slotDate ASC, ts.startTime ASC")
    List<Booking> findByProviderUserIdWithDetails(@Param("providerUserId") Long providerUserId);

    Optional<Booking> findByIdAndClientId(Long id, Long clientId);

    Optional<Booking> findByIdAndProviderProfileUserId(Long id, Long providerUserId);
}
