package com.booking.repository;

import com.booking.entity.SlotStatus;
import com.booking.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {

    List<TimeSlot> findByProviderProfileIdAndSlotDateAndStatusOrderByStartTime(
            Long providerProfileId, LocalDate slotDate, SlotStatus status);

    List<TimeSlot> findByProviderProfileIdAndSlotDateBetween(
            Long providerProfileId, LocalDate from, LocalDate to);

    boolean existsByProviderProfileIdAndSlotDateAndStartTime(
            Long providerProfileId, LocalDate slotDate, LocalTime startTime);
}
